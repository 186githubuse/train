/**
 * views/magicMachine.js
 * ─────────────────────────────────────────────────────────────
 * 感觉训练系统 — 魔法机器（AI 动态选项引导式写作助手）
 *
 * 流程：
 *   首页（输入题目 / 拍照）
 *   → 逐步引导（每步 AI 根据题目动态生成 4 个贴切选项）
 *   → 生成作文（展示 + 复制）
 * ─────────────────────────────────────────────────────────────
 */

import { API_CONFIG } from '../js/config.js';
import { store } from '../js/store.js';

// ── 页面状态 ──
let _phase = 'home';       // 'home' | 'guide' | 'essay'
let _topic = '';
let _step = 0;
let _answers = [];         // [{sense, emoji, answer}]
let _currentOptions = [];  // 当前步骤 AI 生成的选项
let _optionsCache = {};    // 预生成缓存 { stepIdx: Promise<string[]> }
let _essay = '';
let _isLoading = false;
let _container = null;
let _imageBase64 = null;
let _imageMimeType = null;
let _imagePreview = null;

// ── 引导步骤定义（只定义感觉维度和引导方向，选项由 AI 生成）──
const GUIDE_STEPS = [
  {
    sense: '颜色',
    emoji: '🎨',
    question: '用眼睛看，它是什么颜色的？',
    tip: '颜色让画面鲜活起来！',
    aiGuide: '颜色（如红色、白色、金黄色等，用生动的比喻描述颜色）',
  },
  {
    sense: '形状',
    emoji: '🔷',
    question: '它的形状是什么样的？',
    tip: '形状让读者脑补画面！',
    aiGuide: '形状或体型（如圆圆的、高高大大的、小巧玲珑的，用比喻更生动）',
  },
  {
    sense: '动作',
    emoji: '🏃',
    question: '它在做什么动作？',
    tip: '动作让画面动起来！',
    aiGuide: '正在做的动作（用生动的动词描述，让画面活起来）',
  },
  {
    sense: '声音',
    emoji: '👂',
    question: '用耳朵听，能听到什么声音？',
    tip: '声音让文章更有感染力！',
    aiGuide: '能听到的声音或声息（用拟声词，区分响亮的"声音"和细小的"声息"）',
  },
  {
    sense: '气味',
    emoji: '👃',
    question: '用鼻子闻，能闻到什么气味？',
    tip: '气味能让读者身临其境！',
    aiGuide: '能闻到的气味或气息（区分浓烈的"气味"和淡淡的"气息"）',
  },
  {
    sense: '触感',
    emoji: '✋',
    question: '用手摸一摸，感觉是什么样的？',
    tip: '触感描写让读者"隔空触摸"！',
    aiGuide: '触摸时的感觉（光滑/粗糙、软/硬、冷/热、干/湿等）',
  },
  {
    sense: '心情',
    emoji: '💖',
    question: '看到它，你心里有什么感觉？',
    tip: '写出内心感受，文章更有温度！',
    aiGuide: '内心的情感感受（开心、好奇、感动、自豪等，写出为什么有这种感受）',
  },
];

const TOTAL_STEPS = GUIDE_STEPS.length;

// ── API 调用 ──────────────────────────────────────────────────

async function callClaude(messages, systemPrompt, maxTokens = 512) {
  const res = await fetch(`${API_CONFIG.baseUrl}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_CONFIG.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: API_CONFIG.model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages,
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  return data.content?.[0]?.text || '';
}

async function callClaudeWithImage(base64, mimeType, prompt, systemPrompt) {
  const res = await fetch(`${API_CONFIG.baseUrl}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_CONFIG.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: API_CONFIG.model,
      max_tokens: 800,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64 } },
          { type: 'text', text: prompt },
        ],
      }],
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  return data.content?.[0]?.text || '';
}

// ── 核心：AI 动态生成选项 ─────────────────────────────────────

const OPTION_SYSTEM_PROMPT = `你是一个帮助小学生写作文的AI助手，基于"感觉训练"教学体系。
你的任务：根据作文题目和当前感觉维度，生成4个贴切、生动、适合小学生的描述选项。

【要求】
1. 选项必须紧扣作文题目，描述该题目主角的真实特征
2. 语言生动，多用比喻，适合小学生理解
3. 4个选项要有区分度，不要太相似
4. 每个选项是一句完整的描述，10-20字左右
5. 严格按JSON格式返回，不要多余文字

【输出格式】
{"options": ["选项1", "选项2", "选项3", "选项4"]}`;

