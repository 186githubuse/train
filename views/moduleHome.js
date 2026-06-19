/**
 * views/moduleHome.js
 * ─────────────────────────────────────────────────────────────
 * 杨红作文 — 模块首页（最外层壳）
 * 展示感觉 / 思维 / 综合 / 审题 / 同步作文 / 三步法36讲等模块。
 * 当前仅「感觉训练」开放，其余模块以锁定占位展示。
 * ─────────────────────────────────────────────────────────────
 */

import { LESSONS } from '../js/data/lessons.js';
import { TOPICS } from '../js/data/topics/index.js';
import { store } from '../js/store.js';

const IP_BASE = 'https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/IP/';
const TEACHER_IP = IP_BASE + 'pose1.png';

const MODULES = [
  {
    id: 'sensing',
    title: '感觉训练',
    subtitle: '用看、听、闻、尝、摸，写出真实细节',
    icon: 'eye',
    colorClass: 'macaron-rose',
    status: '进行中',
    available: true,
    tags: ['10 课 · 300 题', '6 大专题'],
  },
  {
    id: 'thinking',
    title: '思维训练',
    subtitle: '构思 · 立意 · 谋篇',
    icon: 'lightbulb',
  },
  {
    id: 'integrated',
    title: '综合训练',
    subtitle: '五感 + 三步法整合',
    icon: 'stack',
  },
  {
    id: 'review',
    title: '审题训练',
    subtitle: '读懂题目要求，抓住写作重点',
    icon: 'magnifying-glass',
  },
  {
    id: 'sync',
    title: '同步作文',
    subtitle: '跟课本单元同步训练',
    icon: 'book-open',
  },
  {
    id: 'steps36',
    title: '杨红作文三步法 · 写作训练 36 讲',
    subtitle: '系统课程 · 配套视频',
    icon: 'steps',
    wide: true,
  },
];

function renderHeader() {
  const user = store.getUser();
  return `
    <div class="mh-header">
      <div>
        <p class="mh-eyebrow">欢迎回来${user.name ? `，${user.name}` : ''} 👋</p>
        <h1 class="mh-title">杨红作文</h1>
        <p class="mh-subtitle">先选训练模块，再开始闯关学习</p>
      </div>
      <div class="mh-header-pill">
        <ph-sparkle weight="fill" size="15" color="#A78BFA"></ph-sparkle>
        <span>${store.getTitle()}</span>
      </div>
    </div>`;
}

function renderStatusCard() {
  const totalXp = LESSONS.reduce((sum, lesson) => sum + store.getProgress(lesson.id).xp, 0);
  const completedLessons = LESSONS.filter(lesson => store.getProgress(lesson.id).passed).length;
  const openTopics = TOPICS.reduce((sum, topic) => {
    if (!topic.available) return sum;
    return sum + topic.subs.filter(sub => !sub.comingSoon).length;
  }, 0);

  return `
    <section class="mh-status glass-card" aria-label="学习概况">
      <div class="mh-avatar" aria-hidden="true"></div>
      <div class="mh-checkin">
        <span class="mh-status-label">累计星星</span>
        <span class="mh-status-main">${store.getStars()}<small>颗</small></span>
      </div>
      <div class="mh-stats">
        <div class="mh-stat">
          <div class="mh-stat-num">${completedLessons}<span>/10</span></div>
          <div class="mh-stat-label">基础课程</div>
        </div>
        <div class="mh-stat">
          <div class="mh-stat-num">${openTopics}</div>
          <div class="mh-stat-label">专题内容</div>
        </div>
        <div class="mh-stat">
          <div class="mh-stat-num">${totalXp}</div>
          <div class="mh-stat-label">累计 XP</div>
        </div>
      </div>
      <div class="mh-teacher" aria-label="杨老师">
        <img src="${TEACHER_IP}" alt="杨老师" loading="lazy">
      </div>
    </section>`;
}

function renderModuleCard(mod, index) {
  if (mod.available) {
    return `
      <button class="mh-module mh-module-hero ${mod.colorClass}"
              type="button"
              data-module-id="${mod.id}"
              style="animation-delay:${index * 70}ms"
              aria-label="进入${mod.title}">
        <span class="mh-live-badge">
          <ph-lightning weight="fill" size="11" color="#fff"></ph-lightning>${mod.status}
        </span>
        <span class="mh-module-icon">
          <ph-${mod.icon} weight="fill" size="28" color="rgba(255,255,255,0.96)"></ph-${mod.icon}>
        </span>
        <span class="mh-module-title">${mod.title}</span>
        <span class="mh-module-desc">${mod.subtitle}</span>
        <span class="mh-module-tags">
          ${mod.tags.map(tag => `<span>${tag}</span>`).join('')}
        </span>
        <span class="mh-module-cta">
          开始学习
          <ph-arrow-right weight="bold" size="14" color="#C2487E"></ph-arrow-right>
        </span>
      </button>`;
  }

  return `
    <button class="mh-module mh-module-locked ${mod.wide ? 'mh-module-wide' : ''}"
            type="button"
            data-locked-module="${mod.id}"
            style="animation-delay:${index * 70}ms"
            aria-label="${mod.title}，敬请期待">
      <span class="mh-lock-pill">
        <ph-lock-simple weight="fill" size="10" color="#8A82A6"></ph-lock-simple>敬请期待
      </span>
      <span class="mh-module-icon mh-module-icon-muted">
        <ph-${mod.icon} weight="fill" size="24" color="#9890AE"></ph-${mod.icon}>
      </span>
      <span class="mh-locked-copy">
        <span class="mh-module-title">${mod.title}</span>
        <span class="mh-module-desc">${mod.subtitle}</span>
      </span>
    </button>`;
}

function bindEvents(content) {
  content.querySelector('[data-module-id="sensing"]')?.addEventListener('click', () => {
    window.__router.navigate('trainingCamp');
  });

  content.querySelectorAll('[data-locked-module]').forEach(card => {
    card.addEventListener('click', () => {
      window.__showToast?.('这个模块正在准备中，敬请期待 ✨');
    });
  });
}

export function renderModuleHome() {
  const header = document.getElementById('app-header');
  const content = document.getElementById('app-content');
  if (!header || !content) return;

  header.innerHTML = renderHeader();
  content.innerHTML = `
    <div class="module-home-page">
      ${renderStatusCard()}
      <section class="mh-section" aria-label="训练模块">
        <div class="mh-section-title">
          <ph-squares-four weight="fill" size="15" color="#A78BFA"></ph-squares-four>
          <span>杨红作文 · 训练模块</span>
        </div>
        <div class="mh-module-grid">
          ${MODULES.map(renderModuleCard).join('')}
        </div>
      </section>
    </div>`;

  bindEvents(content);
}
