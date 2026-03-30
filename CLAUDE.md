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
