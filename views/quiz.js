/**
 * views/quiz.js
 * ─────────────────────────────────────────────────────────────
 * 基础训练 — 答题页（5.13 增补规则版）
 *
 * 答题规则：
 *   • 每轮 10 题（D1×3 + D2×3 + D3×4，D3 按学生学段抽）
 *   • 答对 → 自动下一题；答错 → 显示正确答案+提示，再下一题
 *   • 一轮 10 题答完后：
 *       错 ≤ 3 → 通关
 *       错 > 3 → 自动追加 3 题补测，循环至错 ≤ 3
 *   • 最多 5 轮保险（再过不去强制提示回看视频）
 *   • 通过轮次评星：1 轮 = 3 星，2 轮 = 2 星，≥3 轮 = 1 星
 *
 * 题型支持：single（单选）、multi（多选）、judge（判断/2 选项）、link（连线）
 * ─────────────────────────────────────────────────────────────
 */

import { getLessonById } from '../js/data/lessons.js';
import { generateLessonRound, generateRetryRound } from '../js/data/questions/index.js';
import { store } from '../js/store.js';

/* ═══════════════════════════════════════════════════
   状态管理（页面级）
═══════════════════════════════════════════════════ */
let _lesson = null;
let _stage = 'S';
let _round = 1;                  // 当前轮次（1=首轮 10 题，2+=补测 3 题）
let _questions = [];             // 当前轮的题目
let _currentIdx = 0;
let _selected = new Set();       // 单选/多选/判断用
let _linkPairs = {};             // 连线题：{ '①':'B', ... }
let _activeLeftKey = null;       // 连线题：当前选中的左侧 key
let _answered = false;           // 当前题是否已提交
let _wrongInRound = 0;           // 当前轮的错题数
let _totalCorrect = 0;           // 全程累计答对
let _totalAnswered = 0;          // 全程累计答题
let _usedIds = new Set();        // 已抽过的题 id（避免补测重复）
const MAX_ROUND = 5;             // 最多 5 轮保险

/* ═══════════════════════════════════════════════════
   答案判定
═══════════════════════════════════════════════════ */
function isMulti(q) {
  return q.qtype === 'multi';
}

function checkAnswer(q) {
  if (q.qtype === 'multi') {
    const correctSet = new Set(q.correct);
    return correctSet.size === _selected.size && [..._selected].every(k => correctSet.has(k));
  }
  if (q.qtype === 'link') {
    const expected = q.correct;
    const keys = Object.keys(expected);
    return keys.every(k => _linkPairs[k] === expected[k]) &&
           Object.keys(_linkPairs).length === keys.length;
  }
  // single / judge
  return _selected.size === 1 && _selected.has(q.correct);
}

function formatCorrect(q) {
  if (q.qtype === 'multi') return q.correct.join('、');
  if (q.qtype === 'link') {
    return Object.entries(q.correct).map(([l, r]) => `${l}-${r}`).join('，');
  }
  return q.correct;
}

function formatUserAnswer(q) {
  if (q.qtype === 'link') {
    return Object.entries(_linkPairs).map(([l, r]) => `${l}-${r}`).join('，');
  }
  return [..._selected].sort().join('、');
}

/* ═══════════════════════════════════════════════════
   渲染：Header / Progress
═══════════════════════════════════════════════════ */
function renderHeader() {
  return `
    <div class="quiz-header">
      <button class="back-btn" data-action="quit-quiz" aria-label="退出答题">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      <div class="quiz-header-info">
        <ph-${_lesson.icon} weight="fill" size="20" color="#7C3AED"></ph-${_lesson.icon}>
        <span class="quiz-header-title">第${_lesson.id}课 · ${_lesson.title}</span>
      </div>
      <div class="quiz-streak" id="quiz-streak">
        <span id="round-label">${_round === 1 ? '首轮' : `补测 ${_round - 1}`}</span>
      </div>
    </div>`;
}

