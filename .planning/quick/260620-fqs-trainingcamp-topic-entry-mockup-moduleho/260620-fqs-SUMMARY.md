# Quick Task 260620-fqs: 横版专题选择页返回模块首页按钮 - Summary

**Completed:** 2026-06-20
**Code commit:** 1bfd0f6

## What changed

在横版 / 桌面端专题选择页补齐返回模块首页入口，对齐此前 mockup 里的左上返回按钮结构。

### Implemented

- `views/trainingCamp.js`
  - 在 `renderTopics()` 的 `.topic-breadcrumb` 内增加圆形返回按钮：`.topic-back-home-btn`。
  - 按钮使用 `data-action="back-module-home"`。
  - 在专题 Tab 渲染分支绑定点击事件：`window.__router.navigate('moduleHome')`。
  - 保留专题卡点击进入 `topicDetail` 的原逻辑。

- `css/views/topic.css`
  - 将桌面端面包屑条调整为更接近 mockup 的玻璃面板。
  - 新增 `.topic-back-home-btn` 圆形玻璃返回按钮样式。
  - 移动端仍因 `.topic-breadcrumb { display: none; }` 不显示返回按钮，保持轻量。

## Verification

- JS 语法检查通过：
  - `node --check views/trainingCamp.js`
- CSS 括号计数通过：
  - `css/views/topic.css`: 175 / 175
  - `css/style.css`: 259 / 259
- 静态检查通过：
  - `back-module-home`
  - `navigate('moduleHome')`
  - `.topic-back-home-btn`
- Playwright + 系统 Chrome 烟测通过：
  - 桌面 1280×820：专题选择页返回按钮可见。
  - 点击返回按钮后 `window.__router.getCurrentView()` 回到 `moduleHome`，并出现 `.module-home-page`。
  - 移动 390×844：`.topic-breadcrumb` 隐藏，因此返回按钮不显示。
  - 截图：
    - `/tmp/topic-selection-back-desktop.png`
    - `/tmp/topic-selection-back-mobile.png`

## Notes

- 本次没有改移动端布局；移动端继续保持轻量。
- 返回按钮是显式回 `moduleHome`，不是依赖历史栈，避免用户从其它入口进入后返回路径不稳定。

## Rollback

```bash
git revert 1bfd0f6
```
