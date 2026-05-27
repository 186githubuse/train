/**
 * views/topicCompose.js
 * ─────────────────────────────────────────────────────────────
 * 专题训练 — D 类：参照树形结构图，按"总-分-分-分"四段式书写成文
 * 流程：
 *   1. 展示图片 + 树形结构图 + 四段式写作要求
 *   2. 学生在文本框里写一篇短文
 *   3. 提交后调用 AI 按 4 维（组成完整 30 / 顺序正确 30 / 感觉点准确 30 / 语句通顺 10）评分
 *   4. 完成后记录积分 + 回训练营
 * ─────────────────────────────────────────────────────────────
 */

import { getSub, getTopic } from '../js/data/topics/index.js';
import { API_CONFIG, VISION_CONFIG } from '../js/config.js?v=20260528';
import { store } from '../js/store.js';
import { speak, stopSpeaking } from '../js/tts.js';
import * as effects from '../js/effects.js';

let _topic = null;
let _sub = null;
let _task = null;
let _quizScore = 0;
let _quizTotal = 0;

/* ─── AI 评分（comfly OpenAI 兼容格式） ─── */
async function callLLM(messages, systemPrompt, maxTokens = 800) {
  const res = await fetch(`${API_CONFIG.baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_CONFIG.apiKey}`,
    },
    body: JSON.stringify({
      model: API_CONFIG.model,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      // 强制 JSON 输出，提升解析稳定性
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error(`[callLLM] ${res.status} from ${API_CONFIG.baseUrl}`, body);
    throw new Error(`API ${res.status}: ${body.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

/* ─── 图片识别（Gemini 走 itlsj，Anthropic 兼容格式） ─── */
async function ocrHandwritingFromImage(base64, mimeType) {
  const sysPrompt = `你是一个识别小学生手写内容的助手。
任务：把图片中的手写中文内容**忠实转录成文字**。
要求：
1. 只输出转录的文字本身，不要加任何解释、标题、引号、Markdown
2. 保留原文的换行和标点
3. 如果某个字辨认不出来，用 ◯ 占位
4. 如果图片里没有可识别的文字，返回：未识别到文字
5. 不要修改、润色、纠错任何内容`;

  const userPrompt = '请把这张图片里小学生写的内容一字一句转录出来。';

  const res = await fetch(`${VISION_CONFIG.baseUrl}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': VISION_CONFIG.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: VISION_CONFIG.model,
      max_tokens: 1500,
      system: sysPrompt,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64 } },
          { type: 'text', text: userPrompt },
        ],
      }],
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error(`[ocr] ${res.status}`, body);
    throw new Error(`OCR API ${res.status}`);
  }
  const data = await res.json();
  return data.content?.[0]?.text || '';
}

/* 文件转 base64 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const parts = e.target.result.split(',');
      resolve({ base64: parts[1], mimeType: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* 图片压缩：长边 ≤ 1280px，JPEG 0.85（避免大图超过 API 限制） */
