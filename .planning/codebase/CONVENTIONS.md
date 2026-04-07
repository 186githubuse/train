# Coding Conventions

_Generated: 2026-04-08_

## Summary

Pure vanilla JS (ES Modules) + Tailwind CDN + custom CSS project. No build tools, no framework. Views are plain JS modules that render HTML strings into two fixed DOM slots (`#app-header`, `#app-content`). All conventions are consistent across the codebase and must be followed exactly when adding new code.

---

## Naming Patterns

**Files:**
- Views: `camelCase.js` — `views/trainingCamp.js`, `views/lessonDetail.js`, `views/mistakeBook.js`
- CSS: `camelCase.css` for view-specific — `css/views/mistakeBook.css`, `css/views/report.css`
- Data modules: `camelCase.js` — `js/data/lessons.js`, `js/data/questions.js`

**Exported render functions:**
- Always named `render` + PascalCase view name: `renderTrainingCamp`, `renderLessonDetail`, `renderQuiz`, `renderMistakeBook`, `renderReport`, `renderChallenge`
- One named export per view file, always the render function

**Private/internal functions:**
- Prefixed with nothing — just camelCase: `renderHeader`, `renderStars`, `bindEvents`, `handleCardClick`
- Private state variables: prefixed with `_` — `_activeTab`, `_lesson`, `_questions`, `_currentIdx`, `_answered`
- Private store internals: prefixed with `_` — `_state`, `_load`, `_save`, `_addMistake`

**Constants:**
- SCREAMING_SNAKE_CASE for module-level config: `DEFAULT_STATE`, `STORAGE_KEY`, `CHALLENGE_QUESTION_COUNT`, `GRADES`, `DIFFICULTY_TEXT`

**CSS classes:**
- BEM-like with view prefix: `quiz-header`, `quiz-option`, `quiz-option-selected`, `mb-card`, `mb-filter-bar`, `ch-page`, `ch-option`
- Global utility classes: `glass-card`, `back-btn`, `glass-btn`, `progress-track`, `progress-fill`
- Macaron color classes: `macaron-rose`, `macaron-lavender`, `macaron-mint`, `macaron-peach`, `macaron-sky`, `macaron-lemon`, `macaron-coral`, `macaron-lilac`, `macaron-teal`, `macaron-cherry`

---

## View Module Pattern

Every view follows this exact structure:

```js
// 1. Imports at top
import { store } from '../js/store.js';
import { LESSONS } from '../js/data/lessons.js';

// 2. Module-level state (private, prefixed with _)
let _activeTab = 'basic';

// 3. Private render helpers (return HTML strings)
function renderHeader(lesson) {
  return `<div class="...">...</div>`;
}

// 4. Private event handlers
function handleCardClick(e) { ... }

// 5. Single named export — the view entry point
export function renderTrainingCamp() {
  const header  = document.getElementById('app-header');
  const content = document.getElementById('app-content');
  header.innerHTML = renderHeader();
  content.innerHTML = `...`;
  // bind events after innerHTML set
}
```

All HTML is built as template literal strings. Views never use `document.createElement` for main content — only for overlays/modals (see `showProfilePanel` in `views/trainingCamp.js`).

---

## HTML Rendering Pattern

**Two DOM injection points only:**
- `document.getElementById('app-header').innerHTML = ...` — sticky header area
- `document.getElementById('app-content').innerHTML = ...` — scrollable main content

**Event binding:** Always after `innerHTML` is set. Use event delegation on container elements, not individual elements:

```js
// Correct — delegation on container
content.addEventListener('click', e => {
  const btn = e.target.closest('[data-action="start"]');
  if (!btn) return;
  ...
});

// Correct — data-action attribute pattern for interactive elements
<button data-action="start-quiz" data-lesson-id="${lesson.id}">开始答题</button>
```

**`{ once: true }` for one-shot listeners** (e.g., video ended, next-button click):
```js
nextBtn.addEventListener('click', handler, { once: true });
```

**`onclick` inline** is used in some views for simple navigation (report.js, mistakeBook.js, challenge.js):
```js
<button class="back-btn" onclick="window.__router.goBack()">
```
Prefer `data-action` delegation for new code; `onclick` is acceptable for simple single-action buttons.

---

## Global APIs (window-mounted)

Three globals are mounted on `window` and used across all views:

| Global | Source | Usage |
|--------|--------|-------|
| `window.__router` | `js/router.js` | `navigate(viewName, params)`, `goBack()` |
| `window.__showToast(msg, duration?)` | `js/main.js` | Show toast notification |
| `window.__store` | `js/store.js` | Debug only |

Always use optional chaining when calling `__showToast` from views:
```js
window.__showToast?.('未找到该课程');
```

Always use `window.__router.navigate(...)` (not the imported `navigate`) from within view HTML event handlers, since those run outside module scope.

---

