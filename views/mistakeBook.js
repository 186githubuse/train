/**
 * views/mistakeBook.js
 * ─────────────────────────────────────────────────────────────
 * 感觉训练系统 — 错题本
 *
 * 功能：
 *   1. 错题列表（显示题目、你的答案、正确答案）
 *   2. 按知识点筛选 + 按状态筛选（未复习/已复习）
 *   3. 重做单题（内联弹出答题卡）
 *   4. 移出错题本
 *   5. 空状态提示
 * ─────────────────────────────────────────────────────────────
 */

import { store } from '../js/store.js';
import { LESSONS, getLessonById } from '../js/data/lessons.js';
import { QUESTIONS } from '../js/data/questions.js';

// ── 页面级状态 ──
let _filterLesson = 0;     // 0 = 全部
let _filterStatus = 'all'; // 'all' | 'unreviewed' | 'reviewed'
let _redoQuestionId = null; // 正在重做的题目ID
let _redoSelected = null;
let _redoAnswered = false;

// ── 难度文字映射 ──
const DIFFICULTY_TEXT = { 1: '基础', 2: '中等', 3: '挑战' };
const DIFFICULTY_COLOR = { 1: '#4CAF50', 2: '#FF9800', 3: '#FF5252' };

// ═══════════════════════════════════════════════════
// 数据处理
// ═══════════════════════════════════════════════════

function getFilteredMistakes() {
  let list = store.getMistakes();
  if (_filterLesson > 0) {
    list = list.filter(m => m.lessonId === _filterLesson);
  }
  if (_filterStatus === 'unreviewed') {
    list = list.filter(m => !m.reviewed);
  } else if (_filterStatus === 'reviewed') {
    list = list.filter(m => m.reviewed);
  }
  return list;
}

// ═══════════════════════════════════════════════════
// HTML 片段
// ═══════════════════════════════════════════════════

function buildFilterBar() {
  // 知识点选项
  const lessonOptions = LESSONS.map(l => `
    <option value="${l.id}" ${_filterLesson === l.id ? 'selected' : ''}>
      ${l.title}
    </option>
  `).join('');

  return `
    <div class="mb-filter-bar glass-card">
      <div class="mb-filter-row">
        <div class="mb-filter-select-wrap">
          <select id="mb-lesson-filter" class="mb-filter-select">
            <option value="0" ${_filterLesson === 0 ? 'selected' : ''}>全部知识点</option>
            ${lessonOptions}
          </select>
        </div>
        <div class="mb-status-tabs">
          <button class="mb-status-tab ${_filterStatus === 'all' ? 'active' : ''}"
                  data-status="all">全部</button>
          <button class="mb-status-tab ${_filterStatus === 'unreviewed' ? 'active' : ''}"
                  data-status="unreviewed">未复习</button>
          <button class="mb-status-tab ${_filterStatus === 'reviewed' ? 'active' : ''}"
                  data-status="reviewed">已复习</button>
        </div>
      </div>
    </div>`;
}

function buildMistakeCard(mistake, index) {
  const lesson = getLessonById(mistake.lessonId);
  const lessonName = lesson ? lesson.title : `第${mistake.lessonId}课`;
  const diffText = DIFFICULTY_TEXT[mistake.difficulty] || '未知';
  const diffColor = DIFFICULTY_COLOR[mistake.difficulty] || '#999';
  const timeStr = new Date(mistake.timestamp).toLocaleDateString('zh-CN');

  const isRedo = _redoQuestionId === mistake.id;

  return `
    <div class="mb-card glass-card" style="animation-delay:${index * 40}ms" data-id="${mistake.id}">

      <!-- 题目头部 -->
      <div class="mb-card-header">
        <div class="mb-card-meta">
          <span class="mb-lesson-tag">${lessonName}</span>
          <span class="mb-diff-tag" style="color:${diffColor};background:${diffColor}18">
            ${diffText}
          </span>
          ${mistake.reviewed
            ? '<span class="mb-reviewed-tag">✓ 已掌握</span>'
            : ''}
        </div>
        <span class="mb-time">${timeStr}</span>
      </div>

      <!-- 题目内容 -->
      <div class="mb-question-text">${mistake.questionText}</div>

      <!-- 答案对比 -->
      <div class="mb-answers">
        <div class="mb-answer wrong">
          <span class="mb-answer-label">你的答案</span>
          <span class="mb-answer-value">${mistake.userAnswer}</span>
        </div>
        <div class="mb-answer-arrow">→</div>
        <div class="mb-answer correct">
          <span class="mb-answer-label">正确答案</span>
          <span class="mb-answer-value">${mistake.correctAnswer}</span>
        </div>
      </div>

      <!-- 重做区域（内联展开） -->
      ${isRedo ? buildRedoArea(mistake) : ''}

      <!-- 操作按钮 -->
      ${!isRedo ? `
      <div class="mb-actions">
        <button class="mb-btn mb-btn-redo" data-action="redo" data-id="${mistake.id}">
          重做此题
        </button>
        <button class="mb-btn mb-btn-remove" data-action="remove" data-id="${mistake.id}">
          移出错题本
        </button>
      </div>` : ''}

    </div>`;
}