function renderProgress() {
  const total = _questions.length;
  const pct = total > 0 ? Math.round(_currentIdx / total * 100) : 0;
  return `
    <div class="quiz-progress-wrap">
      <div class="quiz-progress-track">
        <div class="quiz-progress-fill" id="quiz-progress-fill" style="width: ${pct}%"></div>
      </div>
      <span class="quiz-progress-text">${_currentIdx + 1} / ${total} · 错 ${_wrongInRound}</span>
    </div>`;
}

/* ═══════════════════════════════════════════════════
   渲染：题目（按 qtype 分支）
═══════════════════════════════════════════════════ */
function renderQuestion(q) {
  if (q.qtype === 'link') return renderLink(q);
  return renderChoice(q);
}

function renderChoice(q) {
  const letters = ['A', 'B', 'C', 'D'];
  const optionsHtml = letters.map(letter => {
    if (!q.options || !q.options[letter]) return '';
    return `
      <button class="quiz-option" data-option="${letter}" aria-label="选项${letter}">
        <span class="quiz-option-letter">${letter}</span>
        <span class="quiz-option-text">${q.options[letter]}</span>
      </button>`;
  }).join('');

  let tip = '';
  if (q.qtype === 'multi') tip = `<p class="quiz-multi-tip">（多选题，请选出所有正确答案）</p>`;
  else if (q.qtype === 'judge') tip = `<p class="quiz-multi-tip">（判断题）</p>`;

  return `
    <div class="quiz-question-card glass-card rounded-[1.5rem] p-5">
      <p class="quiz-question-text">${q.text}</p>
      ${tip}
    </div>
    <div class="quiz-options" id="quiz-options">
      ${optionsHtml}
    </div>
    ${q.qtype === 'multi' ? `<button class="quiz-confirm-btn" id="quiz-confirm-btn" disabled>确认答案</button>` : ''}`;
}

function renderLink(q) {
  const leftHtml = Object.entries(q.leftItems).map(([k, v]) => `
    <button class="quiz-link-left" data-left="${k}">
      <span class="quiz-link-key">${k}</span>
      <span class="quiz-link-text">${v}</span>
      <span class="quiz-link-pair" data-pair-for="${k}"></span>
    </button>`).join('');

  const rightHtml = Object.entries(q.rightItems).map(([k, v]) => `
    <button class="quiz-link-right" data-right="${k}">
      <span class="quiz-link-key">${k}</span>
      <span class="quiz-link-text">${v}</span>
    </button>`).join('');

  return `
    <div class="quiz-question-card glass-card rounded-[1.5rem] p-5">
      <p class="quiz-question-text">${q.text}</p>
      <p class="quiz-multi-tip">（连线题：先点左边一项，再点右边对应项配对）</p>
    </div>
    <div class="quiz-link-board" id="quiz-link-board">
      <div class="quiz-link-col">${leftHtml}</div>
      <div class="quiz-link-col">${rightHtml}</div>
    </div>
    <button class="quiz-confirm-btn" id="quiz-confirm-btn" disabled>确认答案</button>`;
}

/* ═══════════════════════════════════════════════════
   渲染：反馈
═══════════════════════════════════════════════════ */
function renderFeedback(isCorrect, q) {
  const correctDisplay = formatCorrect(q);
  const icon = isCorrect
    ? `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
    : `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

  const title = isCorrect ? '答对了！' : '再想想';
  const cls = isCorrect ? 'quiz-feedback-correct' : 'quiz-feedback-wrong';
  const hintHtml = !isCorrect
    ? `<p class="quiz-feedback-hint">正确答案：${correctDisplay}${q.hint ? '。' + q.hint : ''}</p>`
    : '';
  const isLast = _currentIdx === _questions.length - 1;

  return `
    <div class="quiz-feedback ${cls}" id="quiz-feedback">
      <div class="quiz-feedback-icon">${icon}</div>
      <div>
        <p class="quiz-feedback-title">${title}</p>
        ${hintHtml}
      </div>
    </div>
    <button class="quiz-next-btn ${_lesson.colorClass}" id="quiz-next-btn">
      ${isLast ? '查看本轮结果' : '下一题'}
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.5"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </button>`;
}

