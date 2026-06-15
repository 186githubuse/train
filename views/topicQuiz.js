/**
 * views/topicQuiz.js
 * ─────────────────────────────────────────────────────────────
 * 专题训练 — 答题视图
 *
 * 两种数据结构兼容：
 *   1. 新「单元模块化」结构（_sub.schema === 'unit'）：静物 台灯/笔袋/书包
 *      流程（边学边写）：
 *        A 类选择题 → A 类书写题(一句话概括组成)
 *        → 每个 B 单元：单元选择题组 → 单元五感树形图 + 单元分段书写(AI 评分)
 *        → 全部过完跳 topicCompose 做 C 类综合大作文
 *   2. 旧「平铺」结构：typeA/typeB/typeC 均为数组，typeD 为书写大题（植物/动物）
 *      流程：A→B→C 选择题全过完 → 跳 topicCompose
 *
 * 书写步骤复用 topicAI.gradeSegment 做轻量评分（覆盖要点 + 通顺）。
 * ─────────────────────────────────────────────────────────────
 */

import { getSub, getTopic } from '../js/data/topics/index.js';
import { store } from '../js/store.js';
import { speak, stopSpeaking } from '../js/tts.js';
import * as effects from '../js/effects.js';
import { gradeSegment, compressImage, fileToBase64, ocrHandwritingFromImage } from '../js/topicAI.js';

/* 页面级状态 */
let _topic = null;
let _sub = null;
let _steps = [];          // 步骤队列：{ kind:'choice', q, seg, dim } | { kind:'write', write, treeMap, segLabel }
let _currentIdx = 0;
let _selected = new Set();
let _sortOrder = [];
let _answered = false;
let _totalCorrect = 0;
let _totalChoices = 0;     // 选择题总数（用于进度/统计）
let _userSegments = {};    // 学生分段书写内容：{ frame: '...', units: { 0:'...', 1:'...' } }

const SEGMENT_LABEL = {
  A: 'A · 感觉三步法',
  B: 'B · 五感扫描',
  C: 'C · 连词成句',
};

/* ─── Helpers ─── */
function isMulti(q) { return q.type === 'multi'; }
function isSort(q)  { return q.type === 'sort'; }

function checkAnswer(q, selected, sortOrder) {
  if (isSort(q)) {
    if (sortOrder.length !== q.correct.length) return false;
    return sortOrder.every((k, i) => k === q.correct[i]);
  }
  if (isMulti(q)) {
    const cs = new Set(q.correct);
    return cs.size === selected.size && [...selected].every(k => cs.has(k));
  }
  return selected.size === 1 && selected.has(q.correct);
}

function formatCorrect(q) {
  if (isSort(q)) return q.correct.join(' → ');
  return Array.isArray(q.correct) ? q.correct.join('、') : q.correct;
}

/* ─── 构建步骤队列 ─── */
function buildSteps() {
  const steps = [];
  if (_sub.schema === 'unit') {
    // —— A 类：选择题 + 书写题 ——
    const a = _sub.typeA || {};
    (a.questions || []).forEach(q => steps.push({ kind: 'choice', q, seg: 'A' }));
    if (a.write) {
      steps.push({ kind: 'write', write: a.write, treeMap: a.write.treeMap || null, seg: 'A', writeKind: 'frame' });
    }
    // —— B 类：每单元 选择题组 + 单元书写 ——
    const units = _sub.typeB?.units || [];
    units.forEach((u, ui) => {
      (u.questions || []).forEach(q => steps.push({ kind: 'choice', q, seg: 'B', unitName: u.name }));
      if (u.write) {
        steps.push({
          kind: 'write', write: u.write, treeMap: u.treeMap,
          seg: 'B', writeKind: 'unit', unitName: u.name, unitIndex: ui,
        });
      }
    });
  } else {
    // —— 旧平铺结构：A/B/C 选择题 ——
    (_sub.typeA || []).forEach(q => steps.push({ kind: 'choice', q, seg: 'A' }));
    (_sub.typeB || []).forEach(q => steps.push({ kind: 'choice', q, seg: 'B' }));
    (_sub.typeC || []).forEach(q => steps.push({ kind: 'choice', q, seg: 'C' }));
  }
  return steps;
}