function buildRedoArea(mistake) {
  // 从题库里找完整题目数据（含选项）
  const q = QUESTIONS.find(q => q.id === mistake.questionId);
  if (!q) {
    return `<div class="mb-redo-notfound">题目数据不存在</div>`;
  }

  const letters = ['A', 'B', 'C', 'D'];
  const optionsHtml = letters.map(letter => {
    if (!q.options[letter]) return '';
    let cls = 'mb-redo-option';
    if (_redoAnswered) {
      if (letter === q.correct) cls += ' correct';
      else if (letter === _redoSelected) cls += ' wrong';
      else cls += ' disabled';
    } else if (letter === _redoSelected) {
      cls += ' selected';
    }
    return `
      <button class="${cls}"
              data-action="redo-select"
              data-id="${mistake.id}"
              data-letter="${letter}"
              ${_redoAnswered ? 'disabled' : ''}>
        <span class="mb-redo-letter">${letter}</span>
        <span class="mb-redo-text">${q.options[letter]}</span>
      </button>`;
  }).join('');

  const feedbackHtml = _redoAnswered ? `
    <div class="mb-redo-feedback ${_redoSelected === q.correct ? 'correct' : 'wrong'}">
      ${_redoSelected === q.correct
        ? '✓ 答对了！已标记为已掌握'
        : `✗ 再想想！正确答案是 ${q.correct}`}
      ${q.hint ? `<div class="mb-redo-hint">${q.hint}</div>` : ''}
    </div>
    <div class="mb-redo-close-row">
      <button class="mb-btn mb-btn-close" data-action="redo-close" data-id="${mistake.id}">
        收起
      </button>
      ${_redoSelected !== q.correct ? `
      <button class="mb-btn mb-btn-remove" data-action="remove" data-id="${mistake.id}">
        移出错题本
      </button>` : ''}
    </div>
  ` : `
    <div class="mb-redo-actions">
      <button class="mb-btn mb-btn-submit"
              data-action="redo-submit"
              data-id="${mistake.id}"
              ${!_redoSelected ? 'disabled' : ''}>
        确认答案
      </button>
      <button class="mb-btn mb-btn-cancel" data-action="redo-close" data-id="${mistake.id}">
        取消
      </button>
    </div>`;

  return `
    <div class="mb-redo-area">
      <div class="mb-redo-title">重做此题</div>
      <div class="mb-redo-options">${optionsHtml}</div>
      ${feedbackHtml}
    </div>`;
}

function buildEmptyState() {
  return `
    <div class="mb-empty">
      <div class="mb-empty-icon"><ph-confetti weight="fill" size="52" color="#A78BFA"></ph-confetti></div>
      <div class="mb-empty-title">太棒了，暂无错题！</div>
      <div class="mb-empty-sub">继续保持，成为感觉大师！</div>
      <button class="mb-empty-btn" onclick="window.__router.navigate('trainingCamp')">
        去学习
      </button>
    </div>`;
}

// ═══════════════════════════════════════════════════
// 整页 HTML
// ═══════════════════════════════════════════════════

