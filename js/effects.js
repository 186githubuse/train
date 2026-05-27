/**
 * js/effects.js
 * ─────────────────────────────────────────────────────────────
 * 视觉 + 音效组合特效（答对、阶段成就、整体通过等）
 * 依赖：assets/sfx/* 音效文件 + canvas-confetti CDN（在 index.html 引入）
 * ─────────────────────────────────────────────────────────────
 */

import * as sfx from './sfx.js';

/** 内部小工具：调 confetti（CDN 全局） */
function fire(opts) {
  if (typeof window === 'undefined' || !window.confetti) return;
  try { window.confetti(opts); } catch (_) {}
}

/* 答对一道题：清脆叮 + 在屏幕中心做一次小型彩花喷射 */
export function answerCorrect() {
  sfx.play('correct');
  fire({
    particleCount: 30,
    spread: 60,
    startVelocity: 25,
    origin: { y: 0.5 },
    scalar: 0.8,
    ticks: 80,
  });
}

/* 答错一道题：只有柔和咚音效，不撒花 */
export function answerWrong() {
  sfx.play('wrong');
}

/* 完成一个段落（A/B/C）：小号声 + 中型撒花 */
export function stageComplete() {
  sfx.play('stage');
  fire({
    particleCount: 80,
    spread: 100,
    origin: { y: 0.4 },
    ticks: 150,
  });
}

/* 完成所有选择题，进入写作前：胜利音 + 大撒花 */
export function allChoicesComplete() {
  sfx.play('complete');
  // 双向撒花
  setTimeout(() => fire({
    particleCount: 120, spread: 70, angle: 60, origin: { x: 0, y: 0.7 }, ticks: 200,
  }), 0);
  setTimeout(() => fire({
    particleCount: 120, spread: 70, angle: 120, origin: { x: 1, y: 0.7 }, ticks: 200,
  }), 100);
}

/* 作文提交通过（≥70 分）：钢琴成就音 + 烟花式撒花 */
export function essayPass() {
  sfx.play('submit');
  // 三次时差爆发，营造烟花感
  setTimeout(() => fire({
    particleCount: 100, spread: 360, startVelocity: 35, origin: { x: 0.5, y: 0.4 }, ticks: 200,
  }), 0);
  setTimeout(() => fire({
    particleCount: 80, spread: 360, startVelocity: 25, origin: { x: 0.3, y: 0.5 }, ticks: 200,
  }), 250);
  setTimeout(() => fire({
    particleCount: 80, spread: 360, startVelocity: 25, origin: { x: 0.7, y: 0.5 }, ticks: 200,
  }), 500);
}

/* 作文提交未通过（<70 分）：不放音效避免挫败感，UI 端用柔和提示文案 */
export function essayRetry() {
  // 故意留空 —— 不放任何音效或动画，用 UI 文案温柔提醒即可
}