/* ─── 渲染：header ─── */
function renderHeader() {
  const doneChoices = _steps.slice(0, _currentIdx + (_answered ? 1 : 0))
    .filter(s => s.kind === 'choice').length;
  return `
    <div class="quiz-header">
      <button class="back-btn" data-action="quit" aria-label="返回">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      <div class="quiz-header-info">
        <ph-jar weight="fill" size="20" color="#7C3AED"></ph-jar>
        <span class="quiz-header-title">${_topic.title} · ${_sub.title}</span>
      </div>
      <div class="quiz-streak">
        <span>${Math.min(doneChoices, _totalChoices)}</span>/<span>${_totalChoices}</span>
      </div>
    </div>`;
}

function renderImageBox() {
  const step = _steps[_currentIdx];
  const overrideUrl = step?.q?.imageOverride;
  const imgSrc = overrideUrl || _sub.image;
  const imgAlt = step?.q?.imageOverrideAlt || _sub.imageAlt || _sub.title;
  return `
    <div class="tq-image-box" role="img" aria-label="${imgAlt}">
      <img src="${imgSrc}" alt="${imgAlt}" loading="eager">
    </div>`;
}

function renderProgress() {
  const pct = Math.round((_currentIdx / _steps.length) * 100);
  return `
    <div class="quiz-progress-wrap">
      <div class="quiz-progress-track">
        <div class="quiz-progress-fill" style="width:${pct}%"></div>
      </div>
      <span class="quiz-progress-text">${_currentIdx + 1} / ${_steps.length}</span>
    </div>`;
}

/** 单选 / 多选 / 判断 共用 */
function renderChoiceQuestion(step) {
  const q = step.q;
  const letters = Object.keys(q.options);
  const optionsHtml = letters.map(letter => `
    <button class="quiz-option" data-option="${letter}" aria-label="选项${letter}">
      <span class="quiz-option-letter">${letter}</span>
      <span class="quiz-option-text">${q.options[letter]}</span>
    </button>
  `).join('');

  const typeBadge = { single: '单选题', multi: '多选题', judge: '判断题' }[q.type];
  const segLabel = SEGMENT_LABEL[step.seg] || '';
  const unitTag = step.unitName ? ` · ${step.unitName}` : '';
  const badgeText = `${segLabel}${unitTag} · ${typeBadge}${q.dim ? ' · ' + q.dim : ''}`;

  return `
    <div class="quiz-question-card glass-card rounded-[1.5rem] p-5">
      <div class="tq-type-badge-row">
        <div class="tq-type-badge">${badgeText}</div>
        <button class="tq-speak-btn" data-action="speak-question" aria-label="朗读题目">
          <ph-speaker-high weight="fill" size="18" color="#7C3AED"></ph-speaker-high>
        </button>
      </div>
      <p class="quiz-question-text">${q.text.replace(/\n/g, '<br>')}</p>
      ${isMulti(q) ? `<p class="quiz-multi-tip">（多选题，请选出所有正确答案）</p>` : ''}
    </div>
    <div class="quiz-options">${optionsHtml}</div>
    ${isMulti(q) ? `<button class="quiz-confirm-btn" id="quiz-confirm-btn" disabled>确认答案</button>` : ''}
  `;
}

