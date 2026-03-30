/**
 * views/onboarding.js
 * ─────────────────────────────────────────────────────────────
 * 感觉训练系统 — 新手引导
 *
 * 流程（三步）：
 *   Step 1：欢迎页（App 介绍）
 *   Step 2：输入姓名
 *   Step 3：选择年级
 *   → 完成后保存到 store，跳转训练营
 * ─────────────────────────────────────────────────────────────
 */

import { store } from '../js/store.js';

// ── 状态 ──
let _step = 1;       // 1 | 2 | 3
let _name = '';
let _grade = null;
let _container = null;

// ── 年级配置 ──
const GRADES = [
  { value: 1, label: '一年级' },
  { value: 2, label: '二年级' },
  { value: 3, label: '三年级' },
  { value: 4, label: '四年级' },
  { value: 5, label: '五年级' },
  { value: 6, label: '六年级' },
];

// ── HTML 构建 ─────────────────────────────────────────────────

function buildStep1HTML() {
  return `
<div class="ob-page">
  <div class="ob-hero">
    <div class="ob-hero-icon">🌸</div>
    <div class="ob-hero-title">感觉训练营</div>
    <div class="ob-hero-subtitle">用五感发现世界<br>让作文充满生命力</div>
  </div>

  <div class="ob-features">
    <div class="ob-feature-item">
      <span class="ob-feature-emoji">📚</span>
      <div>
        <div class="ob-feature-name">10节感觉训练课</div>
        <div class="ob-feature-desc">从看、听、闻、尝、摸，全方位训练感知力</div>
      </div>
    </div>
    <div class="ob-feature-item">
      <span class="ob-feature-emoji">🤖</span>
      <div>
        <div class="ob-feature-name">AI 魔法机器</div>
        <div class="ob-feature-desc">拍照或输入题目，AI 一步步引导你写作文</div>
      </div>
    </div>
    <div class="ob-feature-item">
      <span class="ob-feature-emoji">⚡</span>
      <div>
        <div class="ob-feature-name">挑战赛 &amp; 错题本</div>
        <div class="ob-feature-desc">巩固所学，看见自己的成长</div>
      </div>
    </div>
  </div>

  <button class="ob-primary-btn" id="ob-next-1">开始我的训练 🚀</button>

  <div class="ob-dots">
    <span class="ob-dot ob-dot-active"></span>
    <span class="ob-dot"></span>
    <span class="ob-dot"></span>
  </div>
</div>`;
}

function buildStep2HTML() {
  return `
<div class="ob-page">
  <div class="ob-step-header">
    <div class="ob-step-icon">👋</div>
    <div class="ob-step-title">你叫什么名字？</div>
    <div class="ob-step-desc">让我认识一下你吧！</div>
  </div>

  <div class="ob-input-wrap">
    <input
      type="text"
      id="ob-name-input"
      class="ob-input"
      placeholder="输入你的名字…"
      maxlength="10"
      value="${escHtml(_name)}"
    >
  </div>

  <button class="ob-primary-btn" id="ob-next-2">下一步 →</button>

  <div class="ob-dots">
    <span class="ob-dot"></span>
    <span class="ob-dot ob-dot-active"></span>
    <span class="ob-dot"></span>
  </div>
</div>`;
}

function buildStep3HTML() {
  const gradeButtons = GRADES.map(g => `
    <button class="ob-grade-btn ${_grade === g.value ? 'ob-grade-selected' : ''}"
            data-grade="${g.value}">
      ${g.label}
    </button>`).join('');

  return `
<div class="ob-page">
  <div class="ob-step-header">
    <div class="ob-step-icon">🎒</div>
    <div class="ob-step-title">你在几年级？</div>
    <div class="ob-step-desc">帮我为你调整合适的题目难度</div>
  </div>

  <div class="ob-grade-grid">
    ${gradeButtons}
  </div>

  <button class="ob-primary-btn ${_grade === null ? 'ob-btn-disabled' : ''}"
          id="ob-finish" ${_grade === null ? 'disabled' : ''}>
    进入训练营 🌸
  </button>

  <div class="ob-dots">
    <span class="ob-dot"></span>
    <span class="ob-dot"></span>
    <span class="ob-dot ob-dot-active"></span>
  </div>
</div>`;
}

// ── 工具 ──

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── 渲染 & 事件 ──────────────────────────────────────────────

function rerender() {
  if (!_container) return;
  if (_step === 1)      _container.innerHTML = buildStep1HTML();
  else if (_step === 2) _container.innerHTML = buildStep2HTML();
  else if (_step === 3) _container.innerHTML = buildStep3HTML();
  bindEvents();
}

function bindEvents() {
  // Step 1 → Step 2
  document.getElementById('ob-next-1')?.addEventListener('click', () => {
    _step = 2;
    rerender();
    setTimeout(() => document.getElementById('ob-name-input')?.focus(), 150);
  });

  // Step 2 → Step 3
  const nameInput = document.getElementById('ob-name-input');
  document.getElementById('ob-next-2')?.addEventListener('click', () => {
    const val = nameInput?.value.trim();
    if (!val) { window.__showToast('请输入你的名字 😊'); nameInput?.focus(); return; }
    _name = val;
    _step = 3;
    rerender();
  });
  nameInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('ob-next-2')?.click();
  });

  // Step 3：年级选择
  document.querySelectorAll('.ob-grade-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _grade = Number(btn.dataset.grade);
      rerender();
    });
  });

  // 完成
  document.getElementById('ob-finish')?.addEventListener('click', () => {
    if (_grade === null) return;
    store.setUserProfile(_name, _grade);
    // 恢复底部导航
    const nav = document.getElementById('bottom-nav');
    if (nav) nav.style.display = '';
    window.__showToast(`欢迎你，${_name}！训练开始咯 🌸`);
    window.__router.navigate('trainingCamp', {}, false);
  });
}

// ── 主入口 ────────────────────────────────────────────────────

export function renderOnboarding() {
  _container = document.getElementById('app-content');
  if (!_container) return;

  // 隐藏顶部 header（新手引导不需要）
  const header = document.getElementById('app-header');
  if (header) header.innerHTML = '';

  // 隐藏底部导航，防止跳过引导
  const nav = document.getElementById('bottom-nav');
  if (nav) nav.style.display = 'none';

  _step = 1;
  _name = '';
  _grade = null;

  rerender();
}
