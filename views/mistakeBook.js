/**
 * views/mistakeBook.js
 * ─────────────────────────────────────────────────────────────
 * 感觉训练系统 — 错题本（5.19 改版）
 *
 * 功能：
 *   1. 按知识点授课顺序排列错题
 *   2. 区分"待改错"（open）和"已通过"（cleared，灰色）
 *   3. 点击错题：显示知识点解析 → 开始复测（同知识点+同难度连对3题）
 *   4. 复测中答错不进错题本，答错重置连对计数
 *   5. 连对3题 → 自动置灰
 * ─────────────────────────────────────────────────────────────
 */

import { store } from '../js/store.js';
import { LESSONS, getLessonById } from '../js/data/lessons.js';
import { getQuestionsByLessonAndDifficulty, QUESTIONS } from '../js/data/questions/index.js';

// ── 页面级状态 ──
let _filterStatus = 'open'; // 'open' | 'cleared' | 'all'
let _activeMistakeId = null; // 当前正在复测的错题ID
let _reviewPhase = 'explain'; // 'explain' | 'quiz'
let _reviewQuestions = [];   // 复测用的3道题
let _reviewIdx = 0;          // 当前复测第几题
let _reviewSelected = null;
let _reviewAnswered = false;
let _cooldowns = {};         // { mistakeId: expiryTimestamp }
let _cooldownTimer = null;

const DIFFICULTY_TEXT = { 1: '基础', 2: '中等', 3: '挑战' };
const DIFFICULTY_COLOR = { 1: '#4CAF50', 2: '#FF9800', 3: '#FF5252' };

// ═══════════════════════════════════════════════════
// 数据
// ═══════════════════════════════════════════════════

function getFilteredMistakes() {
  let list = store.getMistakes();
  if (_filterStatus === 'open') list = list.filter(m => m.status !== 'cleared');
  else if (_filterStatus === 'cleared') list = list.filter(m => m.status === 'cleared');
  // 按知识点（lessonId）排序
  list.sort((a, b) => a.lessonId - b.lessonId || a.timestamp - b.timestamp);
  return list;
}

// ═══════════════════════════════════════════════════
// HTML
// ═══════════════════════════════════════════════════

function buildFilterBar() {
  const openCount = store.getOpenMistakes().length;
  const clearedCount = store.getClearedMistakes().length;
  return `
    <div class="mb-filter-bar glass-card">
      <div class="mb-status-tabs">
        <button class="mb-status-tab ${_filterStatus === 'open' ? 'active' : ''}"
                data-status="open">待改错 (${openCount})</button>
        <button class="mb-status-tab ${_filterStatus === 'cleared' ? 'active' : ''}"
                data-status="cleared">已通过 (${clearedCount})</button>
        <button class="mb-status-tab ${_filterStatus === 'all' ? 'active' : ''}"
                data-status="all">全部</button>
      </div>
    </div>`;
}

function buildMistakeCard(mistake, index) {
  const lesson = getLessonById(mistake.lessonId);
  const lessonName = lesson ? lesson.title : `第${mistake.lessonId}课`;
  const diffText = DIFFICULTY_TEXT[mistake.difficulty] || '未知';
  const diffColor = DIFFICULTY_COLOR[mistake.difficulty] || '#999';
  const isCleared = mistake.status === 'cleared';
  const isActive = _activeMistakeId === mistake.id;

  // 从题库查出完整题目（含选项）
  const fullQ = QUESTIONS.find(q => q.id === mistake.questionId);
  const userLetters = new Set((mistake.userAnswer || '').split(/[、,]/).map(s => s.trim().charAt(0)));
  const correctLetters = new Set(
    Array.isArray(fullQ?.correct) ? fullQ.correct : [fullQ?.correct]
  );

  let optionsHtml = '';
  if (fullQ && fullQ.options) {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    optionsHtml = letters.map(letter => {
      if (!fullQ.options[letter]) return '';
      let cls = 'mb-opt';
      if (correctLetters.has(letter)) cls += ' mb-opt-correct';
      if (userLetters.has(letter) && !correctLetters.has(letter)) cls += ' mb-opt-wrong';
      return `<div class="${cls}"><span class="mb-opt-letter">${letter}</span><span class="mb-opt-text">${fullQ.options[letter]}</span></div>`;
    }).join('');
  }

  return `
    <div class="mb-card glass-card ${isCleared ? 'mb-card-cleared' : ''}"
         style="animation-delay:${index * 40}ms" data-id="${mistake.id}">
      <div class="mb-card-header">
        <div class="mb-card-meta">
          <span class="mb-lesson-tag">${lessonName}</span>
          <span class="mb-diff-tag" style="color:${diffColor};background:${diffColor}18">${diffText}</span>
          ${isCleared ? '<span class="mb-reviewed-tag">✓ 已通过</span>' : ''}
          ${!isCleared && mistake.reviewStreak > 0 ? `<span class="mb-streak-tag">连对 ${mistake.reviewStreak}/3</span>` : ''}
        </div>
      </div>
      <div class="mb-question-text">${mistake.questionText}</div>
      <div class="mb-options-review">${optionsHtml}</div>
      ${mistake.explanation ? `<p class="mb-explain-text">${mistake.explanation}</p>` : ''}
      ${isActive ? buildReviewArea(mistake) : ''}
      ${!isActive && !isCleared ? buildActionButton(mistake) : ''}
    </div>`;
}

