# Domain Pitfalls

**Domain:** Chinese K-12 education web app (writing training, primary school)
**Researched:** 2026-04-08
**Confidence:** MEDIUM — compliance rules from PIPL/CAC official sources (HIGH); China-specific Android performance from Chrome team guidance (MEDIUM); migration pitfalls from web.dev + model knowledge (MEDIUM); AI content rules from known regulatory framework (MEDIUM, verify against latest CAC updates before launch)

---

## Critical Pitfalls

### Pitfall 1: API Keys in Client JS — Already Exploitable
**What goes wrong:** `js/config.js` contains Claude and Gemini proxy keys in plaintext. Any user opening DevTools can extract them. The project has no `.gitignore`, so the file may already be in git history.
**Why it happens:** Fast prototyping shortcut that was never cleaned up.
**Consequences:** Keys get scraped by bots within hours of public launch. API costs spike uncontrollably. No per-user attribution means you can't detect abuse. If keys are already in git history, rotating them is the only fix — the history can't be un-pushed.
**Prevention:**
1. `git log --all --full-history -- js/config.js` — if it appears, rotate both keys immediately.
2. Add `.gitignore` entry for `js/config.js` before any further commits.
3. Move all AI calls to a CloudBase Function. Frontend calls your function; your function holds the key server-side.
4. Add per-user rate limiting in the CloudBase Function (e.g., max 10 AI calls/day per uid).
**Detection:** Unexpected API billing spikes; calls from non-Chinese IPs.

---

### Pitfall 2: PIPL — Collecting Minors' Data Without Parental Consent
**What goes wrong:** China's Personal Information Protection Law (PIPL, 2021) classifies all personal data of children under 14 as "sensitive personal information." Processing it requires separate, specific, verifiable parental consent — not bundled into general terms of service.
**Why it happens:** Teams treat consent as a checkbox in a terms modal. PIPL requires it to be a distinct, affirmative act by a parent/guardian, not the child.
**Consequences:** Regulatory investigation by CAC. Fines up to 5% of annual revenue. App forced offline. For a school-facing product, reputational damage with teachers and parents is severe and hard to recover from.
**Prevention:**
- During registration, collect the child's age/grade. If under 14, require a parent phone number and send a verification SMS to that number (not the child's).
- Store consent records with timestamp, parent contact, and consent version.
- Privacy policy must explicitly list: what data is collected, why, retention period, and how parents can request deletion.
- Do not collect more than necessary — current store collects grade, name, learning progress, mistakes. Each field needs a stated purpose.
**Detection:** Registration flow that lets a 7-year-old self-register with no parental step is a compliance gap.

---

### Pitfall 3: ICP 备案 — App Goes Live Without Filing, Gets Blocked
**What goes wrong:** Any website or web app hosted on a Chinese server and accessible to Chinese users requires an ICP 备案 (filing) from MIIT. Operating without it means the hosting provider (Tencent Cloud) is legally required to take the site down. This is not a fine — it's a hard block.
**Why it happens:** Teams assume 备案 is only for large commercial sites, or underestimate the processing time (typically 20–30 working days, sometimes longer).
**Consequences:** Launch blocked. If you go live before 备案 completes, Tencent Cloud will suspend the domain. The PROJECT.md already notes "备案后启动上线改造" — this is the right call, but the timeline risk is real.
**Prevention:**
- Start 备案 application the moment the domain and server are confirmed. Do not wait until code is ready.
- ICP 备案 (informational) is the minimum. If the app charges fees or has user-generated content, an ICP License (经营性ICP许可证) may also be required — verify with a local legal advisor.
- The domain must be registered under the same entity as the 备案 applicant.
- Keep a copy of the 备案 number and display it in the footer (legally required).
**Detection:** Tencent Cloud console will show 备案 status. No 备案 number = not compliant.

---

### Pitfall 4: AI Content Safety — Generated Essays Not Screened for Minors
**What goes wrong:** The 魔法机器 uses Claude Haiku to generate essays from student sensory inputs. China's Interim Measures for the Management of Generative AI Services (生成式人工智能服务管理暂行办法, effective August 2023) require that AI-generated content comply with socialist core values, not contain harmful content, and that providers take responsibility for outputs served to users.
**Why it happens:** The proxy (`ai.itlsj.com`) handles the API call, but there is no content filtering layer between the AI response and what the student sees.
**Consequences:** A single inappropriate AI output shown to a primary school student creates legal liability and destroys trust with schools and parents. CAC can require the service to suspend.
**Prevention:**
- Add a server-side content filter in the CloudBase Function before returning AI output to the client. At minimum, run a keyword blocklist against the response.
- System prompt must explicitly instruct the model: output is for primary school students aged 6–12, must be age-appropriate, no violence/politics/adult content.
- Log all AI inputs and outputs server-side for audit purposes (CAC can request logs).
- Consider adding a "report this essay" button so teachers/parents can flag bad outputs.
**Detection:** No filtering layer between AI response and DOM render in current `views/magicMachine.js`.

