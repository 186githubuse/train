# Codebase Structure

_Generated: 2026-04-08 · Updated: 2026-05-14_

## Summary

Flat, feature-grouped layout with no build output directory. Source files are served directly from the repo root via a local HTTP server. CSS is split into global layers and per-view overrides; JS is split into core infrastructure (`js/`) and view modules (`views/`).

## Directory Layout

```
杨老师作文训练营/
├── index.html              # App shell — only HTML file served to browser
├── preview.html            # Standalone design preview (not part of app routing)
├── CLAUDE.md               # Project memory / instructions for AI assistant
│
├── js/                     # Core infrastructure (non-view JS)
│   ├── main.js             # App entry point
│   ├── router.js           # Client-side router + view registry
│   ├── store.js            # Global state + localStorage persistence (schemaVersion 2)
│   ├── config.js           # API keys (AI / Vision) — NOT committed ideally
│   └── data/               # Static data — pure exports, no DOM
│       ├── lessons.js      # 10 Lesson objects (course order updated 2026-05-14)
│       ├── courseLogic.js  # Domain logic: 15 sense points, prompts, ability scoring
│       ├── questions/      # Basic-training quiz bank (split into 10 files)
│       │   ├── index.js    # Aggregates Q01..Q10, exports QUESTIONS + helpers
│       │   └── q01.js .. q10.js   # 30 questions per lesson (D1×9+D2×9+D3×12 含 S/C/H 学段)，K1-D3-S01 编码
│       └── topics/         # Topic-training quiz bank
│           ├── index.js    # 6 topic modules entry (only 静物 enabled)
│           └── jingwu/
│               ├── taideng.js  # Desk lamp · typeA/B/C/D
│               ├── liushu.js   # Willow tree · typeA/B/C/D
│               ├── shubao.js   # Backpack · typeA/B/C/D
│               ├── bidai.js    # Pencil case · typeA/B/C/D
│               └── gaozhi.js   # Writing paper (deprecated · kept as archive, not wired)
│
├── views/                  # One file per route/screen
│   ├── onboarding.js       # Registration / login (3-step flow)
│   ├── trainingCamp.js     # Main map view (basic lessons + topic tabs)
│   ├── lessonDetail.js     # Lesson detail: video placeholder + key points
│   ├── quiz.js             # Adaptive quiz: question + options + feedback
│   ├── challenge.js        # Timed challenge mode (15 random questions)
│   ├── magicMachine.js     # AI writing assistant (guided sense prompts)
│   ├── report.js           # Growth report: radar chart + progress stats
│   ├── mistakeBook.js      # Wrong-answer review list
│   ├── medalHall.js        # Achievement badges display
│   ├── topicDetail.js      # Topic sub-content list
│   ├── topicQuiz.js        # Topic quiz (single/multi/judge/sort, 16:9 image)
│   └── topicCompose.js     # Topic compose-and-grade with AI scoring + OCR
│
├── css/
│   ├── style.css           # Global: reset, background, macaron color tokens, layout
│   ├── components.css      # Shared component classes (cards, buttons, nav, toast)
│   └── views/              # Per-view CSS (loaded eagerly in index.html <head>)
│       ├── onboarding.css
│       ├── challenge.css
│       ├── magicMachine.css
│       ├── mistakeBook.css
│       ├── report.css
│       ├── medalHall.css
│       └── topic.css       # Shared by topicDetail / topicQuiz / topicCompose
│
├── memory/                 # Project memory files for AI assistant sessions
├── .planning/              # GSD planning documents
│   └── codebase/           # Auto-generated codebase analysis docs
└── .claude/                # Claude Code local settings
```

## Directory Purposes

**`js/`:**
- Purpose: Infrastructure — routing, state, data, config
- Contains: Non-view JS modules only; no HTML generation here except `main.js` Toast
- Key files: `router.js`, `store.js`, `main.js`

**`js/data/`:**
- Purpose: Pure data and domain logic — no DOM, no side effects
- Contains: Exported constants and pure functions
- Key files: `lessons.js`, `courseLogic.js`, `questions/index.js`, `topics/index.js`
- Note: Quiz bank is split per lesson under `questions/q01.js`..`q10.js`. Each file declares `lessonId` matching its filename. Topics are split under `topics/<module>/<sub>.js`; 4 静物 sub-contents (台灯/柳树/书包/笔袋) are wired up via `typeA/B/C/D` schema. The other 5 top-level modules (植物/动物/景物/人物/事件) are placeholders. Old `jingwu/gaozhi.js` (type1/2/3 schema) is kept as archive but not imported.

**`views/`:**
- Purpose: One module per screen; each exports a single `render*()` function
- Contains: HTML string builders, event listener setup, page-scoped `let` state
- Key files: `trainingCamp.js` (main entry), `quiz.js` (core learning loop), `topicCompose.js` (AI grading + OCR)

**`css/`:**
- Purpose: All styling; no CSS-in-JS, no Tailwind config file
- Contains: Global tokens in `style.css`, reusable classes in `components.css`, view-specific overrides in `views/`
- Note: `trainingCamp`, `lessonDetail`, and `quiz` views have no dedicated CSS file — they rely on `style.css` + `components.css` + inline Tailwind classes. The three `topic*` views share `css/views/topic.css`.

