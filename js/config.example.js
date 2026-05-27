/**
 * js/config.example.js
 * ─────────────────────────────────────────────────────────────
 * API 配置模板 · 复制为 config.js 后填入真实 key
 * config.js 已在 .gitignore 中，不会被提交到 git
 * ─────────────────────────────────────────────────────────────
 */

// 主模型（文本对话/选项生成/作文评分）— comfly + OpenAI 兼容格式
export const API_CONFIG = {
  baseUrl:  'https://ai.comfly.chat',
  apiKey:   'sk-XXX',  // ← 你的 comfly API Key
  model:    'gpt-4o-mini',
  format:   'openai',
};

// 图片识别专用（Gemini）— itlsj
export const VISION_CONFIG = {
  baseUrl:  'https://ai.itlsj.com',
  apiKey:   'sk-XXX',  // ← 你的 itlsj API Key
  model:    'gemini-3-flash-preview-all',
  format:   'anthropic',
};

// MiniMax TTS（文字转语音）
// 控制台：https://platform.minimaxi.com
// 用 sk-api-* 格式新版 API Key，无需 GroupId
export const TTS_CONFIG = {
  baseUrl:  'https://api.minimaxi.com',
  apiKey:   'sk-api-XXX',  // ← 你的 MiniMax API Key
  model:    'speech-2.5-hd-preview',
  voiceId:  'female-tianmei',
};
