# Quick Task 260620-fil: 专题选择页横版强化、竖版轻量 - Summary

**Completed:** 2026-06-20
**Code commit:** 87f3405

## What changed

将上一轮专题选择页增强改成响应式策略：

- `<1024px` 竖版 / 移动端：保持轻量，不显示入口面包屑、不显示对象预览、不显示 `topicDetail` 小面包屑，避免卡片过高。
- `≥1024px` 横版 / 桌面端：保留强化层级，显示 `感觉训练 › 选择专题`、对象预览、`topicDetail` 小面包屑。

### Implemented

- `css/views/topic.css`
  - `.topic-breadcrumb` 默认 `display: none`，桌面端恢复 `inline-flex`。
  - `.topic-preview` 默认 `display: none`，桌面端恢复 `grid`。
  - `.topic-detail-crumb` 默认 `display: none`，桌面端恢复 `flex`。

## Verification

- JS 语法检查通过：
  - `node --check views/trainingCamp.js`
  - `node --check views/topicDetail.js`
- CSS 括号计数通过：
  - `css/views/topic.css`: 172 / 172
  - `css/style.css`: 259 / 259
- 静态响应式规则检查通过。
- Playwright + 系统 Chrome 响应式烟测通过：
  - 桌面 1280×820：专题入口面包屑可见、对象预览可见、`topicDetail` 小面包屑可见。
  - 移动 390×844：专题入口面包屑隐藏、对象预览隐藏、`topicDetail` 小面包屑隐藏。
  - 移动端专题标题仍保留去重后的「静物 / 植物 / 动物 / 景物」。
  - 截图：
    - `/tmp/topic-selection-desktop-responsive.png`
    - `/tmp/topic-selection-mobile-responsive.png`

## Notes

- 本次只改 CSS，不改 JS 逻辑和数据。
- 移动端仍保留卡片标题去重与锁定态文案，因为这些不会增加明显高度，且有助于语义清晰。

## Rollback

```bash
git revert 87f3405
```