## Import Organization

```js
// 1. Data modules
import { LESSONS, getLessonById } from '../js/data/lessons.js';
import { QUESTIONS } from '../js/data/questions.js';

// 2. Store
import { store } from '../js/store.js';

// 3. Logic helpers (if any)
import { calcSenseRadarScores } from '../js/data/courseLogic.js';
```

No third-party imports in view files — everything is local or CDN-loaded globally (Tailwind, Phosphor Icons).

---

## CSS Conventions

**Three CSS layers, loaded in this order in `index.html`:**
1. `css/style.css` — global base styles, macaron colors, animations, layout
2. `css/components.css` — reusable component classes (`glass-card`, `back-btn`, `glass-btn`, `badge`, `empty-state`)
3. `css/views/*.css` — view-specific styles, one file per view

**Tailwind utility classes** are used inline in HTML strings for spacing, typography, and flex layout. Custom CSS classes handle anything requiring pseudo-elements, animations, or complex selectors.

**Glass/blur pattern** (used everywhere):
```css
.some-card {
  background: rgba(255, 255, 255, 0.62);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.88);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 0.95);
}
```
Always include `-webkit-backdrop-filter` alongside `backdrop-filter`.

**Macaron color classes** apply `background: linear-gradient(140deg, ...)`. They are applied directly to card elements alongside structural classes:
```html
<div class="lesson-card-unlocked macaron-rose rounded-[2rem] p-5">
```

**Animation pattern** — entrance animations use `opacity: 0` + `transform` initial state, then `animation: cardSlideUp forwards`:
```css
.some-item {
  opacity: 0;
  transform: translateY(12px);
  animation: cardSlideUp 0.4s ease forwards;
}
```
Stagger with `animation-delay` set inline: `style="animation-delay: ${index * 80}ms"`.

**CSS custom properties** for interactive effects:
```css
/* Spotlight border — set via JS on mousemove */
card.style.setProperty('--mx', `${x}px`);
card.style.setProperty('--my', `${y}px`);
```

**Responsive breakpoints** (desktop centering only, mobile-first):
- Default: full-width mobile layout
- `@media (min-width: 768px)`: center `#app-shell` at `420px` width with card shadow
- `@media (min-width: 1024px)`: widen to `460px`

---

## State Management Pattern

All persistent state lives in `js/store.js`. Views never write to `localStorage` directly.

```js
// Read
const progress = store.getProgress(lessonId);
const user = store.getUser();

// Write
store.passLesson(lessonId, stars, xp);
store.addStars(10);
store.markMistakeReviewed(id);
```

Module-level `let` variables handle view-local UI state (selected option, current index, active tab). These are reset at the top of each exported render function:

```js
export function renderQuiz(params = {}) {
  // Reset all local state on entry
  _currentIdx = 0;
  _selected = null;
  _answered = false;
  _consecutiveCorrect = 0;
  ...
}
```

---

## Error Handling

**Guard pattern** at view entry points:
```js
export function renderQuiz(params = {}) {
  const lesson = getLessonById(lessonId);
  if (!lesson) {
    window.__showToast?.('未找到该课程');
    window.__router.goBack();
    return;
  }
  ...
}
```

**Store persistence errors** are caught silently with `console.warn`:
```js
function _save(state) {
  try { ... }
  catch (e) { console.warn('[Store] 本地存储保存失败', e); }
}
```

**Router missing view** logs a warning:
```js
console.warn(`[Router] 未找到视图：${viewName}`);
```

---

## Comments

**File-level JSDoc block** at top of every JS file:
```js
/**
 * js/store.js
 * ─────────────────────────────────────────────────────────────
 * 感觉训练系统 — 全局状态管理
 *
 * 职责：
 *   1. ...
 * ─────────────────────────────────────────────────────────────
 */
```

**Section dividers** using `═══` or `───` separators for logical groupings within a file.

**JSDoc on public store methods** — `@param` and `@returns` tags used consistently:
```js
/**
 * 通关一节课
 * @param {number} lessonId
 * @param {number} stars     1~3
 * @param {number} xp        获得的 XP
 */
passLesson(lessonId, stars, xp) { ... }
```

Inline comments in Chinese for business logic explanations. Code structure comments in Chinese.

---

## Phosphor Icons

Icons use the `@phosphor-icons/webcomponents` web component syntax:
```html
<ph-star weight="fill" size="16" color="rgba(255,255,255,0.9)"></ph-star>
<ph-books weight="regular" size="16" color="#9B8AC4"></ph-books>
```

The `lesson.icon` field in lesson data contains the icon name suffix (e.g., `"eye"`, `"ear"`, `"star"`), used as:
```html
<ph-${lesson.icon} weight="fill" size="32" color="rgba(255,255,255,0.9)"></ph-${lesson.icon}>
```

---

*Convention analysis: 2026-04-08*