/** 排序题：点击按顺序加入 → 再次点击从序列移除 */
function renderSortQuestion(step) {
  const q = step.q;
  const keys = Object.keys(q.items);
  const chosenHtml = _sortOrder.map((k, i) => `
    <div class="tq-sort-chosen" data-key="${k}">
      <span class="tq-sort-idx">${i + 1}</span>
      <span class="tq-sort-text">${q.items[k]}</span>
      <button class="tq-sort-remove" data-remove="${k}" aria-label="移除">×</button>
    </div>
  `).join('');

  const availableHtml = keys.map(k => {
    const chosen = _sortOrder.includes(k);
    return `
      <button class="tq-sort-item ${chosen ? 'tq-sort-item-chosen' : ''}"
              data-sort-key="${k}" ${chosen ? 'disabled' : ''}>
        <span class="tq-sort-letter">${k}</span>
        <span class="tq-sort-text">${q.items[k]}</span>
      </button>`;
  }).join('');

  const allSelected = _sortOrder.length === keys.length;
  const segLabel = SEGMENT_LABEL[step.seg] || '';
  const unitTag = step.unitName ? ` · ${step.unitName}` : '';
  const badgeText = `${segLabel}${unitTag} · 排序题${q.dim ? ' · ' + q.dim : ''}`;

  return `
    <div class="quiz-question-card glass-card rounded-[1.5rem] p-5">
      <div class="tq-type-badge-row">
        <div class="tq-type-badge">${badgeText}</div>
        <button class="tq-speak-btn" data-action="speak-question" aria-label="朗读题目">
          <ph-speaker-high weight="fill" size="18" color="#7C3AED"></ph-speaker-high>
        </button>
      </div>
      <p class="quiz-question-text">${q.text.replace(/\n/g, '<br>')}</p>
      <p class="quiz-multi-tip">（点击下方选项依次加入，顺序会显示在上方）</p>
    </div>

    <div class="tq-sort-panel">
      <div class="tq-sort-label">你的排序</div>
      <div class="tq-sort-chosen-list ${_sortOrder.length ? '' : 'tq-sort-empty'}">
        ${_sortOrder.length
          ? chosenHtml
          : '<div class="tq-sort-placeholder">点击下方选项开始排序</div>'}
      </div>
    </div>

    <div class="tq-sort-label" style="margin-top:16px">可选项</div>
    <div class="tq-sort-available">${availableHtml}</div>

    <button class="quiz-confirm-btn" id="quiz-confirm-btn" ${allSelected ? '' : 'disabled'}>
      ${allSelected ? '确认答案' : `还需选择 ${keys.length - _sortOrder.length} 项`}
    </button>
  `;
}

function renderFeedback(isCorrect, q) {
  const correctDisplay = formatCorrect(q);
  const icon = isCorrect
    ? `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
    : `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

  const title = isCorrect ? '答对了！' : '再想想';
  const cls = isCorrect ? 'quiz-feedback-correct' : 'quiz-feedback-wrong';
  const hintHtml = !isCorrect
    ? `<p class="quiz-feedback-hint">正确答案：${correctDisplay}${q.hint ? '<br>' + q.hint : ''}</p>`
    : (q.hint ? `<p class="quiz-feedback-hint">${q.hint}</p>` : '');

  const nextLabel = nextStepLabel();

  return `
    <div class="quiz-feedback ${cls}">
      <div class="quiz-feedback-icon">${icon}</div>
      <div>
        <p class="quiz-feedback-title">${title}</p>
        ${hintHtml}
      </div>
    </div>
    <button class="quiz-next-btn ${_topic.colorClass}" id="tq-next-btn">
      ${nextLabel}
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.5"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </button>`;
}

/** 下一步按钮文案 */
function nextStepLabel() {
  const next = _steps[_currentIdx + 1];
  if (!next) return '进入 C 类 · 书写成文';
  if (next.kind === 'write') {
    return next.writeKind === 'frame' ? '试着写一句话' : `写一写「${next.unitName}」`;
  }
  return '下一题';
}

/* ─── 渲染当前步骤 ─── */
function renderCurrent() {
  const step = _steps[_currentIdx];
  if (step.kind === 'write') {
    renderWriteStep(step);
    return;
  }

  const content = document.getElementById('app-content');
  content.innerHTML = `
    <div class="topic-quiz-page">
      ${renderImageBox()}
      ${renderProgress()}
      <div id="tq-question-area">
        ${isSort(step.q) ? renderSortQuestion(step) : renderChoiceQuestion(step)}
      </div>
      <div id="tq-feedback-area"></div>
    </div>`;

  bindQuestionEvents();
}

