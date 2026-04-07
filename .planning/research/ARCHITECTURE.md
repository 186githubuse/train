# Architecture Patterns: CloudBase Integration

**Domain:** Vanilla JS SPA → CloudBase migration
**Researched:** 2026-04-08
**Overall confidence:** MEDIUM (CloudBase docs partially inaccessible; patterns verified via official SDK CDN docs + cloud function HTTP trigger docs)

---

## Recommended Architecture

Keep the existing SPA shell intact. CloudBase slots in as a new layer beneath the existing `store.js` — the views never talk to CloudBase directly.

```
┌─────────────────────────────────────────┐
│  Views (trainingCamp, quiz, report …)   │  ← unchanged
└────────────────┬────────────────────────┘
                 │ read/write
┌────────────────▼────────────────────────┐
│  store.js  (existing API surface)       │  ← add cloud sync methods
│  + cloudStore.js  (new thin adapter)    │
└────────────────┬────────────────────────┘
                 │ SDK calls
┌────────────────▼────────────────────────┐
│  CloudBase Web SDK  (CDN script tag)    │
│  auth  |  database  |  callFunction     │
└────────────────┬────────────────────────┘
                 │ HTTP trigger
┌────────────────▼────────────────────────┐
│  Cloud Functions (Node.js)              │
│  ai-proxy  |  data-migrate              │
└─────────────────────────────────────────┘
```

---

## Component Boundaries

| Component | Stays Client | Moves to Cloud | Notes |
|-----------|-------------|----------------|-------|
| Routing / views | ✓ all of it | — | No change |
| store.js public API | ✓ keep as-is | — | Views keep same call signatures |
| localStorage read/write | ✓ keep as fallback | — | Offline / pre-login safety net |
| User identity | — | CloudBase Auth | Phone + WeChat login |
| lessonProgress, mistakes, challengeRecords | ✓ local cache | CloudBase DB (source of truth) | Dual-write pattern |
| abilityIndex | ✓ local cache | CloudBase DB | Sync on session end |
| AI API keys | — | Cloud Function env vars | Never in client code |
| AI proxy logic | — | Cloud Function `ai-proxy` | fetch → cloud fn → external API |
| js/config.js | DELETE after migration | — | Remove keys from client entirely |

---

## SDK Integration (No Build Step)

Load CloudBase before `js/main.js` in `index.html`:

```html
<!-- CloudBase Web SDK — pin version in production -->
<script src="https://static.cloudbase.net/cloudbase-js-sdk/2.x.x/cloudbase.full.js"></script>
<script type="module" src="js/main.js"></script>
```

Initialize once in a new `js/cloudbase.js` module (loaded as a regular script, not ES module, because the SDK attaches to `window.cloudbase`):

```js
// js/cloudbase.js  — plain script, not ES module
const tcb = cloudbase.init({
  env: 'your-env-id',        // from CloudBase console
  region: 'ap-shanghai'      // must match env region
});

window.__tcb = tcb;
window.__tcbAuth = tcb.auth({ persistence: 'local' });
window.__tcbDB  = tcb.database();
```

Then in ES module files, access via `window.__tcb` / `window.__tcbAuth` / `window.__tcbDB`. This sidesteps the ES module / global script boundary cleanly.

---

## Data Flow: Dual-Write Pattern

The safest migration keeps localStorage as a local cache and CloudBase as the remote source of truth. No big-bang rewrite needed.

```
User action
    │
    ▼
store.someMethod()          ← existing call, unchanged
    │
    ├─► localStorage._save()   (immediate, synchronous — keeps offline working)
    │
    └─► cloudStore.sync()      (async, fire-and-forget while logged in)
              │
              ▼
         tcbDB.collection('userProgress').doc(uid).update(...)
```

On app boot, after login resolves:

```
cloudStore.pull(uid)
    │
    ▼
merge remote data into _state  (remote wins on conflict)
    │
    ▼
localStorage._save(_state)     (local cache updated)
```

---

## Data Migration: localStorage → CloudBase on First Login

Run once, on the first successful login where `cloudMigrated` flag is absent.

```js
// js/cloudStore.js
export async function migrateIfNeeded(uid) {
  const state = store._getRawState();
  if (state.cloudMigrated) return;          // already done

  const existing = await window.__tcbDB
    .collection('userProgress')
    .doc(uid)
    .get();

  if (existing.data && existing.data.length > 0) {
    // Remote record exists — pull it, don't overwrite
    store._mergeState(existing.data[0]);
  } else {
    // First login ever — push local data up
    await window.__tcbDB
      .collection('userProgress')
      .doc(uid)
      .set({ ...state, uid, migratedAt: Date.now() });
  }

  store._setFlag('cloudMigrated', true);
}
```

Call this immediately after `auth.signIn()` resolves, before routing to the first view.

---

## Cloud Function: AI Proxy

Structure the proxy as a single HTTP-trigger cloud function. One function handles both Claude and Gemini to minimize cold-start surface.

```
cloudbase/
  functions/
    ai-proxy/
      index.js      ← handler
      package.json  ← { "dependencies": {} }  (use built-in https, no axios needed)
```

