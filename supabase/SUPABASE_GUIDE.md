# Supabase PostgreSQL & Storage Setup Guide

Hriday Banquet Hall is designed with dual-database and cloud-storage architecture:
1. **Zero-Config Local Mode**: Runs out of the box using built-in high-performance SQLite (`server/data/hriday_banquet.db`) with file uploads saved to `server/uploads/`.
2. **Production Supabase Mode**: Connects directly to Supabase PostgreSQL with Row Level Security (RLS) policies and Supabase Storage for banquet photography.

---

## Setting Up Supabase (Optional for Cloud Production)

### 1. Create a Project on Supabase
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Note your **Project URL**, **Anon Key**, and **Service Role Key** (under Project Settings -> API).

### 2. Run Database Migration
1. In the Supabase Dashboard, go to the **SQL Editor**.
2. Copy and paste the contents of `supabase/schema.sql` and click **Run**.
3. Copy and paste the contents of `supabase/seed.sql` and click **Run**.

### 3. Setup Supabase Storage Bucket
1. In the Supabase Dashboard, navigate to **Storage**.
2. Click **New Bucket**.
3. Name the bucket `gallery-images` and toggle **Public Bucket** to ON.
4. Save the bucket.

### 4. Configure Backend Environment
In `server/.env`, provide:
```env
PORT=5001
JWT_SECRET=hriday_banquet_super_secret_jwt_key_2026

# Supabase Credentials
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_STORAGE_BUCKET=gallery-images
```

When these environment variables are provided, the backend seamlessly routes image uploads to your Supabase Storage bucket and syncs with Supabase PostgreSQL!