/* ─── 提交选择题答案 + 反馈 ─── */
function submitAnswer() {
  if (_answered) return;
  const step = _steps[_currentIdx];
  const q = step.q;
  const isCorrect = checkAnswer(q, _selected, _sortOrder);
  _answered = true;
  if (isCorrect) _totalCorrect++;

  const content = document.getElementById('app-content');

  if (isCorrect) {
    effects.answerCorrect();
    if (isSort(q)) {
      content.querySelectorAll('.tq-sort-chosen').forEach(el => el.classList.add('tq-sort-correct'));
    } else {
      content.querySelectorAll('.quiz-option').forEach(btn => {
        const letter = btn.dataset.option;
        if (_selected.has(letter)) btn.classList.add('quiz-option-correct');
        btn.disabled = true;
      });
    }
    const confirmBtn = document.getElementById('quiz-confirm-btn');
    if (confirmBtn) confirmBtn.style.display = 'none';
    setTimeout(goNext, 300);
    return;
  }

  // 答错
  effects.answerWrong();
  if (isSort(q)) {
    content.querySelectorAll('.tq-sort-chosen').forEach((el, i) => {
      const expected = q.correct[i];
      const userKey = _sortOrder[i];
      el.classList.add(userKey === expected ? 'tq-sort-correct' : 'tq-sort-wrong');
    });
    content.querySelectorAll('.tq-sort-item').forEach(btn => btn.disabled = true);
    content.querySelectorAll('.tq-sort-remove').forEach(btn => btn.style.display = 'none');
    const confirmBtn = document.getElementById('quiz-confirm-btn');
    if (confirmBtn) confirmBtn.style.display = 'none';
  } else {
    content.querySelectorAll('.quiz-option').forEach(btn => {
      const letter = btn.dataset.option;
      const correctArr = Array.isArray(q.correct) ? q.correct : [q.correct];
      if (correctArr.includes(letter)) btn.classList.add('quiz-option-correct');
      else if (_selected.has(letter))  btn.classList.add('quiz-option-wrong');
      btn.disabled = true;
    });
    const confirmBtn = document.getElementById('quiz-confirm-btn');
    if (confirmBtn) confirmBtn.style.display = 'none';
  }

  document.getElementById('tq-feedback-area').innerHTML = renderFeedback(isCorrect, q);
  document.getElementById('tq-next-btn')?.addEventListener('click', goNext);
}

/* ─── 下一步 ─── */
function goNext() {
  const cur = _steps[_currentIdx];
  const next = _steps[_currentIdx + 1];

  if (!next) {
    // 全部步骤完成 → 大撒花 + 跳 C 类综合大作文
    effects.allChoicesComplete();
    speak('做得真棒！现在把它们连成一篇作文吧～');
    window.__router.navigate('topicCompose', {
      topicId: _topic.id,
      subId: _sub.id,
      score: _totalCorrect,
      total: _totalChoices,
      userSegments: _userSegments,
    });
    return;
  }

  // 段落切换撒花（A→B 等），仅在选择题之间切段时触发
  if (cur.kind === 'choice' && next.kind === 'choice' && cur.seg !== next.seg) {
    effects.stageComplete();
    if (cur.seg === 'A') speak('感觉三步法学完啦，继续加油！');
  }

  _currentIdx++;
  _selected = new Set();
  _sortOrder = [];
  _answered = false;
  renderCurrent();
}

/* ─── 绑定选择/排序题事件 ─── */
function bindQuestionEvents() {
  const content = document.getElementById('app-content');
  const step = _steps[_currentIdx];
  const q = step.q;

  content.querySelector('[data-action="speak-question"]')?.addEventListener('click', () => {
    const plainText = (q.text || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (plainText) speak(plainText);
  });

  if (isSort(q)) {
    content.querySelectorAll('.tq-sort-item').forEach(btn => {
      btn.addEventListener('click', () => {
        if (_answered) return;
        const k = btn.dataset.sortKey;
        if (_sortOrder.includes(k)) return;
        _sortOrder.push(k);
        renderPartialSort(step);
      });
    });
    content.addEventListener('click', e => {
      if (_answered) return;
      const rm = e.target.closest('[data-remove]');
      if (!rm) return;
      const k = rm.dataset.remove;
      _sortOrder = _sortOrder.filter(x => x !== k);
      renderPartialSort(step);
    });
    document.getElementById('quiz-confirm-btn')?.addEventListener('click', submitAnswer);
    return;
  }

  content.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => {
      if (_answered) return;
      const letter = btn.dataset.option;
      if (isMulti(q)) {
        if (_selected.has(letter)) {
          _selected.delete(letter);
          btn.classList.remove('quiz-option-selected');
        } else {
          _selected.add(letter);
          btn.classList.add('quiz-option-selected');
        }
        const confirm = document.getElementById('quiz-confirm-btn');
        if (confirm) confirm.disabled = _selected.size === 0;
      } else {
        _selected = new Set([letter]);
        btn.classList.add('quiz-option-selected');
        setTimeout(submitAnswer, 120);
      }
    });
  });

  document.getElementById('quiz-confirm-btn')?.addEventListener('click', submitAnswer);
}

