/**
 * views/report.js
 * ─────────────────────────────────────────────────────────────
 * 感觉训练系统 — 学习报告 / 我的成长页
 *
 * 包含：
 *   1. 顶部用户卡片（能力指数 + 称号 + 年级）
 *   2. 总体进度（环形图 + 数据）
 *   3. 五感能力雷达图（Canvas）
 *   4. 各知识点掌握度列表
 *   5. 错题本入口 + 挑战赛入口
 * ─────────────────────────────────────────────────────────────
 */

import { store } from '../js/store.js';
import { LESSONS } from '../js/data/lessons.js';
import {
  calcSenseRadarScores,
  getAbilityTitle,
  SENSE_RADAR_CONFIG,
} from '../js/data/courseLogic.js';

// ═══════════════════════════════════════════════════
// 工具函数
// ═══════════════════════════════════════════════════

/** 计算某节课的掌握度百分比（0-100） */
function calcMastery(progress) {
  if (!progress || !progress.passed) return 0;
  const stars = progress.stars || 0;
  // 通关至少60分，每颗星加13.3分，上限100
  return Math.min(100, Math.round(60 + stars * 13.3));
}

/** 格式化能力指数为两位小数 */
function fmt(n) {
  return Number(n).toFixed(1);
}

// ═══════════════════════════════════════════════════
// 1. 环形进度图（Canvas）
// ═══════════════════════════════════════════════════

function drawRingChart(canvasId, percent, color = '#FF8FAB') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;
  const cy = H / 2;
  const r = W * 0.38;
  const lineW = W * 0.10;

  ctx.clearRect(0, 0, W, H);

  // 背景圆环
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(0,0,0,0.07)';
  ctx.lineWidth = lineW;
  ctx.stroke();

  // 进度圆弧
  if (percent > 0) {
    const start = -Math.PI / 2;
    const end = start + (Math.PI * 2 * Math.min(percent, 100) / 100);
    ctx.beginPath();
    ctx.arc(cx, cy, r, start, end);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineW;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}

// ═══════════════════════════════════════════════════
// 2. 五感雷达图（Canvas）
// ═══════════════════════════════════════════════════

