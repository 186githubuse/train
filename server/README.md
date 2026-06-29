# Backend V1 Stage 1

This isolated backend lives entirely under `server/`. The existing app remains static at the repository root and is not wired to this API in Stage 1.

## Stage 1 scope

Included in this stage:
- standalone Node.js + Express service under `server/`
- `GET /api/health` health check
- MySQL 8 schema foundation in `schema.sql`
- unified JSON error handling
- JWT middleware skeleton for future protected routes
- placeholder route modules for auth, sync, and admin APIs

Explicit non-goals for this stage:
- no frontend integration / 不接入前端
- no student register/login business implementation yet
- no admin UI
- no production deployment

## Requirements

- Node.js 18+
- MySQL 8 (optional for health check; recommended for schema validation)

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
- `JWT_SECRET` - required once protected routes are enabled

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

## Route status in Stage 1

- `GET /api/health` - active
- `/api/auth/*` - placeholder only, returns `501`
- `/api/sync/*` - placeholder only, returns `501`
- `/api/admin/*` - placeholder only, returns `501`

## JWT skeleton

`src/middleware/auth.js` exports:
- `requireAuth` - verifies `Authorization: Bearer <token>` with `JWT_SECRET`
- `requireRole(...roles)` - future role guard for admin routes

This stage does not implement login, token issuing, refresh tokens, or frontend auth wiring.
