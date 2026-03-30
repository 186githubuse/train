/**
 * views/challenge.js
 * ─────────────────────────────────────────────────────────────
 * 感觉训练系统 — 挑战赛
 *
 * 三个阶段：
 *   1. 首页：规则说明 + 历史记录 + 开始按钮
 *   2. 答题中：计时器 + 进度 + 题目 + 选项 + 即时反馈
 *   3. 结果页：正确率 + 用时 + 得分 + 称号 + 再战
 * ─────────────────────────────────────────────────────────────
 */

import { store } from '../js/store.js';
import { QUESTIONS, pickRandomQuestions } from '../js/data/questions.js';

// ═══════════════════════════════════════════════════
// 挑战配置
// ═══════════════════════════════════════════════════
const CHALLENGE_QUESTION_COUNT = 10;

// 评级阈值
const GRADES = [
  { min: 90, title: '感觉大师！', emoji: '🏆', color: '#FF9800', desc: '你对所有感觉点都了如指掌！' },
  { min: 70, title: '表现不错！', emoji: '⭐', color: '#4CAF50', desc: '继续努力，离大师只差一步！' },
  { min: 60, title: '继续加油！', emoji: '💪', color: '#2196F3', desc: '还有些知识点需要再巩固一下。' },
  { min: 0,  title: '再试一次！', emoji: '🌱', color: '#FF5252', desc: '没关系，失败是成功之母！' },
];

// ═══════════════════════════════════════════════════
// 页面级状态
// ═══════════════════════════════════════════════════
let _phase = 'home';       // 'home' | 'quiz' | 'result'
let _questions = [];
let _currentIdx = 0;
let _selected = null;
let _answered = false;
let _correctCount = 0;
let _startTime = 0;
let _questionStartTime = 0;
let _totalMs = 0;
let _timerInterval = null;
let _container = null;

// ═══════════════════════════════════════════════════
// 工具
// ═══════════════════════════════════════════════════

function getGrade(accuracy) {
  return GRADES.find(g => accuracy >= g.min) || GRADES[GRADES.length - 1];
}