function drawRadarChart(canvasId, scores) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;
  const cy = H / 2;
  const maxR = Math.min(cx, cy) * 0.72;
  const n = scores.length;
  const angleStep = (Math.PI * 2) / n;
  const startAngle = -Math.PI / 2;

  ctx.clearRect(0, 0, W, H);

  // 计算各顶点坐标
  function getPoint(i, radius) {
    const angle = startAngle + i * angleStep;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  }

  // 画网格（3层同心多边形）
  for (let ring = 1; ring <= 3; ring++) {
    const ringR = maxR * (ring / 3);
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const p = getPoint(i, ringR);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // 画轴线
  for (let i = 0; i < n; i++) {
    const p = getPoint(i, maxR);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // 画数据填充区
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const r = maxR * (scores[i].score / 100);
    const p = getPoint(i, r);
    i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(255, 143, 171, 0.18)';
  ctx.fill();
  ctx.strokeStyle = '#FF8FAB';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 画数据点
  for (let i = 0; i < n; i++) {
    const r = maxR * (scores[i].score / 100);
    const p = getPoint(i, r);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = scores[i].color || '#FF8FAB';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // 画标签
  ctx.font = `bold ${W * 0.075}px -apple-system, PingFang SC, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < n; i++) {
    const labelR = maxR + W * 0.13;
    const p = getPoint(i, labelR);
    ctx.fillStyle = '#555';
    const lines = scores[i].label.split('（');
    if (lines.length > 1) {
      ctx.fillText(lines[0], p.x, p.y - W * 0.04);
      ctx.fillStyle = '#999';
      ctx.font = `${W * 0.065}px -apple-system, PingFang SC, sans-serif`;
      ctx.fillText('（' + lines[1], p.x, p.y + W * 0.04);
      ctx.font = `bold ${W * 0.075}px -apple-system, PingFang SC, sans-serif`;
      ctx.fillStyle = '#555';
    } else {
      ctx.fillText(scores[i].label, p.x, p.y);
    }
  }
}

// ═══════════════════════════════════════════════════
// 3. HTML 模板
// ═══════════════════════════════════════════════════

function buildHTML(data) {
  const {
    user, stats, lessonProgress, senseScores,
    overallPercent, masteryList,
  } = data;

  const abilityTitle = getAbilityTitle(user.abilityIndex);

  // 知识点列表
  const lessonItems = masteryList.map(item => {
    const needReview = item.mastery < 60 && item.passed;
    const notStarted = !item.passed && item.mastery === 0;
    const progressColor = item.mastery >= 80 ? '#4CAF50'
      : item.mastery >= 60 ? '#FF9800'
      : '#FF5252';

    return `
      <div class="report-lesson-item glass-card" style="animation-delay:${item.index * 50}ms">
        <div class="report-lesson-left">
          <span class="report-lesson-emoji">${item.emoji}</span>
          <div class="report-lesson-info">
            <div class="report-lesson-title">${item.title}</div>
            <div class="report-lesson-sub">${item.subtitle}</div>
          </div>
        </div>
        <div class="report-lesson-right">
          ${notStarted
            ? `<span class="report-lesson-tag tag-todo">未开始</span>`
            : `<div class="report-mastery-bar">
                <div class="report-mastery-fill"
                     style="width:${item.mastery}%;background:${progressColor}"></div>
              </div>
              <span class="report-mastery-num" style="color:${progressColor}">${item.mastery}%</span>`
          }
          ${needReview ? `<span class="report-lesson-tag tag-review">建议复习</span>` : ''}
        </div>
      </div>`;
  }).join('');

  // 五感图例
  const radarLegend = senseScores.map(s => `
    <div class="radar-legend-item">
      <span class="radar-dot" style="background:${s.color}"></span>
      <span class="radar-label">${s.label.split('（')[0]}</span>
      <span class="radar-score">${s.score}分</span>
    </div>
  `).join('');

  // 统计徽章
  const mistakeCount = store.getMistakes().length;
  const unreviewedCount = store.getMistakes().filter(m => !m.reviewed).length;

  return `
<div class="report-page">

  <!-- 顶部标题 -->
  <div class="report-header">
    <button class="back-btn" onclick="window.__router.goBack()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
    <h1 class="report-title">我的成长</h1>
    <div style="width:36px"></div>
  </div>

  <!-- 用户能力卡片 -->
  <div class="report-ability-card glass-card macaron-rose">
    <div class="ability-card-left">
      <div class="ability-title-row">
        <span class="ability-crown">👑</span>
        <span class="ability-title-text">${abilityTitle}</span>
      </div>
      <div class="ability-name">${user.name}</div>
      <div class="ability-grade">${user.grade}年级 · 小学员</div>
    </div>
    <div class="ability-card-right">
      <div class="ability-index-wrap">
        <canvas id="ability-ring" width="100" height="100"></canvas>
        <div class="ability-index-text">
          <span class="ability-index-num">${fmt(user.abilityIndex)}</span>
          <span class="ability-index-max">/5.0</span>
        </div>
      </div>
      <div class="ability-index-label">能力指数</div>
    </div>
  </div>

  <!-- 总进度卡片 -->
  <div class="report-section-title">学习进度</div>
  <div class="report-progress-card glass-card">
    <div class="progress-ring-wrap">
      <canvas id="progress-ring" width="120" height="120"></canvas>
      <div class="progress-ring-text">
        <span class="progress-ring-num">${overallPercent}%</span>
      </div>
    </div>
    <div class="progress-stats">
      <div class="progress-stat-item">
        <span class="progress-stat-num">${stats.completedLessons}</span>
        <span class="progress-stat-label">已完成</span>
      </div>
      <div class="progress-stat-divider"></div>
      <div class="progress-stat-item">
        <span class="progress-stat-num">${stats.totalLessons}</span>
        <span class="progress-stat-label">总课数</span>
      </div>
      <div class="progress-stat-divider"></div>
      <div class="progress-stat-item">
        <span class="progress-stat-num">${stats.totalXp}</span>
        <span class="progress-stat-label">总经验</span>
      </div>
    </div>
  </div>

  <!-- 五感能力雷达图 -->
  <div class="report-section-title">五感能力</div>
  <div class="report-radar-card glass-card">
    <canvas id="radar-chart" width="280" height="280"></canvas>
    <div class="radar-legend">${radarLegend}</div>
  </div>

  <!-- 知识点掌握度 -->
  <div class="report-section-title">知识点详情</div>
  <div class="report-lessons-list">
    ${lessonItems}
  </div>

  <!-- 快捷入口 -->
  <div class="report-quick-actions">
    <button class="report-action-btn btn-mistake"
            onclick="window.__router.navigate('mistakeBook')">
      <span class="action-btn-icon">📖</span>
      <span class="action-btn-label">错题本</span>
      ${mistakeCount > 0
        ? `<span class="action-btn-badge">${mistakeCount}</span>`
        : ''}
    </button>
    <button class="report-action-btn btn-challenge"
            onclick="window.__router.navigate('challenge')">
      <span class="action-btn-icon">⚡</span>
      <span class="action-btn-label">挑战赛</span>
    </button>
  </div>

  <!-- 底部占位 -->
  <div style="height: 100px"></div>
</div>`;
}

// ═══════════════════════════════════════════════════
// 4. 主渲染函数
// ═══════════════════════════════════════════════════

export function renderReport() {
  const container = document.getElementById('app-content');
  if (!container) return;

  // 收集数据
  const user = store.getUser();
  const stats = store.getStats();
  const lessonProgress = {};
  for (let i = 1; i <= 10; i++) {
    lessonProgress[i] = store.getProgress(i);
  }

  // 五感评分
  const senseScores = calcSenseRadarScores(lessonProgress);

  // 总进度百分比
  const overallPercent = Math.round((stats.completedLessons / 10) * 100);

  // 各知识点掌握度列表
  const masteryList = LESSONS.map((lesson, i) => ({
    ...lesson,
    index: i,
    passed: lessonProgress[lesson.id]?.passed || false,
    mastery: calcMastery(lessonProgress[lesson.id]),
  }));

  // 渲染 HTML
  container.innerHTML = buildHTML({
    user, stats, lessonProgress, senseScores,
    overallPercent, masteryList,
  });

  // 延迟一帧再画 Canvas（确保 DOM 已渲染）
  requestAnimationFrame(() => {
    // 能力指数环形图（用能力指数/5.0 换算百分比）
    const abilityPercent = (user.abilityIndex / 5.0) * 100;
    drawRingChart('ability-ring', abilityPercent, '#fff');

    // 总进度环形图
    drawRingChart('progress-ring', overallPercent, '#FF8FAB');

    // 五感雷达图
    drawRadarChart('radar-chart', senseScores);
  });
}
