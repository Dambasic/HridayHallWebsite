import express from 'express';
import cors from 'cors';
import path from 'node:path';
import dotenv from 'dotenv';
import { initDatabaseEngine, initDatabase, sqliteDb, activeDbEngine, getSupabaseClient } from './db/database.js';
import { seedDatabase } from './db/seed.js';
import { runMigrationsAndSeed } from './db/migrateAndSeed.js';
import publicRouter from './routes/public.js';
import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js';

dotenv.config();

const currentDir = __dirname;

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve static uploads (bundled + /tmp uploads on serverless)
const uploadsPath = path.resolve(currentDir, '../uploads');
app.use('/uploads', express.static(uploadsPath));
if (process.env.VERCEL || process.env.NOW_REGION) {
  app.use('/uploads', express.static('/tmp/uploads'));
}

// Lazy one-time initialization guard (safe for both Vercel serverless and local dev)
let startupPromise: Promise<void> | null = null;
async function ensureInitialized(): Promise<void> {
  if (!startupPromise) {
    startupPromise = (async () => {
      await initDatabaseEngine();
      await initDatabase();
      await seedDatabase();
      await runMigrationsAndSeed();
    })().catch((err) => {
      startupPromise = null;
      throw err;
    });
  }
  return startupPromise;
}

app.use(async (req, res, next) => {
  try {
    await ensureInitialized();
    next();
  } catch (err: any) {
    console.error('❌ Database startup error:', err);
    res.status(500).json({
      error: 'Database initialization failed',
      message: err?.message || String(err),
      path: req.path,
    });
  }
});

// Prevent stale browser/CDN caching for dynamic CMS API responses
app.use('/api', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// API Routes
app.use('/api/public', publicRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    brand: 'Hriday Banquet Hall',
    dbEngine: activeDbEngine,
    storageConfigured: Boolean(getSupabaseClient()),
    storageBucket: (process.env.SUPABASE_STORAGE_BUCKET || 'gallery-images').trim(),
    timestamp: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// TECHNICAL SEO: Robots.txt & Dynamic XML Sitemap
// -------------------------------------------------------------
app.get('/robots.txt', (_req, res) => {
  res.header('Content-Type', 'text/plain; charset=utf-8');
  res.send(`# Robots.txt for Hriday Banquet Hall
# Technical SEO Directives

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/admin/
Disallow: /api/auth/

# XML Sitemap Location
Sitemap: https://hridaybanquethall.com/sitemap.xml
`);
});

app.get('/sitemap.xml', async (_req, res) => {
  try {
    const baseUrl = 'https://hridaybanquethall.com';
    const now = new Date().toISOString();

    const services = (await sqliteDb
      .prepare('SELECT slug, updated_at FROM services WHERE is_active = 1 ORDER BY display_order ASC')
      .all()) as Array<{ slug: string; updated_at?: string }>;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

    // 1. Homepage
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>1.0</priority>\n`;
    xml += `  </url>\n`;

    // 2. Active Service Landing Pages
    for (const s of services) {
      const lastMod = s.updated_at || now;
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/services/${s.slug}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.85</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  } catch (err) {
    console.error('Error generating sitemap:', err);
    res.status(500).send('Error generating XML sitemap');
  }
});

// Production: serve built client assets if available
const clientDistPath = path.resolve(currentDir, '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('Hriday Banquet Hall API Server Running. Please run the frontend client or build it.');
    }
  });
});

if (!process.env.VERCEL && !process.env.NOW_REGION) {
  ensureInitialized()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`✨ Hriday Banquet Hall Server running at http://localhost:${PORT}`);
        console.log(`📁 Uploads served from ${uploadsPath}`);
      });
    })
    .catch((err) => {
      console.error('❌ Failed to start local server:', err);
      process.exit(1);
    });
}

export default app;
