/**
 * views/topicCompose.js
 * ─────────────────────────────────────────────────────────────
 * 专题训练 — C 类：连句成文（综合书写大题）
 * 流程：
 *   1. 展示图片 + 全局五感树形总图（含各单元概述句作脚手架）+ 写作要求
 *   2. 学生在文本框里写一篇短文（支持拍照 OCR）
 *   3. 提交后调用 AI 按 4 维（组成完整30/顺序正确30/感觉点准确30/语句通顺10）评分
 *   4. 完成后记录积分 + 回专题列表
 *
 * 兼容两种数据：
 *   - 新结构：_sub.typeC = { totalTreeMap, essay }
 *   - 旧结构：_sub.typeD = { title, treeMap{root,branches}, requirements, rubric, sample }
 * ─────────────────────────────────────────────────────────────
 */

import { getSub, getTopic } from '../js/data/topics/index.js';
import { store } from '../js/store.js';
import { speak, stopSpeaking } from '../js/tts.js';
import * as effects from '../js/effects.js';
import { gradeEssay, compressImage, fileToBase64, ocrHandwritingFromImage } from '../js/topicAI.js';

let _topic = null;
let _sub = null;
let _task = null;       // 归一化后的任务对象
let _quizScore = 0;
let _quizTotal = 0;
let _userSegments = { frame: '', units: {} };  // 学生在 B 各单元写的内容

/* ─── 归一化：把 typeC（新）/ typeD（旧）统一成 _task ─── */
function normalizeTask() {
  // 新结构
  if (_sub.schema === 'unit' && _sub.typeC) {
    const tt = _sub.typeC.totalTreeMap || {};
    const essay = _sub.typeC.essay || {};
    const points = (tt.units || []).flatMap(u => u.nodes || []);
    return {
      title: essay.title || `写一篇《我的${_sub.title}》`,
      order: essay.order || tt.order || '',
      requirements: essay.requirements || [],
      rubric: essay.rubric || [],
      sample: essay.sample || '',
      points,
      mode: 'total',
      total: tt,
    };
  }
  // 旧结构
  const t = _sub.typeD;
  if (!t) return null;
  const points = (t.treeMap?.branches || []).flatMap(b => (b.children || []).map(c => c.name));
  return {
    title: t.title || `写一篇《我的${_sub.title}》`,
    order: t.order || '',
    requirements: t.requirements || [],
    rubric: t.rubric || [],
    sample: t.sample || '',
    points,
    mode: 'legacy',
    legacy: t.treeMap,
  };
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
        <span class="quiz-header-title">${_sub.title} · C 类·连句成文</span>
      </div>
      <div class="quiz-streak" style="visibility:hidden">.</div>
    </div>`;
}

/* 全局五感树形总图（显示学生自己写的句子作脚手架，没写过才回退到参考概述） */
function renderTotalTreeMap(tt) {
  const branches = (tt.units || []).map((u, i) => {
    const leaves = (u.nodes || []).map(n => `<li class="tc-mm-leaf">${n}</li>`).join('');
    const mine = (_userSegments.units || {})[i];
    const overview = mine
      ? `<div class="tc-mm-overview tc-mm-overview-mine">✍️ 你写的：${mine}</div>`
      : (u.overview ? `<div class="tc-mm-overview">📝 参考：${u.overview}</div>` : '');
    return `
      <div class="tc-mm-branch" style="--branch-color:${u.color || '#7C3AED'}">
        <div class="tc-mm-branch-title">${u.name}</div>
        <ul class="tc-mm-children">${leaves}</ul>
        ${overview}
      </div>`;
  }).join('');

  const headText = _userSegments.frame || tt.overview;
  const head = headText
    ? `<div class="tc-mm-overview tc-mm-overview-root">${_userSegments.frame ? '✍️ 你写的开头：' : '📝 参考开头：'}${headText}</div>`
    : '';

  return `
    <div class="tc-mindmap">
      <div class="tc-mm-root">${tt.object || _sub.title}${tt.order ? `（${tt.order}）` : ''}</div>
      ${head}
      <div class="tc-mm-branches">${branches}</div>
    </div>`;
}

/* 旧结构树形图 */
function renderLegacyTreeMap(tm) {
  const branches = (tm.branches || []).map(b => {
    const children = (b.children || []).map(c => `<li class="tc-mm-leaf">${c.name}</li>`).join('');
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

function renderTreeMap() {
  return _task.mode === 'total'
    ? renderTotalTreeMap(_task.total)
    : renderLegacyTreeMap(_task.legacy || { branches: [] });
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
        placeholder="参照上方树形总图，把各小节的概括句子连成一篇完整的短文：&#10;第一段总起写组成 → 后面每段分别描写一个部位 → 包含图中所有感觉点&#10;&#10;也可以点上方相机图标拍下手写内容自动识别～"
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
  const { topicId, subId, score = 0, total = 0, userSegments } = params;
  _topic = getTopic(topicId);
  _sub = getSub(topicId, subId);
  _task = _sub ? normalizeTask() : null;
  _quizScore = Number(score) || 0;
  _quizTotal = Number(total) || 0;
  _userSegments = userSegments && typeof userSegments === 'object'
    ? { frame: userSegments.frame || '', units: userSegments.units || {} }
    : { frame: '', units: {} };

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
      stopSpeaking();
      window.__router.navigate('topicDetail', { topicId });
    }
  });

  renderWritePhase();
}

function renderWritePhase() {
  const content = document.getElementById('app-content');
  const recap = _quizTotal > 0
    ? `<div class="tc-recap">前面选择题共答对 <b>${_quizScore}</b> / ${_quizTotal} 题，下方是你在每个小节<b>自己写过的句子</b>，把它们连起来、加上衔接，就是一篇完整的短文啦！</div>`
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
    submitBtn.disabled = len < 120;
  });

  submitBtn.addEventListener('click', async () => {
    const text = textarea.value.trim();
    if (text.length < 120) {
      window.__showToast?.('再多写一点吧，至少 120 字哦');
      return;
    }
    await submitForGrading(text);
  });

  document.getElementById('tc-btn-camera')?.addEventListener('click', () => {
    document.getElementById('tc-file-camera')?.click();
  });
  document.getElementById('tc-btn-gallery')?.addEventListener('click', () => {
    document.getElementById('tc-file-gallery')?.click();
  });

  document.getElementById('tc-file-camera')?.addEventListener('change', e => {
    const file = e.target.files?.[0];
    if (file) handleOcrUpload(file);
    e.target.value = '';
  });
  document.getElementById('tc-file-gallery')?.addEventListener('change', e => {
    const file = e.target.files?.[0];
    if (file) handleOcrUpload(file);
    e.target.value = '';
  });
}

/* ─── OCR 流程 ─── */
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
    const result = await gradeEssay(text, {
      objName: _sub.title,
      order: _task.order,
      points: _task.points,
    });
    const total = Math.min(100, Math.max(0, Number(result.total) || 0));
    const passed = total >= 70;

    const content = document.getElementById('app-content');
    content.innerHTML = renderGradingResult(result, text);
    content.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (passed) {
      effects.essayPass();
      speak('哇，你写得真好！要不要看看老师的范文？');
    } else {
      effects.essayRetry();
      speak('继续加油！先看看老师的范文学一学，再来挑战一次～');
    }

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
