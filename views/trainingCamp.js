/**
 * views/trainingCamp.js
 * ─────────────────────────────────────────────────────────────
 * 感觉训练系统 — 训练营视图
 * 职责：渲染闯关地图，不关心路由切换逻辑
 * ─────────────────────────────────────────────────────────────
 */

import { LESSONS } from '../js/data/lessons.js';
import { TOPICS } from '../js/data/topics.js';
import { store } from '../js/store.js';

let _activeTab = 'basic'; // 'basic' | 'topic'

/* ─── 私有辅助函数 ─── */

/**
 * 渲染三颗星评分 SVG
 * @param {number} filled 已填充星数（0-3）
 * @returns {string} HTML string
 */
function renderStars(filled) {
  return Array.from({ length: 3 }, (_, i) => {
    const isFilled = i < filled;
    return `
      <svg class="w-4 h-4 ${isFilled ? 'star-filled' : 'star-empty'}"
           viewBox="0 0 24 24"
           fill="${isFilled ? 'currentColor' : 'none'}"
           stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
      </svg>`;
  }).join('');
}

/**
 * 渲染 XP 进度条
 * @param {number} xp 当前 XP
 * @param {number} totalXp 总 XP
 * @returns {string} HTML string
 */
function renderProgressBar(xp, totalXp) {
  const pct = totalXp > 0 ? Math.round((xp / totalXp) * 100) : 0;
  return `
    <div class="mt-3">
      <div class="flex justify-between items-center mb-1.5">
        <span class="text-[11px] font-medium text-white/70">经验值</span>
        <span class="text-[11px] font-bold text-white/90">${xp} / ${totalXp} XP</span>
      </div>
      <div class="progress-bar-track">
        <div class="progress-bar-fill" style="width: ${pct}%"></div>
      </div>
    </div>`;
}

/**
 * 渲染已解锁关卡卡片
 * @param {import('../js/data/lessons.js').Lesson} lesson
 * @param {number} index
 * @returns {string} HTML string
 */
function renderUnlockedCard(lesson, index) {
  const isEven = index % 2 === 0;
  const offset  = isEven ? 'mr-6' : 'ml-6'; // 锯齿偏移，形成闯关地图感

  const btnLabel = lesson.xp > 0 ? '继续练习' : '开始训练';

  return `
    <div class="lesson-card-wrap ${offset}" style="animation-delay: ${index * 90}ms">
      <div
        class="lesson-card-unlocked ${lesson.colorClass} rounded-[2rem] p-5 w-full"
        role="button"
        tabindex="0"
        aria-label="第${lesson.id}关 ${lesson.title} — 点击开始训练"
        data-lesson-id="${lesson.id}"
      >
        <!-- 顶行：关卡徽章 + emoji + 星星 -->
        <div class="flex items-start justify-between mb-3">

          <!-- 左：关卡号 + emoji -->
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 rounded-[14px] bg-white/30 backdrop-blur-sm
                        flex items-center justify-center
                        font-black text-sm shadow-inner"
                 style="color: ${lesson.textColor}">
              ${lesson.id}
            </div>
            <span class="text-3xl leading-none select-none">${lesson.emoji}</span>
          </div>

          <!-- 右：星星 -->
          <div class="flex items-center gap-0.5 pt-1">
            ${renderStars(lesson.stars)}
          </div>
        </div>

        <!-- 标题 & 副标题 -->
        <h3 class="text-white font-black text-[17px] leading-snug drop-shadow-sm">
          ${lesson.title}
        </h3>
        <p class="text-white/78 text-[12px] mt-0.5 leading-relaxed">
          ${lesson.subtitle}
        </p>

        <!-- 进度条 -->
        ${renderProgressBar(lesson.xp, lesson.totalXp)}

        <!-- 底行：开始按钮 -->
        <div class="mt-4 flex justify-end">
          <button class="btn-start" data-action="start" data-lesson-id="${lesson.id}">
            ${btnLabel}
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>`;
}

/**
 * 渲染已锁定关卡卡片
 * @param {import('../js/data/lessons.js').Lesson} lesson
 * @param {number} index
 * @returns {string} HTML string
 */
function renderLockedCard(lesson, index) {
  const isEven = index % 2 === 0;
  const offset  = isEven ? 'mr-6' : 'ml-6';

  return `
    <div class="lesson-card-wrap ${offset}" style="animation-delay: ${index * 90}ms">
      <div
        class="lesson-card-locked rounded-[2rem] p-5 w-full"
        aria-label="第${lesson.id}关 ${lesson.title} — 尚未解锁"
        aria-disabled="true"
      >
        <!-- 顶行：关卡号 + 模糊 emoji + 锁图标 -->
        <div class="flex items-start justify-between mb-3">

          <!-- 左：关卡号 + emoji（灰化） -->
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 rounded-[14px] bg-white/15
                        flex items-center justify-center
                        font-black text-sm text-gray-400">
              ${lesson.id}
            </div>
            <span class="text-3xl leading-none select-none opacity-25">${lesson.emoji}</span>
          </div>

          <!-- 右：锁定图标 -->
          <div class="w-8 h-8 rounded-full bg-white/20
                      flex items-center justify-center">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        </div>

        <!-- 标题 & 副标题（灰色） -->
        <h3 class="text-gray-400 font-black text-[17px] leading-snug">
          ${lesson.title}
        </h3>
        <p class="text-gray-400/65 text-[12px] mt-0.5 leading-relaxed">
          ${lesson.subtitle}
        </p>

        <!-- 解锁提示 -->
        <div class="mt-4 flex items-center gap-1.5 text-gray-400/55">
          <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4l3 3"/>
          </svg>
          <span class="text-[11px]">完成上一关卡后解锁</span>
        </div>
      </div>
    </div>`;
}