**`memory/`:**
- Purpose: Persistent AI assistant session notes
- Generated: No (manually maintained)
- Committed: Yes

## Key File Locations

**Entry Points:**
- `index.html`: Browser entry — shell DOM, CDN imports, mounts `js/main.js`
- `js/main.js`: JS entry — wires nav, registers globals, calls first `navigate()`

**Configuration:**
- `js/config.js`: AI API base URL, keys, model names. Two configs: `API_CONFIG` (comfly + gpt-4o-mini, OpenAI-compatible) and `VISION_CONFIG` (itlsj + gemini-3-flash-preview-all, Anthropic-compatible). Imports must use `?v=YYYYMMDD` cache-buster.
- `index.html` (inline `<script>`): Tailwind theme extension (border radius, backdrop blur)

**Core Logic:**
- `js/router.js`: `VIEW_MAP`, `navigate()`, `goBack()`. `viewsWithHeader` whitelist controls which views render their own header.
- `js/store.js`: All state mutations and `localStorage` I/O. `SCHEMA_VERSION` constant; mismatched versions auto-clear storage.
- `js/data/courseLogic.js`: Ability scoring, radar chart data, sense-to-lesson mapping, AI quiz / magic machine prompts.

**Testing:**
- Not present — no test files or test runner configured

## Naming Conventions

**Files:**
- View modules: camelCase matching the route key — `trainingCamp.js` matches `VIEW_MAP.trainingCamp`
- Data modules: camelCase noun — `lessons.js`, per-lesson `q01.js` ... `q10.js`
- CSS view overrides: camelCase matching view name — `mistakeBook.css`

**Exported functions:**
- View render functions: `render` + PascalCase view name — `renderTrainingCamp`, `renderQuiz`, `renderTopicQuiz`
- Data exports: SCREAMING_SNAKE_CASE constants — `LESSONS`, `QUESTIONS`, `TOPICS`, `Q01`..`Q10`
- Store methods: camelCase verbs — `getProgress()`, `passLesson()`, `advanceSession()`

**CSS classes:**
- Macaron color tokens: `macaron-rose`, `macaron-lavender`, `macaron-mint`, etc.
- Component classes: kebab-case — `nav-item`, `progress-bar-track`, `toast-item`
- View-scoped classes: kebab-case prefixed by view — `quiz-header`, `ob-page`, `lesson-video-section`

**DOM IDs:**
- Shell slots: `app`, `app-shell`, `app-header`, `app-content`, `bottom-nav`, `toast-container`
- Dynamic IDs injected by views: `quiz-streak`, `streak-count`, `lesson-video`

## Where to Add New Code

**New view/screen:**
1. Create `views/newViewName.js` — export `renderNewViewName(params)`
2. Add one line to `VIEW_MAP` in `js/router.js`: `newViewName: () => import('../views/newViewName.js').then(m => m.renderNewViewName)`
3. If the view renders its own header, add the name to `viewsWithHeader` array in `router.js`
4. If the view needs custom styles beyond Tailwind + components.css, create `css/views/newViewName.css` and add `<link>` in `index.html`
5. If it's a bottom-nav tab, add a `<button class="nav-item" data-view="newViewName">` in `index.html` and add the name to `navViews` array in `router.js`

**New data:**
- Static lesson data: edit `js/data/lessons.js` (note: when reordering courses, bump `SCHEMA_VERSION` in `store.js` and rename matching `q*.js` files + their internal `lessonId` and id prefixes so user progress doesn't misalign)
- Basic-training questions: edit the matching `js/data/questions/q<lessonId>.js`
- New topic sub-content: add `js/data/topics/<module>/<sub>.js`, then import + register in `js/data/topics/index.js`
- New domain logic (scoring, mapping): add to `js/data/courseLogic.js`

**New store state:**
- Add field to `DEFAULT_STATE` in `js/store.js`
- Add getter/setter methods to the `store` object
- If ephemeral (session-only), prefix with `_` and exclude from `_save()` like `_session`
- If the new field changes the meaning of existing data, bump `SCHEMA_VERSION`

**New shared component styles:**
- Add to `css/components.css` if reused across 2+ views
- Add to the view's own `css/views/*.css` if view-specific

**New global utility:**
- Add function to `js/main.js` and expose via `window.__utilName`
- Current globals: `window.__router`, `window.__showToast`, `window.__store`

## Special Directories

**`.planning/codebase/`:**
- Purpose: GSD auto-generated architecture and convention docs
- Generated: Yes (by GSD mapper)
- Committed: Yes

**`memory/`:**
- Purpose: AI assistant session memory (decisions, progress, next steps)
- Generated: No
- Committed: Yes

**`.claude/`:**
- Purpose: Claude Code local project settings
- Generated: Yes
- Committed: Partially (settings.local.json is modified)

---

*Structure analysis: 2026-04-08 · last reconciled with code: 2026-05-14*