/** 排序题子刷新 */
function renderPartialSort(step) {
  const area = document.getElementById('tq-question-area');
  if (!area) return;
  area.innerHTML = renderSortQuestion(step);
  bindQuestionEvents();
}

/* ════════════════════════════════════════════════════════════
 *  书写步骤（A 类一句话框架 / B 单元分段书写）
 * ════════════════════════════════════════════════════════════ */

function renderUnitTreeMap(treeMap) {
  if (!treeMap) return '';
  const leaves = treeMap.nodes.map(n => `<li class="tc-mm-leaf">${n}</li>`).join('');
  return `
    <div class="tc-mindmap">
      <div class="tc-mm-branches">
        <div class="tc-mm-branch" style="--branch-color:#7C3AED">
          <div class="tc-mm-branch-title">${treeMap.title}</div>
          <ul class="tc-mm-children">${leaves}</ul>
        </div>
      </div>
    </div>`;
}

function renderWriteStep(step) {
  const content = document.getElementById('app-content');
  const w = step.write;
  const minLen = step.writeKind === 'frame' ? 10 : 20;
  const segLabel = step.writeKind === 'frame'
    ? 'A · 一句话概括组成'
    : `B · ${step.unitName} · 分段书写`;

  content.innerHTML = `
    <div class="topic-quiz-page topic-compose-page">
      ${renderImageBox()}
      ${renderProgress()}
      <div class="quiz-question-card glass-card rounded-[1.5rem] p-5">
        <div class="tq-type-badge-row">
          <div class="tq-type-badge">${segLabel}</div>
          <button class="tq-speak-btn" data-action="speak-write" aria-label="朗读题目">
            <ph-speaker-high weight="fill" size="18" color="#7C3AED"></ph-speaker-high>
          </button>
        </div>
        <p class="quiz-question-text">${w.prompt}</p>
        <p class="quiz-multi-tip">${w.requirement || ''}</p>
      </div>
      ${renderUnitTreeMap(step.treeMap)}
      <div class="tc-write-area">
        <div class="tc-write-header">
          <span class="tc-write-label">写一写</span>
          <div class="tc-write-tools">
            <button class="tc-tool-btn" id="tq-btn-camera" title="拍照识字" aria-label="拍照识字">
              <ph-camera weight="fill" size="18" color="#7C3AED"></ph-camera>
            </button>
            <button class="tc-tool-btn" id="tq-btn-gallery" title="从相册选图" aria-label="从相册选图">
              <ph-image weight="fill" size="18" color="#7C3AED"></ph-image>
            </button>
            <span class="tc-write-count"><span id="tq-char-count">0</span> 字</span>
          </div>
        </div>
        <input type="file" id="tq-file-camera" accept="image/*" capture="environment" style="display:none">
        <input type="file" id="tq-file-gallery" accept="image/*" style="display:none">
        <div id="tq-ocr-status" class="tc-ocr-status" style="display:none"></div>
        <textarea id="tq-seg-input" class="tc-essay-input"
          placeholder="参照上面的要点，用通顺的话写出来吧～"
          rows="5" maxlength="400"></textarea>
        <button class="tc-submit-btn ${_topic.colorClass}" id="tq-seg-submit" disabled>
          提交看看
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
      <div id="tq-seg-result"></div>
    </div>`;

  bindWriteEvents(step, minLen);
  speak(w.prompt.replace(/<[^>]+>/g, ' '));
}

