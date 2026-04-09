/**
 * views/medalHall.js
 * 勋章馆 — 深色流动渐变背景 + 精致勋章展示
 */

import { store } from '../js/store.js';

const COS_BASE = 'https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/Medal/';

const MEDALS = [
  {
    id: 'beginner',
    name: '初心者',
    desc: '完成第1课',
    img: `${COS_BASE}初心者.png`,
    condition: s => s.completedLessons >= 1,
    color: '#F9A8D4',
    glow: 'rgba(249,168,212,0.6)',
  },
  {
    id: 'five_senses',
    name: '五感觉醒',
    desc: '完成全部10课',
    img: `${COS_BASE}五感觉醒.png`,
    condition: s => s.completedLessons >= 10,
    color: '#C084FC',
    glow: 'rgba(192,132,252,0.6)',
  },
  {
    id: 'perfect',
    name: '零失误',
    desc: '任意一课0错误通关',
    img: `${COS_BASE}零失误.png`,
    condition: s => s.hasPerfect,
    color: '#6EE7B7',
    glow: 'rgba(110,231,183,0.6)',
  },
  {
    id: 'combo',
    name: '连击王',
    desc: '挑战赛连续答对10题',
    img: `${COS_BASE}连击王.png`,
    condition: s => s.bestCombo >= 10,
    color: '#FCD34D',
    glow: 'rgba(252,211,77,0.6)',
  },
  {
    id: 'apprentice',
    name: '感觉学徒',
    desc: '累计获得20颗星',
    img: `${COS_BASE}感觉学徒.png`,
    condition: s => s.totalStars >= 20,
    color: '#7DD3FC',
    glow: 'rgba(125,211,252,0.6)',
  },
  {
    id: 'reviewer',
    name: '复习达人',
    desc: '复习完成10道错题',
    img: `${COS_BASE}复习达人.png`,
    condition: s => s.reviewedCount >= 10,
    color: '#FCA5A5',
    glow: 'rgba(252,165,165,0.6)',
  },
  {
    id: 'master',
    name: '感觉大师',
    desc: '累计获得200颗星',
    img: `${COS_BASE}感觉大师.png`,
    condition: s => s.totalStars >= 200,
    color: '#A78BFA',
    glow: 'rgba(167,139,250,0.7)',
  },
];

/** 计算勋章解锁状态所需的统计数据 */
function getMedalStats() {
  const stats = store.getStats();
  const totalStars = store.getStars();
  const mistakes = store.getMistakes();
  const reviewedCount = mistakes.filter(m => m.reviewed).length;

  // 判断是否有某课0错误通关（通过 lessonProgress 里 stars===3 近似判断）
  let hasPerfect = false;
  for (let i = 1; i <= 10; i++) {
    const p = store.getProgress(i);
    if (p.passed && p.stars === 3) { hasPerfect = true; break; }
  }

  // 最佳连击（challengeRecords 暂无连击字段，预留接口）
  const bestCombo = 0;

  return {
    completedLessons: stats.completedLessons,
    totalStars,
    reviewedCount,
    hasPerfect,
    bestCombo,
  };
}

/** 渲染单个勋章 */
function buildMedalCard(medal, unlocked, index) {
  const delay = index * 80;
  return `
    <div class="mh-medal-item" style="animation-delay:${delay}ms" data-medal-id="${medal.id}">
      <div class="mh-medal-img-wrap ${unlocked ? 'unlocked' : 'locked'}">
        ${unlocked
          ? `<div class="mh-glow" style="background:${medal.glow}"></div>
             <img src="${medal.img}" alt="${medal.name}" class="mh-medal-img"
                  style="animation-delay:${delay + 200}ms">`
          : `<div class="mh-locked-overlay">
               <img src="${medal.img}" alt="${medal.name}" class="mh-medal-img mh-medal-grayscale">
               <div class="mh-lock-icon">
                 <ph-lock-simple weight="fill" color="rgba(255,255,255,0.5)" size="28"></ph-lock-simple>
               </div>
             </div>`
        }
      </div>
      <div class="mh-medal-name ${unlocked ? 'unlocked' : 'locked'}">${medal.name}</div>
      <div class="mh-medal-desc">${medal.desc}</div>
    </div>`;
}

