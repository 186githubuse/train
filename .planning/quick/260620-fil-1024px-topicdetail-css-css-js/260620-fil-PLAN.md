# Quick Task 260620-fil: 专题选择页横版强化、竖版轻量 - Plan

**Date:** 2026-06-20
**Mode:** quick

## Objective

让上一轮专题选择页增强只在横版/桌面端承担主要视觉层级；竖版/移动端保持轻量，避免专题卡被对象预览和面包屑拉高。

## Tasks

1. CSS 响应式收敛
   - 文件：`css/views/topic.css`
   - 默认移动端：隐藏 `.topic-breadcrumb`、`.topic-preview`、`.topic-detail-crumb`。
   - 桌面端 `@media (min-width: 1024px)`：恢复显示入口面包屑、对象预览和详情页小面包屑。
   - 保留卡片标题去重（静物/植物/动物/景物）和锁定态文案，这是内容层级优化，不会明显增加竖版高度。

2. 验证
   - CSS brace count：`topic.css` 与 `style.css`。
   - JS syntax：`views/trainingCamp.js`、`views/topicDetail.js`。
   - 浏览器烟测：桌面端能看到面包屑/预览；移动端隐藏面包屑/预览但仍可进入专题。

3. 记录与提交
   - 提交代码。
   - 写 `260620-fil-SUMMARY.md`。
   - 更新 `.planning/STATE.md` Quick Tasks Completed。

## Success criteria

- `<1024px`：专题入口不显示对象预览，不显示入口面包屑；`topicDetail` 不显示小面包屑。
- `≥1024px`：专题入口显示 `感觉训练 › 选择专题`、对象预览、图标增强；`topicDetail` 显示 `感觉训练 › 当前专题`。
- CSS/JS 验证通过。
