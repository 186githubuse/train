# CONCERNS
_Generated: 2026-04-08_

## Summary
这是一个纯前端、无后端的小学写作训练 App，所有数据存于 localStorage，API 密钥直接硬编码在客户端 JS 文件中。当前存在一个严重安全漏洞（密钥暴露）、一个已知的临时绕过（课程解锁逻辑被注释掉）、以及多处因无后端导致的数据安全和扩展性限制。

---

## Critical Issues

### 1. API 密钥硬编码在客户端代码中
- Files: `js/config.js`
- Issue: 两个 API 密钥（Claude 和 Gemini 代理）以明文字符串写在 JS 文件里，任何人打开浏览器 DevTools 或查看源码即可获取。
- Impact: 密钥被滥用会产生费用，且无法追踪是哪个用户在调用。
- 额外风险: 项目**没有 `.gitignore` 文件**，`js/config.js` 文件注释写着"不要提交到 git"，但没有任何机制阻止它被提交。历史 commit 中若已包含该文件，密钥已泄露。
- Fix approach:
  1. 立即添加 `.gitignore`，将 `js/config.js` 加入。
  2. 短期：将 API 调用代理到自己的后端（如腾讯云 CloudBase Functions），前端只调用自己的接口，不持有密钥。
  3. 检查 git 历史：`git log --all --full-history -- js/config.js`，若已提交则需 rotate 密钥。

### 2. 课程解锁逻辑被临时注释掉
- File: `js/store.js` line 209
- Issue: `isUnlocked()` 直接 `return true`，原本的"前一课通关才解锁"逻辑被注释，注释说明是"客户测试视频用"。
- Impact: 所有课程对所有用户全部开放，破坏了课程设计的渐进式学习路径，且这个状态极易被遗忘带上线。
- Fix approach: 确认客户测试结束后，删除 `return true` 这一行，取消注释原有逻辑。建议用环境变量或 URL 参数控制测试模式，而不是直接改业务逻辑。

---

## Medium Issues

### 3. 所有用户数据仅存于 localStorage，无云端备份
- Files: `js/store.js`
- Issue: 学习进度、错题本、星星积分、能力指数全部存在 `localStorage`（key: `ganjue_training_state`）。
- Impact:
  - 用户换浏览器、换设备、清除浏览器数据 → 所有进度丢失，无法找回。
  - 同一用户多设备无法同步。
  - 浏览器 localStorage 上限约 5MB，错题本和挑战记录积累后存在溢出风险（`_save` 有 try/catch 但只打 warning，用户无感知）。
- Fix approach: 接入腾讯云 CloudBase（memory 文件中已有上线方案），将 store 的 `_save` 改为同时写云端。

### 4. 挑战赛答题使用 `window._chAutoSubmit` 全局变量
- File: `views/challenge.js` line 374
- Issue: 自动提交的 setTimeout ID 挂在 `window._chAutoSubmit` 上，是全局污染。若用户快速切换视图再回来，旧的 timer 可能在新的答题上下文中触发 `submitAnswer()`，导致错误提交。
- Fix approach: 将 timer ID 存为模块级变量（与 `_timerInterval` 同级），在 `renderChallenge()` 入口处清除。

### 5. quiz.js 与 store.js 双重记录错题
- Files: `views/quiz.js` lines 336-344, `js/store.js` lines 296-308
- Issue: `advanceSession()` 内部会调用 `_addMistake()`，但 `views/quiz.js` 的 `submitAnswer()` 在调用 `store.updateAbility()` 之后又**再次手动调用** `store._addMistake()`（直接访问私有方法）。同一道题答错会被记录两次，但 `_addMistake` 内部有去重逻辑（按 questionId 过滤），所以实际只保留最新一条，不会出现重复条目，但逻辑冗余且脆弱。
- Fix approach: `quiz.js` 应只调用 `store.advanceSession()`，不应直接调用 `store._addMistake()`。

### 6. 挑战赛每次完成固定发放 15 颗星，无防刷机制
- File: `views/challenge.js` line 452
- Issue: `store.addStars(15)` 在每次挑战结束时无条件执行，用户可以反复开始并立即完成挑战（哪怕全答错）来刷星星。
- Impact: 积分系统（勋章馆称号）可被轻易刷满，失去激励意义。
- Fix approach: 参考 `quiz.js` 的 `isFirstPass` 模式，或对挑战记录加冷却时间（如同一天只能领一次奖励）。

### 7. 专题训练内容完全缺失
- Files: `js/data/topics.js`, `views/trainingCamp.js` lines 189-206
- Issue: `TOPICS` 数据文件注释写明"内容待上线，目前只定义专题模块结构"，训练营 Tab 中专题训练卡片全部显示"即将上线"徽章，点击无任何响应。
- Impact: 底部导航"训练营"Tab 切换到"专题训练"是死页面，对用户体验有负面影响。
- Fix approach: 短期在 Tab 上加禁用样式或隐藏该 Tab；长期按 `topics.js` 中定义的结构填充内容。