function buildActionButton(mistake) {
  const expiry = _cooldowns[mistake.id];
  if (expiry && Date.now() < expiry) {
    const secs = Math.ceil((expiry - Date.now()) / 1000);
    return `
      <div class="mb-actions">
        <button class="mb-btn mb-btn-cooldown" disabled>
          先巩固知识，${secs}秒后可重试
        </button>
      </div>`;
  }
  return `
    <div class="mb-actions">
      <button class="mb-btn mb-btn-redo" data-action="start-review" data-id="${mistake.id}">
        巩固测试
      </button>
    </div>`;
}

function buildReviewArea(mistake) {
  if (_reviewPhase === 'explain') {
    const lesson = getLessonById(mistake.lessonId);
    const keyPoints = lesson ? lesson.keyPoints.map(kp => `<li>${kp}</li>`).join('') : '';
    return `
      <div class="mb-review-area">
        <div class="mb-review-explain">
          <div class="mb-review-explain-title">知识点讲解</div>
          ${mistake.explanation ? `<p class="mb-review-explain-text">${mistake.explanation}</p>` : ''}
          <div class="mb-review-explain-points">
            <p class="mb-review-explain-subtitle">${lesson ? lesson.title : ''}核心要点：</p>
            <ul>${keyPoints}</ul>
          </div>
        </div>
        <button class="mb-btn mb-btn-redo" data-action="start-quiz" data-id="${mistake.id}">
          我懂了，开始测试
        </button>
      </div>`;
  }
  return '';
}

// ═══════════════════════════════════════════════════
// 独立复测页面
// ═══════════════════════════════════════════════════

