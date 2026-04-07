# Technology Stack — Production Migration

**Project:** 杨老师感觉训练写作营
**Researched:** 2026-04-08
**Scope:** Vanilla JS PWA → Tencent CloudBase production

---

## Current State vs Target State

| Layer | Current | Target |
|-------|---------|--------|
| Auth | localStorage fake login | CloudBase SMS + WeChat OAuth |
| Database | localStorage (5MB cap) | CloudBase Firestore-style DB |
| AI proxy | API key hardcoded in `js/config.js` | CloudBase cloud function proxy |
| Offline | None | Service Worker (cache-first for assets) |
| Install | None | PWA manifest (Android Chrome only) |

---

## Recommended Stack

### CloudBase SDK

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `@cloudbase/js-sdk` | 2.27.2 (latest) | Auth + DB + callFunction | Official SDK, CDN-loadable, no build step needed |

CDN (no npm/build required — matches project constraint):
```html
<script src="https://static.cloudbase.net/cloudbase-js-sdk/latest/cloudbase.full.js"></script>
```

Pin to a specific version in production — `latest` can break on major bumps:
```html
<script src="https://static.cloudbase.net/cloudbase-js-sdk/2.27.2/cloudbase.full.js"></script>
```

Initialization (add to `js/config.js`, replace hardcoded keys):
```js
const app = cloudbase.init({
  env: 'your-env-id',        // from CloudBase console
  region: 'ap-shanghai',     // or ap-beijing — match your env region
  accessKey: 'your-publishable-key'  // requires SDK >= 2.21.0
});
```

The `accessKey` (Publishable Key) is safe to expose in client code — it is not a secret. It only grants access to resources your security rules permit.

---

### Auth

**Phone SMS login** — primary method for students:
```js
const auth = app.auth();

// Step 1: send code
await auth.sendSmsCode({ phoneNumber: '+8613800000000' });

// Step 2: verify
await auth.signInWithSmsCode({
  phoneNumber: '+8613800000000',
  smsCode: '123456'
});

// Step 3: get user
const user = auth.currentUser;  // { uid, phoneNumber, ... }
```

**WeChat OAuth** — enable in CloudBase console under 身份认证 → 登录方式 → 微信. The SDK handles the OAuth redirect flow; you call `auth.signInWithRedirect({ provider: 'wechat' })` and read the result on return.

Token management is automatic — access tokens refresh silently (2h expiry, 30d refresh token). No manual token handling needed.

---

### Database

Use CloudBase's document DB (Firestore-style). Suggested collections for this app:

| Collection | Documents | Notes |
|------------|-----------|-------|
| `users` | One per uid | grade, name, abilityIndex |
| `lessonProgress` | One per uid | keyed by lessonId |
| `mistakes` | One per mistake event | uid + questionId + timestamp |
| `challengeRecords` | One per attempt | uid + score + duration |

Basic CRUD pattern:
```js
const db = app.database();

// Write user progress
await db.collection('lessonProgress').doc(uid).set({ lessonId: 1, stars: 3 });

// Read
const result = await db.collection('lessonProgress').where({ uid }).get();

// Update single field
await db.collection('users').doc(uid).update({ abilityIndex: 3.2 });
```

Security rules: set per-collection in CloudBase console. Minimum rule: users can only read/write their own documents (`request.auth.uid == resource.data.uid`).

---

### Cloud Function — AI API Proxy

This is the critical security fix. Move all AI calls from client to a cloud function.

**Function structure** (`functions/ai-proxy/index.js`):
```js
const https = require('https');

exports.main = async (event, context) => {
  const { messages, model = 'claude-haiku-20240307' } = event;

  // API key lives here — never in client code
  const API_KEY = process.env.AI_API_KEY;
  const API_BASE = 'https://ai.itlsj.com';

  try {
    const response = await fetch(`${API_BASE}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({ model, messages })
    });

    const data = await response.json();
    return { code: 0, data };
  } catch (err) {
    return { code: -1, message: err.message };
  }
};
```

Set `AI_API_KEY` as an environment variable in the CloudBase console (云函数 → 函数配置 → 环境变量) — never hardcode it in function code.

**Client call** (replaces direct fetch in `js/views/magicMachine.js`):
```js
const result = await app.callFunction({
  name: 'ai-proxy',
  data: { messages, model: 'claude-haiku-20240307' }
});