---

### Pitfall 5: localStorage → Cloud Migration Causes Silent Data Loss
**What goes wrong:** When the app switches from localStorage to CloudBase, existing users' progress (lessons passed, stars, mistakes, ability index) lives only in their browser. If the migration is not handled explicitly, that data is abandoned.
**Why it happens:** The migration is treated as a backend task ("just start writing to the cloud"), but the client-side data is never read and uploaded.
**Consequences:** Users who tested the app lose all progress on first login after the update. For a school context where teachers have been demoing the app, this is a visible failure.
**Prevention:**
1. On first login after cloud launch, read `localStorage['ganjue_training_state']`, upload it to CloudBase under the user's uid, then set a flag `migrated: true`.
2. Use a write-to-both phase: write to localStorage AND cloud simultaneously for at least one release cycle before deprecating local writes.
3. Never clear localStorage until the server has acknowledged the write with a success response.
4. Handle the case where the user is offline during migration — queue the upload and retry on next session.
5. Schema migration: the localStorage flat structure may not map 1:1 to CloudBase collections. Define the mapping explicitly before writing migration code.
**Detection:** After launch, monitor CloudBase for users with empty progress records who have non-zero localStorage data.

---

## Moderate Pitfalls

### Pitfall 6: Course Unlock `return true` Shipped to Production
**What goes wrong:** `js/store.js` line 209 has `return true` bypassing all unlock logic. It's a one-line change that's easy to forget.
**Prevention:** Add a build-time check or a prominent `// TODO: REMOVE BEFORE LAUNCH` comment with a grep-able marker. Better: use a `DEV_MODE` flag in `config.js` that gates the bypass, so it can never accidentally be `true` in production config.

---

### Pitfall 7: Star Farming Exploit Undermines Gamification
**What goes wrong:** Challenge mode awards 15 stars unconditionally on completion, with no cooldown. Users (or curious parents) can farm stars in minutes, making the badge/title system meaningless.
**Prevention:** Gate the reward on a minimum score threshold (e.g., ≥ 60% correct) AND a daily cooldown per user uid (stored in CloudBase, not localStorage — localStorage can be cleared to reset the cooldown). See `CONCERNS.md` issue #6.

---

### Pitfall 8: Ability Index Initialized to Grade Number
**What goes wrong:** A grade-6 student starts with `abilityIndex = 6`, which is above the system's 5.0 ceiling. The adaptive difficulty system immediately serves level-3 questions to a student who may be a beginner.
**Prevention:** Decouple initialization from grade. Use a fixed starting value (e.g., 2.0) or a grade-to-index mapping: grades 1–3 → 1.5, grades 4–6 → 2.5, grades 7–9 → 3.5. See `CONCERNS.md` issue #13.

---

### Pitfall 9: CDN Tailwind Without Version Lock
**What goes wrong:** `https://cdn.tailwindcss.com` (no version) pulls the latest Tailwind on every load. A breaking change in Tailwind CSS silently breaks the entire app's layout with no code change on your part.
**Prevention:** Lock to a specific version: `https://cdn.tailwindcss.com/3.4.1`. Test the locked version before launch. Long-term, self-host the CSS file in the repo to eliminate the CDN dependency entirely.

---