function bindWriteEvents(step, minLen) {
  const w = step.write;
  const textarea = document.getElementById('tq-seg-input');
  const countEl = document.getElementById('tq-char-count');
  const submitBtn = document.getElementById('tq-seg-submit');

  document.querySelector('[data-action="speak-write"]')?.addEventListener('click', () => {
    speak(w.prompt.replace(/<[^>]+>/g, ' '));
  });

  textarea.addEventListener('input', () => {
    const len = textarea.value.trim().length;
    countEl.textContent = len;
    submitBtn.disabled = len < minLen;
  });

  submitBtn.addEventListener('click', () => submitSegment(step, minLen));

  // OCR
  document.getElementById('tq-btn-camera')?.addEventListener('click', () => {
    document.getElementById('tq-file-camera')?.click();
  });
  document.getElementById('tq-btn-gallery')?.addEventListener('click', () => {
    document.getElementById('tq-file-gallery')?.click();
  });
  document.getElementById('tq-file-camera')?.addEventListener('change', e => {
    const file = e.target.files?.[0];
    if (file) handleSegOcr(file, minLen);
    e.target.value = '';
  });
  document.getElementById('tq-file-gallery')?.addEventListener('change', e => {
    const file = e.target.files?.[0];
    if (file) handleSegOcr(file, minLen);
    e.target.value = '';
  });
}

async function handleSegOcr(file, minLen) {
  const status = document.getElementById('tq-ocr-status');
  const textarea = document.getElementById('tq-seg-input');
  const countEl = document.getElementById('tq-char-count');
  const submitBtn = document.getElementById('tq-seg-submit');
  if (!status || !textarea) return;

  status.style.display = 'flex';
  status.className = 'tc-ocr-status tc-ocr-loading';
  status.innerHTML = `
    <span class="tc-loading-dot"></span><span class="tc-loading-dot"></span>
    <span class="tc-loading-dot"></span><span>正在识别手写内容...</span>`;

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
    if (submitBtn) submitBtn.disabled = len < minLen;
    status.className = 'tc-ocr-status tc-ocr-success';
    status.innerHTML = `<ph-check-circle weight="fill" size="16" color="#10B981"></ph-check-circle> 识别完成！可以修改后再提交`;
    setTimeout(() => { if (status) status.style.display = 'none'; }, 3000);
  } catch (err) {
    console.error('[seg-ocr] failed', err);
    status.className = 'tc-ocr-status tc-ocr-error';
    status.innerHTML = `<ph-warning weight="fill" size="16" color="#DC2626"></ph-warning> 识别失败，请稍后再试`;
  }
}

