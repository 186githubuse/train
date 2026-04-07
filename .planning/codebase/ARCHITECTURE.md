# Architecture

_Generated: 2026-04-08_

## Summary

Single-page application built with vanilla ES Modules and no build tooling. A central router handles lazy-loaded view swapping inside a persistent shell layout. All state lives in a single `store` object backed by `localStorage`, exposed globally on `window.__store` for cross-module access.

## Pattern Overview

**Overall:** SPA with manual client-side routing, module-per-view pattern

**Key Characteristics:**
- No framework, no bundler — pure ES Module `import()` for lazy loading
- Single DOM shell (`index.html`) with dynamic content injection per view
- Centralized state singleton (`store.js`) with direct `localStorage` persistence
- Views are stateless render functions; page-level mutable state is module-scoped `let` variables

## Layers

**Shell (HTML):**
- Purpose: Persistent layout container — background orbs, header, content area, bottom nav, toast mount
- Location: `index.html`
- Contains: Static DOM skeleton, CDN script tags, bottom nav buttons with `data-view` attributes
- Depends on: `js/main.js` (entry point via `<script type="module">`)
- Used by: All views inject into `#app-header` and `#app-content`

**Entry / Bootstrap:**
- Purpose: Initialize navigation event listeners, Toast utility, and route to first view
- Location: `js/main.js`
- Contains: `initNavigation()`, `showToast()`, `initApp()`
- Depends on: `js/router.js`, `js/store.js`
- Used by: `index.html` only

**Router:**
- Purpose: View registry, lazy loading, navigation history stack, nav-bar highlight sync
- Location: `js/router.js`
- Contains: `VIEW_MAP` (name → dynamic import), `navigate()`, `goBack()`, history array `_history`
- Depends on: All view modules (via dynamic `import()`)
- Used by: `js/main.js`, all views (via `window.__router`)

**State / Store:**
- Purpose: Single source of truth for all persistent and session data
- Location: `js/store.js`
- Contains: `store` object with methods for user profile, lesson progress, ability index, quiz session, mistakes, challenge records
- Depends on: `localStorage` only
- Used by: All view modules via `import { store } from '../js/store.js'`

**Data Layer:**
- Purpose: Static data definitions — no DOM, no side effects
- Location: `js/data/`
- Contains:
  - `lessons.js` — 10 `Lesson` objects with metadata, `videoUrl`, `keyPoints`
  - `questions.js` — 180 questions, exports `generateQuizSet()` and `pickRandomQuestions()`
  - `topics.js` — 5 topic module stubs (all `comingSoon: true`)
  - `courseLogic.js` — domain logic: `calcSenseRadarScores()`, `getAbilityTitle()`, `SENSE_RADAR_CONFIG`
- Depends on: Nothing
- Used by: Views and store

**Views:**
- Purpose: Render HTML strings into `#app-content` (and sometimes `#app-header`), attach event listeners
- Location: `views/*.js`
- Contains: One exported `render*()` function per file, plus private module-scoped state variables
- Depends on: `js/store.js`, `js/data/*.js`, `window.__router`, `window.__showToast`
- Used by: `js/router.js` (loaded on demand)

**Config:**
- Purpose: API keys and base URLs for AI and vision services
- Location: `js/config.js`
- Contains: `API_CONFIG` (Claude Haiku), `VISION_CONFIG` (Gemini)
- Depends on: Nothing
- Used by: `views/magicMachine.js`

**Styles:**
- Purpose: Global design tokens, component classes, per-view overrides
- Location: `css/style.css`, `css/components.css`, `css/views/*.css`
- All CSS loaded eagerly in `index.html` `<head>`

## Data Flow

**App Boot:**
1. `index.html` loads, CDN scripts execute (Tailwind, Phosphor Icons)
2. `js/main.js` runs on `DOMContentLoaded`
3. `store.js` loads and merges `localStorage` into `_state`
4. `main.js` checks `store.isNewUser()` → routes to `onboarding` or `trainingCamp`

**Navigation:**
1. User taps bottom nav button or view calls `window.__router.navigate(viewName, params)`
2. `router.navigate()` pushes current view to `_history`, updates `_currentView`
3. Router syncs bottom nav `.active` class and manages `#app-header` visibility
4. Dynamic `import()` fetches the view module (cached by browser after first load)
5. Exported `render*()` function is called with `params`; it writes HTML to `#app-content`

**Quiz Session Flow:**
1. `lessonDetail.js` calls `store.startSession(lessonId, questions)` then navigates to `quiz`
2. `quiz.js` reads session via `store.getSession()`
3. Each answer calls `store.advanceSession(isCorrect, userAnswer)` which:
   - Updates `abilityIndex` via `store.updateAbility()`
   - Records mistake via `store._addMistake()` if wrong
   - Returns `{ consecutiveCorrect, passed }`
4. On pass (3 consecutive correct): `store.passLesson()` is called, stars/XP computed, navigate back

**State Persistence:**
- Every mutating `store` method calls `_save(_state)` immediately
- `_session` is explicitly excluded from serialization (ephemeral)
- Storage key: `'ganjue_training_state'`

## Key Abstractions

**`store` singleton:**
- Purpose: All app state in one place; no prop-drilling, no event bus needed
- Examples: `js/store.js`
- Pattern: Module-level private `_state` object, public API object exported as named export and `window.__store`

**`VIEW_MAP` registry:**
- Purpose: Decouple router from view implementations; add a view by adding one line
- Examples: `js/router.js` lines 20–36
- Pattern: `{ viewName: () => import(...).then(m => m.renderFn) }`

**Render functions:**
- Purpose: Each view is a pure-ish function that writes to the DOM
- Examples: `renderTrainingCamp(params)`, `renderQuiz(params)`, `renderReport(params)`
- Pattern: Build HTML string → set `innerHTML` on `#app-content` → attach event listeners via `addEventListener` or delegated clicks

**Page-level state:**
- Purpose: Transient UI state (current step, selected option, loading flag) that doesn't need persistence
- Examples: `_phase`, `_currentIdx`, `_selected` in `views/quiz.js`, `views/challenge.js`, `views/magicMachine.js`
- Pattern: Module-scoped `let` variables, reset on each `render*()` call

## Entry Points

**`index.html`:**
- Location: `index.html`
- Triggers: Browser load
- Responsibilities: Mount DOM shell, load CSS, bootstrap `js/main.js`

**`js/main.js`:**
- Location: `js/main.js`
- Triggers: `DOMContentLoaded`
- Responsibilities: Wire bottom nav clicks, register `window.__showToast`, call `navigate()` to first view

## Error Handling

**Strategy:** Silent fallback with console warnings; no global error boundary

**Patterns:**
- `router.navigate()` logs `console.warn` for unknown view names and `console.error` on failed dynamic import
- `store._load()` catches JSON parse errors and returns `DEFAULT_STATE`
- `store._save()` catches `localStorage` write errors with `console.warn`
- Views do not have try/catch; errors surface as uncaught promise rejections

## Cross-Cutting Concerns

**Logging:** `console.log/warn/error` with `[Router]` / `[Store]` prefixes; no logging library
**Validation:** None — inputs trusted from UI controls; no schema validation on store data
**Authentication:** `localStorage`-only for now; `onboarding.js` notes CloudBase migration path for phone/WeChat login
**AI calls:** `views/magicMachine.js` calls external API directly from the browser using keys from `js/config.js`

---

*Architecture analysis: 2026-04-08*
