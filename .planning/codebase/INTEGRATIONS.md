# External Integrations
_Generated: 2026-04-08_

## Summary
Two AI API endpoints are used — one for text generation (Claude model) and one for image/vision analysis (Gemini model). Both are routed through a shared proxy base URL. All other functionality is local: no auth provider, no database, no analytics, no CDN for assets.

## APIs & External Services

**AI Text Generation:**
- Service: Claude (Anthropic-compatible API)
  - SDK/Client: raw `fetch` calls in `views/magicMachine.js` — `callClaude()`
  - Base URL: configured in `js/config.js` as `API_CONFIG.baseUrl` (`https://ai.itlsj.com`)
  - Model: `API_CONFIG.model` (claude-haiku-4-5-20251001)
  - Auth: `API_CONFIG.apiKey` — hardcoded in `js/config.js` (file marked as not-for-git)
  - Endpoint: `POST {baseUrl}/v1/messages`
  - Headers: `x-api-key`, `anthropic-version: 2023-06-01`
  - Used for: generating writing prompt options per sense dimension, composing final essays

**AI Vision / Image Analysis:**
- Service: Gemini (routed through same proxy)
  - SDK/Client: raw `fetch` calls in `views/magicMachine.js` — `callGeminiWithImage()`
  - Base URL: `VISION_CONFIG.baseUrl` (same proxy `https://ai.itlsj.com`)
  - Model: `VISION_CONFIG.model` (gemini-3-flash-preview-all)
  - Auth: `VISION_CONFIG.apiKey` — hardcoded in `js/config.js`
  - Endpoint: `POST {baseUrl}/v1/messages`
  - Payload: Anthropic messages format with `type: "image"` + `type: "text"` content blocks
  - Used for: analyzing user-uploaded/captured photos to extract essay topic context

**Icon CDN:**
- Service: unpkg.com
  - URL: `https://unpkg.com/@phosphor-icons/webcomponents@2.1`
  - Used for: rendering Phosphor icon web components throughout the UI

**CSS CDN:**
- Service: Tailwind CSS CDN
  - URL: `https://cdn.tailwindcss.com`
  - Used for: all utility CSS classes

## Data Storage

**Databases:**
- None — no remote database

**Local Storage:**
- Browser `localStorage`, key: `ganjue_training_state`
- Managed by `js/store.js`
- Stores: user profile, lesson progress, mistakes, challenge records
- Session state (`_session`) is explicitly excluded from persistence

**File Storage:**
- None — no file upload service
- Images captured for vision analysis are base64-encoded in memory only, never uploaded to storage

**Caching:**
- In-memory only: `_optionsCache` in `views/magicMachine.js` caches AI-generated options per step index within a session (not persisted)

## Authentication & Identity

**Auth Provider:** None
- No login, no accounts, no sessions
- User identity is a locally stored name + grade set during onboarding (`store.setUserProfile()`)
- `js/store.js` line 427: `localStorage.removeItem('ob_accounts')` suggests a prior or experimental account system was considered but is not active

## Monitoring & Observability

**Error Tracking:** None
- Errors logged to `console.error` only (e.g. `[Router] 视图加载失败`)
- API failures surface as thrown `Error` objects caught by callers

**Logs:**
- `console.log` / `console.warn` / `console.error` only
- Startup log: `感觉训练系统 v1.0.0 已启动` in `js/main.js`

## CI/CD & Deployment

**Hosting:** Not configured — static files only, deployable to any static host
**CI Pipeline:** None detected

## Webhooks & Callbacks

**Incoming:** None
**Outgoing:** None — all API calls are request/response, no webhooks

## Environment Configuration

**Config file:** `js/config.js` (marked do-not-commit)

**Values present:**
- `API_CONFIG.baseUrl` — AI proxy base URL
- `API_CONFIG.apiKey` — API key for Claude model
- `API_CONFIG.model` — Claude model identifier
- `VISION_CONFIG.baseUrl` — Vision proxy base URL (same host)
- `VISION_CONFIG.apiKey` — API key for Gemini model
- `VISION_CONFIG.model` — Gemini model identifier

**Security note:** Both API keys are currently hardcoded as string literals in `js/config.js`. Since this is a client-side app with no build step, these keys are visible to any user who opens DevTools. The proxy at `https://ai.itlsj.com` likely provides rate-limiting or key rotation as the mitigation layer.

---

*Integration audit: 2026-04-08*