/**
 * 调用 AI 为当前步骤生成选项
 * @param {string} topic - 作文题目
 * @param {Object} step - 当前步骤定义
 * @param {Array} prevAnswers - 前面已收集的答案（给 AI 更多上下文）
 * @returns {Promise<string[]>}
 */
async function generateOptions(topic, step, prevAnswers) {
  const contextStr = prevAnswers.length > 0
    ? `\n已收集的信息：${prevAnswers.map(a => `${a.sense}：${a.answer}`).join('；')}`
    : '';

  const prompt = `作文题目：《${_topic}》${contextStr}

请为"${step.sense}"这个感觉维度生成4个选项。
这个维度的引导方向：${step.aiGuide}

例如题目是《我的小狗》，颜色维度的选项应该是：
["棕色的，像一块巧克力","白色的，像一团棉花","黑白相间，像小奶牛","金黄色的，毛茸茸的"]

现在请为《${topic}》的"${step.sense}"生成4个选项：`;

  try {
    const raw = await callClaude(
      [{ role: 'user', content: prompt }],
      OPTION_SYSTEM_PROMPT,
      256
    );
    // 解析 JSON
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed.options) && parsed.options.length >= 2) {
        return parsed.options.slice(0, 4);
      }
    }
    throw new Error('格式错误');
  } catch (e) {
    // 降级：返回通用选项
    return getFallbackOptions(step.sense, topic);
  }
}

/** 降级选项（API 失败时使用） */
function getFallbackOptions(sense, topic) {
  const fallbacks = {
    颜色: ['红色的，像火焰一样', '白色的，干干净净', '金黄色的，暖暖的', '五颜六色，很好看'],
    形状: ['圆圆的，很可爱', '高高大大的', '小巧玲珑的', '长长的，细细的'],
    动作: ['活泼地跑来跑去', '安静地待在那里', '轻轻地摇摆', '快速地移动'],
    声音: ['"叽叽喳喳"叫个不停', '"哗哗哗"很响亮', '悄悄的，几乎没有声音', '"沙沙沙"细细的声息'],
    气味: ['香香的，非常好闻', '淡淡的清香，若有若无', '浓浓的气味，扑鼻而来', '没有特别的气味'],
    触感: ['光滑柔软，摸起来很舒服', '毛茸茸的，软软的', '凉凉的，很舒服', '粗糙坚硬'],
    心情: ['非常开心，很喜欢它', '感到好奇，想多了解', '觉得很美，舍不得离开', '感到温暖，心情很好'],
  };
  return fallbacks[sense] || ['很有趣', '非常好', '很特别', '让人印象深刻'];
}

// ── 生成作文 ─────────────────────────────────────────────────

async function generateEssay() {
  const user = store.getUser();
  _isLoading = true;
  _phase = 'essay';
  _essay = '';
  rerender();

  try {
    const sensesText = _answers.map(a => `${a.sense}：${a.answer}`).join('\n');

    const systemPrompt = `你是一位专业的小学语文写作老师，擅长"感觉训练法"写作教学。请根据学生收集的感觉素材，帮他写一篇真实生动的作文。

【核心写作原则】
感觉点是写作的原材料，要如实描写，不要过度修饰。
- 用感觉点把场景写真实、写具体，让读者身临其境
- 比喻是点睛之笔，全文最多用2-3个，放在最关键的地方，不要每句都加
- 拟声词适度使用，用在声音描写处即可
- 不要堆砌华丽词语，小学生的语言要自然朴实

【段落结构】
第1段：开头引入，写看到的（颜色、形状、动作）
第2段：写听到的声音或声息
第3段：写闻到的气味或气息、摸到的触感
第4段：写内心感受，结尾有一句真实的感悟

【格式要求】
1. 严格只用学生提供的素材，不杜撰没有的内容
2. 300字左右，语言自然，适合小学生水平
3. 直接输出作文正文，第一行写题目《${_topic}》，然后空一行写正文`;

    _essay = await callClaude(
      [{ role: 'user', content: `请根据以下感觉素材，帮我写一篇关于"${_topic}"的作文：\n\n${sensesText}` }],
      systemPrompt,
      1024
    );
  } catch (e) {
    _essay = `生成失败：${e.message}\n\n请检查网络后重试。`;
  }

  _isLoading = false;
  rerender();
}

