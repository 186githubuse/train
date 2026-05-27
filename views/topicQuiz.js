/**
 * views/topicQuiz.js
 * ─────────────────────────────────────────────────────────────
 * 专题训练 — 答题视图（A 类 + B 类 + C 类）
 * 特点：
 *   1. 顶部 16:9 固定图片框，答题时始终可见参考图
 *   2. 支持 single / multi / judge / sort 四种题型
 *   3. 按 typeA → typeB → typeC 顺序过完全部题后跳 topicCompose（D 类书写题）
 *   4. 题目按段落显示分段徽章（A 感觉三步法 / B 五感扫描 / C 连词成句）
 * ─────────────────────────────────────────────────────────────
 */

import { getSub, getTopic } from '../js/data/topics/index.js';
import { store } from '../js/store.js';
import { speak, stopSpeaking } from '../js/tts.js';
import * as effects from '../js/effects.js';

/* 页面级状态 */
let _topic = null;
let _sub = null;
let _queue = [];          // 合并 typeA + typeB + typeC 的题目队列
let _segments = [];       // 与 _queue 等长，记录每题所在段落: 'A' | 'B' | 'C'
let _currentIdx = 0;
let _selected = new Set(); // 单选/多选用
let _sortOrder = [];       // 排序题用户当前顺序
let _answered = false;
let _totalCorrect = 0;

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

