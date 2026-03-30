/**
 * views/lessonDetail.js
 * ─────────────────────────────────────────────────────────────
 * 感觉训练系统 — 课程详情页
 * 职责：展示课程视频（占位）+ 知识点 + 引导进入答题
 * ─────────────────────────────────────────────────────────────
 */

import { LESSONS, getLessonById } from '../js/data/lessons.js';
import { store } from '../js/store.js';

/* ─── 渲染视频播放区 ─── */
function renderVideoSection(lesson, progress) {
  const hasVideo = !!lesson.videoUrl;
  const watched = progress.videoWatched;

  // 视频占位区（等视频团队提供 videoUrl 后接入）
  return `
    <div class="lesson-video-section ${lesson.colorClass}">
      ${hasVideo
        ? `<video id="lesson-video" src="${lesson.videoUrl}"
                  controls playsinline preload="metadata"
                  class="w-full rounded-2xl"></video>`
        : `<div class="video-placeholder">
            <div class="video-placeholder-icon">${lesson.emoji}</div>
            <p class="video-placeholder-text">课程视频制作中</p>
            <p class="video-placeholder-hint">视频准备好后将在这里播放</p>
          </div>`
      }
      ${watched
        ? `<div class="video-watched-badge">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            已观看
          </div>`
        : ''
      }
    </div>`;
}

/* ─── 渲染知识点列表 ─── */
function renderKeyPoints(lesson) {
  if (!lesson.keyPoints || lesson.keyPoints.length === 0) return '';

  const items = lesson.keyPoints.map((point, i) => `
    <div class="key-point-item" style="animation-delay: ${i * 80}ms">
      <div class="key-point-index">${i + 1}</div>
      <div class="key-point-text">${point}</div>
    </div>
  `).join('');

  return `
    <div class="key-points-section">
      <h3 class="section-title">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
        本节知识点
      </h3>
      <div class="key-points-list">
        ${items}
      </div>
    </div>`;
}

/* ─── 渲染课程信息卡片 ─── */
function renderLessonInfo(lesson) {
  return `
    <div class="lesson-info-card glass-card rounded-[1.5rem] p-5">
      <p class="text-gray-600 text-[13px] leading-relaxed">
        ${lesson.description}
      </p>
    </div>`;
}

/* ─── 渲染底部操作区 ─── */
function renderActions(lesson, progress) {
  const hasVideo = !!lesson.videoUrl;
  const watched = progress.videoWatched;

  // 如果有视频但还没看完，按钮文案提示先看视频（但不强制）
  let btnLabel = '开始答题';
  let btnHint = '';
  if (hasVideo && !watched) {
    btnLabel = '开始答题';
    btnHint = '<p class="action-hint">建议先观看视频再答题</p>';
  } else if (progress.passed) {
    btnLabel = '再练一次';
  }

  return `
    <div class="lesson-actions">
      ${btnHint}
      <button class="lesson-start-btn ${lesson.colorClass}"
              data-action="start-quiz" data-lesson-id="${lesson.id}">
        ${btnLabel}
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </div>`;
}

/* ─── 渲染 Header ─── */
function renderHeader(lesson) {
  return `
    <div class="lesson-detail-header">
      <button class="back-btn" data-action="go-back" aria-label="返回">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      <div class="lesson-detail-title">
        <span class="lesson-detail-emoji">${lesson.emoji}</span>
        <div>
          <h1 class="text-[18px] font-black text-gray-800 leading-tight">
            第${lesson.id}课 · ${lesson.title}
          </h1>
          <p class="text-[12px] text-gray-400 mt-0.5">${lesson.subtitle}</p>
        </div>
      </div>
    </div>`;
}

/* ─── 公开导出的视图渲染函数 ─── */

/**
 * 渲染课程详情页
 * @param {{ lessonId: number }} params
 */
export function renderLessonDetail(params = {}) {
  const { lessonId } = params;
  const lesson = getLessonById(lessonId);

  if (!lesson) {
    window.__showToast?.('未找到该课程');
    window.__router.goBack();
    return;
  }

  const progress = store.getProgress(lessonId);
  const header  = document.getElementById('app-header');
  const content = document.getElementById('app-content');

  /* 注入 Header */
  header.innerHTML = renderHeader(lesson);

  /* 注入内容 */
  content.innerHTML = `
    <div class="lesson-detail-page">
      ${renderVideoSection(lesson, progress)}
      ${renderLessonInfo(lesson)}
      ${renderKeyPoints(lesson)}
      ${renderActions(lesson, progress)}
    </div>`;

  /* 绑定事件 */
  bindEvents(lesson, progress);
}

/* ─── 事件绑定 ─── */
function bindEvents(lesson, progress) {
  const header  = document.getElementById('app-header');
  const content = document.getElementById('app-content');

  // 返回按钮
  header.addEventListener('click', e => {
    if (e.target.closest('[data-action="go-back"]')) {
      window.__router.goBack();
    }
  });

  // 开始答题按钮
  content.addEventListener('click', e => {
    const btn = e.target.closest('[data-action="start-quiz"]');
    if (btn) {
      const id = Number(btn.dataset.lessonId);
      window.__showToast?.(`即将进入答题 ${lesson.emoji}`);
      window.__router.navigate('quiz', { lessonId: id });
    }
  });

  // 标记视频为已观看（模拟：点击视频占位区）
  const videoSection = content.querySelector('.lesson-video-section');
  if (videoSection && !progress.videoWatched) {
    // 如果有真实 video 元素，监听 ended 事件
    const video = videoSection.querySelector('video');
    if (video) {
      video.addEventListener('ended', () => {
        store.markVideoWatched(lesson.id);
        window.__showToast?.('视频观看完成！');
        // 刷新页面状态
        renderLessonDetail({ lessonId: lesson.id });
      }, { once: true });
    } else {
      // 视频占位区：点击标记为已观看（开发调试用）
      const placeholder = videoSection.querySelector('.video-placeholder');
      if (placeholder) {
        placeholder.addEventListener('click', () => {
          store.markVideoWatched(lesson.id);
          window.__showToast?.('已标记视频为已观看');
          renderLessonDetail({ lessonId: lesson.id });
        }, { once: true });
      }
    }
  }
}
