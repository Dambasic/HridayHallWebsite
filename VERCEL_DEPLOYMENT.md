# Vercel Deployment Guide — Hriday Banquet Hall

This project is arranged for single-project full-stack deployment on **Vercel** using Vercel Services (`client` Vite frontend + `server` Express backend) with **Turso Cloud SQLite** + **Supabase Storage** support.

## Recommended Production Environment Variables (Vercel)

Add these under **Vercel Project → Settings → Environment Variables**:

### 1. Required Authentication Secret
- `JWT_SECRET` = strong random secret (e.g., `617ff3bc2498df2412662b43cf4dfbe03798e3f5bb70cd32c150ce832fa51a61`)

### 2. Persistent Cloud Database (Turso Cloud SQLite)
1. Create a free database at [turso.tech](https://turso.tech) (e.g. `hriday-banquet`).
2. Copy the Database URL and generate an Auth Token (`turso db tokens create hriday-banquet`).
3. Add in Vercel Environment Variables:
   - `TURSO_DATABASE_URL` = `libsql://your-db-name.turso.io`
   - `TURSO_AUTH_TOKEN` = `your-turso-auth-token`
   - On the first request, the server automatically creates all tables and seeds the initial data (including services, reels, contact `+91 9604540084`, email `sunshineexplores2016@gmail.com`, Pune Google Maps, and Instagram/Facebook links).

### 3. Persistent Cloud Image Storage (Supabase Storage)
1. Create a free project at [supabase.com](https://supabase.com) → **Storage** → **New Bucket** named `gallery-images` with **Public Bucket** enabled.
2. Add in Vercel Environment Variables:
   - `SUPABASE_URL` = `https://your-project-id.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = `your-supabase-service-role-key`
   - `SUPABASE_STORAGE_BUCKET` = `gallery-images`

> Without `TURSO_DATABASE_URL`, the server automatically falls back to `sql.js` in `/tmp/hriday_banquet.db` on Vercel (read/write during warm containers, ephemeral on cold starts) and `node:sqlite` locally.