/* ═══════════════════════════════════════════════════
   主循环
═══════════════════════════════════════════════════ */
function renderCurrentQuestion() {
  const content = document.getElementById('app-content');
  if (!content) return;
  const q = _questions[_currentIdx];
  if (!q) {
    finishRound();
    return;
  }

  // 重置每题状态
  _selected = new Set();
  _linkPairs = {};
  _activeLeftKey = null;
  _answered = false;

  content.innerHTML = `
    <div class="quiz-page">
      ${renderProgress()}
      ${renderQuestion(q)}
      <div id="quiz-feedback-area"></div>
    </div>`;

  bindQuestionEvents(q);
}

function bindQuestionEvents(q) {
  if (q.qtype === 'link') {
    bindLinkEvents();
    return;
  }
  bindChoiceEvents(q);
}

function bindChoiceEvents(q) {
  const optionsEl = document.getElementById('quiz-options');
  if (!optionsEl) return;
  optionsEl.addEventListener('click', e => {
    if (_answered) return;
    const btn = e.target.closest('.quiz-option');
    if (!btn) return;
    const opt = btn.dataset.option;

    if (q.qtype === 'multi') {
      if (_selected.has(opt)) {
        _selected.delete(opt);
        btn.classList.remove('quiz-option-selected');
      } else {
        _selected.add(opt);
        btn.classList.add('quiz-option-selected');
      }
      const confirm = document.getElementById('quiz-confirm-btn');
      if (confirm) confirm.disabled = _selected.size === 0;
    } else {
      // single / judge
      optionsEl.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('quiz-option-selected'));
      _selected = new Set([opt]);
      btn.classList.add('quiz-option-selected');
      submitAnswer();
    }
  });

  if (q.qtype === 'multi') {
    const confirm = document.getElementById('quiz-confirm-btn');
    if (confirm) confirm.addEventListener('click', () => {
      if (_selected.size > 0 && !_answered) submitAnswer();
    });
  }
}

function bindLinkEvents() {
  const board = document.getElementById('quiz-link-board');
  if (!board) return;
  board.addEventListener('click', e => {
    if (_answered) return;
    const left = e.target.closest('.quiz-link-left');
    const right = e.target.closest('.quiz-link-right');
    if (left) {
      const k = left.dataset.left;
      _activeLeftKey = k;
      board.querySelectorAll('.quiz-link-left').forEach(b => b.classList.remove('quiz-link-active'));
      left.classList.add('quiz-link-active');
    } else if (right && _activeLeftKey) {
      const r = right.dataset.right;
      // 如果该左项已配对，先清掉旧配对
      _linkPairs[_activeLeftKey] = r;
      // 把右项 r 已经被别人配对的也清掉
      Object.keys(_linkPairs).forEach(k => {
        if (k !== _activeLeftKey && _linkPairs[k] === r) {
          delete _linkPairs[k];
        }
      });
      // 更新 UI：左项尾部显示 = 右项 key
      board.querySelectorAll('.quiz-link-pair').forEach(span => {
        const forKey = span.dataset.pairFor;
        span.textContent = _linkPairs[forKey] ? `→${_linkPairs[forKey]}` : '';
      });
      // 高亮已配对左项
      board.querySelectorAll('.quiz-link-left').forEach(b => {
        const k = b.dataset.left;
        b.classList.toggle('quiz-link-paired', !!_linkPairs[k]);
        b.classList.remove('quiz-link-active');
      });
      _activeLeftKey = null;
      // 全部配对完启用确认
      const total = Object.keys(_questions[_currentIdx].leftItems).length;
      const confirm = document.getElementById('quiz-confirm-btn');
      if (confirm) confirm.disabled = Object.keys(_linkPairs).length !== total;
    }
  });
  const confirm = document.getElementById('quiz-confirm-btn');
  if (confirm) confirm.addEventListener('click', () => {
    if (!_answered) submitAnswer();
  });
}