/**
 * 渲染专题训练内容
 */
function renderTopics() {
  const cards = TOPICS.map(topic => `
    <div class="topic-card ${topic.colorClass} rounded-[2rem] p-5">
      <div class="flex items-center justify-between mb-3">
        <span class="text-4xl leading-none">${topic.emoji}</span>
        <span class="topic-coming-badge">即将上线</span>
      </div>
      <h3 class="text-white font-black text-[18px] leading-snug drop-shadow-sm">
        ${topic.title}
      </h3>
      <p class="text-white/75 text-[12px] mt-1 leading-relaxed">
        ${topic.subtitle}
      </p>
    </div>
  `).join('');

  return `<div class="topic-grid">${cards}</div>`;
}

/**
 * 渲染关卡间的路径连接符
 * @param {boolean} isUnlocked 上方关卡是否已解锁
 * @returns {string} HTML string
 */
function renderPathConnector(isUnlocked) {
  const stateClass = isUnlocked ? 'unlocked' : 'locked';
  return `
    <div class="path-connector ${stateClass} my-0.5" aria-hidden="true">
      <div class="path-line"></div>
      <div class="path-dot"></div>
      <div class="path-line"></div>
    </div>`;
}

/* ─── 顶部总进度 Header ─── */
function renderHeader() {
  const totalLessons = LESSONS.length;
  const unlockedCount = LESSONS.filter(l => store.isUnlocked(l.id)).length;
  const totalXp = LESSONS.reduce((sum, l) => sum + store.getProgress(l.id).xp, 0);
  const pct = Math.round((unlockedCount / totalLessons) * 100);

  return `
    <!-- 欢迎语 -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <p class="text-[13px] text-gray-400 font-medium">欢迎回来 👋</p>
        <h1 class="text-[22px] font-black text-gray-800 leading-tight mt-0.5">
          训练营
        </h1>
      </div>
      <!-- 头像占位 -->
      <div id="tc-avatar-btn" class="w-11 h-11 rounded-[16px]
                  bg-gradient-to-br from-violet-400 to-pink-400
                  flex items-center justify-center shadow-md cursor-pointer
                  hover:scale-105 transition-transform duration-200">
        <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
    </div>

    <!-- 总进度卡片（仅基础训练显示） -->
    <div class="overall-progress-card rounded-[1.75rem] px-5 py-4 mb-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-white/90 font-semibold text-[13px]">基础训练进度</span>
        <span class="text-white font-black text-[14px]">
          ${unlockedCount} <span class="font-normal opacity-70">/ ${totalLessons} 关</span>
        </span>
      </div>
      <div class="progress-bar-track" style="height:8px;">
        <div class="progress-bar-fill" style="width:${pct}%"></div>
      </div>
      <div class="flex items-center justify-between mt-2.5 text-white/75 text-[11px]">
        <span>🌟 已获得 ${totalXp} XP</span>
        <span>
          ${unlockedCount < totalLessons
            ? `下一关：${LESSONS[unlockedCount].title} →`
            : '🎉 全部完成！'}
        </span>
      </div>
    </div>

    <!-- Tab 切换 -->
    <div class="tc-tab-bar">
      <button class="tc-tab ${_activeTab === 'basic' ? 'tc-tab-active' : ''}" data-tab="basic">
        📚 基础训练
      </button>
      <button class="tc-tab ${_activeTab === 'topic' ? 'tc-tab-active' : ''}" data-tab="topic">
        🎯 专题训练
      </button>
    </div>`;
}

/* ─── 公开导出的视图渲染函数 ─── */

/**
 * 渲染训练营视图
 * 将 Header 注入 #app-header，将关卡地图注入 #app-content
 */
