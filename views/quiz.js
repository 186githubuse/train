/**
 * views/quiz.js
 * ─────────────────────────────────────────────────────────────
 * 感觉训练系统 — 答题页
 * 职责：展示题目 + 选项 + 正误反馈 + 通关/继续逻辑
 *
 * 通关条件：连续答对 3 题
 * 连续答错 3 题：提示回看视频
 * ─────────────────────────────────────────────────────────────
 */

import { getLessonById } from '../js/data/lessons.js';
import { generateQuizSet } from '../js/data/questions.js';
import { store } from '../js/store.js';

/* ═══════════════════════════════════════════════════
   状态管理（页面级）
═══════════════════════════════════════════════════ */
let _lesson = null;
let _questions = [];
let _currentIdx = 0;
let _selected = null;        // 用户选的选项 'A'|'B'|'C'|'D'
let _answered = false;       // 当前题是否已提交
let _consecutiveCorrect = 0; // 连续答对
let _consecutiveWrong = 0;   // 连续答错
let _totalCorrect = 0;
let _totalAnswered = 0;
let _passed = false;
let _questionStartTime = 0;

/* ═══════════════════════════════════════════════════
   渲染函数
═══════════════════════════════════════════════════ */

/** 渲染顶部 Header */
function renderHeader(lesson) {
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
        <span class="quiz-header-emoji">${lesson.emoji}</span>
        <span class="quiz-header-title">第${lesson.id}课 · ${lesson.title}</span>
      </div>
      <div class="quiz-streak" id="quiz-streak">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
        <span id="streak-count">0</span>/3
      </div>
    </div>`;
}

/** 渲染进度条 */
function renderProgress() {
  const total = _questions.length;
  const pct = total > 0 ? Math.round(((_currentIdx) / total) * 100) : 0;
  return `
    <div class="quiz-progress-wrap">
      <div class="quiz-progress-track">
        <div class="quiz-progress-fill" id="quiz-progress-fill" style="width: ${pct}%"></div>
      </div>
      <span class="quiz-progress-text">${_currentIdx + 1} / ${total}</span>
    </div>`;
}

/** 渲染题目和选项 */
function renderQuestion(q) {
  const optionLetters = ['A', 'B', 'C', 'D'];
  const optionsHtml = optionLetters.map(letter => {
    if (!q.options[letter]) return '';
    return `
      <button class="quiz-option" data-option="${letter}" aria-label="选项${letter}">
        <span class="quiz-option-letter">${letter}</span>
        <span class="quiz-option-text">${q.options[letter]}</span>
      </button>`;
  }).join('');

  return `
    <div class="quiz-question-card glass-card rounded-[1.5rem] p-5" id="quiz-question-card">
      <p class="quiz-question-text">${q.text}</p>
    </div>
    <div class="quiz-options" id="quiz-options">
      ${optionsHtml}
    </div>`;
}

/** 渲染反馈区域 */
function renderFeedback(isCorrect, correctAnswer, hint) {
  const icon = isCorrect
    ? `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
    : `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

  const title = isCorrect ? '答对了！' : '再想想';
  const cls = isCorrect ? 'quiz-feedback-correct' : 'quiz-feedback-wrong';
  const hintHtml = hint && !isCorrect ? `<p class="quiz-feedback-hint">正确答案是 ${correctAnswer}${hint ? '：' + hint : ''}</p>` : '';

  return `
    <div class="quiz-feedback ${cls}" id="quiz-feedback">
      <div class="quiz-feedback-icon">${icon}</div>
      <div>
        <p class="quiz-feedback-title">${title}</p>
        ${hintHtml}
      </div>
    </div>
    <button class="quiz-next-btn ${_lesson.colorClass}" id="quiz-next-btn">
      ${_passed ? '查看结果' : '下一题'}
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.5"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </button>`;
}

