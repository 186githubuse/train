# Quick Task 260629-jgo: 实现后台数据库 V1 第一阶段 - Context

**Gathered:** 2026-06-29
**Status:** Ready for planning

<domain>
## Task Boundary

实现后台数据库 V1 第一阶段：基于 `docs/backend-database-v1-implementation-plan.md`，先新增 Node.js 后端骨架、MySQL schema、环境变量示例、健康检查接口和基础 README；本阶段不接入前端、不做后台 UI、不部署生产。

</domain>

<decisions>
## Implementation Decisions

### 数据库连接方式
- 选择 **MySQL 优先**：按方案文档和 ECS 目标，使用面向 MySQL 的连接方式和 `schema.sql`。本阶段不要为了本地便利改用 SQLite。

### API 范围
- 选择 **健康检查 + 骨架**：第一阶段只做 `/api/health`、统一错误、路由占位和目录结构；不实现学生注册/登录业务，不实现完整同步接口。

### 认证方案
- 选择 **预留 JWT 骨架**：加入 auth middleware、`JWT_SECRET` 环境变量、受保护路由的占位能力；本阶段不接前端、不实现完整登录签发 token 流程。

### Claude's Discretion
- 依项目现状保持“新增后端目录，不改现有前端运行路径”。
- 如需引入 npm 依赖，优先选择轻量稳定组合：`express`、`mysql2`、`cors`、`dotenv`、`jsonwebtoken`，开发依赖可用 `nodemon`。

</decisions>

<specifics>
## Specific Ideas

- 后端建议放在 `server/`。
- 文档/配置至少包含：`server/package.json`、`server/src/app.js` 或等价入口、`server/src/db.js`、`server/src/routes/health.js`、`server/src/middleware/auth.js`、`server/schema.sql`、`server/.env.example`、`server/README.md`。
- 不要修改学生端前端页面，不要新增后台 UI，不要执行生产部署。

</specifics>

<canonical_refs>
## Canonical References

- `docs/backend-database-v1-implementation-plan.md`
- `CLAUDE.md`
- `.planning/STATE.md`

</canonical_refs>