/* ─── 渲染 ─── */
function renderHeader() {
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
        <span>${_currentIdx + (_answered ? 1 : 0)}</span>/<span>${_queue.length}</span>
      </div>
    </div>`;
}

function renderImageBox() {
  const q = _queue[_currentIdx];
  const overrideUrl = q?.imageOverride;
  const imgSrc = overrideUrl || _sub.image;
  const imgAlt = q?.imageOverrideAlt || _sub.imageAlt || _sub.title;
  return `
    <div class="tq-image-box" role="img" aria-label="${imgAlt}">
      <img src="${imgSrc}" alt="${imgAlt}" loading="eager">
    </div>`;
}

function renderProgress() {
  const pct = Math.round((_currentIdx / _queue.length) * 100);
  return `
    <div class="quiz-progress-wrap">
      <div class="quiz-progress-track">
        <div class="quiz-progress-fill" style="width:${pct}%"></div>
      </div>
      <span class="quiz-progress-text">${_currentIdx + 1} / ${_queue.length}</span>
    </div>`;
}

/** 单选 / 多选 / 判断 共用 */
function renderChoiceQuestion(q) {
  const letters = Object.keys(q.options);
  const optionsHtml = letters.map(letter => `
    <button class="quiz-option" data-option="${letter}" aria-label="选项${letter}">
      <span class="quiz-option-letter">${letter}</span>
      <span class="quiz-option-text">${q.options[letter]}</span>
    </button>
  `).join('');

  const typeBadge = {
    single: '单选题',
    multi: '多选题',
    judge: '判断题',
  }[q.type];

  const segLabel = SEGMENT_LABEL[_segments[_currentIdx]] || '';
  const badgeText = segLabel
    ? `${segLabel} · ${typeBadge}${q.dim ? ' · ' + q.dim : ''}`
    : `${typeBadge}${q.dim ? ' · ' + q.dim : ''}`;

  return `
    <div class="quiz-question-card glass-card rounded-[1.5rem] p-5">
      <div class="tq-type-badge-row">
        <div class="tq-type-badge">${badgeText}</div>
        <button class="tq-speak-btn" data-action="speak-question" aria-label="朗读题目">
          <ph-speaker-high weight="fill" size="18" color="#7C3AED"></ph-speaker-high>
        </button>
      </div>
      <p class="quiz-question-text">${q.text}</p>
      ${isMulti(q) ? `<p class="quiz-multi-tip">（多选题，请选出所有正确答案）</p>` : ''}
    </div>
    <div class="quiz-options">${optionsHtml}</div>
    ${isMulti(q) ? `<button class="quiz-confirm-btn" id="quiz-confirm-btn" disabled>确认答案</button>` : ''}
  `;
}

/** 排序题：点击按顺序加入 → 再次点击从序列移除 */
function renderSortQuestion(q) {
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

  const segLabel = SEGMENT_LABEL[_segments[_currentIdx]] || '';
  const badgeText = segLabel
    ? `${segLabel} · 排序题${q.dim ? ' · ' + q.dim : ''}`
    : `排序题${q.dim ? ' · ' + q.dim : ''}`;

  return `
    <div class="quiz-question-card glass-card rounded-[1.5rem] p-5">
      <div class="tq-type-badge-row">
        <div class="tq-type-badge">${badgeText}</div>
        <button class="tq-speak-btn" data-action="speak-question" aria-label="朗读题目">
          <ph-speaker-high weight="fill" size="18" color="#7C3AED"></ph-speaker-high>
        </button>
      </div>
      <p class="quiz-question-text">${q.text}</p>
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

function renderQuestion(q) {
  if (isSort(q)) return renderSortQuestion(q);
  return renderChoiceQuestion(q);
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

  const isLast = _currentIdx >= _queue.length - 1;
  const nextLabel = isLast ? '进入 D 类 · 书写成文' : '下一题';

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

/* ─── 渲染当前题（完整刷新） ─── */
function renderCurrent() {
  const content = document.getElementById('app-content');
  const q = _queue[_currentIdx];

  content.innerHTML = `
    <div class="topic-quiz-page">
      ${renderImageBox()}
      ${renderProgress()}
      <div id="tq-question-area">
        ${renderQuestion(q)}
      </div>
      <div id="tq-feedback-area"></div>
    </div>`;

  bindQuestionEvents();
}

/* ─── 提交答案 + 显示反馈 ─── */
function submitAnswer() {
  if (_answered) return;
  const q = _queue[_currentIdx];
  const isCorrect = checkAnswer(q, _selected, _sortOrder);
  _answered = true;
  if (isCorrect) _totalCorrect++;

  const content = document.getElementById('app-content');

  if (isCorrect) {
    // 答对：闪绿 + 音效 + 小撒花，300ms 后自动跳下一题
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

  // 答错：柔咚音效 + 高亮正确/错误选项 + 显示反馈
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

  // 渲染反馈（仅答错时）
  document.getElementById('tq-feedback-area').innerHTML = renderFeedback(isCorrect, q);

  document.getElementById('tq-next-btn')?.addEventListener('click', goNext);
}

/* ─── 下一题 or 进入题型3 ─── */
function goNext() {
  // 检测段落切换：当前题段落 vs 下一题段落
  const curSeg = _segments[_currentIdx];
  const nextSeg = _segments[_currentIdx + 1];

  if (_currentIdx >= _queue.length - 1) {
    // 全部答完 → 大撒花 + 总结语音 + 跳转 D 类
    effects.allChoicesComplete();
    speak('做得真棒！现在动手写作文吧～');
    window.__router.navigate('topicCompose', {
      topicId: _topic.id,
      subId: _sub.id,
      score: _totalCorrect,
      total: _queue.length,
    });
    return;
  }

  // 段落切换 → 阶段撒花 + 阶段语音
  if (curSeg && nextSeg && curSeg !== nextSeg) {
    effects.stageComplete();
    if (curSeg === 'A') speak('感觉三步法学完啦，继续加油！');
    else if (curSeg === 'B') speak('五感扫描完成啦，最后一段啦！');
  }

  _currentIdx++;
  _selected = new Set();
  _sortOrder = [];
  _answered = false;
  renderCurrent();
}

/* ─── 绑定事件 ─── */
function bindQuestionEvents() {
  const content = document.getElementById('app-content');
  const q = _queue[_currentIdx];

  // 小喇叭按钮：朗读题面（去掉 HTML 标签）
  content.querySelector('[data-action="speak-question"]')?.addEventListener('click', () => {
    const plainText = (q.text || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (plainText) speak(plainText);
  });

  if (isSort(q)) {
    // 排序题：点击可选项加入序列；点击 × 移除
    content.querySelectorAll('.tq-sort-item').forEach(btn => {
      btn.addEventListener('click', () => {
        if (_answered) return;
        const k = btn.dataset.sortKey;
        if (_sortOrder.includes(k)) return;
        _sortOrder.push(k);
        // 全部选完 → 自动启用确认按钮
        const total = Object.keys(q.items).length;
        if (_sortOrder.length === total) {
          renderPartialSort(q); // 再刷一次让 confirm 按钮 enable
        } else {
          renderPartialSort(q);
        }
      });
    });
    content.addEventListener('click', e => {
      if (_answered) return;
      const rm = e.target.closest('[data-remove]');
      if (!rm) return;
      const k = rm.dataset.remove;
      _sortOrder = _sortOrder.filter(x => x !== k);
      renderPartialSort(q);
    });
    document.getElementById('quiz-confirm-btn')?.addEventListener('click', submitAnswer);
    return;
  }

  // 单选 / 多选 / 判断
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
        // 单选 / 判断：点选即提交
        _selected = new Set([letter]);
        btn.classList.add('quiz-option-selected');
        // 延迟 120ms 以便用户看到选中反馈
        setTimeout(submitAnswer, 120);
      }
    });
  });

  document.getElementById('quiz-confirm-btn')?.addEventListener('click', submitAnswer);
}

/** 排序题子刷新（不重绘整页） */
function renderPartialSort(q) {
  const area = document.getElementById('tq-question-area');
  if (!area) return;
  area.innerHTML = renderSortQuestion(q);
  // 重新绑定：整个题的事件要重绑
  bindQuestionEvents();
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

  // 重置状态：按 A → B → C 顺序拼接，并记录每题段落
  const arrA = _sub.typeA || [];
  const arrB = _sub.typeB || [];
  const arrC = _sub.typeC || [];
  _queue = [...arrA, ...arrB, ...arrC];
  _segments = [
    ...arrA.map(() => 'A'),
    ...arrB.map(() => 'B'),
    ...arrC.map(() => 'C'),
  ];
  _currentIdx = 0;
  _selected = new Set();
  _sortOrder = [];
  _answered = false;
  _totalCorrect = 0;

  // 注入 header
  const header = document.getElementById('app-header');
  header.style.display = '';
  header.innerHTML = renderHeader();
  header.addEventListener('click', e => {
    if (e.target.closest('[data-action="quit"]')) {
      stopSpeaking();  // 退出时停掉正在播放的 TTS
      window.__router.goBack();
    }
  });

  renderCurrent();

  // 入场语音（首次进入时播报）
  speak('我们开始吧！');
}