/** 渲染通关结果页 */
function renderResult() {
  const accuracy = _totalAnswered > 0 ? Math.round((_totalCorrect / _totalAnswered) * 100) : 0;

  // 计算星星：3星=accuracy>=90, 2星=>=70, 1星=>=0
  let stars = 1;
  if (accuracy >= 90) stars = 3;
  else if (accuracy >= 70) stars = 2;

  // 计算 XP
  const xp = Math.min(100, _totalCorrect * 20 + stars * 10);

  // 保存进度
  store.passLesson(_lesson.id, stars, xp);

  // 增加 attemptCount
  const prev = store.getProgress(_lesson.id);

  const starsHtml = Array.from({ length: 3 }, (_, i) => {
    const filled = i < stars;
    return `
      <svg class="quiz-result-star ${filled ? 'star-filled' : 'star-empty'}"
           viewBox="0 0 24 24"
           fill="${filled ? 'currentColor' : 'none'}"
           stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round"
           style="animation-delay: ${i * 200}ms">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
      </svg>`;
  }).join('');

  return `
    <div class="quiz-result-page">
      <div class="quiz-result-card ${_lesson.colorClass} rounded-[2rem] p-6">
        <div class="quiz-result-emoji">${_lesson.emoji}</div>
        <h2 class="quiz-result-title">恭喜通关！</h2>
        <p class="quiz-result-subtitle">第${_lesson.id}课 · ${_lesson.title}</p>
        <div class="quiz-result-stars">${starsHtml}</div>
        <div class="quiz-result-stats">
          <div class="quiz-result-stat">
            <span class="quiz-result-stat-value">${accuracy}%</span>
            <span class="quiz-result-stat-label">正确率</span>
          </div>
          <div class="quiz-result-stat">
            <span class="quiz-result-stat-value">${_totalCorrect}/${_totalAnswered}</span>
            <span class="quiz-result-stat-label">答对</span>
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
}

/** 渲染回看视频提示 */
function renderVideoHint() {
  return `
    <div class="quiz-video-hint glass-card rounded-[1.5rem] p-5" id="quiz-video-hint">
      <div class="quiz-video-hint-icon">💡</div>
      <p class="quiz-video-hint-text">连续答错了3题，要不要回去再看看视频？</p>
      <div class="quiz-video-hint-actions">
        <button class="quiz-video-hint-btn" data-action="rewatch-video">回看视频</button>
        <button class="quiz-video-hint-btn quiz-video-hint-btn-secondary" data-action="continue-quiz">继续答题</button>
      </div>
    </div>`;
}

/* ═══════════════════════════════════════════════════
   核心渲染
═══════════════════════════════════════════════════ */

/** 渲染当前题目状态 */
function renderCurrentQuestion() {
  const content = document.getElementById('app-content');
  if (!content) return;

  const q = _questions[_currentIdx];
  if (!q) {
    // 所有题目已答完但没通关 → 重新出题
    refillQuestions();
    return;
  }

  _selected = null;
  _answered = false;
  _questionStartTime = Date.now();

  content.innerHTML = `
    <div class="quiz-page">
      ${renderProgress()}
      ${renderQuestion(q)}
      <div id="quiz-feedback-area"></div>
    </div>`;

  // 更新 streak 显示
  updateStreakDisplay();
  bindQuestionEvents();
}

/** 补充题目（题用完但还没通关） */
function refillQuestions() {
  const difficulty = store.getCurrentDifficulty();
  const newQuestions = generateQuizSet(_lesson.id, difficulty, 5);
  _questions = [..._questions, ...newQuestions];
  renderCurrentQuestion();
}

/** 更新连续答对显示 */
function updateStreakDisplay() {
  const el = document.getElementById('streak-count');
  if (el) el.textContent = _consecutiveCorrect;

  const wrap = document.getElementById('quiz-streak');
  if (wrap) {
    wrap.classList.toggle('quiz-streak-active', _consecutiveCorrect > 0);
  }
}

/** 更新进度条 */
function updateProgressBar() {
  const fill = document.getElementById('quiz-progress-fill');
  if (fill) {
    const pct = Math.round(((_currentIdx) / _questions.length) * 100);
    fill.style.width = `${Math.min(pct, 100)}%`;
  }
}

/* ═══════════════════════════════════════════════════
   事件绑定
═══════════════════════════════════════════════════ */

function bindQuestionEvents() {
  const optionsEl = document.getElementById('quiz-options');
  if (!optionsEl) return;

  optionsEl.addEventListener('click', e => {
    if (_answered) return;

    const btn = e.target.closest('.quiz-option');
    if (!btn) return;

    const option = btn.dataset.option;

    // 如果点的是已选中的，取消选中
    if (_selected === option) {
      _selected = null;
      btn.classList.remove('quiz-option-selected');
      return;
    }

    // 清除之前的选中
    optionsEl.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('quiz-option-selected'));

    // 选中当前
    _selected = option;
    btn.classList.add('quiz-option-selected');

    // 自动提交
    submitAnswer();
  });
}

function submitAnswer() {
  if (!_selected || _answered) return;
  _answered = true;

  const q = _questions[_currentIdx];
  const isCorrect = _selected === q.correct;
  const responseTime = Date.now() - _questionStartTime;

  // 更新状态
  _totalAnswered++;
  if (isCorrect) {
    _totalCorrect++;
    _consecutiveCorrect++;
    _consecutiveWrong = 0;
  } else {
    _consecutiveCorrect = 0;
    _consecutiveWrong++;
  }

  // 通过 store 更新能力指数和记录错题
  store.updateAbility(q.difficulty, isCorrect, responseTime);
  if (!isCorrect) {
    store._addMistake({
      lessonId: _lesson.id,
      questionId: q.id,
      questionText: q.text,
      userAnswer: _selected,
      correctAnswer: q.correct,
      difficulty: q.difficulty,
    });
  }

  // 检查是否通关
  _passed = _consecutiveCorrect >= 3;

  // 更新选项样式
  const optionsEl = document.getElementById('quiz-options');
  optionsEl.querySelectorAll('.quiz-option').forEach(btn => {
    const opt = btn.dataset.option;
    btn.classList.add('quiz-option-disabled');

    if (opt === q.correct) {
      btn.classList.add('quiz-option-correct');
    }
    if (opt === _selected && !isCorrect) {
      btn.classList.add('quiz-option-wrong');
    }
  });

  // 更新 streak 显示
  updateStreakDisplay();

  // 显示反馈
  const feedbackArea = document.getElementById('quiz-feedback-area');
  if (feedbackArea) {
    // 连续答错3题 → 提示回看视频
    if (_consecutiveWrong >= 3) {
      feedbackArea.innerHTML = renderFeedback(isCorrect, q.correct, q.hint) + renderVideoHint();
    } else {
      feedbackArea.innerHTML = renderFeedback(isCorrect, q.correct, q.hint);
    }

    // 绑定"下一题"按钮
    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (_passed) {
          showResult();
        } else {
          _currentIdx++;
          renderCurrentQuestion();
        }
      }, { once: true });
    }

    // 绑定视频提示按钮
    bindVideoHintEvents();
  }
}

function bindVideoHintEvents() {
  const hint = document.getElementById('quiz-video-hint');
  if (!hint) return;

  hint.addEventListener('click', e => {
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (action === 'rewatch-video') {
      // 回到课程详情页
      window.__router.navigate('lessonDetail', { lessonId: _lesson.id });
    } else if (action === 'continue-quiz') {
      _consecutiveWrong = 0;
      hint.remove();
    }
  });
}

function showResult() {
  const header = document.getElementById('app-header');
  const content = document.getElementById('app-content');

  header.innerHTML = '';
  content.innerHTML = renderResult();

  // 绑定结果页事件
  content.addEventListener('click', e => {
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (action === 'next-lesson') {
      const nextId = _lesson.id + 1;
      window.__router.navigate('lessonDetail', { lessonId: nextId });
    } else if (action === 'back-to-camp') {
      window.__router.navigate('trainingCamp');
    }
  }, { once: false });
}

/* ═══════════════════════════════════════════════════
   公开导出的视图渲染函数
═══════════════════════════════════════════════════ */

/**
 * 渲染答题页
 * @param {{ lessonId: number }} params
 */
export function renderQuiz(params = {}) {
  const { lessonId } = params;
  _lesson = getLessonById(lessonId);

  if (!_lesson) {
    window.__showToast?.('未找到该课程');
    window.__router.goBack();
    return;
  }

  // 初始化状态
  _currentIdx = 0;
  _selected = null;
  _answered = false;
  _consecutiveCorrect = 0;
  _consecutiveWrong = 0;
  _totalCorrect = 0;
  _totalAnswered = 0;
  _passed = false;

  // 根据能力指数选择难度，生成题目
  const difficulty = store.getCurrentDifficulty();
  _questions = generateQuizSet(lessonId, difficulty, 5);

  if (_questions.length === 0) {
    window.__showToast?.('题目加载失败');
    window.__router.goBack();
    return;
  }

  // 渲染 Header
  const header = document.getElementById('app-header');
  header.innerHTML = renderHeader(_lesson);

  // 绑定 Header 事件
  header.addEventListener('click', e => {
    if (e.target.closest('[data-action="quit-quiz"]')) {
      window.__router.goBack();
    }
  });

  // 渲染第一道题
  renderCurrentQuestion();
}
