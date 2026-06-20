# Quick Task 260620-fqs: 横版专题选择页返回模块首页按钮 - Plan

**Date:** 2026-06-20
**Mode:** quick

## Objective

补齐横版专题选择页的返回模块首页入口：从模块首页点击「感觉训练」进入训练营后，在桌面端专题选择页能清楚返回模块首页；移动端仍保持轻量，不显示该增强控件。

## Tasks

1. Markup + behavior
   - 文件：`views/trainingCamp.js`
   - 在 `renderTopics()` 的 `.topic-entry-page` 内，将原面包屑替换为包含圆形返回按钮的桌面面包屑栏。
   - 返回按钮使用 `data-action="back-module-home"`，点击 `window.__router.navigate('moduleHome')`。
   - 绑定事件放在 `_activeTab === 'topic'` 分支，保持专题卡点击逻辑不变。

2. CSS
   - 文件：`css/views/topic.css`
   - 默认移动端隐藏整个桌面面包屑/返回区域。
   - `@media (min-width: 1024px)` 显示横向面包屑栏和圆形玻璃返回按钮。

3. Verification
   - `node --check views/trainingCamp.js`
   - CSS brace count for `css/views/topic.css` and `css/style.css`
   - Browser smoke: desktop shows button and click returns `moduleHome`; mobile button hidden.

## Success criteria

- 桌面端专题选择页左上出现圆形返回按钮 + `感觉训练 › 选择专题`。
- 点击返回按钮进入 `moduleHome`。
- 移动端不显示该按钮/面包屑区域。
- 现有专题卡点击进入 `topicDetail` 不受影响。