export function renderTrainingCamp() {
  const header  = document.getElementById('app-header');
  const content = document.getElementById('app-content');

  /* 注入 Header */
  header.innerHTML = renderHeader();

  /* 头像点击 → 用户信息弹窗 */
  document.getElementById('tc-avatar-btn')?.addEventListener('click', showProfilePanel);

  /* Tab 切换 */
  header.querySelectorAll('.tc-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      _activeTab = btn.dataset.tab;
      renderTrainingCamp();
    });
  });

  /* 根据 Tab 渲染内容 */
  if (_activeTab === 'topic') {
    content.innerHTML = renderTopics();
    return;
  }

  /* 基础训练：构建关卡地图 HTML */
  const mapItems = LESSONS.flatMap((lesson, index) => {
    const unlocked = store.isUnlocked(lesson.id);
    const progress = store.getProgress(lesson.id);
    const enriched = { ...lesson, unlocked, stars: progress.stars, xp: progress.xp, totalXp: progress.totalXp };
    const card = unlocked
      ? renderUnlockedCard(enriched, index)
      : renderLockedCard(enriched, index);

    const connector = index < LESSONS.length - 1
      ? renderPathConnector(unlocked)
      : '';

    return [card, connector];
  }).join('');

  content.innerHTML = `
    <div class="lesson-map flex flex-col items-stretch py-2" role="list" aria-label="关卡列表">
      ${mapItems}
    </div>`;

  /* 绑定关卡点击事件（事件委托） */
  content.addEventListener('click', handleCardClick, { once: false });

  /* 聚光灯边框：鼠标/触摸移动时更新 --mx / --my */
  content.addEventListener('mousemove', handleSpotlight);
  content.addEventListener('touchmove', handleSpotlightTouch, { passive: true });
}

function handleSpotlight(e) {
  const card = e.target.closest('.lesson-card-unlocked');
  if (!card) return;
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
  card.style.setProperty('--my', `${e.clientY - rect.top}px`);
}

function handleSpotlightTouch(e) {
  const touch = e.touches[0];
  const card = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.lesson-card-unlocked');
  if (!card) return;
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${touch.clientX - rect.left}px`);
  card.style.setProperty('--my', `${touch.clientY - rect.top}px`);
}

/**
 * 关卡点击处理（内部使用，绑定在 content 上做事件委托）
 * @param {MouseEvent} e
 */
function handleCardClick(e) {
  const btn = e.target.closest('[data-action="start"]');
  if (!btn) return;

  const lessonId = Number(btn.dataset.lessonId);
  const lesson   = LESSONS.find(l => l.id === lessonId);
  if (!lesson || !store.isUnlocked(lessonId)) return;

  // 通过路由进入课程详情页
  window.__router.navigate('lessonDetail', { lessonId });
}

/* ─── 用户信息弹窗 ─── */
function showProfilePanel() {
  const user = store.getUser();
  const gradeLabel = ['', '一', '二', '三', '四', '五', '六'][user.grade] || '';
  const totalXp = LESSONS.reduce((sum, l) => sum + store.getProgress(l.id).xp, 0);

  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:500;
    background:rgba(0,0,0,0.35);backdrop-filter:blur(6px);
    display:flex;align-items:flex-end;padding:16px;box-sizing:border-box;
  `;
  overlay.innerHTML = `
    <div style="
      width:100%;background:rgba(255,255,255,0.95);
      border-radius:28px;padding:24px 20px 28px;
      box-shadow:0 -8px 40px rgba(139,92,246,0.15);
      border:1px solid rgba(255,255,255,0.9);
    ">
      <!-- 用户信息 -->
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">
        <div style="
          width:60px;height:60px;border-radius:20px;flex-shrink:0;
          background:linear-gradient(135deg,#A78BFA,#EC4899);
          display:flex;align-items:center;justify-content:center;
          font-size:28px;box-shadow:0 4px 16px rgba(139,92,246,0.35);
        ">👤</div>
        <div>
          <div style="font-size:20px;font-weight:800;color:#1F1040;">${user.name || '同学'}</div>
          <div style="font-size:13px;color:#9CA3AF;margin-top:2px;">${gradeLabel}年级 · 能力指数 ${Number(user.abilityIndex).toFixed(1)}</div>
          <div style="font-size:12px;color:#A78BFA;font-weight:600;margin-top:2px;">🌟 已获得 ${totalXp} XP</div>
        </div>
      </div>

      <!-- 操作 -->
      <div style="display:flex;flex-direction:column;gap:10px;">
        <button id="pp-reset" style="
          width:100%;padding:14px;border-radius:16px;border:none;
          background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.20);
          color:#DC2626;font-size:15px;font-weight:700;cursor:pointer;
          font-family:inherit;
        ">重新设置姓名和年级</button>
        <button id="pp-close" style="
          width:100%;padding:14px;border-radius:16px;border:none;
          background:rgba(255,255,255,0.70);border:1px solid rgba(255,255,255,0.90);
          color:#6B7280;font-size:15px;font-weight:600;cursor:pointer;
          font-family:inherit;backdrop-filter:blur(12px);
        ">关闭</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.getElementById('pp-close').addEventListener('click', close);
  document.getElementById('pp-reset').addEventListener('click', () => {
    close();
    // 重置用户信息，重新走引导
    store.setUserProfile('', null);
    const nav = document.getElementById('bottom-nav');
    if (nav) nav.style.display = 'none';
    window.__router.navigate('onboarding', {}, false);
  });
}
