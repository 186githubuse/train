/**
 * js/router.js
 * ─────────────────────────────────────────────────────────────
 * 感觉训练系统 — 路由注册表
 *
 * 职责：
 *   1. 集中管理所有视图的注册
 *   2. 提供 navigate(viewName, params) 全局跳转函数
 *   3. 维护导航历史，支持"返回"操作
 *
 * 新增视图只需在 VIEW_MAP 中添加一行，其他地方不用动
 * ─────────────────────────────────────────────────────────────
 */

/* ═══════════════════════════════════════════════════
   视图懒加载函数
   import() 是动态导入，只有在真正跳转到该视图时才加载
   好处：初始加载快，后续按需加载
═══════════════════════════════════════════════════ */
const VIEW_MAP = {
  // ── 底部导航栏视图 ──────────────────────────────
  trainingCamp:  () => import('../views/trainingCamp.js').then(m => m.renderTrainingCamp),
  magicMachine:  () => import('../views/magicMachine.js').then(m => m.renderMagicMachine),
  challenge:     () => import('../views/challenge.js').then(m => m.renderChallenge),
  growth:        () => import('../views/report.js').then(m => m.renderReport),

  // ── 功能页视图 ───────────────────────────────────
  lessonDetail:  () => import('../views/lessonDetail.js').then(m => m.renderLessonDetail),
  quiz:          () => import('../views/quiz.js').then(m => m.renderQuiz),
  report:        () => import('../views/report.js').then(m => m.renderReport),
  mistakeBook:   () => import('../views/mistakeBook.js').then(m => m.renderMistakeBook),
};

/* ═══════════════════════════════════════════════════
   路由历史栈
   格式：[{ view: 'trainingCamp', params: {} }, ...]
═══════════════════════════════════════════════════ */
const _history = [];
let _currentView = '';
let _currentParams = {};

/**
 * 跳转到指定视图
 * @param {string} viewName   - VIEW_MAP 中的 key
 * @param {Object} [params]   - 传递给视图的参数（如 lessonId）
 * @param {boolean} [pushHistory=true] - 是否记录到历史栈
 */
async function navigate(viewName, params = {}, pushHistory = true) {
  if (!VIEW_MAP[viewName]) {
    console.warn(`[Router] 未找到视图：${viewName}`);
    return;
  }

  // 记录历史
  if (pushHistory && _currentView) {
    _history.push({ view: _currentView, params: _currentParams });
  }

  _currentView = viewName;
  _currentParams = params;

  // 更新底部导航高亮（只对底部导航视图生效）
  const navViews = ['trainingCamp', 'magicMachine', 'challenge', 'growth'];
  document.querySelectorAll('#bottom-nav .nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewName);
  });

  // 非训练营视图：清空顶部 header（训练进度只在训练营显示）
  if (viewName !== 'trainingCamp') {
    const header = document.getElementById('app-header');
    if (header) header.innerHTML = '';
  }

  // 滚动回顶部
  const content = document.getElementById('app-content');
  if (content) content.scrollTop = 0;

  // 加载并执行渲染函数
  try {
    const getRenderer = VIEW_MAP[viewName];
    const renderer = await getRenderer();
    if (typeof renderer === 'function') {
      renderer(params);
    }
  } catch (err) {
    console.error(`[Router] 视图加载失败：${viewName}`, err);
  }
}

/**
 * 返回上一个视图
 * 若无历史则返回训练营首页
 */
async function goBack() {
  if (_history.length === 0) {
    navigate('trainingCamp', {}, false);
    return;
  }
  const prev = _history.pop();
  navigate(prev.view, prev.params, false);
}

/**
 * 获取当前视图名
 * @returns {string}
 */
function getCurrentView() {
  return _currentView;
}

/**
 * 获取当前视图参数
 * @returns {Object}
 */
function getCurrentParams() {
  return _currentParams;
}

/* 挂到 window，所有视图可直接调用 */
window.__router = { navigate, goBack, getCurrentView, getCurrentParams };

export { navigate, goBack, getCurrentView, getCurrentParams };
