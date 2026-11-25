# Vercel Deployment Guide — Hriday Banquet Hall

This project is arranged for single-project full-stack deployment on **Vercel** (`client/` Vite React frontend + `/api/index.ts` Express serverless backend + pre-populated SQLite data & uploaded images).

## Project Arrangement
- `vercel.json` — Build command (`npm run vercel-build`), static output (`client/dist`), serverless bundle rules, and SPA/API rewrites.
- `api/index.ts` — Vercel Serverless Function entrypoint forwarding `/api/*`, `/uploads/*`, `/robots.txt`, and `/sitemap.xml` to the Express app (`server/dist/index.js`).
- `client/public/uploads/` — Pre-uploaded banquet & reel cover images served directly by Vercel CDN at `/uploads/<filename>`.
- `server/data/hriday_banquet.db` — Bundled SQLite database (copied automatically to writable `/tmp/hriday_banquet.db` on Vercel serverless startup).

## How to Upload / Deploy to Vercel

### Option 1: Deploy via GitHub + Vercel Dashboard (Recommended)
1. Push this project folder (`hriday-banquet-hall`) to a GitHub repository.
2. In **Vercel Dashboard** → **Add New Project** → Import the repository.
3. Keep **Root Directory** as `.` (project root) — `vercel.json` automatically configures the build and output directory.
4. Under **Environment Variables**, add:
   - `JWT_SECRET` = any strong random secret string (e.g., 32+ characters)
   - *(Optional, for persistent cloud database/image storage across cold starts)*:
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `SUPABASE_STORAGE_BUCKET` = `gallery-images`
5. Click **Deploy**.

### Option 2: Deploy Directly from CLI
```bash
npx vercel --prod
```

## Notes on Serverless Storage
- On Vercel, `/tmp/hriday_banquet.db` and `/tmp/uploads/` are used for runtime writes. Pre-seeded services, reels, cover images, contact details (`+91 9604540084`, `sunshineexplores2016@gmail.com`, Pune Google Maps, Instagram & Facebook links), and pre-uploaded `/uploads/*` photos are bundled directly into the deployment.
- If you want Admin Panel edits or new image uploads made in production to persist permanently across serverless cold starts, connect **Supabase** env vars (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET`).
