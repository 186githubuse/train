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
css/
  style.css             # 全局样式（马卡龙色系、液态玻璃、动画）
  components.css        # 通用组件
  views/                # 各视图独立样式（report / mistakeBook / challenge / magicMachine / onboarding / medalHall / topic）
js/
  main.js               # 应用入口，初始化路由 / Toast
  router.js             # 路由系统（懒加载视图 + 历史栈）
  store.js              # 全局状态管理（localStorage 持久化）
  config.js             # API 密钥 + 模型配置（勿提交 git）
  data/
    lessons.js          # 10 节课定义
    courseLogic.js      # 课程核心教学逻辑
    questions/          # 基础训练题库（297题拆分到 q01~q10.js，每课30题）
    topics/             # 专题训练题库
      index.js          # 6 模块入口（静物→植物→动物→景物→人物→事件；静物/植物/动物/景物已开放）
      jingwu/           # 静物专题 + 状元桥数据（topicId='scenery'）
        taideng.js      # 台灯（schema:'unit'）
        shubao.js       # 书包（schema:'unit'）
        bidai.js        # 笔袋（schema:'unit'）
        zhuangyuanqiao.js # 状元桥（schema:'unit'，景物模块）
        gaozhi.js       # 稿纸（已废弃 · 入口未引用，文件保留作存档）
      zhiwu/            # 植物专题：柳树 / 白牡丹 / 橘子（schema:'unit'）
      dongwu/           # 动物专题：橘猫 / 比熊 / 虎皮鹦鹉 / 金鱼 / 蜜蜂（schema:'unit'）
      scenery/          # 景物专题：公园湖畔（schema:'unit'）
views/
  trainingCamp.js       # ✅ 训练营（基础 + 专题 Tab）
  lessonDetail.js       # ✅ 课程详情页
  quiz.js               # ✅ 基础答题页
  magicMachine.js       # ✅ 魔法机器
  challenge.js          # ✅ 挑战赛
  report.js             # ✅ 学习报告/我的成长
  mistakeBook.js        # ✅ 错题本
  medalHall.js          # ✅ 勋章馆
  onboarding.js         # ✅ 注册/登录
  topicDetail.js        # ✅ 专题子内容列表
  topicQuiz.js          # ✅ 专题答题（单/多/判/排序，16:9 图片框）
  topicCompose.js       # ✅ 专题连句成段 + AI 评分 + OCR
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
| `onboarding` | views/onboarding.js | ✅ |
| `trainingCamp` | views/trainingCamp.js | ✅ |
| `magicMachine` | views/magicMachine.js | ✅ |
| `challenge` | views/challenge.js | ✅ |
| `growth` / `report` | views/report.js | ✅ |
| `lessonDetail` | views/lessonDetail.js | ✅ |
| `quiz` | views/quiz.js | ✅ |
| `mistakeBook` | views/mistakeBook.js | ✅ |
| `medalHall` | views/medalHall.js | ✅ |
| `topicDetail` | views/topicDetail.js | ✅ |
| `topicQuiz` | views/topicQuiz.js | ✅ |
| `topicCompose` | views/topicCompose.js | ✅ |

**viewsWithHeader 白名单**（router.js 内）：`trainingCamp / lessonDetail / quiz / topicDetail / topicQuiz / topicCompose` —— 这些视图自己渲染 header，路由器不清空。

## 课程数据（js/data/lessons.js）
10节课，主题：感觉与写作（2026-05-14 重排后顺序）
1. 什么是感觉（eye · macaron-rose）
2. 怎么感觉及感觉结果（list-numbers · macaron-lavender）
3. 眼看感觉点专项（eye · macaron-peach）
4. 耳听感觉点专项（ear · macaron-sky）
5. 鼻闻感觉点专项（flower-lotus · macaron-lemon）
6. 口尝感觉点专项（orange · macaron-coral）
7. 手摸感觉点专项（hand-palm · macaron-lilac）
8. 五感综合识别（circles-four · macaron-teal）
9. 感觉三步法（steps · macaron-mint）  ← 2026-05-14 从第3课移到此处
10. 三步法加五感综合练习（trophy · macaron-cherry）

视频托管在腾讯云 COS：`https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/lessonX.mov`。文件名仍沿用旧编号（`lesson3.mov` 对应三步法，现在挂在第 9 课 `videoUrl` 上）。第 1–3、5–9 课已上传正式视频，第 4、10 课暂用替代。