### 8. 所有视频 URL 为 null，视频时长为 0
- File: `js/data/lessons.js` lines 18-19, 34
- Issue: 10 节课的 `videoUrl` 全部为 `null`，`duration` 全部为 `0`。`lessonDetail.js` 中视频区域是占位符。
- Impact: 核心教学内容（视频）缺失，`markVideoWatched` 逻辑存在但无法被真实触发。
- Fix approach: 视频由外部团队提供，接入时只需填充 `lessons.js` 中的 `videoUrl` 字段，`lessonDetail.js` 已预留接口。

### 9. CDN 依赖无版本锁定，存在可用性风险
- File: `index.html` lines 9, 29
- Issue:
  - Phosphor Icons: `https://unpkg.com/@phosphor-icons/webcomponents@2.1`（锁定了主版本，相对安全）
  - Tailwind CSS: `https://cdn.tailwindcss.com`（**无版本号**，始终拉取最新版）
- Impact: Tailwind CDN 若发布破坏性更新，样式可能在无任何代码变更的情况下崩溃。unpkg 或 CDN 服务不可用时整个 App 无法正常显示。
- Fix approach: Tailwind 改为锁定版本，如 `https://cdn.tailwindcss.com/3.4.1`；长期考虑将静态资源本地化或使用 jsDelivr 等有 SLA 的 CDN。

---

## Low Priority / Tech Debt

### 10. 路由历史栈无上限，长时间使用会持续增长
- File: `js/router.js` line 60
- Issue: `_history` 数组只 push 不清理，理论上可无限增长（内存中，不持久化）。
- Impact: 正常使用场景下不会有问题，但极端情况（用户长时间不刷新、反复跳转）会占用内存。
- Fix approach: 限制历史栈深度，如最多保留 20 条。

### 11. report.js 和 challenge.js 中使用 `onclick` 内联事件
- Files: `views/report.js` lines 235, 319, 333, `views/challenge.js` line 122
- Issue: 部分按钮使用 `onclick="window.__router.goBack()"` 内联写法，与其他视图统一使用事件委托的风格不一致。
- Impact: 代码风格不统一，内联 onclick 依赖全局 `window.__router` 在渲染时已存在。
- Fix approach: 统一改为 `data-action` + 事件委托模式。

### 12. trainingCamp.js 中 `content.addEventListener('click', handleCardClick, { once: false })` 每次渲染都重复绑定
- File: `views/trainingCamp.js` line 337
- Issue: `renderTrainingCamp()` 每次被调用（包括 Tab 切换时）都会在 `content` 上追加一个新的 click 监听器，`{ once: false }` 意味着不会自动移除。多次切换 Tab 后，同一次点击会触发多次 `handleCardClick`。
- Impact: 点击关卡可能触发多次路由跳转（实际因路由幂等性影响不大，但属于内存泄漏）。
- Fix approach: 在重新渲染前先 `content.removeEventListener('click', handleCardClick)`，或改用 `{ once: true }` 并在渲染后重新绑定。

### 13. 能力指数初始值等于年级数，量纲混用
- File: `js/store.js` lines 108, 118
- Issue: `setUserProfile` 和 `setGrade` 都执行 `abilityIndex = grade`，即3年级学生初始能力指数为3.0。这让年级和能力指数在数值上耦合，但两者含义不同（年级1-9，能力指数1.0-5.0）。
- Impact: 高年级学生（6-9年级）初始能力指数会超出或接近上限5.0，导致自适应难度系统从一开始就给最高难度题，体验不佳。
- Fix approach: 将初始能力指数与年级解耦，例如统一初始为2.5，或按年级映射到合理区间（如1-3年级→1.5，4-6年级→2.5，7-9年级→3.5）。

### 14. `store._reset()` 暴露在 `window.__store` 上，生产环境可被任意调用
- File: `js/store.js` lines 419-429, 433
- Issue: `window.__store = store` 将整个 store 对象（含 `_reset()` 方法）挂到全局，任何人在控制台执行 `__store._reset()` 即可清空所有用户数据。
- Impact: 恶意用户或误操作可清空学习进度。
- Fix approach: 生产环境不挂载 `window.__store`，或只暴露只读的调试信息。

### 15. 错题本重做时直接访问 `store._addMistake`（私有方法）
- File: `views/quiz.js` line 337
- Issue: `quiz.js` 直接调用 `store._addMistake()`（下划线前缀约定为私有），破坏封装。
- Fix approach: 在 store 上暴露一个公开的 `recordMistake()` 方法，或通过 `advanceSession` 统一处理。

---

*Concerns audit: 2026-04-08*
