/**
 * js/config.js
 * ─────────────────────────────────────────────────────────────
 * API 配置
 * ⚠️  不要把这个文件提交到 git！
 * ─────────────────────────────────────────────────────────────
 */

export const API_CONFIG = {
  baseUrl:  'https://ai.itlsj.com',
  apiKey:   'sk-rLFYM8GX2UrE4tePRSjEWJCDMl1knStoDyAUrPx458WatgBB',
  model:    'claude-haiku-4-5-20251001',
};

// 图片识别专用（Gemini，速度更快）
export const VISION_CONFIG = {
  baseUrl:  'https://ai.itlsj.com',
  apiKey:   'sk-SYBz0MI3HsTqvcs69nvleCt6hPB0MMLrgcjLN13ph7RwMbIG',
  model:    'gemini-3-flash-preview-all',
};