function buildPageHTML() {
  const all = store.getMistakes();
  const filtered = getFilteredMistakes();
  const unreviewed = all.filter(m => !m.reviewed).length;

  const cardsHtml = filtered.length === 0
    ? buildEmptyState()
    : filtered.map((m, i) => buildMistakeCard(m, i)).join('');

  return `
<div class="mb-page">

  <!-- 顶部标题栏 -->
  <div class="mb-header">
    <button class="back-btn" onclick="window.__router.goBack()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
    <div class="mb-title-wrap">
      <h1 class="mb-title">错题本</h1>
      ${unreviewed > 0
        ? `<span class="mb-unreviewed-badge">${unreviewed} 待复习</span>`
        : ''}
    </div>
    <div style="width:36px"></div>
  </div>

  <!-- 筛选栏 -->
  ${buildFilterBar()}

  <!-- 统计行 -->
  <div class="mb-stats-row">
    <span class="mb-stats-text">共 <b>${filtered.length}</b> 道错题</span>
    ${all.length > 0 ? `
    <button class="mb-clear-all-btn" data-action="clear-reviewed">
      清除已掌握
    </button>` : ''}
  </div>

  <!-- 错题列表 -->
  <div class="mb-list" id="mb-list">
    ${cardsHtml}
  </div>

  <div style="height:100px"></div>
</div>`;
}

// ═══════════════════════════════════════════════════
// 事件处理
// ═══════════════════════════════════════════════════

function handleEvents(container) {
  // 知识点筛选下拉
  container.querySelector('#mb-lesson-filter')?.addEventListener('change', e => {
    _filterLesson = Number(e.target.value);
    _redoQuestionId = null;
    _redoSelected = null;
    _redoAnswered = false;
    rerender(container);
  });

  // 状态标签切换
  container.querySelectorAll('.mb-status-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      _filterStatus = btn.dataset.status;
      _redoQuestionId = null;
      _redoSelected = null;
      _redoAnswered = false;
      rerender(container);
    });
  });

  // 错题卡片内的各种按钮
  container.querySelector('#mb-list')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === 'redo') {
      // 展开重做
      _redoQuestionId = id;
      _redoSelected = null;
      _redoAnswered = false;
      rerender(container);
    }

    if (action === 'redo-select') {
      if (_redoAnswered) return;
      _redoSelected = btn.dataset.letter;
      rerender(container);
    }

    if (action === 'redo-submit') {
      if (!_redoSelected) return;
      _redoAnswered = true;
      // 找到对应的错题和题库题目
      const mistake = store.getMistakes().find(m => m.id === id);
      const q = mistake ? QUESTIONS.find(q => q.id === mistake.questionId) : null;
      if (mistake && q && _redoSelected === q.correct) {
        // 答对了，标记已复习
        store.markMistakeReviewed(id);
      }
      rerender(container);
    }

    if (action === 'redo-close') {
      _redoQuestionId = null;
      _redoSelected = null;
      _redoAnswered = false;
      rerender(container);
    }

    if (action === 'remove') {
      store.removeMistake(id);
      if (_redoQuestionId === id) {
        _redoQuestionId = null;
        _redoSelected = null;
        _redoAnswered = false;
      }
      window.__showToast('已移出错题本');
      rerender(container);
    }
  });

  // 清除已掌握
  container.querySelector('[data-action="clear-reviewed"]')?.addEventListener('click', () => {
    const reviewed = store.getMistakes().filter(m => m.reviewed);
    reviewed.forEach(m => store.removeMistake(m.id));
    _redoQuestionId = null;
    _redoSelected = null;
    _redoAnswered = false;
    window.__showToast(`已清除 ${reviewed.length} 道已掌握的题`);
    rerender(container);
  });
}

// ═══════════════════════════════════════════════════
// 局部重渲染（保持筛选状态，只更新列表区域）
// ═══════════════════════════════════════════════════

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

  // 重置页面状态
  _filterLesson = 0;
  _filterStatus = 'all';
  _redoQuestionId = null;
  _redoSelected = null;
  _redoAnswered = false;

  container.innerHTML = buildPageHTML();
  handleEvents(container);
}
