# How Well Do You Know Me?

A quiz you build about yourself. Share a short link, friends take it, everyone gets a score (e.g. `8/10`).

- Vanilla HTML/CSS/JS frontend (no build step), English + Thai
- Vercel serverless functions (`/api`) + Upstash Redis for storage
- Correct answers never leave the server; scoring happens in `POST /api/quiz/:id`
- No accounts: creating a quiz returns a private edit link (`/edit/:id#token`); only a SHA-256 hash of the token is stored

## Deploy
1. Push this folder to GitHub.
2. Import the repo in Vercel (no build settings needed).
3. In the Vercel project: **Storage → Create Database → Upstash Redis** (free plan) and connect it to the project. The env vars (`KV_REST_API_URL` / `KV_REST_API_TOKEN`, or `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`) are injected automatically.
4. Redeploy.

## Local dev
```
npm i -g vercel
npm install
vercel link && vercel env pull .env.local
vercel dev
```

## API
| Method | Path | Purpose |
|---|---|---|
| POST | `/api/quiz` | create → `{ id, token }` |
| GET | `/api/quiz/:id` | public quiz (no answers); with `x-edit-token` returns full quiz |
| POST | `/api/quiz/:id` | `{ answers: { [questionId]: index \| text } }` → `{ score, total, results }` |
| PUT / DELETE | `/api/quiz/:id` | update / delete (needs `x-edit-token`) |