### Pitfall 10: `window.__store._reset()` Accessible in Production
**What goes wrong:** The entire store object, including `_reset()`, is mounted on `window.__store`. Any user in DevTools can wipe their own (or, in a shared device scenario, another student's) progress.
**Prevention:** In production, do not mount `window.__store`. Gate it behind `DEV_MODE` flag. See `CONCERNS.md` issue #14.

---

### Pitfall 11: Low-End Android Performance — CSS Animations and CDN Latency
**What goes wrong:** Chinese school environments commonly use budget Android tablets and phones (Redmi, OPPO A-series, sub-¥1000 devices) with weak CPUs and constrained RAM. The app uses CSS backdrop-filter (liquid glass effect), multiple simultaneous animations, and loads Tailwind + Phosphor Icons from CDN on every cold start.
**Why it happens:** Development happens on MacBooks; performance issues only surface on target hardware.
**Consequences:** Janky animations, slow first paint, and CDN timeouts (unpkg and cdn.tailwindcss.com can be slow or intermittently blocked in some school network environments) make the app feel broken.
**Prevention:**
- Test on a real budget Android device (or Chrome DevTools with CPU 4x slowdown + Slow 3G throttling) before launch.
- `backdrop-filter: blur()` is GPU-expensive — verify it doesn't cause frame drops on low-end hardware. Have a fallback that disables it if `matchMedia('(prefers-reduced-motion)')` or a performance heuristic triggers.
- Self-host Tailwind CSS and Phosphor Icons to eliminate CDN dependency and reduce cold-start latency.
- Lazy-load view JS files only when navigated to (the router already does this — verify it's working correctly).
- Total JS parse + execute budget for low-end Android: aim for under 200KB uncompressed across all initially loaded scripts.
**Detection:** Lighthouse audit with "Mobile" preset and CPU throttling enabled. Target LCP < 3s on simulated mid-range Android.

---

### Pitfall 12: Video Playback on Tencent COS Without Hotlink Protection
**What goes wrong:** COS bucket URLs are currently public. Anyone who finds the video URL can download or hotlink the videos, consuming your bandwidth quota and potentially redistributing paid course content.
**Prevention:** Enable COS hotlink protection (防盗链) to whitelist only your app's domain. For paid content, use signed URLs with expiry (腾讯云 COS 临时密钥/预签名URL).

---

## Minor Pitfalls

### Pitfall 13: Event Listener Leak on Tab Switch
**What goes wrong:** `trainingCamp.js` adds a new click listener every time the tab is rendered without removing the old one. After 5 tab switches, one click fires 5 handlers.
**Prevention:** Store the handler reference and call `removeEventListener` before re-adding, or use `{ once: true }` with re-bind on render. See `CONCERNS.md` issue #12.

---

### Pitfall 14: Double Mistake Recording
**What goes wrong:** `quiz.js` calls `store._addMistake()` directly after `store.advanceSession()` already calls it internally. The dedup logic masks the bug but the code is fragile.
**Prevention:** Remove the direct call in `quiz.js`. Only call `store.advanceSession()`. See `CONCERNS.md` issue #5.

---

### Pitfall 15: No `.gitignore` — Secrets Can Be Committed
**What goes wrong:** There is no `.gitignore` in the repo. `js/config.js` has a comment saying "don't commit this" but nothing enforces it. A `git add .` will include it.
**Prevention:** Add `.gitignore` immediately with at minimum: `js/config.js`, `.DS_Store`, `memory/`. Check git history for past commits of `config.js`.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| CloudBase integration | localStorage migration data loss | Write-to-both phase; explicit migration on first login |
| User registration | PIPL parental consent for under-14 | Separate parent verification step; consent records |
| AI essay generation | Unfiltered content shown to minors | Server-side keyword filter + strict system prompt |
| ICP 备案 | Launch blocked if filed late | File immediately when domain/server confirmed |
| Production deploy | `return true` unlock bypass shipped | DEV_MODE flag; grep check in deploy checklist |
| Star/badge system | Farming exploit via challenge mode | Score threshold + daily cooldown in CloudBase |
| Video hosting | COS bandwidth abuse | Hotlink protection + signed URLs |
| Low-end Android | CDN latency + animation jank | Self-host assets; test on budget hardware |

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| PIPL / minors data rules | HIGH | PIPL text is public; under-14 = sensitive data is explicit in Article 28 |
| ICP 备案 requirement | HIGH | Standard requirement for all China-hosted web services |
| AI content rules (AIGC) | MEDIUM | 2023 Interim Measures are in effect; verify latest CAC guidance before launch |
| 未成年人网络保护条例 specifics | MEDIUM | 2023 regulation exists and is in effect; exact article citations need legal review |
| localStorage migration pitfalls | HIGH | Standard web engineering, verified against web.dev |
| Low-end Android performance | MEDIUM | Chrome guidance + general knowledge; test on real hardware to confirm |
| COS hotlink / video security | MEDIUM | Standard Tencent Cloud feature; verify current COS console options |

---

## Sources

- PIPL Article 28 (sensitive personal information, minors under 14): official PIPL text, 2021
- China's Interim Measures for the Management of Generative AI Services (生成式人工智能服务管理暂行办法), CAC, effective 2023-08-15
- web.dev/articles/storage-for-the-web — localStorage limitations and migration risks
- Chrome Lighthouse performance scoring documentation — TBT/LCP/CLS weights for low-end device simulation
- Codebase audit: `.planning/codebase/CONCERNS.md` (2026-04-08) — issues #1–15
- Project context: `.planning/PROJECT.md` — confirmed constraints and known issues
