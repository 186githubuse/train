# 感觉训练系统 — 项目记忆

## 项目概述
面向小学生的**感觉训练闯关 App**（写作感知力培养），移动端优先的纯原生 Web 应用。
风格：马卡龙液态玻璃 + 纯色透明 SVG 图标，Tailwind CSS CDN + 自定义 CSS。

## 技术栈
- 纯原生 HTML / CSS / JavaScript（ES Module）
- Tailwind CSS（CDN 引入，无构建工具）
- localStorage 持久化
- 无任何框架、无 Node.js、无打包器

## 目录结构
```
index.html              # 入口，含底部导航 + 背景光晕球
css/style.css           # 全局样式（马卡龙色系、液态玻璃、动画）
js/
  main.js               # 应用入口，初始化路由 / Toast
  router.js             # 路由系统（懒加载视图 + 历史栈），main.js 已接入
  store.js              # 全局状态管理（localStorage 持久化）
  data/
    lessons.js          # 课程数据（10节课，含 keyPoints / videoUrl）
    questions.js        # 题库数据（180题，10知识点+综合挑战，3层难度）
views/
  trainingCamp.js       # ✅ 训练营关卡地图视图（已完成）
  lessonDetail.js       # ✅ 课程详情页（视频占位 + 知识点 + 进入答题）
  quiz.js               # ✅ 答题页（题目+选项+正误反馈+通关逻辑）
```

## 全局 API（挂载于 window）
| 名称 | 说明 |
|------|------|
| `window.__router` | `{ navigate, goBack, getCurrentView, getCurrentParams }` |
| `window.__showToast(msg, duration?)` | 显示 Toast 通知 |
| `window.__store` | store 对象（调试用） |

## 路由视图注册表（router.js）
| 视图名 | 文件 | 状态 |
|--------|------|------|
| `trainingCamp` | views/trainingCamp.js | ✅ 已完成 |
| `magicMachine` | views/placeholder.js | ⬜ 占位 |
| `challenge` | views/challenge.js | ⬜ 待开发 |
| `growth` | views/report.js | ⬜ 待开发 |
| `lessonDetail` | views/lessonDetail.js | ✅ 已完成 |
| `quiz` | views/quiz.js | ✅ 已完成 |
| `report` | views/report.js | ⬜ 待开发 |
| `mistakeBook` | views/mistakeBook.js | ⬜ 待开发 |

## 课程数据（js/data/lessons.js）
10节课，主题：感觉与写作的关系
1. 什么是感觉（👀 macaron-rose）
2. 感觉与作文的关系（✏️ macaron-lavender）
3. 用什么感觉（👂 macaron-mint）
4. 怎么感觉及结果（⚙️ macaron-peach）
5. 感觉结果精讲之"看"（🎨 macaron-sky）
6. 感觉结果精讲之"听"（🎵 macaron-lemon）
7. 感觉结果精讲之"闻"（🌸 macaron-coral）
8. 感觉结果精讲之"尝"（🍋 macaron-lilac）
9. 感觉结果精讲之"摸"（🤲 macaron-teal）
10. 15个基本感觉点总结（🏆 macaron-cherry）

所有课程的 `videoUrl: null`，`duration: 0`（待填充）。

## Store 数据结构（store.js）
```js
{
  user: { grade, abilityIndex, name },
  lessonProgress: {
    [lessonId]: { passed, stars, xp, totalXp, attemptCount, videoWatched }
  },
  mistakes: [{ id, lessonId, questionId, questionText, userAnswer, correctAnswer, difficulty, timestamp, reviewed }],
  challengeRecords: [{ id, score, accuracy, duration, timestamp }],
  _session: null  // 当前答题会话，不持久化
}
```

## 能力指数系统
- 范围：1.0 ~ 5.0
- 答对 +0.2，答错 -0.3（含修正系数）
- 难度分级：< 2.0 → level 1，< 4.0 → level 2，≥ 4.0 → level 3
- 通关条件：连续答对 3 题（session.consecutiveCorrect >= 3）