## Store 数据结构（store.js）
```js
{
  schemaVersion: 4,   // 2026-05-21：四档评级 + 错题本改造（连对3题通过+冷却）
  user: { grade, abilityIndex, name, totalStars },  // grade 1-12；学段由 store.getStage() 推导
  lessonProgress: {
    [lessonId]: { passed, stars, xp, totalXp, attemptCount, videoWatched, roundsUsed }
  },
  mistakes: [{ id, lessonId, questionId, questionText, userAnswer, correctAnswer, difficulty, explanation, timestamp, reviewed, rewardClaimed, status, reviewStreak }],
  challengeRecords: [{ id, score, accuracy, duration, timestamp }],
  _session: null  // 当前答题会话，不持久化
}
```
Schema 版本不匹配时 `_load()` 自动清 localStorage。`store.getStage()` 从 grade 推导：1-6=S，7-9=C，10-12=H。

## 答题规则（基础训练，2026-05-21 改版）

- 每轮 **10 题**：D1×3 + D2×3 + D3×4
- D3 题按学生**学段**抽（S 小学 1-6 / C 初中 7-9 / H 高中 10-12，从年级推导）
- 答对/答错都显示 explanation 解析
- 10 题答完按错题数**四档评级**：
  - 错 ≤ 2 → 优秀（3⭐）
  - 错 = 3 → 良好（2⭐）
  - 错 = 4 → 及格（1⭐）
  - 错 ≥ 5 → 不及格（0⭐，提示回看视频）
- 题型：single（单选）/ multi（多选）/ judge（判断·2 选项）/ link（连线）

## 错题本规则（2026-05-21 改版）

- 错题按知识点授课顺序排列，分"待改错"和"已通过"两个 Tab
- 每道错题展示完整选项（正确绿色/错误红色删除线）+ explanation 解析
- 点"巩固测试" → 先看知识点讲解 → 跳转独立复测页
- 复测抽同知识点+同难度的 3 道题，连对 3 题 → 错题置灰（status: cleared）+ 奖励 3 星
- 答错 → 连对计数归零 + 60 秒冷却（倒计时期间不可再次测试）
- 复测中答错的题不进错题本

## 题号编码（K-D-学段-序号）

- 基础题：`K1-D1-01`（知识点 1·难度 1·第 1 题）
- D3 题加学段：`K1-D3-S01`（知识点 1·难度 3·小学段·第 1 题）
- archived 题（status: 'archived'）：题库里有 4 道（缺答案/无选项/leftItems 空），抽题时自动跳过
- **选项最多支持 6 个（A-F）**，渲染层（quiz / challenge / mistakeBook）按 `q.options[letter]` 存在性渲染，不存在的字母自动跳过

## CSS 马卡龙色系（对应 colorClass）
macaron-rose / lavender / mint / peach / sky / lemon / coral / lilac / teal / cherry

## 专题训练（2026-05-13 起 · 2026-06-18 按 0619/612 文档统一模块化）

数据：`js/data/topics/index.js` + `js/data/topics/{jingwu,zhiwu,dongwu,scenery}/**.js`
视图：`topicDetail` / `topicQuiz` / `topicCompose`

**入口流程（2026-05-24 起 · 二段式）**：
1. **介绍页**（`topicDetail` 默认 phase）：模块介绍视频（占位用 lesson9.mov）+ 知识点 + `选择${topic.title.replace('训练','')}开始答题` 按钮
2. **列表页**（`topicDetail` phase=`list`）：当前专题下的子内容卡片
3. 选一个子内容 → `topicQuiz` 答题/分段书写 → `topicCompose` 综合书写

**统一题型结构（schema:'unit'）**：
- 所有已开放子内容都使用单元模块化「边学边写」结构，不再区分“静物新结构 / 植物动物旧结构”。
- `typeA = { questions[], write }`：感觉三步法选择题 + 1 道“概括组成”书写题。`write.treeMap` 是组成框架脚手架。
- `typeB = { units[] }`：每单元 `{ questions[], treeMap{title,nodes[]}, write }`，单元选择题 → 单元树形图 → 单元分段书写。
- `typeC = { totalTreeMap, essay }`：全局树形总图 + 1 篇综合书写。学生在 A/B 各步写的内容会通过路由参数 `userSegments` 传到 `topicCompose`，总图里优先显示「✍️ 你写的」，没写过才回退到参考概述。
- `write` 结构：`{ id, prompt, requirement, points[], reference, treeMap? }`

