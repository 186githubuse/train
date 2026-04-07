# Codebase Structure

_Generated: 2026-04-08_

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
│   ├── store.js            # Global state + localStorage persistence
│   ├── config.js           # API keys (AI / Vision) — NOT committed ideally
│   └── data/               # Static data — pure exports, no DOM
│       ├── lessons.js      # 10 Lesson objects
│       ├── questions.js    # 180 questions + generateQuizSet() / pickRandomQuestions()
│       ├── topics.js       # 5 topic stubs (all comingSoon)
│       └── courseLogic.js  # Domain logic: radar scores, ability titles
│
├── views/                  # One file per route/screen
│   ├── onboarding.js       # Registration / login (3-step flow)
│   ├── trainingCamp.js     # Main map view (basic lessons + topic tabs)
│   ├── lessonDetail.js     # Lesson detail: video placeholder + key points
│   ├── quiz.js             # Adaptive quiz: question + options + feedback
│   ├── challenge.js        # Timed challenge mode (10 random questions)
│   ├── magicMachine.js     # AI writing assistant (guided sense prompts)
│   ├── report.js           # Growth report: radar chart + progress stats
│   ├── mistakeBook.js      # Wrong-answer review list
│   └── medalHall.js        # Achievement badges display
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
│       └── medalHall.css
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
- Key files: `lessons.js`, `questions.js`, `courseLogic.js`
- Note: `topics.js` is a stub; all 5 topics have `comingSoon: true` and `lessonCount: 0`

**`views/`:**
- Purpose: One module per screen; each exports a single `render*()` function
- Contains: HTML string builders, event listener setup, page-scoped `let` state
- Key files: `trainingCamp.js` (main entry), `quiz.js` (core learning loop)

**`css/`:**
- Purpose: All styling; no CSS-in-JS, no Tailwind config file
- Contains: Global tokens in `style.css`, reusable classes in `components.css`, view-specific overrides in `views/`
- Note: `trainingCamp`, `lessonDetail`, and `quiz` views have no dedicated CSS file — they rely on `style.css` + `components.css` + inline Tailwind classes

**`memory/`:**
- Purpose: Persistent AI assistant session notes
- Generated: No (manually maintained)
- Committed: Yes

## Key File Locations

**Entry Points:**
- `index.html`: Browser entry — shell DOM, CDN imports, mounts `js/main.js`
- `js/main.js`: JS entry — wires nav, registers globals, calls first `navigate()`

**Configuration:**
- `js/config.js`: AI API base URL, keys, model names
- `index.html` (inline `<script>`): Tailwind theme extension (border radius, backdrop blur)

**Core Logic:**
- `js/router.js`: `VIEW_MAP`, `navigate()`, `goBack()`
- `js/store.js`: All state mutations and `localStorage` I/O
- `js/data/courseLogic.js`: Ability scoring, radar chart data, sense-to-lesson mapping

**Testing:**
- Not present — no test files or test runner configured

## Naming Conventions

**Files:**
- View modules: camelCase matching the route key — `trainingCamp.js` matches `VIEW_MAP.trainingCamp`
- Data modules: camelCase noun — `lessons.js`, `questions.js`
- CSS view overrides: camelCase matching view name — `mistakeBook.css`

**Exported functions:**
- View render functions: `render` + PascalCase view name — `renderTrainingCamp`, `renderQuiz`
- Data exports: SCREAMING_SNAKE_CASE constants — `LESSONS`, `QUESTIONS`, `TOPICS`
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
3. If the view needs custom styles beyond Tailwind + components.css, create `css/views/newViewName.css` and add `<link>` in `index.html`
4. If it's a bottom-nav tab, add a `<button class="nav-item" data-view="newViewName">` in `index.html` and add the name to `navViews` array in `router.js`

**New data:**
- Static lesson/question data: edit `js/data/lessons.js` or `js/data/questions.js`
- New domain logic (scoring, mapping): add to `js/data/courseLogic.js`
- New topic stubs: add to `js/data/topics.js`

**New store state:**
- Add field to `DEFAULT_STATE` in `js/store.js`
- Add getter/setter methods to the `store` object
- If ephemeral (session-only), prefix with `_` and exclude from `_save()` like `_session`

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

*Structure analysis: 2026-04-08*
