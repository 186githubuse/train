/**
 * js/config.js
 * ─────────────────────────────────────────────────────────────
 * API 配置
 * ⚠️  不要把这个文件提交到 git！
 * ─────────────────────────────────────────────────────────────
 */

export const API_CONFIG = {
  baseUrl:  'https://ai.comfly.chat',
  apiKey:   'sk-zaEFr9ZYkxsPEAl5yUXU1WcCsbUxFI0yxWK3HMN2rNHW4Xsp',
  model:    'claude-haiku-4-5-20251001',
};

// 图片识别专用（Gemini，速度更快）
export const VISION_CONFIG = {
  baseUrl:  'https://ai.comfly.chat',
  apiKey:   'sk-KngxpueN9AQqcKOTaCQ6Cr5ODuxTtIRs8yIWS32O5654nWld',
  model:    'gemini-3-pro-preview',
};