// ── HTML 构建 ─────────────────────────────────────────────────

function buildHomeHTML() {
  return `
<div class="mm-page">
  <div class="mm-header">
    <div style="width:36px"></div>
    <h1 class="mm-title">🤖 魔法机器</h1>
    <div style="width:36px"></div>
  </div>

  <div class="mm-hero-card">
    <div class="mm-hero-icon">✨</div>
    <div class="mm-hero-title">感觉魔法机器</div>
    <div class="mm-hero-desc">告诉我你的作文题目<br>我来一步步引导你收集写作素材<br>最后帮你写出一篇好作文！</div>
  </div>

  <div class="mm-card">
    <div class="mm-card-label">📝 你的作文题目是？</div>
    <input type="text"
           id="mm-topic-input"
           class="mm-topic-input"
           placeholder="例如：我的小狗、秋天的公园…"
           maxlength="20">
    <button class="mm-primary-btn" id="mm-start-btn">开始写作之旅 🚀</button>
  </div>

  <div class="mm-card mm-photo-card">
    <div class="mm-photo-title">📷 拍张照片找灵感</div>
    <div class="mm-photo-subtitle">拍下你想写的事物，AI 帮你发现写作素材</div>
    <div class="mm-photo-btns">
      <button class="mm-photo-btn" id="mm-camera-btn"><span>📸</span><span>拍照</span></button>
      <button class="mm-photo-btn" id="mm-upload-btn"><span>🖼️</span><span>从相册选</span></button>
    </div>
    <input type="file" id="mm-file-camera" accept="image/*" capture="environment" style="display:none">
    <input type="file" id="mm-file-upload" accept="image/*" style="display:none">
  </div>

  <div style="height:100px"></div>
</div>`;
}

function buildGuideHTML() {
  const step = GUIDE_STEPS[_step];
  const progress = Math.round((_step / TOTAL_STEPS) * 100);

  const answeredHtml = _answers.map((a, i) => `
    <div class="mm-answered-item" style="animation-delay:${i * 30}ms">
      <span class="mm-answered-sense">${a.emoji} ${a.sense}</span>
      <span class="mm-answered-val">${a.answer}</span>
    </div>`).join('');

  const optionsHtml = _isLoading
    ? ''
    : _currentOptions.map((opt, i) => `
        <button class="mm-option-btn" data-idx="${i}" style="animation-delay:${i * 70}ms">
          ${escHtml(opt)}
        </button>`).join('');

  return `
<div class="mm-page">
  <div class="mm-header">
    <button class="back-btn" id="mm-back-btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
    <div class="mm-guide-title-wrap">
      <div class="mm-guide-topic">《${_topic}》</div>
      <div class="mm-progress-bar-wrap">
        <div class="mm-progress-bar" style="width:${progress}%"></div>
      </div>
      <div class="mm-guide-step-txt">${_step}/${TOTAL_STEPS} 个感觉点</div>
    </div>
    <div style="width:36px"></div>
  </div>

  ${_answers.length > 0 ? `<div class="mm-answered-list">${answeredHtml}</div>` : ''}

  <!-- 问题卡片 -->
  <div class="mm-question-card">
    <div class="mm-question-emoji">${step.emoji}</div>
    <div class="mm-question-text">${step.question}</div>
    <div class="mm-question-tip">💡 ${step.tip}</div>
  </div>

  <!-- 选项区 -->
  <div class="mm-options-list" id="mm-options-list">
    ${_isLoading ? `
      <div class="mm-options-loading">
        <div class="mm-typing-dots"><span></span><span></span><span></span></div>
        <div class="mm-loading-txt">魔法机器正在思考贴切的选项…</div>
      </div>` : optionsHtml}
  </div>

  <div style="height:100px"></div>
</div>`;
}

