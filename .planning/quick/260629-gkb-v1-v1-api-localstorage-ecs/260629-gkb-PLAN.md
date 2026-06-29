---
phase: quick-260629-gkb-v1-v1-api-localstorage-ecs
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - docs/backend-database-v1-implementation-plan.md
autonomous: true
requirements:
  - QUICK-DOC-01
must_haves:
  truths:
    - "开发者能从文档判断后台数据库 V1 做什么、不做什么，以及为什么保留前端 localStorage 兼容层。"
    - "开发者能按文档落地数据库表结构、API 接口、后台页面和 ECS 部署顺序。"
    - "文档明确当前纯前端 App 与未来后台同步之间的数据边界，避免一次性重写前端。"
  artifacts:
    - path: "docs/backend-database-v1-implementation-plan.md"
      provides: "《后台数据库 V1 实施方案》完整方案文档"
      contains: "V1 功能范围"
    - path: "docs/backend-database-v1-implementation-plan.md"
      provides: "数据库表结构与 API 接口清单"
      contains: "localStorage 兼容同步策略"
    - path: "docs/backend-database-v1-implementation-plan.md"
      provides: "后台页面结构、ECS 部署方案和开发顺序"
      contains: "开发顺序"
  key_links:
    - from: "docs/backend-database-v1-implementation-plan.md"
      to: "js/store.js"
      via: "文档中的 localStorage schemaVersion: 4 兼容说明"
      pattern: "schemaVersion.*4|ganjue_training_state"
    - from: "docs/backend-database-v1-implementation-plan.md"
      to: "ECS 部署方案"
      via: "文档说明现有 train.tybqcloud.com + nginx 部署与新增 Node/MySQL 后台的关系"
      pattern: "train.tybqcloud.com|ECS|nginx|MySQL"
---

<objective>
创建一份可执行的《后台数据库 V1 实施方案》文档，作为后续实现云端账号、学习数据同步、教师/后台管理与 ECS 部署的蓝图。

Purpose: 当前 App 仍以纯前端 localStorage 为主，下一步需要接入数据库和后台，但必须先限定 V1 范围、保留兼容策略，避免直接重写现有成熟前端。
Output: `docs/backend-database-v1-implementation-plan.md`，包含 V1 功能范围、暂不做内容、数据库表结构、API 接口、前端 localStorage 兼容同步策略、后台页面结构、ECS 部署方案和开发顺序。
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/STATE.md
@CLAUDE.md
@js/store.js
@views/onboarding.js
@views/report.js
@views/mistakeBook.js
@views/topicCompose.js
@js/topicAI.js

<project_constraints>
- 本任务只写方案文档，不实现后端代码、不改前端逻辑、不创建数据库迁移。
- 现有 App 是纯原生 HTML/CSS/JS，无构建工具；V1 方案必须尊重这一现状。
- 现有持久化核心是 `localStorage` key `ganjue_training_state`，`store.js` 当前 schemaVersion 为 4。
- 正式站点为 `https://train.tybqcloud.com`，当前 ECS + nginx + git pull 部署；后续后台可规划为同 ECS 上 Node.js API + MySQL，但不要在本任务中执行部署。
- API 密钥后端代理是上线前必做安全项，但本方案的主题是后台数据库 V1；可以在部署/安全章节说明与 FC/代理的关系，不要把它扩展成完整安全改造实施计划。
</project_constraints>
</context>

<tasks>

<task type="auto">
  <name>Task 1: 梳理 V1 范围、数据边界与 localStorage 兼容策略</name>
  <files>docs/backend-database-v1-implementation-plan.md</files>
  <action>新建《后台数据库 V1 实施方案》文档。先写清背景、目标、V1 功能范围、V1 暂不做内容。必须明确 V1 不是重写前端，而是在现有 `store.js` / `localStorage` 之上增加登录身份、云端同步和后台查看能力。写出前端兼容策略：首次登录如何从 localStorage 上传、云端数据如何下发合并、离线/接口失败时如何继续使用本地数据、schemaVersion 如何演进、哪些字段仍保留本地兜底。不要写“以后再接”这种空泛表述；每个同步策略都要说明触发时机、冲突处理和失败兜底。</action>
  <verify>
    <automated>test -f docs/backend-database-v1-implementation-plan.md && grep -q "V1 功能范围" docs/backend-database-v1-implementation-plan.md && grep -q "暂不做" docs/backend-database-v1-implementation-plan.md && grep -q "localStorage" docs/backend-database-v1-implementation-plan.md && grep -q "ganjue_training_state" docs/backend-database-v1-implementation-plan.md</automated>
  </verify>
  <done>文档存在，且包含 V1 范围、暂不做内容、localStorage key、兼容同步策略、冲突处理和失败兜底说明。</done>
</task>