async function submitSegment(step, minLen) {
  const w = step.write;
  const textarea = document.getElementById('tq-seg-input');
  const submitBtn = document.getElementById('tq-seg-submit');
  const text = textarea.value.trim();
  if (text.length < minLen) {
    window.__showToast?.('再多写一点点吧～');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="tc-loading-dot"></span><span class="tc-loading-dot"></span><span class="tc-loading-dot"></span> 老师正在看...`;

  // 记录学生自己写的内容（C 类总图回填用）
  if (step.writeKind === 'frame') _userSegments.frame = text;
  else if (typeof step.unitIndex === 'number') _userSegments.units[step.unitIndex] = text;

  const unitName = step.writeKind === 'frame' ? '组成与顺序' : (step.unitName || '');
  try {
    const result = await gradeSegment(text, {
      objName: _sub.title,
      unitName,
      points: w.points || [],
      reference: w.reference || '',
    });
    renderSegResult(step, result, text);
  } catch (err) {
    console.error('[segment] grading failed', err);
    // AI 失败兜底：不卡流程，直接展示参考答案，允许继续
    renderSegResult(step, null, text);
  }
}

function renderSegResult(step, result, text) {
  const w = step.write;
  const area = document.getElementById('tq-seg-result');
  const submitBtn = document.getElementById('tq-seg-submit');
  if (submitBtn) submitBtn.style.display = 'none';

  const pass = result ? (Number(result.total) >= 70) : true;
  const total = result ? Math.min(100, Math.max(0, Number(result.total) || 0)) : null;

  // 通过给 3 星鼓励（每个书写小节奖励，沿用积分体系）
  if (pass) { effects.stageComplete(); store.addStars(3); }
  else effects.answerWrong();

  const missing = (result?.missing || []).filter(Boolean);
  const fbCls = pass ? 'quiz-feedback-correct' : 'quiz-feedback-wrong';
  const fbTitle = pass ? '写得真不错！' : '快完整啦，再补一点～';

  const aiBlock = result ? `
    ${result.highlight ? `<p class="quiz-feedback-hint"><ph-sparkle weight="fill" size="14" color="#10B981"></ph-sparkle> ${result.highlight}</p>` : ''}
    ${missing.length ? `<p class="quiz-feedback-hint"><ph-lightbulb weight="fill" size="14" color="#F59E0B"></ph-lightbulb> 如果再写上：${missing.join('、')}，就更完整啦</p>` : ''}
    ${result.encouragement ? `<p class="quiz-feedback-hint">${result.encouragement}</p>` : ''}
  ` : `<p class="quiz-feedback-hint">先对照下面的参考答案看一看吧～</p>`;

  area.innerHTML = `
    <div class="quiz-feedback ${fbCls}">
      <div class="quiz-feedback-icon">
        ${pass
          ? `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
          : `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><circle cx="12" cy="12" r="10"/></svg>`}
      </div>
      <div>
        <p class="quiz-feedback-title">${fbTitle}${total !== null ? `（${total} 分）` : ''}</p>
        ${aiBlock}
      </div>
    </div>

    <div class="tc-sample-section glass-card rounded-[1.25rem] p-4">
      <button class="tc-sample-toggle" id="tq-seg-sample-toggle">
        <ph-book-open weight="fill" size="18" color="#7C3AED"></ph-book-open>
        <span>看看参考答案</span>
        <ph-caret-down weight="bold" size="16" color="#7C3AED" class="tc-sample-caret"></ph-caret-down>
      </button>
      <div class="tc-sample-body" id="tq-seg-sample-body" style="display:none;">
        <p class="tc-sample-text">${(w.reference || '').replace(/\n/g, '<br>')}</p>
      </div>
    </div>

    <div class="tc-result-actions">
      <button class="tc-btn-secondary" id="tq-seg-retry">再改一改</button>
      <button class="tc-btn-primary ${_topic.colorClass}" id="tq-seg-next">
        ${nextStepLabel()}
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </div>`;

  if (pass) speak('写得真棒！我们继续～');
  else speak('快完整啦，看看参考答案，再补一点点～');

  document.getElementById('tq-seg-sample-toggle')?.addEventListener('click', () => {
    const body = document.getElementById('tq-seg-sample-body');
    const caret = document.querySelector('#tq-seg-result .tc-sample-caret');
    if (!body) return;
    const open = body.style.display !== 'none';
    body.style.display = open ? 'none' : 'block';
    if (caret) caret.style.transform = open ? '' : 'rotate(180deg)';
  });

  document.getElementById('tq-seg-retry')?.addEventListener('click', () => {
    stopSpeaking();
    area.innerHTML = '';
    const sb = document.getElementById('tq-seg-submit');
    if (sb) { sb.style.display = ''; sb.disabled = false; sb.innerHTML = '提交看看'; }
    document.getElementById('tq-seg-input')?.focus();
  });
  document.getElementById('tq-seg-next')?.addEventListener('click', () => {
    stopSpeaking();
    goNext();
  });
}

/* ─── 入口 ─── */
export function renderTopicQuiz(params = {}) {
  const { topicId, subId } = params;
  _topic = getTopic(topicId);
  _sub = getSub(topicId, subId);

  if (!_topic || !_sub) {
    window.__showToast?.('未找到该子内容');
    window.__router.goBack();
    return;
  }

  _steps = buildSteps();
  _totalChoices = _steps.filter(s => s.kind === 'choice').length;
  _currentIdx = 0;
  _selected = new Set();
  _sortOrder = [];
  _answered = false;
  _totalCorrect = 0;
  _userSegments = { frame: '', units: {} };

  const header = document.getElementById('app-header');
  header.style.display = '';
  header.innerHTML = renderHeader();
  header.addEventListener('click', e => {
    if (e.target.closest('[data-action="quit"]')) {
      stopSpeaking();
      window.__router.goBack();
    }
  });

  renderCurrent();
  speak('我们开始吧！');
}