function submitAnswer() {
  if (_answered) return;
  _answered = true;
  const q = _questions[_currentIdx];
  const correct = checkAnswer(q);

  _totalAnswered++;
  if (correct) _totalCorrect++;
  else _wrongInRound++;

  // 错题入库
  if (!correct) {
    store._addMistake({
      lessonId: _lesson.id,
      questionId: q.id,
      questionText: q.text,
      userAnswer: formatUserAnswer(q),
      correctAnswer: formatCorrect(q),
      difficulty: q.difficulty,
    });
  }

  // 高亮答案
  highlightAnswer(q, correct);

  // 隐藏多选/连线确认按钮
  const confirm = document.getElementById('quiz-confirm-btn');
  if (confirm) confirm.style.display = 'none';

  // 反馈
  const feedbackArea = document.getElementById('quiz-feedback-area');
  if (feedbackArea) {
    feedbackArea.innerHTML = renderFeedback(correct, q);
    const next = document.getElementById('quiz-next-btn');
    if (next) {
      next.addEventListener('click', () => {
        _currentIdx++;
        if (_currentIdx >= _questions.length) finishRound();
        else renderCurrentQuestion();
      }, { once: true });
    }
  }

  // 更新进度文本
  const progText = document.querySelector('.quiz-progress-text');
  if (progText) progText.textContent = `${_currentIdx + 1} / ${_questions.length} · 错 ${_wrongInRound}`;
}

function highlightAnswer(q, isCorrect) {
  if (q.qtype === 'link') {
    const board = document.getElementById('quiz-link-board');
    if (!board) return;
    const expected = q.correct;
    Object.keys(expected).forEach(leftK => {
      const userR = _linkPairs[leftK];
      const correctR = expected[leftK];
      const leftBtn = board.querySelector(`.quiz-link-left[data-left="${leftK}"]`);
      if (!leftBtn) return;
      leftBtn.classList.add(userR === correctR ? 'quiz-link-correct' : 'quiz-link-wrong');
      const pairSpan = leftBtn.querySelector('.quiz-link-pair');
      if (pairSpan) pairSpan.textContent = `→${correctR}（应：${correctR}）`;
    });
    board.querySelectorAll('.quiz-link-left,.quiz-link-right').forEach(b => b.classList.add('quiz-option-disabled'));
    return;
  }
  const correctSet = new Set(Array.isArray(q.correct) ? q.correct : [q.correct]);
  const optionsEl = document.getElementById('quiz-options');
  if (!optionsEl) return;
  optionsEl.querySelectorAll('.quiz-option').forEach(btn => {
    const opt = btn.dataset.option;
    btn.classList.add('quiz-option-disabled');
    if (correctSet.has(opt)) btn.classList.add('quiz-option-correct');
    if (_selected.has(opt) && !correctSet.has(opt)) btn.classList.add('quiz-option-wrong');
  });
}

/* ═══════════════════════════════════════════════════
   一轮结束 → 判定
═══════════════════════════════════════════════════ */
function finishRound() {
  // 通过条件：错 ≤ 3
  if (_wrongInRound <= 3) {
    showResult(true);
    return;
  }
  // 不过：超过 5 轮强制提示视频
  if (_round >= MAX_ROUND) {
    showVideoSuggest();
    return;
  }
  // 否则进入下一轮补测
  showRetryHint();
}