function renderReviewPage(container) {
  const mistake = store.getMistakes().find(m => m.id === _activeMistakeId);
  if (!mistake) { resetReviewState(); rerender(container); return; }

  const lesson = getLessonById(mistake.lessonId);
  const lessonName = lesson ? lesson.title : `第${mistake.lessonId}课`;
  const streak = mistake.reviewStreak || 0;

  const q = _reviewQuestions[_reviewIdx];

  let bodyHtml = '';
  if (!q) {
    bodyHtml = `<div class="mb-review-empty"><p>暂无可用复测题，请稍后再试</p>
      <button class="mb-btn mb-btn-redo" data-action="review-cancel">返回错题本</button></div>`;
  } else {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const optionsHtml = letters.map(letter => {
      if (!q.options[letter]) return '';
      let cls = 'mb-redo-option';
      if (_reviewAnswered) {
        const correctKey = Array.isArray(q.correct) ? q.correct[0] : q.correct;
        if (letter === correctKey) cls += ' correct';
        else if (letter === _reviewSelected) cls += ' wrong';
        else cls += ' disabled';
      } else if (letter === _reviewSelected) {
        cls += ' selected';
      }
      return `
        <button class="${cls}"
                data-action="review-select" data-letter="${letter}"
                ${_reviewAnswered ? 'disabled' : ''}>
          <span class="mb-redo-letter">${letter}</span>
          <span class="mb-redo-text">${q.options[letter]}</span>
        </button>`;
    }).join('');

    let feedbackHtml = '';
    if (_reviewAnswered) {
      const correctKey = Array.isArray(q.correct) ? q.correct[0] : q.correct;
      const isCorrect = _reviewSelected === correctKey;
      const currentStreak = store.getMistakes().find(m => m.id === _activeMistakeId)?.reviewStreak || 0;
      feedbackHtml = `
        <div class="mb-redo-feedback ${isCorrect ? 'correct' : 'wrong'}">
          ${isCorrect
            ? `✓ 答对了！(${currentStreak}/3)`
            : `✗ 答错了，正确答案是 ${correctKey}`}
          ${q.explanation ? `<div class="mb-redo-hint">${q.explanation}</div>` : ''}
        </div>
        <button class="mb-btn mb-btn-redo" data-action="review-next">
          ${isCorrect && currentStreak >= 3 ? '完成！返回错题本' : '下一步'}
        </button>`;
    } else {
      feedbackHtml = `
        <div class="mb-redo-actions">
          <button class="mb-btn mb-btn-submit" data-action="review-submit" ${!_reviewSelected ? 'disabled' : ''}>
            确认答案
          </button>
        </div>`;
    }

    bodyHtml = `
      <div class="mb-question-text" style="margin-bottom:16px">${q.text}</div>
      <div class="mb-redo-options">${optionsHtml}</div>
      ${feedbackHtml}`;
  }

  container.innerHTML = `
<div class="mb-page">
  <div class="mb-header">
    <button class="back-btn" data-action="review-cancel">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
    <div class="mb-title-wrap">
      <h1 class="mb-title">${lessonName} · 错题复测</h1>
    </div>
    <div class="quiz-streak"><span>连对 ${streak}/3</span></div>
  </div>

  <div class="mb-review-page-body">
    <div class="mb-review-progress">第 ${_reviewIdx + 1} 题</div>
    ${bodyHtml}
  </div>

  <div style="height:80px"></div>
</div>`;

  handleReviewPageEvents(container);
}

function handleReviewPageEvents(container) {
  container.querySelector('.mb-page').addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;

    if (action === 'review-select') {
      if (_reviewAnswered) return;
      _reviewSelected = btn.dataset.letter;
      renderReviewPage(container);
    }

    if (action === 'review-submit') {
      if (!_reviewSelected) return;
      _reviewAnswered = true;
      const q = _reviewQuestions[_reviewIdx];
      const correctKey = Array.isArray(q.correct) ? q.correct[0] : q.correct;
      if (_reviewSelected === correctKey) {
        store.incrementReviewStreak(_activeMistakeId);
      } else {
        store.resetReviewStreak(_activeMistakeId);
      }
      renderReviewPage(container);
    }

    if (action === 'review-next') {
      const mistake = store.getMistakes().find(m => m.id === _activeMistakeId);
      if (mistake && mistake.status === 'cleared') {
        window.__showToast?.('恭喜！这道错题已通过');
        resetReviewState();
        rerender(container);
        return;
      }
      const q = _reviewQuestions[_reviewIdx];
      const correctKey = Array.isArray(q?.correct) ? q.correct[0] : q?.correct;
      if (_reviewSelected !== correctKey) {
        // 答错了，设置60秒冷却
        _cooldowns[_activeMistakeId] = Date.now() + 60000;
        window.__showToast?.('答错了，1分钟后可重试');
        const mistakeId = _activeMistakeId;
        resetReviewState();
        rerender(container);
        // 启动倒计时刷新
        startCooldownTimer(container, mistakeId);
        return;
      }
      _reviewIdx++;
      _reviewSelected = null;
      _reviewAnswered = false;
      if (_reviewIdx >= _reviewQuestions.length) {
        const m2 = store.getMistakes().find(m => m.id === _activeMistakeId);
        if (m2 && m2.status !== 'cleared') {
          _reviewQuestions = getQuestionsByLessonAndDifficulty(m2.lessonId, m2.difficulty, m2.questionId);
          _reviewIdx = 0;
        }
      }
      renderReviewPage(container);
    }

    if (action === 'review-cancel') {
      resetReviewState();
      rerender(container);
    }
  });
}

