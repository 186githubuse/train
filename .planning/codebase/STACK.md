# Technology Stack
_Generated: 2026-04-08_

## Summary
Pure vanilla web app — no build tools, no framework, no Node.js. HTML/CSS/JS loaded directly in the browser via ES Modules. Tailwind CSS is pulled from CDN at runtime. All state is persisted to `localStorage`.

## Languages

**Primary:**
- JavaScript (ES2020+) — all application logic, views, routing, state
- HTML5 — single entry point `index.html`
- CSS3 — global styles + per-view stylesheets

## Runtime

**Environment:**
- Browser only (no server-side runtime)
- Must be served over HTTP (not `file://`) due to ES Module CORS restrictions
- Development: `python3 -m http.server` or equivalent static server

**Package Manager:**
- None — no `package.json`, no lockfile
- All dependencies loaded via CDN `<script>` tags

## Frameworks

**Core:**
- None — pure vanilla JS with ES Modules

**UI / Styling:**
- Tailwind CSS (CDN) `https://cdn.tailwindcss.com` — utility classes
  - Custom config defined inline in `index.html` via `window.tailwind.config` before CDN load
  - Extended tokens: `borderRadius.4xl`, `borderRadius.5xl`, `backdropBlur.xs`
- Custom CSS — `css/style.css`, `css/components.css`, `css/views/*.css`

**Icons:**
- Phosphor Icons Web Components `@phosphor-icons/webcomponents@2.1` via unpkg CDN
  - Loaded as `<script type="module">` in `index.html`
  - Used as custom HTML elements e.g. `<ph-icon>`

**Testing:**
- None detected

**Build/Dev:**
- No build step — files served as-is
- No bundler, no transpiler, no minifier

## Key Dependencies

**Critical:**
- `https://cdn.tailwindcss.com` — all layout and utility styling depends on this
- `https://unpkg.com/@phosphor-icons/webcomponents@2.1` — icon rendering throughout UI

**Infrastructure:**
- `localStorage` (browser built-in) — sole persistence layer, key: `ganjue_training_state`
- `fetch` (browser built-in) — all AI API calls in `views/magicMachine.js`

## Module System

**Pattern:** ES Modules (`type="module"`)
- Entry: `js/main.js` loaded via `<script type="module" src="js/main.js">`
- Views lazy-loaded via dynamic `import()` in `js/router.js`
- Shared globals exposed on `window`: `window.__router`, `window.__showToast`, `window.__store`

## Configuration

**App config:**
- `js/config.js` — AI API base URL, API keys, model names (not committed to git per file comment)

**Tailwind config:**
- Inline in `index.html` lines 13–27 via `window.tailwind.config`

**No other config files** — no `.eslintrc`, no `.prettierrc`, no `tsconfig.json`, no `.nvmrc`

## CSS Architecture

**Files:**
- `css/style.css` — global reset, macaron color palette, glassmorphism utilities, animations, nav bar
- `css/components.css` — shared component styles (cards, buttons, badges, toasts)
- `css/views/challenge.css` — challenge view styles
- `css/views/magicMachine.css` — magic machine view styles
- `css/views/medalHall.css` — medal hall view styles
- `css/views/mistakeBook.css` — mistake book view styles
- `css/views/onboarding.css` — onboarding view styles
- `css/views/report.css` — report/growth view styles

**Design system:**
- Macaron color classes: `macaron-rose`, `macaron-lavender`, `macaron-mint`, `macaron-peach`, `macaron-sky`, `macaron-lemon`, `macaron-coral`, `macaron-lilac`, `macaron-teal`, `macaron-cherry`
- Glassmorphism: `backdrop-blur-xl`, `bg-white/40`, `border-white/50` patterns throughout
- Font stack: `-apple-system`, `PingFang SC`, `Hiragino Sans GB`, `Microsoft YaHei`, `Noto Sans CJK SC`

## Platform Requirements

**Development:**
- Any static HTTP server (e.g. `python3 -m http.server 8080`)
- Modern browser with ES Module support

**Production:**
- Any static file host (no server-side processing required)
- HTTPS recommended (required for camera/image capture in `magicMachine.js`)

---

*Stack analysis: 2026-04-08*