/** 构建页面 HTML */
function buildHTML(medals, stats) {
  const unlockedCount = medals.filter(m => m.condition(stats)).length;

  const cardsHtml = medals.map((medal, i) => {
    const unlocked = medal.condition(stats);
    return buildMedalCard(medal, unlocked, i);
  }).join('');

  return `
    <div class="mh-page">
      <!-- 流动渐变背景 -->
      <div class="mh-bg" aria-hidden="true">
        <div class="mh-bg-blob mh-blob-1"></div>
        <div class="mh-bg-blob mh-blob-2"></div>
        <div class="mh-bg-blob mh-blob-3"></div>
      </div>

      <!-- 顶部 Header -->
      <div class="mh-header">
        <button class="mh-back-btn" aria-label="返回">
          <ph-caret-left weight="bold" color="rgba(255,255,255,0.85)" size="22"></ph-caret-left>
        </button>
        <div class="mh-header-center">
          <div class="mh-header-title">勋章馆</div>
          <div class="mh-header-sub">
            <ph-star weight="fill" color="#FCD34D" size="13"></ph-star>
            已获得 ${unlockedCount} / ${medals.length} 枚
          </div>
        </div>
        <div style="width:36px"></div>
      </div>

      <!-- 进度条 -->
      <div class="mh-progress-wrap">
        <div class="mh-progress-track">
          <div class="mh-progress-fill" style="width:${Math.round(unlockedCount/medals.length*100)}%"></div>
        </div>
      </div>

      <!-- 粒子装饰 -->
      <div class="mh-particles" aria-hidden="true">
        ${Array.from({length: 18}, (_, i) => `<div class="mh-particle" style="
          left:${Math.random()*100}%;
          top:${Math.random()*100}%;
          animation-delay:${Math.random()*4}s;
          animation-duration:${3+Math.random()*3}s;
          width:${2+Math.random()*3}px;
          height:${2+Math.random()*3}px;
          opacity:${0.2+Math.random()*0.4};
        "></div>`).join('')}
      </div>

      <!-- 勋章网格 -->
      <div class="mh-grid">
        ${cardsHtml}
      </div>

      <!-- 底部提示 -->
      ${unlockedCount < medals.length ? `
      <div class="mh-footer-tip">
        <ph-info weight="fill" color="rgba(255,255,255,0.3)" size="14"></ph-info>
        <span>继续学习解锁更多勋章</span>
      </div>` : `
      <div class="mh-footer-tip mh-footer-complete">
        <ph-confetti weight="fill" color="#FCD34D" size="14"></ph-confetti>
        <span>全部勋章已集齐！</span>
      </div>`}
    </div>`;
}

export function renderMedalHall() {
  const content = document.getElementById('app-content');
  if (!content) return;

  // 隐藏 header 和底部导航
  const header = document.getElementById('app-header');
  if (header) { header.innerHTML = ''; header.style.display = 'none'; }
  const nav = document.getElementById('bottom-nav');
  if (nav) nav.style.display = 'none';

  // 撑满全屏：去掉 app-content 的内边距，让页面自己控制布局
  content.style.padding = '0';
  content.style.overflow = 'hidden';

  const stats = getMedalStats();
  content.innerHTML = buildHTML(MEDALS, stats);

  // 点击勋章弹出详情
  content.querySelectorAll('.mh-medal-item').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.medalId;
      const medal = MEDALS.find(m => m.id === id);
      const unlocked = medal.condition(stats);
      showMedalDetail(medal, unlocked);
    });
  });

  // 返回按钮：恢复 content 样式 + 导航栏
  content.querySelector('.mh-back-btn')?.addEventListener('click', () => {
    content.style.padding = '';
    content.style.overflow = '';
    const nav = document.getElementById('bottom-nav');
    if (nav) nav.style.display = '';
    window.__router.goBack();
  });
}

/** 勋章详情弹窗 */
function showMedalDetail(medal, unlocked) {
  const overlay = document.createElement('div');
  overlay.className = 'mh-overlay';
  overlay.innerHTML = `
    <div class="mh-detail-card">
      <div class="mh-detail-img-wrap ${unlocked ? 'unlocked' : 'locked'}">
        ${unlocked
          ? `<div class="mh-detail-glow" style="background:${medal.glow}"></div>
             <img src="${medal.img}" class="mh-detail-img" alt="${medal.name}">`
          : `<img src="${medal.img}" class="mh-detail-img mh-medal-grayscale" alt="${medal.name}">
             <div class="mh-lock-icon large">
               <ph-lock-simple weight="fill" color="rgba(255,255,255,0.5)" size="40"></ph-lock-simple>
             </div>`
        }
      </div>
      <div class="mh-detail-name" style="color:${unlocked ? medal.color : 'rgba(255,255,255,0.4)'}">${medal.name}</div>
      <div class="mh-detail-status">${unlocked ? '✦ 已获得' : '未解锁'}</div>
      <div class="mh-detail-desc">${medal.desc}</div>
      <button class="mh-detail-close">知道了</button>
    </div>`;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('show'));

  const close = () => {
    overlay.classList.remove('show');
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
  };
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  overlay.querySelector('.mh-detail-close').addEventListener('click', close);
}