function buildEssayHTML() {
  const isGenerating = _isLoading || !_essay;
  return `
<div class="mm-page">
  <div class="mm-header">
    <button class="back-btn" id="mm-essay-back-btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
    <h1 class="mm-title">${isGenerating ? '✍️ 生成中…' : '✍️ 你的作文'}</h1>
    <div style="width:36px"></div>
  </div>

  <!-- 素材小结 -->
  <div class="mm-sense-summary glass-card">
    <div class="mm-summary-title">🎯 你收集的感觉素材</div>
    <div class="mm-summary-list">
      ${_answers.map(a => `
        <div class="mm-summary-item">
          <span class="mm-summary-emoji">${a.emoji}</span>
          <span class="mm-summary-sense">${a.sense}：</span>
          <span class="mm-summary-val">${escHtml(a.answer)}</span>
        </div>`).join('')}
    </div>
  </div>

  <!-- 作文正文 / 加载中 -->
  ${isGenerating ? `
  <div class="mm-essay-generating glass-card">
    <div class="mm-typing-dots"><span></span><span></span><span></span></div>
    <div class="mm-loading-txt">魔法机器正在帮你写作文，稍等片刻…</div>
  </div>` : `
  <div class="mm-essay-card glass-card">
    <div class="mm-essay-content">${formatText(_essay)}</div>
  </div>
  <div class="mm-essay-actions">
    <button class="mm-essay-btn mm-essay-copy" id="mm-copy-btn">📋 复制作文</button>
    <button class="mm-essay-btn mm-essay-redo" id="mm-redo-btn">🔄 重新收集</button>
  </div>`}

  <div style="height:100px"></div>
</div>`;
}

