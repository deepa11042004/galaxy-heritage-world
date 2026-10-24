# Admin panel

Manages **Hotels & Resorts, Destinations, Itineraries (with day-by-day schedules), Day Outings** and **Settings & Users**.
Enquiries and Vouchers keep their existing pages (`/admin/enquiries`, `/admin/vouchers`), linked from the sidebar.

- UI: Next.js, `frontend/src/app/admin/(panel)` (shell: `components/admin/AdminShell.tsx`)
- API: Express, `backend/src/routes/admin.routes.ts` → `/api/v1/admin/*`
- Data: existing Prisma/MySQL tables (`destinations`, `hotels`, `packages`, `activities`, `users`, `roles`, …)
- Sign in at `/login`; unauthenticated visits to `/admin/*` are redirected there.

## Roles

| Role | Can do |
| --- | --- |
| EDITOR | view, create, edit, publish/unpublish, upload images |
| ADMIN | + delete content |
| SUPER_ADMIN | + manage users (create, change role, deactivate, reset password) |

Enforced on the server (`authorizeRoles`), not just hidden in the UI. Deletes are soft (`deleted_at`), a destination
that still has hotels/packages cannot be deleted, and the last active Super Admin cannot be demoted or deactivated.
Every change is written to `audit_logs`.

## Public site integration

Public endpoints only return `is_published = 1 AND deleted_at IS NULL`. After each admin write the API calls
`POST {FRONTEND_REVALIDATE_URL}` (header `x-revalidate-secret`) and the site refreshes its `content` cache tag, so changes
show immediately; without it pages refresh within 60 seconds. The Day Outings page (`/day-activities`) is built from the
`activities` table: outings with a gallery **and** a YouTube id become featured cards, categories containing
"water"/"amusement" go to the water-park section, everything else to the outings section.

## Environment variables (names only — never commit values)

| Variable | Where | Notes |
| --- | --- | --- |
| `DATABASE_URL` | backend | MySQL connection string |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `COOKIE_SECRET` | backend | ≥ 32 random chars; the API refuses to start in production otherwise |
| `CORS_ORIGIN` | backend | comma-separated list of allowed browser origins |
| `FRONTEND_REVALIDATE_URL`, `REVALIDATE_SECRET` | backend (+ `REVALIDATE_SECRET` in frontend) | optional instant cache refresh |
| `NEXT_PUBLIC_API_URL` | frontend | e.g. `https://api.example.com/api/v1`; baked in at build time |
| `API_INTERNAL_URL` | frontend | server-side API URL; `/media/uploads/*` is proxied to it (set before `next build`) |

In production the API and the site should share a registrable domain (e.g. `api.` and `www.`) because the session is an
httpOnly `SameSite=Lax` cookie, and the API must run with `NODE_ENV=production` so cookies are `Secure`.

## Database

Migrations live in `backend/prisma/migrations` (`0_init` is the baseline of the existing schema, already marked as applied;
`1_activity_gallery_video` adds `gallery` and `video_id` to `activities`). Apply with `npx prisma migrate deploy`.

Before any risky change, take a backup (read-only, writes JSON per table to `backend/backups/`, git-ignored):

```
cd backend && npx tsx scripts/backup-db.ts
```

`scripts/one-off/import-day-outings.ts` was the one-off import of the old static day-outings content (idempotent, never overwrites).

## Tests

```
cd backend  && npm test                                   # API integration tests (admin.test.ts, api.test.ts)
cd frontend && ADMIN_E2E_EMAIL=… ADMIN_E2E_PASSWORD=… \
  npx playwright test -c playwright.admin.config.ts       # browser tests; needs API :4000 and web :3000 running
cd backend  && npx tsx scripts/cleanup-test-data.ts       # removes leftover "zz-…" test records
```

The tests run against the configured database and prefix everything they create with `zz-`.
