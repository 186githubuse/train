/**
 * views/topicDetail.js
 * ─────────────────────────────────────────────────────────────
 * 专题训练 — 子内容列表页
 * 展示某个专题（如静物）下的所有子内容卡片（稿纸/台灯/橘子...）
 * ─────────────────────────────────────────────────────────────
 */

import { getTopic } from '../js/data/topics/index.js';

/** 统计选择题数量 + 是否有书写大题（兼容新单元结构 / 旧平铺结构） */
function countQuestions(sub) {
  if (sub.schema === 'unit') {
    const a = sub.typeA?.questions?.length || 0;
    const b = (sub.typeB?.units || []).reduce((n, u) => n + (u.questions?.length || 0), 0);
    return { choiceCount: a + b, tD: sub.typeC ? 1 : 0 };
  }
  const a = sub.typeA?.length || 0;
  const b = sub.typeB?.length || 0;
  const c = sub.typeC?.length || 0;
  return { choiceCount: a + b + c, tD: sub.typeD ? 1 : 0 };
}

function getTopicLabel(topic) {
  return topic.title.replace('训练', '');
}

function renderHeader(topic) {
  const label = getTopicLabel(topic);
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
        <div>
          <div class="topic-detail-crumb">
            <span>感觉训练</span>
            <ph-caret-right weight="bold" size="11" color="rgba(156,163,175,0.78)"></ph-caret-right>
            <span>${label}</span>
          </div>
          <h1 class="text-[18px] font-black text-gray-800 leading-tight">
            ${topic.title}
          </h1>
          <p class="text-[12px] text-gray-400 mt-0.5">${topic.subtitle}</p>
        </div>
      </div>
    </div>`;
}

function renderSubCard(sub, topic, idx) {
  const locked = !!sub.comingSoon;
  const { choiceCount, tD } = countQuestions(sub);

  if (locked) {
    return `
      <div class="sub-card sub-card-locked" style="animation-delay:${idx * 80}ms">
        <div class="sub-card-left">
          <div class="sub-card-num">${idx + 1}</div>
          <div>
            <h3 class="sub-card-title sub-card-title-locked">${sub.title}</h3>
            <p class="sub-card-sub">${sub.subtitle || ''}</p>
          </div>
        </div>
        <span class="sub-card-coming">即将上线</span>
      </div>`;
  }

  return `
    <div class="sub-card sub-card-unlocked ${topic.colorClass}"
         data-sub-id="${sub.id}"
         role="button" tabindex="0"
         style="animation-delay:${idx * 80}ms">
      <div class="sub-card-left">
        <div class="sub-card-num sub-card-num-unlocked">${idx + 1}</div>
        <div>
          <h3 class="sub-card-title">${sub.title}</h3>
          <p class="sub-card-sub sub-card-sub-light">${sub.subtitle || ''}</p>
          <div class="sub-card-meta">
            <span><ph-list-bullets weight="bold" size="12" color="rgba(255,255,255,0.9)"></ph-list-bullets> ${choiceCount} 道选择题</span>
            ${tD ? `<span><ph-pencil-simple weight="bold" size="12" color="rgba(255,255,255,0.9)"></ph-pencil-simple> 1 篇书写</span>` : ''}
          </div>
        </div>
      </div>
      <div class="sub-card-arrow">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </div>`;
}

export function renderTopicDetail(params = {}) {
  const { topicId, phase } = params;
  const topic = getTopic(topicId);

  if (!topic) {
    window.__showToast?.('未找到该专题');
    window.__router.goBack();
    return;
  }

  const header = document.getElementById('app-header');
  const content = document.getElementById('app-content');

  header.innerHTML = renderHeader(topic);
  header.style.display = '';

  // phase === 'list' 时直接显示子内容列表
  if (phase === 'list') {
    renderListPhase(topic, topicId, content, header);
    return;
  }

  // 默认：介绍页（视频 + 知识点 + 开始按钮）
  if (topic.intro) {
    renderIntroPhase(topic, topicId, content, header);
  } else {
    // 没有 intro 的模块直接显示列表
    renderListPhase(topic, topicId, content, header);
  }
}

function renderIntroPhase(topic, topicId, content, header) {
  const label = getTopicLabel(topic);
  const points = topic.intro.points.map((p, i) => `
    <div class="key-point-item" style="animation-delay: ${i * 80}ms">
      <div class="key-point-index">${i + 1}</div>
      <div class="key-point-text">${p}</div>
    </div>
  `).join('');

  content.innerHTML = `
    <div class="topic-detail-page">
      <div class="topic-video-section glass-card rounded-[1.5rem] overflow-hidden mb-4">
        <video
          class="topic-intro-video"
          src="${topic.intro.videoUrl}"
          controls
          playsinline
          preload="metadata"
        ></video>
      </div>
      <div class="key-points-section">
        <h3 class="section-title">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
          ${topic.intro.title}
        </h3>
        <div class="key-points-list">
          ${points}
        </div>
      </div>
      <button class="topic-start-btn ${topic.colorClass}" id="topic-start-btn">
        <span class="topic-start-btn-text">选择${label}开始答题</span>
        <svg class="topic-start-btn-arrow" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </div>`;

  header.addEventListener('click', e => {
    if (e.target.closest('[data-action="go-back"]')) {
      window.__router.navigate('trainingCamp', { tab: 'topic' });
    }
  });

  document.getElementById('topic-start-btn')?.addEventListener('click', () => {
    window.__router.navigate('topicDetail', { topicId, phase: 'list' });
  });
}

function renderListPhase(topic, topicId, content, header) {
  const label = getTopicLabel(topic);
  const cards = topic.subs.map((sub, i) => renderSubCard(sub, topic, i)).join('');

  content.innerHTML = `
    <div class="topic-detail-page">
      <div class="topic-intro-card ${topic.colorClass}">
        <ph-${topic.icon} weight="fill" size="36" color="rgba(255,255,255,0.95)"></ph-${topic.icon}>
        <div>
          <h2 class="text-white font-black text-[18px] leading-tight">
            选择一个${label}
          </h2>
          <p class="text-white/80 text-[12px] mt-1 leading-relaxed">
            共 ${topic.subs.length} 个子内容，由浅入深逐步练习
          </p>
        </div>
      </div>
      <div class="sub-card-list">${cards}</div>
    </div>`;

  header.addEventListener('click', e => {
    if (e.target.closest('[data-action="go-back"]')) {
      window.__router.navigate('trainingCamp', { tab: 'topic' });
    }
  });

  content.querySelectorAll('.sub-card-unlocked').forEach(card => {
    card.addEventListener('click', () => {
      const subId = card.dataset.subId;
      window.__router.navigate('topicQuiz', { topicId, subId });
    });
  });
}