**当前已实装（2026-06-18）**：静物 3 + 植物 3 + 动物 5 + 景物 2 = 13 个子内容，288 道选择题（不含 A/B/C 书写任务）
| 分类 | 子内容 | 结构 |
|---|---|---|
| 静物 jingwu/ | 台灯 / 笔袋 / 书包 | 单元模块化 |
| 植物 zhiwu/ | 柳树 / 白牡丹 / 橘子 | 单元模块化 |
| 动物 dongwu/ | 橘猫 / 比熊犬·小V / 虎皮鹦鹉 / 金鱼 / 蜜蜂 | 单元模块化 |
| 景物 scenery/ + jingwu/ | 公园湖畔 / 状元桥 | 单元模块化 |

**图片状态**：旧 10 个对象沿用 COS 主图；蜜蜂 / 状元桥 / 公园湖畔正式主图已上传 COS 并接入。8 张新增局部图已通过 `imageOverride` 接到相关选择题：蜜蜂头部/翅膀/腹部，状元桥护栏/桥洞，公园湖畔湖面/石拱桥/白牡丹蜜蜂。提示词保存在 `image-prompts/README.md`。

**答题逻辑**：答对直接跳下一题（300ms 闪绿），答错才显示正确答案 + 解析。书写步调 `gradeSegment()` 轻量 AI 评分（≥70 通过 +3 星，AI 失败兜底出参考答案不卡流程）。

**评分维度（30/30/30/10）**：组成完整 / 顺序正确 / 感觉点准确 / 语句通顺。C 类综合书写门槛 ≥ 120 字。不要求修辞。

**AI 工具**：`js/topicAI.js`（共享模块，topicQuiz + topicCompose 共用）—— `callLLM` / `gradeSegment` / `gradeEssay` / OCR 三件套。

**树状图**：`renderTreeMap()` 纯 HTML 渲染。新结构使用 `typeB.units[].treeMap.nodes[]`（单元图）+ `typeC.totalTreeMap.units[]`（总图，含 overview 脚手架，`.tc-mm-overview` 样式）。`topicCompose` 仍保留旧 `typeD` fallback。

**扩展方式**：新增子内容 = 写 `schema:'unit'` 数据文件 + 在 `index.js` import 并加入对应 `subs[]`；三视图通常无需改动。

**已废弃**：稿纸（`gaozhi.js`，旧 type1/2/3 格式，文件保留作存档但 index.js 不再 import）。

## API 配置（js/config.js · 2026-05-14 切换）

- **主模型**：comfly（`https://ai.comfly.chat`）+ `gpt-4o-mini`，**OpenAI 兼容格式**，走 `/v1/chat/completions` + `Authorization: Bearer`
- **图片识别**：itlsj（`https://ai.itlsj.com`）+ `gemini-3-flash-preview-all`，**Anthropic 兼容格式**，走 `/v1/messages` + `x-api-key`

两种 format 在 `js/config.js` 的 `format` 字段标记了，调用方自己适配。原 itlsj 的 Claude 分组已失效（403 无权访问）。

**破缓存技巧**：所有 `import 'config.js'` 必须带版本号 `?v=YYYYMMDD`，否则浏览器会缓存旧 key。

## 专题连句成段的 OCR

- `views/topicCompose.js` 的"写作区"右上角有相机/相册两个按钮
- 图片经 canvas 压缩（长边 ≤ 1280px、JPEG 0.85），调 `ocrHandwritingFromImage()`
- Gemini 识别结果**追加**到文本框（不覆盖已有）
- 三种状态条：loading / success / error

## 下一步待办