```js
// functions/ai-proxy/index.js
const https = require('https');

exports.main = async (event) => {
  const CORS = {
    'Access-Control-Allow-Origin': 'https://your-domain.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }

  const { provider, payload } = JSON.parse(event.body);

  // Keys live in CloudBase environment variables — never in code
  const key = provider === 'claude'
    ? process.env.CLAUDE_API_KEY
    : process.env.GEMINI_API_KEY;

  const upstream = provider === 'claude'
    ? 'https://ai.itlsj.com/v1/messages'       // existing proxy
    : 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash:generateContent';

  const result = await callUpstream(upstream, key, payload);

  return {
    statusCode: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
    body: JSON.stringify(result),
  };
};
```

Client call (replaces direct fetch in `magicMachine.js`):

```js
const res = await fetch(
  'https://<env-id>.ap-shanghai.app.tcloudbase.com/ai-proxy',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: 'claude', payload: { ... } }),
  }
);
```

Set `CLAUDE_API_KEY` and `GEMINI_API_KEY` in CloudBase console → Cloud Functions → Environment Variables. They never appear in client code.

---

## Database Collections

| Collection | Document key | Fields | Notes |
|------------|-------------|--------|-------|
| `userProgress` | `uid` (one doc per user) | `lessonProgress`, `mistakes`, `challengeRecords`, `abilityIndex`, `user` | Full store snapshot |
| `users` | `uid` | `phone`, `name`, `grade`, `createdAt` | Auth metadata only |

Single-document-per-user is the right call here. The data volume is small (< 50KB per user), and it maps directly to the existing `_state` shape — no schema redesign needed.

---

## Auth Flow

```
App boot
  │
  ├─ tcbAuth.getLoginState() → logged in?
  │     YES → migrateIfNeeded(uid) → route to trainingCamp
  │     NO  → route to login view
  │
Login view
  │
  ├─ Phone: sendSmsCode(phone) → user enters code → signInWithSmsCode(phone, code)
  │
  └─ WeChat: signInWithWechat() → OAuth redirect → callback → migrateIfNeeded(uid)
```

The existing `onboarding.js` / login view only needs its submit handler swapped from `store.setUser()` to `tcbAuth.signIn*()` + `migrateIfNeeded()`.

---

## Build Order

1. **SDK scaffold** — Add CDN script tag, `js/cloudbase.js` init, verify `window.__tcb` exists. No feature change yet.

2. **Auth** — Wire phone login (SMS code flow) to CloudBase Auth. Keep localStorage user fields as fallback. Test login/logout cycle.

3. **AI proxy cloud function** — Deploy `ai-proxy`, update `magicMachine.js` to call it, delete `js/config.js`. This is the highest-security-risk item and should be done before any real users.

4. **Data sync** — Add `cloudStore.js` with `migrateIfNeeded()` + dual-write. Test migration path with a real device.

5. **WeChat login** — Add after phone login is stable. Requires WeChat Open Platform config in CloudBase console.

6. **Admin/teacher view** — Separate concern; can query `userProgress` collection directly from a simple admin page.

---

## Anti-Patterns to Avoid

### Calling CloudBase DB directly from views
Views should never import `window.__tcbDB` directly. All data access goes through `store.js` → `cloudStore.js`. This keeps the abstraction layer intact and makes offline fallback trivial.

### Big-bang localStorage removal
Don't remove localStorage on day one. Keep it as the local cache indefinitely — it makes the app work offline and speeds up boot (no waiting for DB round-trip on every launch).

### Storing API keys in cloud function code
Keys go in CloudBase environment variables only. The function code itself can be read by anyone with console access.

### One cloud function per AI provider
Avoid `claude-proxy` and `gemini-proxy` as separate functions. One `ai-proxy` with a `provider` param means one cold-start pool, one CORS config, one deploy.

### Blocking boot on cloud sync
`cloudStore.pull()` should never block the initial render. Boot from localStorage immediately, sync in background, update UI when sync resolves.

---

## Scalability Notes

| Concern | Now (< 500 users) | Later (5000+ users) |
|---------|-------------------|---------------------|
| DB reads | One doc per user, fine | Still fine — single-doc pattern scales |
| AI proxy cold starts | Acceptable | Consider keeping function warm with scheduled ping |
| Auth tokens | Managed by SDK | No action needed |
| localStorage conflicts | N/A (one device typical) | Multi-device: remote always wins on pull |

---

## Sources

- CloudBase Web SDK CDN init: `https://docs.cloudbase.net/api-reference/webv2/initialization` (MEDIUM confidence — partial doc access)
- CloudBase HTTP cloud functions: `https://docs.cloudbase.net/cloud-function/introduce` (MEDIUM confidence — verified response format)
- CloudBase Auth methods: `https://docs.cloudbase.net/authentication-v2/auth/introduce` (MEDIUM confidence — verified method list)
- Existing codebase architecture: `.planning/codebase/ARCHITECTURE.md` (HIGH confidence — direct source)
- PROJECT.md constraints and decisions: `.planning/PROJECT.md` (HIGH confidence — direct source)
