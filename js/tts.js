/**
 * js/tts.js
 * ─────────────────────────────────────────────────────────────
 * MiniMax TTS 文字转语音封装
 * 走 /v1/t2a_v2 接口，缓存音频 blob 到 sessionStorage 避免重复扣费
 * ─────────────────────────────────────────────────────────────
 */

import { TTS_CONFIG } from './config.js?v=20260528';

/* 内存缓存：text → ObjectURL，会话内同句话只生成一次 */
const _cache = new Map();
let _currentAudio = null;  // 当前正在播放的 Audio 实例，确保单声道

/* hex 字符串 → Uint8Array */
function hexToBytes(hex) {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return out;
}

/**
 * 调 TTS API，返回 ObjectURL（mp3 blob）
 * 同一段文字只调一次，之后命中缓存
 */
export async function ttsToUrl(text, opts = {}) {
  if (!text || !text.trim()) return null;

  const voiceId = opts.voiceId || TTS_CONFIG.voiceId;
  const speed = opts.speed || 1.0;
  const cacheKey = `${voiceId}::${speed}::${text}`;

  if (_cache.has(cacheKey)) return _cache.get(cacheKey);

  if (!TTS_CONFIG.apiKey) {
    console.warn('[tts] apiKey 未配置，跳过');
    return null;
  }

  const payload = {
    model: TTS_CONFIG.model,
    text,
    stream: false,
    voice_setting: { voice_id: voiceId, speed, vol: 1.0, pitch: 0 },
    audio_setting: { sample_rate: 32000, bitrate: 128000, format: 'mp3', channel: 1 },
  };

  try {
    const res = await fetch(`${TTS_CONFIG.baseUrl}/v1/t2a_v2`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TTS_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    const hex = data?.data?.audio;
    if (!hex) {
      console.warn('[tts] 无音频返回:', data?.base_resp);
      return null;
    }
    const bytes = hexToBytes(hex);
    const blob = new Blob([bytes], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    _cache.set(cacheKey, url);
    return url;
  } catch (e) {
    console.error('[tts] error', e);
    return null;
  }
}

/**
 * 播放一段文字（核心 API）
 * - 自动停掉前一句还没播完的
 * - 返回 Promise，resolve 在播放结束时
 */
export async function speak(text, opts = {}) {
  stopSpeaking();
  const url = await ttsToUrl(text, opts);
  if (!url) return;
  return new Promise(resolve => {
    const audio = new Audio(url);
    audio.volume = opts.volume ?? 1.0;
    _currentAudio = audio;
    audio.addEventListener('ended', () => {
      if (_currentAudio === audio) _currentAudio = null;
      resolve();
    });
    audio.addEventListener('error', () => {
      if (_currentAudio === audio) _currentAudio = null;
      resolve();
    });
    audio.play().catch(e => {
      console.warn('[tts] play failed', e);
      resolve();
    });
  });
}

/** 停掉当前播放 */
export function stopSpeaking() {
  if (_currentAudio) {
    try { _currentAudio.pause(); } catch (_) {}
    _currentAudio = null;
  }
}

/** 是否正在播放 */
export function isSpeaking() {
  return _currentAudio !== null && !_currentAudio.paused;
}