function buildEmptyState() {
  const msg = _filterStatus === 'open'
    ? '太棒了，没有待改错的题！'
    : _filterStatus === 'cleared' ? '还没有通过的错题' : '错题本是空的！';
  return `
    <div class="mb-empty">
      <div class="mb-empty-icon"><ph-confetti weight="fill" size="52" color="#A78BFA"></ph-confetti></div>
      <div class="mb-empty-title">${msg}</div>
      <div class="mb-empty-sub">继续保持，成为感觉大师！</div>
      <button class="mb-empty-btn" onclick="window.__router.navigate('trainingCamp')">
        去学习
      </button>
    </div>`;
}

function buildPageHTML() {
  const filtered = getFilteredMistakes();

  const cardsHtml = filtered.length === 0
    ? buildEmptyState()
    : filtered.map((m, i) => buildMistakeCard(m, i)).join('');

  return `
<div class="mb-page">
  <div class="mb-header">
    <button class="back-btn" onclick="window.__router.goBack()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
    <div class="mb-title-wrap">
      <h1 class="mb-title">错题本</h1>
    </div>
    <div style="width:36px"></div>
  </div>

  ${buildFilterBar()}

  <div class="mb-stats-row">
    <span class="mb-stats-text">共 <b>${filtered.length}</b> 道错题</span>
  </div>

  <div class="mb-list" id="mb-list">
    ${cardsHtml}
  </div>

  <div style="height:100px"></div>
</div>`;
}

// ═══════════════════════════════════════════════════
// 事件
// ═══════════════════════════════════════════════════

function handleEvents(container) {
  // 状态 Tab
  container.querySelectorAll('.mb-status-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      _filterStatus = btn.dataset.status;
      resetReviewState();
      rerender(container);
    });
  });

  // 列表事件委托
  container.querySelector('#mb-list')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === 'start-review') {
      _activeMistakeId = id;
      _reviewPhase = 'explain';
      rerender(container);
    }

    if (action === 'start-quiz') {
      _reviewPhase = 'quiz';
      const mistake = store.getMistakes().find(m => m.id === _activeMistakeId);
      if (mistake) {
        _reviewQuestions = getQuestionsByLessonAndDifficulty(
          mistake.lessonId, mistake.difficulty, mistake.questionId
        );
        _reviewIdx = 0;
        _reviewSelected = null;
        _reviewAnswered = false;
      }
      renderReviewPage(container);
      return;
    }

    if (action === 'review-cancel') {
      resetReviewState();
      rerender(container);
    }
  });
}

function resetReviewState() {
  _activeMistakeId = null;
  _reviewPhase = 'explain';
  _reviewQuestions = [];
  _reviewIdx = 0;
  _reviewSelected = null;
  _reviewAnswered = false;
}

function startCooldownTimer(container, mistakeId) {
  if (_cooldownTimer) clearInterval(_cooldownTimer);
  _cooldownTimer = setInterval(() => {
    const expiry = _cooldowns[mistakeId];
    if (!expiry || Date.now() >= expiry) {
      clearInterval(_cooldownTimer);
      _cooldownTimer = null;
      delete _cooldowns[mistakeId];
      rerender(container);
    } else {
      // 更新按钮文字
      const btn = container.querySelector(`[data-id="${mistakeId}"]`)?.querySelector('.mb-btn-cooldown');
      if (btn) {
        const secs = Math.ceil((expiry - Date.now()) / 1000);
        btn.textContent = `先巩固知识，${secs}秒后可重试`;
      }
    }
  }, 1000);
}

function rerender(container) {
  container.innerHTML = buildPageHTML();
  handleEvents(container);
}

// ═══════════════════════════════════════════════════
// 主入口
// ═══════════════════════════════════════════════════

export function renderMistakeBook() {
  const container = document.getElementById('app-content');
  if (!container) return;

  _filterStatus = 'open';
  resetReviewState();

  container.innerHTML = buildPageHTML();
  handleEvents(container);
}