if (result.result.code === 0) {
  const text = result.result.data.choices[0].message.content;
}
```

**Rate limiting:** Cloud functions have no built-in per-user rate limiting. For 5000 students, add a simple check: store last-call timestamp in DB and reject if < 10s ago. Without this, one student can spam the AI and exhaust your quota.

---

### PWA Setup

**What works in China mobile browsers:**

| Browser | SW Support | Install Prompt | Notes |
|---------|-----------|----------------|-------|
| Chrome Android | Full | Yes (beforeinstallprompt) | Best experience |
| Samsung Internet | Full | Yes | Common on Android |
| WeChat in-app browser | None / unreliable | No | WeChat intercepts browser chrome |
| UC Browser | Partial | No | SW may register but push/sync unreliable |
| QQ Browser | Partial | No | Similar to UC |
| iOS Safari | Partial (since iOS 11.3) | No (manual only) | No push, no background sync |

**Conclusion:** Build PWA for Chrome Android (the install prompt works). For WeChat users (likely majority of your traffic), the app runs as a normal web page — no install, no offline. Design accordingly.

**manifest.json** (place at project root):
```json
{
  "name": "杨老师感觉训练写作营",
  "short_name": "感觉训练营",
  "id": "/",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#fdf4ff",
  "theme_color": "#c084fc",
  "lang": "zh-CN",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

Link in `index.html` `<head>`:
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#c084fc">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
```

**Service Worker** — cache-first for static assets only. Keep it minimal:
```js
// sw.js
const CACHE = 'ganjue-v1';
const PRECACHE = [
  '/',
  '/css/style.css',
  '/js/main.js',
  '/js/router.js',
  '/js/store.js',
  // add other core JS files
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Cache-first for same-origin assets, network-first for API/CloudBase
  if (e.request.url.includes('cloudbase') || e.request.url.includes('ai.itlsj')) {
    return; // let network handle it
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
```

Register in `js/main.js`:
```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}
```

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Backend | Tencent CloudBase | Supabase, Firebase | CloudBase is China-hosted, no GFW issues; already decided |
| Auth | CloudBase SMS | Custom SMS (Aliyun) | CloudBase handles token lifecycle; less code |
| AI proxy | CloudBase cloud function | Separate Express server | No extra infra; same platform |
| PWA offline | Cache-first SW | Workbox | Workbox requires npm/build; project is no-build |
| DB migration | Parallel write (localStorage + CloudBase) | Hard cutover | Parallel write lets you roll back if CloudBase has issues |

---

## Migration Strategy

Do NOT do a hard cutover from localStorage to CloudBase in one step. Use parallel write:

1. On login: load from CloudBase, merge with localStorage (CloudBase wins on conflict)
2. On every write: write to both localStorage AND CloudBase
3. After 2 weeks stable: remove localStorage writes, read CloudBase only

This means students who used the app before login still have their progress, and you can roll back if CloudBase has issues.

---

## What NOT to Do

**Don't put API keys in client code.** `js/config.js` currently has `AI_API_KEY` exposed. Any student opening DevTools can see it and use it. Move to cloud function before launch.

**Don't use `latest` CDN tag in production.** Pin the SDK version. A breaking change in CloudBase SDK will silently break your app for all users.

**Don't cache CloudBase SDK calls in the service worker.** Auth tokens expire; caching API responses will serve stale/invalid data. Always let CloudBase traffic go to network.

**Don't assume WeChat users can install the PWA.** WeChat's in-app browser does not support `beforeinstallprompt`. If you show an install banner, detect the WeChat UA and hide it.

**Don't skip security rules.** CloudBase DB is open by default in development mode. Before launch, set rules so users can only access their own documents. Without this, any student can read every other student's data.

**Don't use anonymous login as a stepping stone.** It's tempting to let students start anonymously and link a phone later. CloudBase's anonymous-to-phone account linking has edge cases (duplicate accounts, lost progress). Start with phone login directly.

---

## Sources

- CloudBase JS SDK init docs: https://docs.cloudbase.net/api-reference/webv2/initialization (HIGH confidence)
- CloudBase auth SMS: https://docs.cloudbase.net/authentication-v2/auth/introduce (HIGH confidence)
- CloudBase DB CRUD: https://docs.cloudbase.net/api-reference/webv2/database (HIGH confidence)
- CloudBase cloud functions: https://docs.cloudbase.net/cloud-function/introduce (HIGH confidence)
- @cloudbase/js-sdk latest version 2.27.2: npm registry (HIGH confidence)
- PWA manifest requirements: https://web.dev/articles/add-manifest (HIGH confidence)
- WeChat browser SW support: multiple sources agree — no install prompt, unreliable SW (MEDIUM confidence — no single authoritative source, but consistent across community reports)
- China browser PWA landscape: training data + web.dev (MEDIUM confidence — verify against current browser release notes before launch)
