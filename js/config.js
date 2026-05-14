/**
 * js/config.js
 * ─────────────────────────────────────────────────────────────
 * API 配置
 * ⚠️  不要把这个文件提交到 git！
 * ─────────────────────────────────────────────────────────────
 */

// 主模型（文本对话/选项生成/作文评分）
// comfly + OpenAI 兼容格式
export const API_CONFIG = {
  baseUrl:  'https://ai.comfly.chat',
  apiKey:   'sk-cO3Bawu82xyawvDAaPAket8GKFj9rFIvWZLFqc1EX3T1VmZs',
  model:    'gpt-4o-mini',
  format:   'openai',  // 标记：调用方按 OpenAI /v1/chat/completions 格式发请求
};

// 图片识别专用（Gemini，速度更快）—— 依然走原 itlsj
export const VISION_CONFIG = {
  baseUrl:  'https://ai.itlsj.com',
  apiKey:   'sk-SYBz0MI3HsTqvcs69nvleCt6hPB0MMLrgcjLN13ph7RwMbIG',
  model:    'gemini-3-flash-preview-all',
  format:   'anthropic',  // Gemini 代理成 Anthropic 格式
};