- 专题·静物：西瓜/菠萝等后续对象（comingSoon · 等文档题库）
- 专题·人物 / 事件（available:false · 文档待产出）
- 专题后续图片维护：图片提示词见 `image-prompts/README.md`；如重新生成主图或局部图，上传到 COS 对应路径后更新数据文件中的 `image` / `imageOverride`。
- **K2-D1-04 题目内容缺失**：当前 archived，需要老师补 leftItems / rightItems 后去掉 archived
- **魔法机器入口临时锁**（2026-05-17）：`index.html` 给 magicMachine 按钮加了 `data-coming-soon="1"` + `nav-coming-soon` class，`js/main.js` 拦截点击弹 Toast，视图代码 / 路由注册 / `views/magicMachine.js` 全部保留。恢复方法：去掉那一处属性 + class 即可
- **API 密钥后端代理**（正式开放前必做）：comfly + itlsj 两个 key 当前明文在 `js/config.js`，前端可被 F12 抓取。方案：阿里云函数计算 FC 写两个代理函数（chat 代理 + vision 代理），key 只存 FC 环境变量，前端 `baseUrl` 切到 FC 域名。涉及文件：`views/magicMachine.js` / `views/topicCompose.js` / `js/config.js`
- `scoco.cc` 备案通过后绑到 ECS，切为正式域名
- 测试通过后做数据库 + 后台（ECS 上装 MySQL + Node.js 后端 API）

<!-- GSD:project-start source:PROJECT.md -->
## Project

**杨老师感觉训练写作营**

面向 **1-12 年级**学生的感觉训练闯关 App，通过 10 节课 + 300 道题（含分学段）帮助学生培养写作感知力（看/听/闻/尝/摸五感）。纯原生 Web 应用，移动端优先，马卡龙液态玻璃风格。核心功能已全部完成，当前处于客户测试阶段。

### 产品全景与本 app 的位置（2026-06-15 客户对齐）

```
杨红作文（整个产品）
├── 感觉训练   ← 当前 app 做的就是这一个模块
│     ├── 基础训练（10 课 · 学三步法 + 五感方法论）
│     └── 专题训练（静物/植物/动物/景物/人物/事件 6 个）
├── 思维训练   （未做）
├── 综合训练   （未做）
└── 同步作文   （未做）
杨红阅读理解   （独立产品线 · 未做）
```

- 当前 app 内部"训练营"页 ≈ **感觉训练模块**，里面的「基础训练 / 专题训练」两个 Tab 是它的两部分
- 命名上「训练营」偏泛，将来加思维 / 综合 / 同步会有冲突；做多模块框架的事**等那些模块要上时再做**，现在不动
- 客户讨论了重命名 / 模块首页 / 多模块壳 三个改造层级；未确认 → 维持现状

正式地址：
- **https://train.tybqcloud.com**（阿里云 ECS + nginx，国内快，给客户用）

测试链接（main 自动部署）：
- https://train-swczlrou.edgeone.cool/（腾讯云 EdgeOne Pages）
- https://train-opal-six.vercel.app/（Vercel）
- https://186githubuse.github.io/train/（GitHub Pages）

发版：`git push` 后 SSH 到 ECS（39.96.194.18，root，或走阿里云 Workbench / 宝塔终端）跑 `cd /www/wwwroot/train.tybqcloud.com && git pull`。注：2026-05-25 之前是手动上传部署，已改成 git clone（备份保留在 `train.tybqcloud.com.bak.20260525`）。

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
- Data modules: `camelCase.js` — `js/data/lessons.js`, `js/data/questions/q01.js`..`q10.js`
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
- `@media (min-width: 768px)`: center `#app-shell` at `420px` card with shadow
- `@media (min-width: 1024px)`: **PC 桌面布局 v2.0（2026-06-15）** — `#app-shell` 改为横向 flex，左侧 196px 竖向侧边栏(`#bottom-nav` 变形而来)+ 右侧 820px 内容卡片（onboarding页面自动扩宽到1000px），背景光晕球放大。`<nav>` 在 DOM 里是 `#app` 兄弟节点，桌面用 `order: -1` 排到左侧。导航 JS 零改动。**训练营页面：基础训练2列网格布局（移除竖向闯关地图）、专题训练3列网格。onboarding页面：欢迎页IP+特性左右布局、表单页左右布局。马卡龙色系饱和度降低15-20%。** 详见 [memory] feature_pc_layout_v2
- `@media (min-width: 1024px)` 答题页：`.topic-quiz-page` 用 CSS Grid 两栏(340px 图 + 1fr 内容)，图片框 sticky 固定 + aspect-ratio 4:3，做题时图常驻视野不滚走
- `@media (min-width: 1024px) and (hover: hover)`：选项 / 卡片 / 按钮的克制悬停反馈(浮起 + 描边 + 阴影)，淡入切页过渡，`prefers-reduced-motion` 兜底
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
