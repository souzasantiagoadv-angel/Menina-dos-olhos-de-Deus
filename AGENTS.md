# Abelhinhas — Base44 Dev Environment

## Setup
The app is a Vite + React + TypeScript project. It runs via `docker-compose.base44.yml`.

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

The dev server (Vite) listens on port 3000 with live reload.

## Key details
- **No build step needed for dev**: Vite serves source directly; `npm install` runs on container startup.
- **`node_modules` is a named volume** so deps persist across restarts without reinstalling.
- **No external secrets required**: The app has no backend or third-party integrations wired yet.
- **Healthcheck**: probes `http://localhost:3000/` via a Node fetch inside the container.

## Verify
```bash
curl -s http://localhost:3000/ | head -5
```