function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}分${s % 60}秒` : `${s}秒`;
}

function formatTimerDisplay(elapsedMs) {
  const s = Math.floor(elapsedMs / 1000);
  const m = Math.floor(s / 60);
  const ss = String(s % 60).padStart(2, '0');
  return `${String(m).padStart(2, '0')}:${ss}`;
}

function stopTimer() {
  if (_timerInterval) {
    clearInterval(_timerInterval);
    _timerInterval = null;
  }
}

// 从综合挑战题库（lessonId=11）抽题，不足则从所有知识点补充
function buildChallengeQuestions() {
  const difficulty = store.getCurrentDifficulty();

  // 优先从综合挑战（lessonId=11）当前难度抽
  let pool = pickRandomQuestions(11, difficulty, CHALLENGE_QUESTION_COUNT);

  // 不够的话从其他知识点补充（每个知识点各抽一题）
  if (pool.length < CHALLENGE_QUESTION_COUNT) {
    const needed = CHALLENGE_QUESTION_COUNT - pool.length;
    const usedIds = new Set(pool.map(q => q.id));
    const supplement = [];
    for (let lessonId = 1; lessonId <= 10 && supplement.length < needed; lessonId++) {
      const candidates = pickRandomQuestions(lessonId, difficulty, 1)
        .filter(q => !usedIds.has(q.id));
      supplement.push(...candidates);
    }
    pool = [...pool, ...supplement.slice(0, needed)];
  }

  return pool;
}

// ═══════════════════════════════════════════════════
// 阶段1：首页
// ═══════════════════════════════════════════════════

function buildHomeHTML() {
  const records = store.getChallengeRecords();
  const best = store.getBestChallengeScore();
  const difficulty = store.getCurrentDifficulty();
  const diffLabel = ['', '基础', '中等', '挑战'][difficulty];

  const historyHtml = records.slice(0, 5).map((r, i) => {
    const grade = getGrade(Math.round(r.accuracy * 100));
    return `
      <div class="ch-history-item">
        <span class="ch-history-rank">#${i + 1}</span>
        <span class="ch-history-emoji">${grade.emoji}</span>
        <div class="ch-history-info">
          <span class="ch-history-score">${r.score}分</span>
          <span class="ch-history-meta">${Math.round(r.accuracy * 100)}% · ${formatTime(r.duration)}</span>
        </div>
        <span class="ch-history-date">${new Date(r.timestamp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
      </div>`;
  }).join('');

  return `
<div class="ch-page">
  <div class="ch-header">
    <button class="back-btn" onclick="window.__router.goBack()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
    <h1 class="ch-title">挑战赛</h1>
    <div style="width:36px"></div>
  </div>

  <!-- 挑战信息卡 -->
  <div class="ch-info-card glass-card macaron-lavender">
    <div class="ch-info-icon">⚡</div>
    <div class="ch-info-content">
      <div class="ch-info-title">综合感觉挑战</div>
      <div class="ch-info-desc">
        ${CHALLENGE_QUESTION_COUNT} 道题 · ${diffLabel}难度 · 计时挑战
      </div>
    </div>
    ${best > 0
      ? `<div class="ch-best-score">
          <div class="ch-best-label">最高分</div>
          <div class="ch-best-num">${best}</div>
        </div>`
      : ''}
  </div>

  <!-- 规则说明 -->
  <div class="ch-rules glass-card">
    <div class="ch-rules-title">挑战规则</div>
    <div class="ch-rule-item">
      <span class="ch-rule-dot" style="background:#FF8FAB"></span>
      <span>共 ${CHALLENGE_QUESTION_COUNT} 道综合题，覆盖全部感觉知识点</span>
    </div>
    <div class="ch-rule-item">
      <span class="ch-rule-dot" style="background:#C4B4FF"></span>
      <span>答对得 10 分，答错不扣分</span>
    </div>
    <div class="ch-rule-item">
      <span class="ch-rule-dot" style="background:#82C4E8"></span>
      <span>全程计时，用时越短越厉害</span>
    </div>
    <div class="ch-rule-item">
      <span class="ch-rule-dot" style="background:#A8D8A8"></span>
      <span>难度根据你的能力自动匹配</span>
    </div>
  </div>

  <!-- 历史记录 -->
  ${records.length > 0 ? `
  <div class="ch-section-title">历史记录</div>
  <div class="ch-history-list glass-card">
    ${historyHtml}
  </div>` : ''}

  <!-- 开始按钮 -->
  <button class="ch-start-btn" id="ch-start-btn">
    <span>开始挑战</span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  </button>

  <div style="height:100px"></div>
</div>`;
}

// ═══════════════════════════════════════════════════
// 阶段2：答题中
// ═══════════════════════════════════════════════════

function buildQuizHTML() {
  const q = _questions[_currentIdx];
  const pct = Math.round((_currentIdx / _questions.length) * 100);
  const elapsed = Date.now() - _startTime;

  const options = ['A', 'B', 'C', 'D'].map(letter => {
    if (!q.options[letter]) return '';
    let cls = 'ch-option';
    if (_answered) {
      if (letter === q.correct) cls += ' correct';
      else if (letter === _selected) cls += ' wrong';
      else cls += ' disabled';
    } else if (letter === _selected) {
      cls += ' selected';
    }
    return `
      <button class="${cls}" data-letter="${letter}" ${_answered ? 'disabled' : ''}>
        <span class="ch-option-letter">${letter}</span>
        <span class="ch-option-text">${q.options[letter]}</span>
      </button>`;
  }).join('');

  const feedbackHtml = _answered ? `
    <div class="ch-feedback ${_selected === q.correct ? 'correct' : 'wrong'}">
      <span class="ch-feedback-icon">${_selected === q.correct ? '✓' : '✗'}</span>
      <div class="ch-feedback-text">
        ${_selected === q.correct
          ? '回答正确！'
          : `正确答案是 <b>${q.correct}</b>`}
        ${q.hint ? `<div class="ch-feedback-hint">${q.hint}</div>` : ''}
      </div>
    </div>
    <button class="ch-next-btn" id="ch-next-btn">
      ${_currentIdx + 1 < _questions.length ? '下一题 →' : '查看结果 →'}
    </button>` : '';

  return `
<div class="ch-page">
  <!-- 顶部进度栏 -->
  <div class="ch-quiz-header">
    <button class="ch-quit-btn" id="ch-quit-btn">退出</button>
    <div class="ch-timer" id="ch-timer">${formatTimerDisplay(elapsed)}</div>
    <div class="ch-score-display">${_correctCount * 10}分</div>
  </div>

  <!-- 进度条 -->
  <div class="ch-progress-wrap">
    <div class="ch-progress-track">
      <div class="ch-progress-fill" style="width:${pct}%"></div>
    </div>
    <span class="ch-progress-text">${_currentIdx + 1} / ${_questions.length}</span>
  </div>

  <!-- 题目 -->
  <div class="ch-question-card glass-card">
    <div class="ch-question-num">第 ${_currentIdx + 1} 题</div>
    <div class="ch-question-text">${q.text}</div>
  </div>

  <!-- 选项 -->
  <div class="ch-options" id="ch-options">
    ${options}
  </div>

  <!-- 反馈 + 下一题 -->
  <div id="ch-feedback-area">${feedbackHtml}</div>

  <div style="height:100px"></div>
</div>`;
}

// ═══════════════════════════════════════════════════
// 阶段3：结果页
// ═══════════════════════════════════════════════════

function buildResultHTML() {
  const accuracy = _questions.length > 0 ? _correctCount / _questions.length : 0;
  const accuracyPct = Math.round(accuracy * 100);
  const score = _correctCount * 10;
  const grade = getGrade(accuracyPct);
  const timeStr = formatTime(_totalMs);

  // 是否破纪录
  const records = store.getChallengeRecords();
  const prevBest = records.length > 1 ? Math.max(...records.slice(1).map(r => r.score)) : 0;
  const isNewRecord = score > prevBest && records.length > 0;

  return `
<div class="ch-page">
  <div class="ch-result-wrap">

    ${isNewRecord ? `<div class="ch-new-record">🎉 新纪录！</div>` : ''}

    <!-- 称号 -->
    <div class="ch-grade-card glass-card" style="border-top: 4px solid ${grade.color}">
      <div class="ch-grade-emoji">${grade.emoji}</div>
      <div class="ch-grade-title" style="color:${grade.color}">${grade.title}</div>
      <div class="ch-grade-desc">${grade.desc}</div>
    </div>

    <!-- 数据 -->
    <div class="ch-result-stats glass-card">
      <div class="ch-result-stat">
        <div class="ch-result-num" style="color:${grade.color}">${score}</div>
        <div class="ch-result-label">得分</div>
      </div>
      <div class="ch-result-divider"></div>
      <div class="ch-result-stat">
        <div class="ch-result-num">${accuracyPct}%</div>
        <div class="ch-result-label">正确率</div>
      </div>
      <div class="ch-result-divider"></div>
      <div class="ch-result-stat">
        <div class="ch-result-num" style="font-size:20px">${timeStr}</div>
        <div class="ch-result-label">用时</div>
      </div>
      <div class="ch-result-divider"></div>
      <div class="ch-result-stat">
        <div class="ch-result-num">${_correctCount}/${_questions.length}</div>
        <div class="ch-result-label">答对</div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="ch-result-actions">
      <button class="ch-retry-btn" id="ch-retry-btn">再战一次</button>
      <button class="ch-home-btn" id="ch-home-btn">返回首页</button>
    </div>

  </div>
  <div style="height:100px"></div>
</div>`;
}

// ═══════════════════════════════════════════════════
// 渲染 & 事件绑定
// ═══════════════════════════════════════════════════

function render() {
  if (!_container) return;

  if (_phase === 'home') {
    _container.innerHTML = buildHomeHTML();
    _container.querySelector('#ch-start-btn')?.addEventListener('click', startChallenge);
  }

  else if (_phase === 'quiz') {
    _container.innerHTML = buildQuizHTML();

    // 计时器
    stopTimer();
    _timerInterval = setInterval(() => {
      const el = document.getElementById('ch-timer');
      if (el) el.textContent = formatTimerDisplay(Date.now() - _startTime);
    }, 500);

    // 选项点击
    _container.querySelector('#ch-options')?.addEventListener('click', e => {
      const btn = e.target.closest('[data-letter]');
      if (!btn || _answered) return;
      _selected = btn.dataset.letter;
      // 只更新选中样式，不重新渲染全页（避免计时器闪烁）
      _container.querySelectorAll('.ch-option').forEach(b => {
        b.classList.toggle('selected', b.dataset.letter === _selected);
      });
    });

    // 提交答案（点击已选中的选项 = 确认）
    _container.querySelector('#ch-options')?.addEventListener('dblclick', e => {
      const btn = e.target.closest('[data-letter]');
      if (!btn || _answered || !_selected) return;
      submitAnswer();
    });

    // 也可以点一次再点"确认"——改为点选项后直接显示确认按钮
    // 实际用：选了选项后 1.5s 自动提交（移动端友好）
    _container.querySelector('#ch-options')?.addEventListener('click', e => {
      const btn = e.target.closest('[data-letter]');
      if (!btn || _answered) return;
      // 清除之前的自动提交
      if (window._chAutoSubmit) clearTimeout(window._chAutoSubmit);
      window._chAutoSubmit = setTimeout(() => {
        if (!_answered && _selected) submitAnswer();
      }, 800);
    });

    // 下一题
    _container.querySelector('#ch-next-btn')?.addEventListener('click', nextQuestion);

    // 退出
    _container.querySelector('#ch-quit-btn')?.addEventListener('click', () => {
      stopTimer();
      if (confirm('确定退出本次挑战？本次成绩不计入记录。')) {
        _phase = 'home';
        render();
      }
    });
  }

  else if (_phase === 'result') {
    _container.innerHTML = buildResultHTML();
    _container.querySelector('#ch-retry-btn')?.addEventListener('click', startChallenge);
    _container.querySelector('#ch-home-btn')?.addEventListener('click', () => {
      window.__router.navigate('trainingCamp');
    });
  }
}

// ═══════════════════════════════════════════════════
// 游戏逻辑
// ═══════════════════════════════════════════════════

function startChallenge() {
  _questions = buildChallengeQuestions();
  _currentIdx = 0;
  _selected = null;
  _answered = false;
  _correctCount = 0;
  _startTime = Date.now();
  _questionStartTime = Date.now();
  _totalMs = 0;
  _phase = 'quiz';
  render();
}

function submitAnswer() {
  if (!_selected || _answered) return;
  _answered = true;

  const q = _questions[_currentIdx];
  const isCorrect = _selected === q.correct;
  const responseTime = Date.now() - _questionStartTime;

  if (isCorrect) _correctCount++;

  // 更新能力指数
  store.updateAbility(q.difficulty, isCorrect, responseTime);

  // 重渲染（含反馈区域）
  render();
}

function nextQuestion() {
  _currentIdx++;
  _selected = null;
  _answered = false;
  _questionStartTime = Date.now();

  if (_currentIdx >= _questions.length) {
    // 挑战结束
    stopTimer();
    _totalMs = Date.now() - _startTime;
    const accuracy = _correctCount / _questions.length;
    store.addChallengeRecord({
      score: _correctCount * 10,
      accuracy,
      duration: _totalMs,
    });
    _phase = 'result';
    render();
  } else {
    render();
  }
}

// ═══════════════════════════════════════════════════
// 主入口
// ═══════════════════════════════════════════════════

export function renderChallenge() {
  _container = document.getElementById('app-content');
  if (!_container) return;

  stopTimer();
  _phase = 'home';

  render();
}