## CSS 马卡龙色系（对应 colorClass）
macaron-rose / lavender / mint / peach / sky / lemon / coral / lilac / teal / cherry

## 待开发优先级（建议顺序）
1. ~~**lessonDetail.js** — 课程详情页~~ ✅ 已完成
2. ~~**quiz.js** — 答题页（题目展示 + 选项 + 结果反馈）~~ ✅ 已完成
3. **report.js** — 学习报告 / 我的成长
4. **mistakeBook.js** — 错题本
5. **challenge.js** — 挑战赛

<!-- GSD:project-start source:PROJECT.md -->
## Project

**杨老师感觉训练写作营**

面向小学生的感觉训练闯关 App，通过 10 节课 + 180 道题帮助学生培养写作感知力（看/听/闻/尝/摸五感）。纯原生 Web 应用，移动端优先，马卡龙液态玻璃风格。核心功能已全部完成，当前处于客户测试阶段，下一步目标是修复已知问题、完善内容、并推进正式上线。

**Core Value:** 学生能通过闯关答题感受到"用感觉写作文"的方法，并用魔法机器把自己的感觉素材变成一篇作文。

### Constraints

- **Tech Stack**: 纯原生 Web，无 Node.js/打包器 — 客户环境限制，保持零依赖部署
- **Security**: API 密钥当前硬编码在 `js/config.js`，上线前必须迁移到后端代理
- **Data**: localStorage 上限约 5MB，上线前必须接入云端存储
- **Timeline**: 备案完成后启动上线改造（时间待定）
- **Content**: 题库和视频依赖客户审阅/外部团队，存在外部依赖
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Summary
## Languages
- JavaScript (ES2020+) — all application logic, views, routing, state
- HTML5 — single entry point `index.html`
- CSS3 — global styles + per-view stylesheets
## Runtime
- Browser only (no server-side runtime)
- Must be served over HTTP (not `file://`) due to ES Module CORS restrictions
- Development: `python3 -m http.server` or equivalent static server
- None — no `package.json`, no lockfile
- All dependencies loaded via CDN `<script>` tags
## Frameworks
- None — pure vanilla JS with ES Modules
- Tailwind CSS (CDN) `https://cdn.tailwindcss.com` — utility classes
- Custom CSS — `css/style.css`, `css/components.css`, `css/views/*.css`
- Phosphor Icons Web Components `@phosphor-icons/webcomponents@2.1` via unpkg CDN
- None detected
- No build step — files served as-is
- No bundler, no transpiler, no minifier
## Key Dependencies
- `https://cdn.tailwindcss.com` — all layout and utility styling depends on this
- `https://unpkg.com/@phosphor-icons/webcomponents@2.1` — icon rendering throughout UI
- `localStorage` (browser built-in) — sole persistence layer, key: `ganjue_training_state`
- `fetch` (browser built-in) — all AI API calls in `views/magicMachine.js`
## Module System
- Entry: `js/main.js` loaded via `<script type="module" src="js/main.js">`
- Views lazy-loaded via dynamic `import()` in `js/router.js`
- Shared globals exposed on `window`: `window.__router`, `window.__showToast`, `window.__store`
## Configuration
- `js/config.js` — AI API base URL, API keys, model names (not committed to git per file comment)
- Inline in `index.html` lines 13–27 via `window.tailwind.config`
## CSS Architecture
- `css/style.css` — global reset, macaron color palette, glassmorphism utilities, animations, nav bar
- `css/components.css` — shared component styles (cards, buttons, badges, toasts)
- `css/views/challenge.css` — challenge view styles
- `css/views/magicMachine.css` — magic machine view styles
- `css/views/medalHall.css` — medal hall view styles
- `css/views/mistakeBook.css` — mistake book view styles
- `css/views/onboarding.css` — onboarding view styles
- `css/views/report.css` — report/growth view styles
- Macaron color classes: `macaron-rose`, `macaron-lavender`, `macaron-mint`, `macaron-peach`, `macaron-sky`, `macaron-lemon`, `macaron-coral`, `macaron-lilac`, `macaron-teal`, `macaron-cherry`
- Glassmorphism: `backdrop-blur-xl`, `bg-white/40`, `border-white/50` patterns throughout
- Font stack: `-apple-system`, `PingFang SC`, `Hiragino Sans GB`, `Microsoft YaHei`, `Noto Sans CJK SC`
## Platform Requirements
- Any static HTTP server (e.g. `python3 -m http.server 8080`)
- Modern browser with ES Module support
- Any static file host (no server-side processing required)
- HTTPS recommended (required for camera/image capture in `magicMachine.js`)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Summary
## Naming Patterns
- Views: `camelCase.js` — `views/trainingCamp.js`, `views/lessonDetail.js`, `views/mistakeBook.js`
- CSS: `camelCase.css` for view-specific — `css/views/mistakeBook.css`, `css/views/report.css`
- Data modules: `camelCase.js` — `js/data/lessons.js`, `js/data/questions.js`
- Always named `render` + PascalCase view name: `renderTrainingCamp`, `renderLessonDetail`, `renderQuiz`, `renderMistakeBook`, `renderReport`, `renderChallenge`
- One named export per view file, always the render function
- Prefixed with nothing — just camelCase: `renderHeader`, `renderStars`, `bindEvents`, `handleCardClick`
- Private state variables: prefixed with `_` — `_activeTab`, `_lesson`, `_questions`, `_currentIdx`, `_answered`
- Private store internals: prefixed with `_` — `_state`, `_load`, `_save`, `_addMistake`
- SCREAMING_SNAKE_CASE for module-level config: `DEFAULT_STATE`, `STORAGE_KEY`, `CHALLENGE_QUESTION_COUNT`, `GRADES`, `DIFFICULTY_TEXT`
- BEM-like with view prefix: `quiz-header`, `quiz-option`, `quiz-option-selected`, `mb-card`, `mb-filter-bar`, `ch-page`, `ch-option`
- Global utility classes: `glass-card`, `back-btn`, `glass-btn`, `progress-track`, `progress-fill`
- Macaron color classes: `macaron-rose`, `macaron-lavender`, `macaron-mint`, `macaron-peach`, `macaron-sky`, `macaron-lemon`, `macaron-coral`, `macaron-lilac`, `macaron-teal`, `macaron-cherry`
## View Module Pattern
## HTML Rendering Pattern
- `document.getElementById('app-header').innerHTML = ...` — sticky header area
- `document.getElementById('app-content').innerHTML = ...` — scrollable main content
## Global APIs (window-mounted)
| Global | Source | Usage |
|--------|--------|-------|
| `window.__router` | `js/router.js` | `navigate(viewName, params)`, `goBack()` |
| `window.__showToast(msg, duration?)` | `js/main.js` | Show toast notification |
| `window.__store` | `js/store.js` | Debug only |
## Import Organization
## CSS Conventions
- Default: full-width mobile layout
- `@media (min-width: 768px)`: center `#app-shell` at `420px` width with card shadow
- `@media (min-width: 1024px)`: widen to `460px`
## State Management Pattern
## Error Handling
## Comments
## Phosphor Icons
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Summary
## Pattern Overview
- No framework, no bundler — pure ES Module `import()` for lazy loading
- Single DOM shell (`index.html`) with dynamic content injection per view
- Centralized state singleton (`store.js`) with direct `localStorage` persistence
- Views are stateless render functions; page-level mutable state is module-scoped `let` variables
## Layers
- Purpose: Persistent layout container — background orbs, header, content area, bottom nav, toast mount
- Location: `index.html`
- Contains: Static DOM skeleton, CDN script tags, bottom nav buttons with `data-view` attributes
- Depends on: `js/main.js` (entry point via `<script type="module">`)
- Used by: All views inject into `#app-header` and `#app-content`
- Purpose: Initialize navigation event listeners, Toast utility, and route to first view
- Location: `js/main.js`
- Contains: `initNavigation()`, `showToast()`, `initApp()`
- Depends on: `js/router.js`, `js/store.js`
- Used by: `index.html` only
- Purpose: View registry, lazy loading, navigation history stack, nav-bar highlight sync
- Location: `js/router.js`
- Contains: `VIEW_MAP` (name → dynamic import), `navigate()`, `goBack()`, history array `_history`
- Depends on: All view modules (via dynamic `import()`)
- Used by: `js/main.js`, all views (via `window.__router`)
- Purpose: Single source of truth for all persistent and session data
- Location: `js/store.js`
- Contains: `store` object with methods for user profile, lesson progress, ability index, quiz session, mistakes, challenge records
- Depends on: `localStorage` only
- Used by: All view modules via `import { store } from '../js/store.js'`
- Purpose: Static data definitions — no DOM, no side effects
- Location: `js/data/`
- Contains:
- Depends on: Nothing
- Used by: Views and store
- Purpose: Render HTML strings into `#app-content` (and sometimes `#app-header`), attach event listeners
- Location: `views/*.js`
- Contains: One exported `render*()` function per file, plus private module-scoped state variables
- Depends on: `js/store.js`, `js/data/*.js`, `window.__router`, `window.__showToast`
- Used by: `js/router.js` (loaded on demand)
- Purpose: API keys and base URLs for AI and vision services
- Location: `js/config.js`
- Contains: `API_CONFIG` (Claude Haiku), `VISION_CONFIG` (Gemini)
- Depends on: Nothing
- Used by: `views/magicMachine.js`
- Purpose: Global design tokens, component classes, per-view overrides
- Location: `css/style.css`, `css/components.css`, `css/views/*.css`
- All CSS loaded eagerly in `index.html` `<head>`
## Data Flow
- Every mutating `store` method calls `_save(_state)` immediately
- `_session` is explicitly excluded from serialization (ephemeral)
- Storage key: `'ganjue_training_state'`
## Key Abstractions
- Purpose: All app state in one place; no prop-drilling, no event bus needed
- Examples: `js/store.js`
- Pattern: Module-level private `_state` object, public API object exported as named export and `window.__store`
- Purpose: Decouple router from view implementations; add a view by adding one line
- Examples: `js/router.js` lines 20–36
- Pattern: `{ viewName: () => import(...).then(m => m.renderFn) }`
- Purpose: Each view is a pure-ish function that writes to the DOM
- Examples: `renderTrainingCamp(params)`, `renderQuiz(params)`, `renderReport(params)`
- Pattern: Build HTML string → set `innerHTML` on `#app-content` → attach event listeners via `addEventListener` or delegated clicks
- Purpose: Transient UI state (current step, selected option, loading flag) that doesn't need persistence
- Examples: `_phase`, `_currentIdx`, `_selected` in `views/quiz.js`, `views/challenge.js`, `views/magicMachine.js`
- Pattern: Module-scoped `let` variables, reset on each `render*()` call
## Entry Points
- Location: `index.html`
- Triggers: Browser load
- Responsibilities: Mount DOM shell, load CSS, bootstrap `js/main.js`
- Location: `js/main.js`
- Triggers: `DOMContentLoaded`
- Responsibilities: Wire bottom nav clicks, register `window.__showToast`, call `navigate()` to first view
## Error Handling
- `router.navigate()` logs `console.warn` for unknown view names and `console.error` on failed dynamic import
- `store._load()` catches JSON parse errors and returns `DEFAULT_STATE`
- `store._save()` catches `localStorage` write errors with `console.warn`
- Views do not have try/catch; errors surface as uncaught promise rejections
## Cross-Cutting Concerns
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
