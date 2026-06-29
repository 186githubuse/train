---
phase: quick-260629-jgo
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - server/package.json
  - server/.env.example
  - server/src/app.js
  - server/src/server.js
  - server/src/config/env.js
  - server/src/db.js
  - server/src/routes/health.js
  - server/src/routes/index.js
  - server/src/routes/auth.js
  - server/src/routes/sync.js
  - server/src/routes/admin.js
  - server/src/middleware/auth.js
  - server/src/middleware/errorHandler.js
  - server/schema.sql
  - server/README.md
autonomous: true
requirements:
  - QUICK-260629-JGO
must_haves:
  truths:
    - "现有学生端仍是根目录静态 App，本阶段不修改前端页面、不接入后台 API。"
    - "开发者可以在 server/ 内安装依赖并启动一个独立 Node.js API 服务。"
    - "GET /api/health 可返回统一 JSON 健康检查结果。"
    - "MySQL 8 schema.sql 覆盖后台数据库 V1 的学生、学习记录、作文、管理员和同步治理表。"
    - "JWT 鉴权中间件存在并可保护未来路由，但本阶段不实现登录签发 token 业务。"
  artifacts:
    - path: "server/package.json"
      provides: "独立 Node/npm 后端项目配置"
    - path: "server/src/app.js"
      provides: "Express app、CORS、JSON 解析、路由和统一错误处理"
    - path: "server/src/routes/health.js"
      provides: "GET /api/health 健康检查"
      exports: ["router"]
    - path: "server/src/middleware/auth.js"
      provides: "JWT skeleton 鉴权中间件"
    - path: "server/schema.sql"
      provides: "MySQL 8 表结构"
      contains: "CREATE TABLE student_users"
    - path: "server/README.md"
      provides: "后端第一阶段使用说明与范围边界"
  key_links:
    - from: "server/src/app.js"
      to: "server/src/routes/index.js"
      via: "app.use('/api', routes)"
      pattern: "app\.use\('/api'"
    - from: "server/src/routes/index.js"
      to: "server/src/routes/health.js"
      via: "router.use('/health', healthRouter)"
      pattern: "healthRouter"
    - from: "server/src/db.js"
      to: "server/src/config/env.js"
      via: "MySQL pool reads MYSQL_* env vars"
      pattern: "MYSQL_"
---

<objective>
Create the first isolated backend/database V1 foundation under `server/` only.

Purpose: introduce a Node.js + MySQL backend base without disturbing the current static student app.
Output: runnable Express skeleton, MySQL schema, environment example, health check endpoint, JWT middleware skeleton, and backend README.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@/Users/mac/Documents/写作demo/杨老师作文训练营/.planning/STATE.md
@/Users/mac/Documents/写作demo/杨老师作文训练营/CLAUDE.md
@/Users/mac/Documents/写作demo/杨老师作文训练营/docs/backend-database-v1-implementation-plan.md
@/Users/mac/Documents/写作demo/杨老师作文训练营/.planning/quick/260629-jgo-v1-docs-backend-database-v1-implementati/260629-jgo-CONTEXT.md

<locked_decisions>
- D-01 MySQL first: use MySQL-oriented config and `server/schema.sql`; do not use SQLite for local convenience.
- D-02 API scope: implement only `/api/health`, unified error handling, route skeletons, and directory structure; do not implement student register/login or full sync APIs.
- D-03 Auth scope: add JWT middleware skeleton and `JWT_SECRET` env var; do not connect frontend or implement login token issuing.
- D-04 Isolation: introduce Node/npm only under `server/`; do not modify current static frontend routes, views, CSS, or deployment path.
- D-05 Exclusions: no frontend integration, no admin UI, no production deployment.
</locked_decisions>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create isolated Express backend skeleton</name>
  <files>server/package.json, server/.env.example, server/src/config/env.js, server/src/app.js, server/src/server.js, server/src/routes/index.js, server/src/routes/health.js, server/src/routes/auth.js, server/src/routes/sync.js, server/src/routes/admin.js, server/src/middleware/errorHandler.js</files>
  <action>Under `server/` only, create a new npm package using CommonJS or ESM consistently. Use lightweight dependencies per user discretion: `express`, `mysql2`, `cors`, `dotenv`, `jsonwebtoken`, with `nodemon` as a dev dependency. Implement `src/app.js` as the Express app with CORS, JSON body parsing, `/api` router mounting, 404 handling, and centralized JSON error handling. Implement `GET /api/health` per D-02 returning `{ code: 0, message: 'ok', data: { status, service, timestamp, uptime, database } }`; database may report `not_configured` or `unavailable` without crashing if local MySQL is not running. Add `auth.js`, `sync.js`, and `admin.js` route files as explicit future route modules that return 501 JSON for non-implemented business endpoints, making clear they are not active features in this stage per D-02/D-05. Do not import or modify any root frontend files per D-04.</action>
  <verify>
    <automated>cd /Users/mac/Documents/写作demo/杨老师作文训练营/server && npm install && node --check src/app.js && node --check src/server.js && node --check src/routes/health.js</automated>
    <automated>cd /Users/mac/Documents/写作demo/杨老师作文训练营/server && PORT=3100 MYSQL_HOST=127.0.0.1 MYSQL_PORT=3306 MYSQL_DATABASE=ganjue_training MYSQL_USER=root MYSQL_PASSWORD=dev JWT_SECRET=dev-secret node src/server.js >/tmp/ganjue-server.log 2>&1 & SERVER_PID=$!; sleep 1; curl -fsS http://127.0.0.1:3100/api/health; kill $SERVER_PID</automated>
  </verify>
  <done>`server/` starts independently, `/api/health` responds with JSON, failed or absent MySQL does not crash health check, and no existing frontend file is modified.</done>