<task type="auto">
  <name>Task 2: 设计数据库表结构与 API 接口清单</name>
  <files>docs/backend-database-v1-implementation-plan.md</files>
  <action>在同一文档中补充数据库和 API 章节。数据库表结构至少覆盖：学生/用户、学习进度、错题记录、挑战记录、专题书写/作文记录、管理员/教师账号、可选的同步日志或事件表。每张表写字段、类型建议、主键/唯一键、索引、与现有 store 字段的映射。API 接口至少覆盖：登录/注册或学生创建、获取当前用户数据、全量/增量同步学习状态、提交课时进度、提交错题状态、提交挑战记录、提交专题作文/评分记录、后台列表查询。每个 API 写 method、path、请求体、响应体、鉴权要求和错误处理。保持 V1 可落地：避免设计实时协作、多租户复杂权限、内容管理系统等暂不做能力。</action>
  <verify>
    <automated>grep -q "数据库表结构" docs/backend-database-v1-implementation-plan.md && grep -q "API 接口" docs/backend-database-v1-implementation-plan.md && grep -q "lessonProgress" docs/backend-database-v1-implementation-plan.md && grep -q "mistakes" docs/backend-database-v1-implementation-plan.md && grep -q "challengeRecords" docs/backend-database-v1-implementation-plan.md && grep -q "topic" docs/backend-database-v1-implementation-plan.md</automated>
  </verify>
  <done>文档包含可直接转化为 MySQL 建表和 Node.js API 的表结构/API 清单，并明确映射现有 store 数据结构。</done>
</task>

<task type="auto">
  <name>Task 3: 补齐后台页面、ECS 部署方案和开发顺序</name>
  <files>docs/backend-database-v1-implementation-plan.md</files>
  <action>在同一文档中补充后台页面结构、ECS 部署方案、开发顺序和验收清单。后台页面至少包含：登录页、学生列表、学生详情/学习报告、错题记录、作文/专题记录、数据概览。ECS 部署方案说明现有 nginx 静态站点与新增 Node.js API/MySQL 的部署关系、推荐目录、进程管理、反向代理路径、环境变量、备份和日志。开发顺序要按可验证里程碑排列：数据库初始化 → API 骨架 → 前端同步适配 → 后台页面 → 部署联调 → 数据备份/回滚。最后加“实施前待确认问题”，列出需要用户/客户确认的账号体系、手机号/密码/班级字段、教师权限、是否迁移历史 localStorage 数据等。</action>
  <verify>
    <automated>grep -q "后台页面结构" docs/backend-database-v1-implementation-plan.md && grep -q "ECS 部署方案" docs/backend-database-v1-implementation-plan.md && grep -q "开发顺序" docs/backend-database-v1-implementation-plan.md && grep -q "验收清单" docs/backend-database-v1-implementation-plan.md && grep -q "实施前待确认" docs/backend-database-v1-implementation-plan.md</automated>
  </verify>
  <done>文档从产品范围到部署实施形成闭环，后续可按开发顺序拆分为实际后端/前端/部署任务。</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| 文档读者→后续实现 | 本任务产出方案，不接收运行时输入；主要风险是方案遗漏安全边界导致后续实现误用。 |
| 未来前端→未来 API | 文档需要提醒后续实现所有同步接口都接收不可信客户端输入。 |
| 未来后台→学生数据 | 文档需要提醒后续实现后台涉及未成年人学习数据，必须有鉴权和最小权限。 |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-quick-260629-01 | I | 方案文档中的学生数据设计 | mitigate | 在文档的安全/部署章节明确学生数据不放前端可枚举接口，后台接口需登录鉴权，生产环境 env 存储数据库密码和 API key。 |
| T-quick-260629-02 | T | 学习进度同步 API 设计 | mitigate | 在 API 章节要求服务端校验用户身份与数据归属，不能信任客户端传入 userId 直接写入。 |
| T-quick-260629-03 | D | ECS 单机 MySQL/Node 部署 | mitigate | 在部署章节要求数据库备份、日志轮转、进程守护和回滚路径。 |
</threat_model>

<verification>
整体检查：

```bash
test -f docs/backend-database-v1-implementation-plan.md
grep -q "V1 功能范围" docs/backend-database-v1-implementation-plan.md
grep -q "数据库表结构" docs/backend-database-v1-implementation-plan.md
grep -q "API 接口" docs/backend-database-v1-implementation-plan.md
grep -q "localStorage 兼容同步策略" docs/backend-database-v1-implementation-plan.md
grep -q "后台页面结构" docs/backend-database-v1-implementation-plan.md
grep -q "ECS 部署方案" docs/backend-database-v1-implementation-plan.md
grep -q "开发顺序" docs/backend-database-v1-implementation-plan.md
```
</verification>

<success_criteria>
- `docs/backend-database-v1-implementation-plan.md` 是一份完整中文方案文档。
- 文档明确 V1 做什么、暂不做什么，避免范围蔓延。
- 文档包含数据库表结构、API 接口、localStorage 兼容同步策略、后台页面结构、ECS 部署方案、开发顺序、验收清单和实施前待确认问题。
- 文档不实现任何代码，不修改现有前端行为。
</success_criteria>

<output>
After completion, create `.planning/quick/260629-gkb-v1-v1-api-localstorage-ecs/260629-gkb-SUMMARY.md`
</output>
