/**
 * js/sfx.js
 * ─────────────────────────────────────────────────────────────
 * UI 音效封装
 * 资源：assets/sfx/ 下 5 个免费音效（Mixkit License）
 * 使用：sfx.play('correct')
 * ─────────────────────────────────────────────────────────────
 */

const SFX_FILES = {
  correct:  'assets/sfx/correct.mp3',   // 答对清脆叮
  wrong:    'assets/sfx/wrong.mp3',     // 答错柔和咚
  stage:    'assets/sfx/stage.mp3',     // 阶段（A/B/C 完成）
  complete: 'assets/sfx/complete.mp3',  // 整体完成（D 写作页前）
  submit:   'assets/sfx/submit.mp3',    // 作文提交评分通过
};

/* 预加载：减少首次播放延迟 */
const _cache = new Map();
function _ensureLoaded(name) {
  if (_cache.has(name)) return _cache.get(name);
  const path = SFX_FILES[name];
  if (!path) return null;
  const audio = new Audio(path);
  audio.preload = 'auto';
  _cache.set(name, audio);
  return audio;
}

/**
 * 播放一个音效
 * - 同一时刻可以多个音效叠加（不互相覆盖，对答对叮+撒花呼啦友好）
 * - 静默忽略错误（用户没打开声音权限时不报错）
 */
export function play(name, opts = {}) {
  if (typeof window === 'undefined') return;
  const cached = _ensureLoaded(name);
  if (!cached) return;
  // 克隆一份避免重叠播放被截断
  const audio = cached.cloneNode();
  audio.volume = opts.volume ?? 0.6;
  audio.play().catch(() => {});
}

/* 预加载所有音效（让用户首次互动时延迟最小） */
export function preloadAll() {
  for (const name of Object.keys(SFX_FILES)) {
    _ensureLoaded(name);
  }
}
