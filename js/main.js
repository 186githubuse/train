/**
 * js/main.js
 * ─────────────────────────────────────────────────────────────
 * 感觉训练系统 — 应用入口
 * 职责：
 *   1. 初始化路由系统
 *   2. 管理底部导航栏（通过 router 跳转）
 *   3. 注册全局工具函数（Toast 等）
 *   4. 页面加载后默认渲染"训练营"视图
 * ─────────────────────────────────────────────────────────────
 */

// 引入 router（会自动挂载 window.__router）
import { navigate } from './router.js';
import { store } from './store.js';

/* ═══════════════════════════════════════════════════
   1. 底部导航初始化
═══════════════════════════════════════════════════ */
function initNavigation() {
  const nav = document.getElementById('bottom-nav');
  if (!nav) return;

  nav.addEventListener('click', e => {
    const btn = e.target.closest('.nav-item[data-view]');
    if (btn) navigate(btn.dataset.view);
  });
}

/* ═══════════════════════════════════════════════════
   2. 全局 Toast 通知
═══════════════════════════════════════════════════ */

/**
 * 显示全局 Toast 消息
 * @param {string} message
 * @param {number} [duration=2600] 毫秒
 */
function showToast(message, duration = 2600) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const el = document.createElement('div');
  el.className = 'toast-item';
  el.textContent = message;
  container.appendChild(el);

  // 触发 show 过渡
  requestAnimationFrame(() => {
    requestAnimationFrame(() => el.classList.add('show'));
  });

  // 自动移除
  setTimeout(() => {
    el.classList.remove('show');
    el.addEventListener('transitionend', () => el.remove(), { once: true });
  }, duration);
}

/* 挂到 window，供各视图模块调用 */
window.__showToast = showToast;

/* ═══════════════════════════════════════════════════
   3. 应用初始化
═══════════════════════════════════════════════════ */
function initApp() {
  initNavigation();

  // 新用户先走引导，老用户直接进训练营
  if (store.isNewUser()) {
    navigate('onboarding', {}, false);
  } else {
    navigate('trainingCamp', {}, false);
  }

  console.log('%c感觉训练系统 v1.0.0 已启动 🌸', 'color:#A78BFA;font-weight:bold;font-size:14px;');
}

// DOM 就绪后启动
document.addEventListener('DOMContentLoaded', initApp);
