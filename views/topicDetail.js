/**
 * views/topicDetail.js
 * ─────────────────────────────────────────────────────────────
 * 专题训练 — 子内容列表页
 * 展示某个专题（如静物）下的所有子内容卡片（稿纸/台灯/橘子...）
 * ─────────────────────────────────────────────────────────────
 */

import { getTopic } from '../js/data/topics/index.js';

function renderHeader(topic) {
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
  const t1 = sub.type1?.length || 0;
  const t2 = sub.type2?.length || 0;
  const t3 = sub.type3 ? 1 : 0;
  const totalCount = t1 + t2 + t3;

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
            <span><ph-list-bullets weight="bold" size="12" color="rgba(255,255,255,0.9)"></ph-list-bullets> ${t1 + t2} 道题</span>
            ${t3 ? `<span><ph-pencil-simple weight="bold" size="12" color="rgba(255,255,255,0.9)"></ph-pencil-simple> 1 篇练笔</span>` : ''}
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
  const { topicId } = params;
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

  const cards = topic.subs.map((sub, i) => renderSubCard(sub, topic, i)).join('');

  content.innerHTML = `
    <div class="topic-detail-page">
      <div class="topic-intro-card ${topic.colorClass}">
        <ph-${topic.icon} weight="fill" size="36" color="rgba(255,255,255,0.95)"></ph-${topic.icon}>
        <div>
          <h2 class="text-white font-black text-[18px] leading-tight">
            一共 ${topic.subs.length} 个子内容
          </h2>
          <p class="text-white/80 text-[12px] mt-1 leading-relaxed">
            由浅入深逐步练习，建议依次完成
          </p>
        </div>
      </div>
      <div class="sub-card-list">${cards}</div>
    </div>`;

  // 事件绑定
  header.addEventListener('click', e => {
    if (e.target.closest('[data-action="go-back"]')) {
      window.__router.goBack();
    }
  });

  content.querySelectorAll('.sub-card-unlocked').forEach(card => {
    card.addEventListener('click', () => {
      const subId = card.dataset.subId;
      window.__router.navigate('topicQuiz', { topicId, subId });
    });
  });
}