</task>

<task type="auto">
  <name>Task 2: Add MySQL V1 schema and database utility</name>
  <files>server/src/db.js, server/schema.sql</files>
  <action>Create `server/src/db.js` using `mysql2/promise` and env values from `src/config/env.js`; export a pool plus a `checkDatabase()` helper used by health. Create `server/schema.sql` for MySQL 8 per D-01 and `docs/backend-database-v1-implementation-plan.md`, including tables for `student_users`, `student_devices`, `student_lesson_progress`, `student_mistakes`, `student_challenge_records`, `topic_compositions`, `admin_users`, `admin_student_scope`, `sync_events`, `sync_snapshots`, and `sync_logs`. Include primary keys, key unique constraints, relevant indexes, `created_at`/`updated_at` fields, JSON columns where specified, InnoDB, and `utf8mb4`. Do not add seed data requiring real student information.</action>
  <verify>
    <automated>cd /Users/mac/Documents/写作demo/杨老师作文训练营/server && node --check src/db.js && grep -E "CREATE TABLE (student_users|student_lesson_progress|student_mistakes|topic_compositions|admin_users|sync_events)" schema.sql</automated>
  </verify>
  <done>`schema.sql` can be applied to a MySQL 8 database by a developer, and `db.js` exposes reusable MySQL pool/health helpers without requiring SQLite or any frontend dependency.</done>
</task>

<task type="auto">
  <name>Task 3: Add JWT skeleton middleware and backend README</name>
  <files>server/src/middleware/auth.js, server/README.md</files>
  <action>Implement `src/middleware/auth.js` per D-03 with `requireAuth` that reads `Authorization: Bearer <token>`, verifies with `JWT_SECRET`, attaches decoded claims to `req.auth`, and returns unified 401 JSON for missing/invalid tokens. Also export role helper middleware such as `requireRole(...roles)` for future admin route protection, but do not implement login or token issuing. Write `server/README.md` documenting: this backend is isolated under `server/`; the existing app remains static; setup commands; `.env.example` variables; how to run health check; how to apply `schema.sql`; exact first-stage scope; and explicit non-goals: no frontend integration, no admin UI, no production deployment per D-04/D-05.</action>
  <verify>
    <automated>cd /Users/mac/Documents/写作demo/杨老师作文训练营/server && node --check src/middleware/auth.js && test -f README.md && grep -E "existing app remains static|现有.*静态|不接入前端|no frontend" README.md</automated>
  </verify>
  <done>Auth middleware is available for future protected routes, README makes the isolation and non-goals explicit, and environment secrets are documented only in `.env.example` with no real credentials committed.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| HTTP client → Express API | All request headers and bodies are untrusted input. |
| Express API → JWT verifier | Bearer tokens may be missing, malformed, expired, or forged. |
| Express API → MySQL | Database credentials and queries must stay server-side under `server/`. |
| Repository → runtime secrets | Real DB passwords and JWT secrets must not be committed. |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-quick-260629-jgo-01 | Information Disclosure | `server/.env.example`, `server/README.md` | mitigate | Document variable names only; do not write real credentials or API keys. |
| T-quick-260629-jgo-02 | Spoofing | `server/src/middleware/auth.js` | mitigate | Verify JWT via `JWT_SECRET`; reject missing/invalid Bearer tokens with 401 JSON. |
| T-quick-260629-jgo-03 | Denial of Service | `GET /api/health` | mitigate | Health endpoint must catch DB errors and return degraded status instead of crashing the process. |
| T-quick-260629-jgo-04 | Elevation of Privilege | Future admin routes | mitigate | Provide `requireRole(...roles)` skeleton and route modules wired for future protection; do not expose real admin data in this phase. |
| T-quick-260629-jgo-05 | Tampering | MySQL schema | mitigate | Add keys/unique constraints for event idempotency and student-owned records per schema plan. |
</threat_model>

<verification>
Run these after all tasks:

```bash
cd /Users/mac/Documents/写作demo/杨老师作文训练营/server
npm install
node --check src/app.js
node --check src/server.js
node --check src/db.js
node --check src/middleware/auth.js
PORT=3100 MYSQL_HOST=127.0.0.1 MYSQL_PORT=3306 MYSQL_DATABASE=ganjue_training MYSQL_USER=root MYSQL_PASSWORD=dev JWT_SECRET=dev-secret node src/server.js >/tmp/ganjue-server.log 2>&1 & SERVER_PID=$!; sleep 1; curl -fsS http://127.0.0.1:3100/api/health; kill $SERVER_PID
grep -E "CREATE TABLE (student_users|student_lesson_progress|student_mistakes|topic_compositions|admin_users|sync_events)" schema.sql
```
</verification>

<success_criteria>
- A single isolated backend exists under `/Users/mac/Documents/写作demo/杨老师作文训练营/server`.
- `/api/health` works locally without requiring production deployment.
- MySQL schema covers the V1 database foundation from the implementation plan.
- JWT middleware skeleton exists, but no login/token issuing business is implemented.
- No files outside `server/` are modified by implementation.
</success_criteria>

<output>
After completion, create `/Users/mac/Documents/写作demo/杨老师作文训练营/.planning/quick/260629-jgo-v1-docs-backend-database-v1-implementati/260629-jgo-SUMMARY.md`
</output>