async function compressImage(file) {
  const maxSize = 1280;
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(blob => {
        if (!blob) return reject(new Error('压缩失败'));
        resolve(new File([blob], 'compressed.jpg', { type: 'image/jpeg' }));
      }, 'image/jpeg', 0.85);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function buildGradingSystemPrompt() {
  const objName = _sub.title;
  return `你是一位耐心温柔的小学语文老师，正在批改一位小学生写的描写${objName}的短文。

【整体原则】
- 鼓励为主，诊断具体。不要笼统说"写得好"，要指出好在哪里。
- 如果有问题，语气要柔和，用"如果…就更好了"这样的句式。
- 不要给负面评价（如"很差""很糟糕"），改用"再加点…会更完整"。
- 本期训练核心是掌握感觉方法与有序描写，不要求使用比喻、拟人等修辞手法，语言应平实、准确、具体。

【评分维度】（总分 100）
1. 组成完整 (30 分)：全文清晰体现"看组成 → 排顺序 → 再感觉"的逻辑。是否按"总-分-分-分"四段结构书写：第一段总起写组成，后续每段分别描写一个主要部分。
2. 顺序正确 (30 分)：各部分描写顺序与树形结构图中确定的"由下到上"一致；段落内部对特征的描写有序。
3. 感觉点准确 (30 分)：是否完整、准确地包含树形结构图中的全部感觉点（如颜色、形状、触感、声音、气息、作用等）。
4. 语句通顺 (10 分)：用词准确，句子衔接流畅，文意连贯，无语病。

【输出格式】严格按 JSON 返回，不要加任何其他文字：
{
  "total": 总分数字,
  "scores": { "组成完整": 数字, "顺序正确": 数字, "感觉点准确": 数字, "语句通顺": 数字 },
  "highlights": ["写得好的地方1(具体)", "写得好的地方2"],
  "suggestions": ["如果..就更好(具体)", "可以再加..."],
  "encouragement": "一句温暖的鼓励话"
}`;
}

async function gradeEssay(text) {
  const prompt = `这是一位小学生写的描写"${_sub.title}"的短文，请按照上述 4 维标准评分：

【学生作品】
${text}

请严格按 JSON 格式返回评分结果。`;
  const raw = await callLLM(
    [{ role: 'user', content: prompt }],
    buildGradingSystemPrompt(),
    900
  );
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('AI 返回格式异常');
  return JSON.parse(match[0]);
}

/* ─── 渲染 ─── */
function renderHeader() {
  return `
    <div class="quiz-header">
      <button class="back-btn" data-action="back" aria-label="返回">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      <div class="quiz-header-info">
        <ph-pencil-simple weight="fill" size="20" color="#7C3AED"></ph-pencil-simple>
        <span class="quiz-header-title">${_sub.title} · D 类·书写成文</span>
      </div>
      <div class="quiz-streak" style="visibility:hidden">.</div>
    </div>`;
}

function renderTreeMap() {
  const tm = _task.treeMap;
  const branches = tm.branches.map(b => {
    const children = b.children.map(c => `<li class="tc-mm-leaf">${c.name}</li>`).join('');
    return `
      <div class="tc-mm-branch" style="--branch-color:${b.color}">
        <div class="tc-mm-branch-title">${b.name}</div>
        <ul class="tc-mm-children">${children}</ul>
      </div>`;
  }).join('');

  return `
    <div class="tc-mindmap">
      <div class="tc-mm-root">${tm.root}</div>
      <div class="tc-mm-branches">${branches}</div>
    </div>`;
}

function renderRequirements() {
  const items = _task.requirements.map(r => `<li>${r}</li>`).join('');
  return `
    <div class="tc-requirements glass-card rounded-[1.25rem] p-4">
      <h3 class="tc-req-title">
        <ph-list-checks weight="fill" size="18" color="#7C3AED"></ph-list-checks>
        写作要求
      </h3>
      <ul class="tc-req-list">${items}</ul>
    </div>`;
}

function renderWriteArea() {
  return `
    <div class="tc-write-area">
      <div class="tc-write-header">
        <span class="tc-write-label">开始写作</span>
        <div class="tc-write-tools">
          <button class="tc-tool-btn" id="tc-btn-camera" title="拍照识字" aria-label="拍照识字">
            <ph-camera weight="fill" size="18" color="#7C3AED"></ph-camera>
          </button>
          <button class="tc-tool-btn" id="tc-btn-gallery" title="从相册选图" aria-label="从相册选图">
            <ph-image weight="fill" size="18" color="#7C3AED"></ph-image>
          </button>
          <span class="tc-write-count"><span id="tc-char-count">0</span> 字</span>
        </div>
      </div>
      <input type="file" id="tc-file-camera" accept="image/*" capture="environment" style="display:none">
      <input type="file" id="tc-file-gallery" accept="image/*" style="display:none">
      <div id="tc-ocr-status" class="tc-ocr-status" style="display:none"></div>
      <textarea
        id="tc-essay"
        class="tc-essay-input"
        placeholder="参照上方树形结构图，按"总-分-分-分"四段式写一篇短文：&#10;第一段总起写组成 → 后面每段分别描写一个部位 → 包含图中所有感觉点&#10;&#10;也可以点上方相机图标拍下手写内容自动识别～"
        rows="12"
        maxlength="800"></textarea>
      <button class="tc-submit-btn ${_topic.colorClass}" id="tc-submit-btn" disabled>
        提交评分
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </div>`;
}

function renderImageBox() {
  return `
    <div class="tq-image-box">
      <img src="${_sub.image}" alt="${_sub.imageAlt || _sub.title}" loading="eager">
    </div>`;
}

/* ─── 评分结果渲染 ─── */
function renderGradingResult(result, text) {
  const total = Math.min(100, Math.max(0, Number(result.total) || 0));
  const passed = total >= 70;
  const stars = total >= 90 ? 3 : total >= 70 ? 2 : 1;

  // 积分（仅通过时发放，未通过不发星）
  const bonus = passed ? 15 : 0;
  if (passed) store.addStars(bonus);

  const scoreBars = Object.entries(result.scores || {}).map(([dim, s]) => {
    const max = dim === '语句通顺' ? 10 : 30;
    const pct = Math.round((s / max) * 100);
    return `
      <div class="tc-score-row">
        <div class="tc-score-dim">
          <span>${dim}</span>
          <span class="tc-score-num">${s}<span class="tc-score-max"> / ${max}</span></span>
        </div>
        <div class="tc-score-bar-track">
          <div class="tc-score-bar-fill" style="width:${pct}%"></div>
        </div>
      </div>`;
  }).join('');

  const highlightsHtml = (result.highlights || []).map(h => `<li><ph-check-circle weight="fill" size="16" color="#10B981"></ph-check-circle> ${h}</li>`).join('');
  const suggestionsHtml = (result.suggestions || []).map(s => `<li><ph-lightbulb weight="fill" size="16" color="#F59E0B"></ph-lightbulb> ${s}</li>`).join('');

  const starsHtml = Array.from({ length: 3 }, (_, i) => `
    <svg class="quiz-result-star ${i < stars ? 'star-filled' : 'star-empty'}"
         viewBox="0 0 24 24"
         fill="${i < stars ? 'currentColor' : 'none'}"
         stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round"
         style="animation-delay:${i * 200}ms">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>
  `).join('');

  // 顶部反馈语：通过 / 未通过 不同口吻（永远鼓励，不出现"未通过 / 不及格"等负面词）
  const headerTitle = passed
    ? '🎉 太棒啦！你写得真好～'
    : '💪 继续加油！再学习一下范文吧～';
  const headerHint = passed
    ? '想看看老师写的范文吗？也许会让你眼前一亮哦。'
    : '别担心，先看看老师的范文学一学，再来挑战一次～';

  return `
    <div class="topic-compose-result">
      <div class="tc-result-card ${_topic.colorClass}">
        <div class="tc-result-stars">${starsHtml}</div>
        <div class="tc-result-total">
          <span class="tc-result-num">${total}</span>
          <span class="tc-result-unit">分</span>
        </div>
        <p class="tc-result-encourage">${result.encouragement || headerTitle}</p>
        ${bonus > 0 ? `
        <div class="tc-result-bonus">
          <ph-star weight="fill" size="16" color="rgba(255,255,255,0.95)"></ph-star>
          获得 ${bonus} 颗星星
        </div>
        ` : ''}
      </div>

      <!-- 通过/未通过 反馈卡片 -->
      <div class="tc-feedback-card glass-card rounded-[1.25rem] p-4">
        <h3 class="tc-section-title">
          <ph-${passed ? 'trophy' : 'graduation-cap'} weight="fill" size="18" color="${passed ? '#F59E0B' : '#7C3AED'}"></ph-${passed ? 'trophy' : 'graduation-cap'}>
          ${headerTitle}
        </h3>
        <p class="tc-feedback-hint">${headerHint}</p>
      </div>

      <div class="tc-scores glass-card rounded-[1.25rem] p-4">
        <h3 class="tc-section-title">
          <ph-chart-bar weight="fill" size="18" color="#7C3AED"></ph-chart-bar>
          各维度得分
        </h3>
        ${scoreBars}
      </div>

      ${highlightsHtml ? `
      <div class="tc-highlights glass-card rounded-[1.25rem] p-4">
        <h3 class="tc-section-title">
          <ph-sparkle weight="fill" size="18" color="#10B981"></ph-sparkle>
          写得好的地方
        </h3>
        <ul class="tc-result-list">${highlightsHtml}</ul>
      </div>
      ` : ''}

      ${suggestionsHtml ? `
      <div class="tc-suggestions glass-card rounded-[1.25rem] p-4">
        <h3 class="tc-section-title">
          <ph-lightbulb weight="fill" size="18" color="#F59E0B"></ph-lightbulb>
          可以再加强
        </h3>
        <ul class="tc-result-list">${suggestionsHtml}</ul>
      </div>
      ` : ''}

      <div class="tc-essay-preview glass-card rounded-[1.25rem] p-4">
        <h3 class="tc-section-title">
          <ph-quotes weight="fill" size="18" color="#9CA3AF"></ph-quotes>
          你写的作品
        </h3>
        <p class="tc-essay-text">${text.replace(/\n/g, '<br>')}</p>
      </div>

      <!-- 老师范文（默认折叠，点按钮展开） -->
      ${_task.sample ? `
      <div class="tc-sample-section glass-card rounded-[1.25rem] p-4" id="tc-sample-section">
        <button class="tc-sample-toggle" id="tc-sample-toggle">
          <ph-book-open weight="fill" size="18" color="#7C3AED"></ph-book-open>
          <span>${passed ? '看看老师的范文' : '学习老师的范文'}</span>
          <ph-caret-down weight="bold" size="16" color="#7C3AED" class="tc-sample-caret"></ph-caret-down>
        </button>
        <div class="tc-sample-body" id="tc-sample-body" style="display:none;">
          <p class="tc-sample-text">${(_task.sample || '').replace(/\n/g, '<br>')}</p>
        </div>
      </div>
      ` : ''}

      <div class="tc-result-actions">
        <button class="tc-btn-secondary" id="tc-retry-btn">再写一遍</button>
        <button class="tc-btn-primary ${_topic.colorClass}" id="tc-done-btn">
          完成
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>`;
}

/* ─── 入口 ─── */
export function renderTopicCompose(params = {}) {
  const { topicId, subId, score = 0, total = 0 } = params;
  _topic = getTopic(topicId);
  _sub = getSub(topicId, subId);
  _task = _sub?.typeD;
  _quizScore = Number(score) || 0;
  _quizTotal = Number(total) || 0;

  if (!_topic || !_sub || !_task) {
    window.__showToast?.('未找到练笔任务');
    window.__router.goBack();
    return;
  }

  const header = document.getElementById('app-header');
  const content = document.getElementById('app-content');

  header.style.display = '';
  header.innerHTML = renderHeader();
  header.addEventListener('click', e => {
    if (e.target.closest('[data-action="back"]')) {
      window.__router.navigate('topicDetail', { topicId });
    }
  });

  renderWritePhase();
}

function renderWritePhase() {
  const content = document.getElementById('app-content');
  const recap = _quizTotal > 0
    ? `<div class="tc-recap">前面 A/B/C 三类共答对 <b>${_quizScore}</b> / ${_quizTotal} 题，现在对照下方树形结构图，按四段式写一篇短文吧！</div>`
    : '';

  content.innerHTML = `
    <div class="topic-compose-page">
      ${renderImageBox()}
      ${recap}
      <h2 class="tc-page-title">${_task.title}</h2>
      ${renderRequirements()}
      ${renderTreeMap()}
      ${renderWriteArea()}
    </div>`;

  const textarea = document.getElementById('tc-essay');
  const countEl = document.getElementById('tc-char-count');
  const submitBtn = document.getElementById('tc-submit-btn');

  textarea.addEventListener('input', () => {
    const len = textarea.value.trim().length;
    countEl.textContent = len;
    submitBtn.disabled = len < 120; // 四段式短文，至少 120 字才允许提交
  });

  submitBtn.addEventListener('click', async () => {
    const text = textarea.value.trim();
    if (text.length < 120) {
      window.__showToast?.('再多写一点吧，至少 120 字哦');
      return;
    }
    await submitForGrading(text);
  });

  // ─── 拍照 / 相册：触发 file input 点击 ───
  document.getElementById('tc-btn-camera')?.addEventListener('click', () => {
    document.getElementById('tc-file-camera')?.click();
  });
  document.getElementById('tc-btn-gallery')?.addEventListener('click', () => {
    document.getElementById('tc-file-gallery')?.click();
  });

  document.getElementById('tc-file-camera')?.addEventListener('change', e => {
    const file = e.target.files?.[0];
    if (file) handleOcrUpload(file);
    e.target.value = ''; // 允许重复选择同一文件
  });
  document.getElementById('tc-file-gallery')?.addEventListener('change', e => {
    const file = e.target.files?.[0];
    if (file) handleOcrUpload(file);
    e.target.value = '';
  });
}

/* ─── OCR 流程：压缩 → 转 base64 → 调 Gemini → 写入文本框 ─── */
async function handleOcrUpload(file) {
  const status = document.getElementById('tc-ocr-status');
  const textarea = document.getElementById('tc-essay');
  const countEl = document.getElementById('tc-char-count');
  const submitBtn = document.getElementById('tc-submit-btn');
  if (!status || !textarea) return;

  status.style.display = 'flex';
  status.className = 'tc-ocr-status tc-ocr-loading';
  status.innerHTML = `
    <span class="tc-loading-dot"></span>
    <span class="tc-loading-dot"></span>
    <span class="tc-loading-dot"></span>
    <span>正在识别手写内容...</span>`;

  try {
    const compressed = await compressImage(file);
    const { base64, mimeType } = await fileToBase64(compressed);
    const text = (await ocrHandwritingFromImage(base64, mimeType)).trim();

    if (!text || text === '未识别到文字') {
      status.className = 'tc-ocr-status tc-ocr-error';
      status.innerHTML = `<ph-warning weight="fill" size="16" color="#DC2626"></ph-warning> 没识别到文字，再试一张清晰的吧～`;
      return;
    }

    // 把识别结果填入文本框（如已有内容，附加在末尾用换行分隔）
    const existing = textarea.value.trim();
    textarea.value = existing ? `${existing}\n${text}` : text;

    const len = textarea.value.trim().length;
    if (countEl) countEl.textContent = len;
    if (submitBtn) submitBtn.disabled = len < 120;

    status.className = 'tc-ocr-status tc-ocr-success';
    status.innerHTML = `<ph-check-circle weight="fill" size="16" color="#10B981"></ph-check-circle> 识别完成！可以修改后再提交`;
    setTimeout(() => { if (status) status.style.display = 'none'; }, 3000);
  } catch (err) {
    console.error('[ocr] failed', err);
    status.className = 'tc-ocr-status tc-ocr-error';
    status.innerHTML = `<ph-warning weight="fill" size="16" color="#DC2626"></ph-warning> 识别失败，请稍后再试`;
  }
}

async function submitForGrading(text) {
  const submitBtn = document.getElementById('tc-submit-btn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="tc-loading-dot"></span><span class="tc-loading-dot"></span><span class="tc-loading-dot"></span> AI 正在认真评分...`;

  try {
    const result = await gradeEssay(text);
    const total = Math.min(100, Math.max(0, Number(result.total) || 0));
    const passed = total >= 70;

    const content = document.getElementById('app-content');
    content.innerHTML = renderGradingResult(result, text);
    content.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 触发特效 + 语音播报
    if (passed) {
      effects.essayPass();
      speak('哇，你写得真好！要不要看看老师的范文？');
    } else {
      effects.essayRetry();
      speak('继续加油！先看看老师的范文学一学，再来挑战一次～');
    }

    // 范文展开切换
    document.getElementById('tc-sample-toggle')?.addEventListener('click', () => {
      const body = document.getElementById('tc-sample-body');
      const caret = document.querySelector('.tc-sample-caret');
      if (!body) return;
      const open = body.style.display !== 'none';
      body.style.display = open ? 'none' : 'block';
      if (caret) caret.style.transform = open ? '' : 'rotate(180deg)';
    });

    document.getElementById('tc-retry-btn')?.addEventListener('click', () => {
      stopSpeaking();
      renderWritePhase();
    });
    document.getElementById('tc-done-btn')?.addEventListener('click', () => {
      stopSpeaking();
      window.__router.navigate('topicDetail', { topicId: _topic.id });
    });
  } catch (err) {
    console.error('[topicCompose] grading failed', err);
    window.__showToast?.('评分失败，请稍后重试');
    submitBtn.disabled = false;
    submitBtn.textContent = '提交评分';
  }
}
