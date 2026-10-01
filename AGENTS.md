# Abelhinhas — children's Bible app (pt-BR)

## Stack
- `client/` — React 18 + Vite (dev server on 5173, published on host port 3000; proxies `/api` to the server)
- `server/` — Express + `pg` + `bcryptjs` (port 8000), sessions in DB, httpOnly cookie `sid`
- `db/` — Postgres 16; schema + seed content run automatically from `db/init.sql` **only on first boot** (fresh `db_data` volume)

## Run
```
docker compose -f docker-compose.base44.yml up -d --build
```
- Web: http://localhost:3000 (preview entry point)
- API health: `curl localhost:8000/api/health`

## Re-seed content
Init.sql only runs when the volume is fresh. To reseed without nuking data:
```
docker compose -f docker-compose.base44.yml exec -T db psql -U abelhinhas -d abelhinhas < db/init.sql  # truncate+insert inside file is idempotent
```
(Never delete the `db_data` volume.)

## Verify app works
- `curl localhost:8000/api/stories?testament=velho` returns seeded stories
- `curl localhost:8000/api/quizzes` returns quizzes; quiz answers are `answer` index inside JSONB `questions`
- Signup/login via `POST /api/auth/signup` / `login` sets the `sid` cookie; `GET /api/auth/me` returns the profile

## Quirks
- All local infra credentials are generated inline in compose (no external secrets needed).
- Third-party OAuth (Google/Apple/Microsoft/Facebook/Instagram/X) is stubbed with "em breve" buttons — would need real OAuth credentials.
- Vite uses `allowedHosts: true` so the preview proxy host is accepted.
