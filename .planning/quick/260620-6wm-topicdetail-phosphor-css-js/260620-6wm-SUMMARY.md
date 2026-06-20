# Quick Task 260620-6wm: 优化右屏专题选择页 - Summary

**Completed:** 2026-06-19
**Code commit:** 8bed4de

## What changed

优化了「训练营 > 专题训练」入口卡片，以及 `topicDetail` 专题详情页的标题/按钮文案，让右屏专题选择更符合「感觉训练 › 选择专题」的层级关系。

### Implemented

- `views/trainingCamp.js`
  - 专题训练 Tab 顶部新增面包屑：`感觉训练 › 选择专题`。
  - 专题卡标题从「静物训练 / 植物训练 / 动物训练 / 景物训练」简化为「静物 / 植物 / 动物 / 景物」。
  - 每张已开放专题卡增加 Phosphor 图标玻璃徽章。
  - 每张已开放专题卡复用 `topic.subs` 前 3 个对象的 `image/title/imageAlt` 渲染对象预览。
  - 人物 / 事件仍为锁定占位，文案改为「敬请期待」+「内容筹备中」，不生成可点击空路由。

- `views/topicDetail.js`
  - 抽出 `getTopicLabel()`，统一去掉标题中的「训练」后缀。
  - Header 增加小面包屑：`感觉训练 › 当前专题`。
  - 介绍页 CTA 从动态表达式统一为 `选择${label}开始答题`。
  - 列表页标题从 `选择一个${topic.title.replace('训练','')}` 改为 `选择一个${label}`，去掉硬编码/重复表达。

- `css/views/topic.css`
  - 新增专题入口页样式：`.topic-entry-page`、`.topic-breadcrumb`。
  - 新增专题卡结构样式：`.topic-card-top`、`.topic-card-icon-badge`、`.topic-card-enter`。
  - 新增对象预览样式：`.topic-preview`、`.topic-preview-item`、`.topic-preview-thumb`、锁定态预览。
  - 新增 `topicDetail` header 面包屑样式 `.topic-detail-crumb`。
  - 桌面端对专题入口页做局部 padding/grid 覆盖，不改全局视觉体系。

## Verification

- JS 语法检查通过：
  - `node --check views/trainingCamp.js`
  - `node --check views/topicDetail.js`
  - `node --check js/data/topics/index.js`
- CSS 括号计数通过：
  - `css/views/topic.css`: 169 / 169
  - `css/style.css`: 259 / 259
- 静态检查通过：
  - 关键 class hook 存在：`topic-breadcrumb` / `topic-preview` / `topic-preview-thumb` / `topic-card-icon-badge`
  - `views/topicDetail.js` 不再包含硬编码 `选择静物开始答题` / `选择一个静物`
- Playwright + 系统 Chrome 真实交互烟测通过：
  - 老用户从 `moduleHome` 点击「感觉训练」进入 `trainingCamp`。
  - 切到「专题训练」后看到 `感觉训练 › 选择专题`。
  - 专题卡标题为「静物 / 植物 / 动物 / 景物」，不再重复「训练」。
  - 已开放专题卡对象预览数量正常。
  - 人物 / 事件仍为锁定卡。
  - 点击「植物」进入 `topicDetail`，header 面包屑含 `感觉训练` 和 `植物`。
  - CTA 文案为「选择植物开始答题」。
  - 截图输出：`/tmp/topic-selection-verify.png`。

## Notes

- 本次未修改 `js/data/topics/index.js`；对象预览直接复用现有 `topic.subs[].image/title/imageAlt`，景物已有 2 个对象预览（状元桥 / 公园湖畔）。
- 本次代码提交只包含：`views/trainingCamp.js`、`views/topicDetail.js`、`css/views/topic.css`。
- 工作区仍有任务开始前已有的未提交改动（如 `css/style.css`、onboarding、router、index 等）；本次继续使用选择性 staging，未混入提交。

## Rollback

快速回退代码提交：

```bash
git revert 8bed4de
```

或手动回退：
1. `views/trainingCamp.js`：恢复原 `renderTopics()` 卡片结构，删除 `getTopicLabel()` / `getTopicPreviewItems()`。
2. `views/topicDetail.js`：删除 header 小面包屑和 `getTopicLabel()`，恢复原动态 `replace('训练','')` 表达式。
3. `css/views/topic.css`：删除本次新增的 `topic-entry` / breadcrumb / preview / card icon badge 样式。