function showRetryHint() {
  const content = document.getElementById('app-content');
  if (!content) return;
  content.innerHTML = `
    <div class="quiz-page">
      <div class="quiz-result-card glass-card rounded-[2rem] p-6" style="text-align:center">
        <div class="quiz-result-icon" style="background:linear-gradient(135deg,#FBBF77,#F4977C)">
          <ph-arrow-clockwise weight="fill" size="48" color="white"></ph-arrow-clockwise>
        </div>
        <h2 class="quiz-result-title">本轮 ${_questions.length} 题，错了 ${_wrongInRound} 题</h2>
        <p class="quiz-result-subtitle">差一点点就过了！再来 3 道补测题</p>
        <div class="quiz-result-actions">
          <button class="quiz-result-btn-primary ${_lesson.colorClass}" id="btn-retry">开始补测</button>
          <button class="quiz-result-btn-secondary" id="btn-quit-retry">放弃返回</button>
        </div>
      </div>
    </div>`;
  document.getElementById('btn-retry').addEventListener('click', () => {
    _round++;
    _wrongInRound = 0;
    _currentIdx = 0;
    _questions = generateRetryRound(_lesson.id, _stage, _usedIds);
    _questions.forEach(q => _usedIds.add(q.id));
    // 补测一轮通过条件：补测 3 题里错 ≤ 1（参考：3 题中超半数错就再补）
    // 但按文档原意是"错 ≤ 3 通过"——补测只有 3 题，等于 3 题全错才不过
    renderCurrentQuestion();
  });
  document.getElementById('btn-quit-retry').addEventListener('click', () => {
    window.__router.navigate('trainingCamp');
  });
}

function showVideoSuggest() {
  const content = document.getElementById('app-content');
  if (!content) return;
  content.innerHTML = `
    <div class="quiz-page">
      <div class="quiz-result-card glass-card rounded-[2rem] p-6" style="text-align:center">
        <div class="quiz-result-icon" style="background:linear-gradient(135deg,#7DA9F0,#A78BFA)">
          <ph-video weight="fill" size="48" color="white"></ph-video>
        </div>
        <h2 class="quiz-result-title">这节课需要再听一遍</h2>
        <p class="quiz-result-subtitle">已经测了 ${MAX_ROUND} 轮，建议先回看视频</p>
        <div class="quiz-result-actions">
          <button class="quiz-result-btn-primary ${_lesson.colorClass}" id="btn-rewatch">回看视频</button>
          <button class="quiz-result-btn-secondary" id="btn-back-camp">返回训练营</button>
        </div>
      </div>
    </div>`;
  document.getElementById('btn-rewatch').addEventListener('click', () => {
    window.__router.navigate('lessonDetail', { lessonId: _lesson.id });
  });
  document.getElementById('btn-back-camp').addEventListener('click', () => {
    window.__router.navigate('trainingCamp');
  });
}