// ── 工具 ─────────────────────────────────────────────────────

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatText(text) {
  return escHtml(text).replace(/\n/g, '<br>');
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const parts = e.target.result.split(',');
      resolve({ base64: parts[1], mimeType: file.type, preview: e.target.result });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── 核心流程 ─────────────────────────────────────────────────

/** 预先请求某步骤的选项，结果存入缓存（不影响当前渲染） */
function prefetchStep(stepIdx) {
  if (stepIdx >= TOTAL_STEPS) return;
  if (_optionsCache[stepIdx]) return; // 已有缓存
  // 注意：预生成时 _answers 可能还没有当前步骤的答案，但上下文已够用
  _optionsCache[stepIdx] = generateOptions(_topic, GUIDE_STEPS[stepIdx], _answers);
}

/** 进入某个步骤：优先读缓存，缓存命中则无需 loading */
async function enterStep(stepIdx) {
  _step = stepIdx;
  _currentOptions = [];

  // 检查缓存
  if (_optionsCache[stepIdx]) {
    // 缓存 Promise 可能已 resolved 或还在进行中
    const cached = await _optionsCache[stepIdx];
    _currentOptions = cached;
    _isLoading = false;
    rerender();
  } else {
    // 无缓存，正常请求（显示 loading）
    _isLoading = true;
    rerender();
    _currentOptions = await generateOptions(_topic, GUIDE_STEPS[stepIdx], _answers);
    _isLoading = false;
    rerender();
  }

  if (_container) _container.scrollTop = 0;

  // 后台预生成下一步选项
  prefetchStep(stepIdx + 1);
}

/** 学生点选了某个选项 */
function selectAnswer(optIdx) {
  const answer = _currentOptions[optIdx];
  if (!answer) return;
  const step = GUIDE_STEPS[_step];
  _answers.push({ sense: step.sense, emoji: step.emoji, answer });

  if (_step + 1 >= TOTAL_STEPS) {
    generateEssay();
  } else {
    enterStep(_step + 1);
  }
}

/** 处理图片上传 */
async function handleImageUpload(file) {
  if (!file || !file.type.startsWith('image/')) return;
  if (file.size > 5 * 1024 * 1024) { window.__showToast('图片不能超过 5MB'); return; }

  try {
    window.__showToast('正在识别图片… 🔍');
    const { base64, mimeType, preview } = await fileToBase64(file);
    _imageBase64 = base64;
    _imageMimeType = mimeType;
    _imagePreview = preview;

    const topic = document.getElementById('mm-topic-input')?.value.trim() || '';
    const sysPrompt = `你是一个帮助小学生写作文的AI助手。请用亲切活泼的语言，从图片中用"15个感觉点"框架（颜色、形状、动作、声音、气味、触感等）发现写作素材，给出4-6句生动具体的描述，适合小学生直接用于写作。`;
    const userPrompt = topic
      ? `这张图片和我的作文题目《${topic}》有关，请帮我发现写作灵感。`
      : `请帮我从这张图片中发现写作灵感。`;

    const insight = await callClaudeWithImage(base64, mimeType, userPrompt, sysPrompt);
    showImageInsight(insight, preview, topic);
  } catch (e) {
    window.__showToast(`图片识别失败：${e.message}`);
  }
}

function showImageInsight(insight, preview, topic) {
  document.getElementById('mm-insight-overlay')?.remove();
  const overlay = document.createElement('div');
  overlay.id = 'mm-insight-overlay';
  overlay.className = 'mm-overlay';
  overlay.innerHTML = `
    <div class="mm-overlay-card">
      <img src="${preview}" class="mm-overlay-img" alt="图片">
      <div class="mm-overlay-title">✨ 写作灵感</div>
      <div class="mm-overlay-content">${formatText(insight)}</div>
      <div class="mm-overlay-actions">
        <button class="mm-primary-btn" id="mm-insight-start">用这个题目开始 🚀</button>
        <button class="mm-overlay-close" id="mm-insight-close">关闭</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  document.getElementById('mm-insight-close')?.addEventListener('click', () => overlay.remove());
  document.getElementById('mm-insight-start')?.addEventListener('click', () => {
    overlay.remove();
    const t = topic || document.getElementById('mm-topic-input')?.value.trim() || '图片里的故事';
    _topic = t;
    _answers = [];
    _phase = 'guide';
    rerender();
    enterStep(0);
  });
}

// ── 重渲染 & 事件 ─────────────────────────────────────────────

function rerender() {
  if (!_container) return;
  if (_phase === 'home')        _container.innerHTML = buildHomeHTML();
  else if (_phase === 'guide')  _container.innerHTML = buildGuideHTML();
  else if (_phase === 'essay')  _container.innerHTML = buildEssayHTML();
  bindEvents();
}

function bindEvents() {
  // 首页
  const startBtn = document.getElementById('mm-start-btn');
  const topicInput = document.getElementById('mm-topic-input');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      const t = topicInput?.value.trim();
      if (!t) { window.__showToast('请先输入作文题目 📝'); topicInput?.focus(); return; }
      _topic = t;
      _answers = [];
      _phase = 'guide';
      rerender();
      enterStep(0);
    });
  }
  if (topicInput) {
    topicInput.addEventListener('keydown', e => { if (e.key === 'Enter') startBtn?.click(); });
    setTimeout(() => topicInput.focus(), 150);
  }
  document.getElementById('mm-camera-btn')?.addEventListener('click', () => document.getElementById('mm-file-camera')?.click());
  document.getElementById('mm-upload-btn')?.addEventListener('click', () => document.getElementById('mm-file-upload')?.click());
  document.getElementById('mm-file-camera')?.addEventListener('change', e => handleImageUpload(e.target.files[0]));
  document.getElementById('mm-file-upload')?.addEventListener('change', e => handleImageUpload(e.target.files[0]));

  // 引导页
  document.getElementById('mm-back-btn')?.addEventListener('click', () => {
    if (_step === 0) {
      _phase = 'home'; rerender();
    } else {
      _answers.pop();
      enterStep(_step - 1);
    }
  });

  // 选项点击
  document.querySelectorAll('.mm-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (_isLoading) return;
      btn.classList.add('mm-option-selected');
      const idx = Number(btn.dataset.idx);
      setTimeout(() => selectAnswer(idx), 180);
    });
  });

  // 作文页
  document.getElementById('mm-essay-back-btn')?.addEventListener('click', () => {
    _phase = 'home'; _answers = []; _step = 0; _essay = ''; _currentOptions = []; rerender();
  });
  document.getElementById('mm-copy-btn')?.addEventListener('click', () => {
    navigator.clipboard?.writeText(_essay)
      .then(() => window.__showToast('已复制到剪贴板 📋'))
      .catch(() => window.__showToast('请手动复制'));
  });
  document.getElementById('mm-redo-btn')?.addEventListener('click', () => {
    _answers = []; _essay = ''; _optionsCache = {}; _phase = 'guide'; rerender(); enterStep(0);
  });
}

// ── 主入口 ────────────────────────────────────────────────────

export function renderMagicMachine() {
  _container = document.getElementById('app-content');
  if (!_container) return;

  _phase = 'home';
  _topic = '';
  _step = 0;
  _answers = [];
  _currentOptions = [];
  _optionsCache = {};
  _essay = '';
  _isLoading = false;
  _imageBase64 = null;
  _imageMimeType = null;
  _imagePreview = null;

  rerender();
}
