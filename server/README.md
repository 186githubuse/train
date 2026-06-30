# Backend V1 Stage 2

This isolated backend lives entirely under `server/`. The existing app remains static at the repository root and is not wired to this API in Stage 2.

## Stage 2 scope

Included in this stage:
- standalone Node.js + Express service under `server/`
- `GET /api/health` health check
- MySQL 8 schema foundation in `schema.sql`
- unified JSON error handling
- student auth endpoints:
  - `POST /api/auth/student/register`
  - `POST /api/auth/student/login`
  - `GET /api/auth/me`
- bcryptjs password hashing service
- JWT middleware for the current-student endpoint
- placeholder route modules for sync and admin APIs

Explicit non-goals for this stage:
- no frontend integration / 不接入前端
- no sync API implementation yet
- no admin UI
- no production deployment
- no live MySQL runtime verification requirement

## Requirements

- Node.js 16+ for the current backend code
- MySQL 8 (optional for schema application; not required for syntax verification)

### Current ECS note

The existing `train.tybqcloud.com` ECS is CentOS 7 / glibc 2.17. NodeSource RPM packages for Node.js 20 require `glibc >= 2.28`, so they cannot be installed safely on this host.

For this ECS, use **Node.js 16.20.2 via nvm** as a transition deployment target. Do not upgrade system `glibc` to force Node.js 20; that can break the server. Long term, migrate the backend to a newer OS such as Alibaba Cloud Linux 3, Ubuntu 22.04+, Debian 12, or another host that supports Node.js 20+ cleanly.

## Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` with local values as needed.

## Environment variables

Variables defined in `.env.example`:
- `PORT` - API port, default `3000`
- `NODE_ENV` - runtime environment
- `CORS_ORIGIN` - allowed browser origin for future integration
- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_DATABASE`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `JWT_SECRET` - required for token issuing and `GET /api/auth/me`

Only variable names and placeholders are committed here. Do not commit real credentials.

## Run the backend

Development:

```bash
cd server
npm run dev
```

Production-like local run:

```bash
cd server
npm start
```

## Health check

With the server running:

```bash
curl http://127.0.0.1:3000/api/health
```

Expected response shape:

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "status": "ok",
    "service": "ganjue-training-backend-v1",
    "timestamp": "2026-06-29T00:00:00.000Z",
    "uptime": 1.234,
    "database": {
      "status": "not_configured"
    }
  }
}
```

If MySQL is unavailable, the API still stays up and reports `database.status = "unavailable"` instead of crashing.

## Apply the schema

Create a local MySQL database and run:

```bash
mysql -u root -p < schema.sql
```

Or, if you want to target an existing database name from `.env`:

```bash
mysql -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" -h "$MYSQL_HOST" -P "$MYSQL_PORT" "$MYSQL_DATABASE" < schema.sql
```

`schema.sql` covers the V1 database foundation tables for:
- student accounts and devices
- lesson progress
- mistakes
- challenge records
- topic compositions
- admin accounts and scope
- sync events, snapshots, and logs

## Student auth endpoints

### `POST /api/auth/student/register`

Request body:

```json
{
  "phone": "13800138000",
  "password": "abc12345",
  "name": "小明",
  "grade": 4,
  "deviceId": "web-device-001",
  "localSchemaVersion": 4
}
```

Success response:

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "accessToken": "jwt-token",
    "user": {
      "id": 1,
      "studentUid": "STUABC123",
      "phone": "13800138000",
      "name": "小明",
      "grade": 4,
      "stage": "S",
      "abilityIndex": 0,
      "totalStars": 0,
      "status": 1,
      "lastLoginAt": null,
      "createdAt": "2026-06-29T00:00:00.000Z"
    }
  }
}
```

Error examples:
- `400 invalid_phone|invalid_password|invalid_name|invalid_grade`
- `409 phone_already_exists`
- `503 database_not_configured|database_unavailable`

### `POST /api/auth/student/login`

Request body:

```json
{
  "phone": "13800138000",
  "password": "abc12345",
  "deviceId": "web-device-001",
  "localSchemaVersion": 4
}
```

Success response shape matches register.

Error examples:
- `401 invalid_phone_or_password`
- `403 student_account_disabled`
- `503 database_not_configured|database_unavailable`

### `GET /api/auth/me`

Request header:

```http
Authorization: Bearer <accessToken>
```

Success response:

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "user": {
      "id": 1,
      "studentUid": "STUABC123",
      "phone": "13800138000",
      "name": "小明",
      "grade": 4,
      "stage": "S",
      "abilityIndex": 0,
      "totalStars": 0,
      "status": 1,
      "lastLoginAt": "2026-06-29T00:00:00.000Z",
      "createdAt": "2026-06-28T23:50:00.000Z"
    }
  }
}
```

Error examples:
- `401 missing_bearer_token|invalid_or_expired_token|missing_auth_context`
- `404 student_not_found`

## Security notes

- Passwords are hashed through `bcryptjs` only and are never returned in API responses.
- `JWT_SECRET` must be configured before issuing tokens or calling `GET /api/auth/me`.
- The current student is always resolved from the JWT payload, never from a client-supplied user ID.
- Rate limiting is not implemented in this isolated stage and should be added in a future production-hardening phase.

## Route status in Stage 2

- `GET /api/health` - active
- `POST /api/auth/student/register` - active
- `POST /api/auth/student/login` - active
- `GET /api/auth/me` - active
- `/api/sync/*` - placeholder only, returns `501`
- `/api/admin/*` - placeholder only, returns `501`

## JWT + password services

Implemented modules:
- `src/services/passwordService.js` - `hashPassword()` and `verifyPassword()` via `bcryptjs`
- `src/services/tokenService.js` - student access token signing with `jsonwebtoken`
- `src/middleware/auth.js` - bearer token verification and future role guard

## Verification without live MySQL

This stage does not require a live MySQL runtime check. Use:

```bash
cd server
npm install
npm run check
node --test test/task1-auth-services.test.js
node --test test/task2-auth-controller.test.js
```

You can also verify key implementation surfaces with grep:

```bash
grep -R "bcryptjs\|hashPassword\|verifyPassword" -n src package.json
grep -R "student/register\|student/login\|router.get('/me'\|requireAuth" -n src/routes src/controllers src/middleware
grep -n "UNIQUE KEY uk_student_users_phone\|password_hash" schema.sql
```