/* ═══════════════════════════════════════════════════
   通关结果页
═══════════════════════════════════════════════════ */
function showResult() {
  // 评星：1 轮 = 3 星，2 轮 = 2 星，≥3 轮 = 1 星
  let stars = 1;
  if (_round === 1) stars = 3;
  else if (_round === 2) stars = 2;

  const accuracy = _totalAnswered > 0 ? Math.round(_totalCorrect / _totalAnswered * 100) : 0;
  const xp = Math.min(100, _totalCorrect * 8 + stars * 10);

  const prevProgress = store.getProgress(_lesson.id);
  const isFirstPass = !prevProgress.passed;
  store.passLesson(_lesson.id, stars, xp, _round);

  if (isFirstPass) {
    store.addStars(10);
    if (_round === 1 && _wrongInRound === 0) store.addStars(5); // 一轮 0 错额外 +5
  }

  const starsHtml = Array.from({ length: 3 }, (_, i) => {
    const filled = i < stars;
    return `<svg class="quiz-result-star ${filled ? 'star-filled' : 'star-empty'}"
                 viewBox="0 0 24 24"
                 fill="${filled ? 'currentColor' : 'none'}"
                 stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round"
                 style="animation-delay: ${i * 200}ms">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>`;
  }).join('');

  const header = document.getElementById('app-header');
  header.innerHTML = `
    <div class="quiz-header">
      <button class="back-btn" id="result-back-btn" aria-label="返回训练营">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      <div class="quiz-header-info">
        <ph-${_lesson.icon} weight="fill" size="20" color="#7C3AED"></ph-${_lesson.icon}>
        <span class="quiz-header-title">第${_lesson.id}课 · 通关结果</span>
      </div>
      <div style="width:40px"></div>
    </div>`;
  document.getElementById('result-back-btn').addEventListener('click', () => {
    window.__router.navigate('trainingCamp');
  });

  const content = document.getElementById('app-content');
  content.innerHTML = `
    <div class="quiz-result-page">
      <div class="quiz-result-card ${_lesson.colorClass} rounded-[2rem] p-6">
        <div class="quiz-result-icon">
          <ph-${_lesson.icon} weight="fill" size="48" color="rgba(255,255,255,0.95)"></ph-${_lesson.icon}>
        </div>
        <h2 class="quiz-result-title">恭喜通关！</h2>
        <p class="quiz-result-subtitle">第${_lesson.id}课 · ${_lesson.title}</p>
        <div class="quiz-result-stars">${starsHtml}</div>
        <div class="quiz-result-stats">
          <div class="quiz-result-stat">
            <span class="quiz-result-stat-value">${_round}</span>
            <span class="quiz-result-stat-label">通过轮次</span>
          </div>
          <div class="quiz-result-stat">
            <span class="quiz-result-stat-value">${accuracy}%</span>
            <span class="quiz-result-stat-label">正确率</span>
          </div>
          <div class="quiz-result-stat">
            <span class="quiz-result-stat-value">+${xp}</span>
            <span class="quiz-result-stat-label">XP</span>
          </div>
        </div>
      </div>

      <div class="quiz-result-actions">
        ${store.isUnlocked(_lesson.id + 1) && _lesson.id < 10
          ? `<button class="quiz-result-btn-primary ${_lesson.colorClass}" data-action="next-lesson">
               下一课
               <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2.5"
                    stroke-linecap="round" stroke-linejoin="round">
                 <path d="M5 12h14M12 5l7 7-7 7"/>
               </svg>
             </button>`
          : ''
        }
        <button class="quiz-result-btn-secondary" data-action="back-to-camp">
          返回训练营
        </button>
      </div>
    </div>`;

  content.addEventListener('click', e => {
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (action === 'next-lesson') {
      window.__router.navigate('lessonDetail', { lessonId: _lesson.id + 1 });
    } else if (action === 'back-to-camp') {
      window.__router.navigate('trainingCamp');
    }
  });
}

/* ═══════════════════════════════════════════════════
   公开导出
═══════════════════════════════════════════════════ */
export function renderQuiz(params = {}) {
  const { lessonId } = params;
  _lesson = getLessonById(lessonId);
  if (!_lesson) {
    window.__showToast?.('未找到该课程');
    window.__router.goBack();
    return;
  }

  // 初始化整轮状态
  _stage = store.getStage();
  _round = 1;
  _currentIdx = 0;
  _selected = new Set();
  _linkPairs = {};
  _activeLeftKey = null;
  _answered = false;
  _wrongInRound = 0;
  _totalCorrect = 0;
  _totalAnswered = 0;
  _usedIds = new Set();

  _questions = generateLessonRound(lessonId, _stage);
  _questions.forEach(q => _usedIds.add(q.id));

  if (_questions.length === 0) {
    window.__showToast?.('题目加载失败');
    window.__router.goBack();
    return;
  }

  const header = document.getElementById('app-header');
  header.innerHTML = renderHeader();
  header.querySelector('[data-action="quit-quiz"]').onclick = () => window.__router.goBack();

  renderCurrentQuestion();
}
