# 杨老师感觉训练写作营

## What This Is

面向小学生的感觉训练闯关 App，通过 10 节课 + 180 道题帮助学生培养写作感知力（看/听/闻/尝/摸五感）。纯原生 Web 应用，移动端优先，马卡龙液态玻璃风格。核心功能已全部完成，当前处于客户测试阶段，下一步目标是修复已知问题、完善内容、并推进正式上线。

## Core Value

学生能通过闯关答题感受到"用感觉写作文"的方法，并用魔法机器把自己的感觉素材变成一篇作文。

## Requirements

### Validated

- ✓ 训练营关卡地图（10节课，马卡龙色系，聚光灯效果）— 已完成
- ✓ 课程详情页（视频占位 + 知识点 + 进入答题）— 已完成
- ✓ 答题页（自适应难度，连续答对3题通关，正误反馈）— 已完成
- ✓ 学习报告（能力指数、五感雷达图、错题本入口）— 已完成
- ✓ 错题本（按知识点筛选，支持重做）— 已完成
- ✓ 挑战赛（限时答题，历史记录，评级）— 已完成
- ✓ 魔法机器（7步感觉引导 + AI生成作文，预生成缓存）— 已完成
- ✓ 注册/登录（手机号+密码，localStorage，预留CloudBase接口）— 已完成
- ✓ 勋章馆（7枚勋章，解锁条件，一屏显示）— 已完成
- ✓ 积分系统（星星+称号，防刷机制）— 已完成
- ✓ 全站 Phosphor Icons（替换所有 emoji）— 已完成
- ✓ 响应式布局（手机全屏 / 桌面420px居中）— 已完成
- ✓ 视频托管（腾讯云COS，1-3、5-9课已上传）— 已完成

### Active

- [ ] 修复已知 Bug（挑战赛刷星、双重记录错题、事件监听器泄漏等）
- [ ] 恢复课程顺序解锁逻辑（去掉 `return true`，客户测试结束后）
- [ ] 专题训练内容填充（5个专题模块，目前全部"即将上线"）
- [ ] 第4课、第10课视频替换为正式版
- [ ] 题库更新（客户审阅 Word 文档后同步到 questions.js）
- [ ] 上线改造（CloudBase 云端数据、手机号/微信登录、备案后启动）
- [ ] 后台管理端（教师/家长查看学生进度）

### Out of Scope

- 原生 App（iOS/Android）— Web 优先，上线验证后再考虑
- 实时多人对战 — 复杂度高，非核心价值
- 自动化测试套件 — 纯前端手动验证足够，无构建工具
- 视频制作/编辑 — 视频由外部团队提供，App 只留接口

## Context

- 技术栈：纯原生 HTML/CSS/JS（ES Module），Tailwind CSS CDN，无框架无构建工具
- 数据持久化：localStorage（`ganjue_training_state`），上线后迁移至腾讯云 CloudBase
- AI 接口：通过代理 `ai.itlsj.com` 调用 Claude Haiku（对话/作文）和 Gemini Flash（图片识别）
- 视频托管：腾讯云 COS（`yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com`）
- 当前状态：客户测试中，`store.isUnlocked()` 临时返回 `true`（全课程开放）
- Git 远程：`git@github.com:186githubuse/train.git`

## Constraints

- **Tech Stack**: 纯原生 Web，无 Node.js/打包器 — 客户环境限制，保持零依赖部署
- **Security**: API 密钥当前硬编码在 `js/config.js`，上线前必须迁移到后端代理
- **Data**: localStorage 上限约 5MB，上线前必须接入云端存储
- **Timeline**: 备案完成后启动上线改造（时间待定）
- **Content**: 题库和视频依赖客户审阅/外部团队，存在外部依赖

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 纯原生 Web，无框架 | 零依赖部署，客户环境简单 | ✓ Good |
| localStorage 持久化 | 快速开发，无需后端 | ⚠️ Revisit — 上线前必须换云端 |
| AI 密钥放客户端 | 快速原型 | ⚠️ Revisit — 上线前必须代理到后端 |
| 选项引导式魔法机器（非自由输入） | 避免小学生乱输入 | ✓ Good |
| 腾讯云 COS 托管视频 | 30MB 以内可用 GitHub Pages，大文件用 COS | ✓ Good |
| itlsj 代理（haiku ~2s vs comfly ~50s） | 速度差异显著 | ✓ Good |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-08 after initialization*
