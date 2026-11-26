import fs from 'node:fs';
import path from 'node:path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const currentDir = __dirname;

const isVercel = Boolean(process.env.VERCEL || process.env.NOW_REGION);

function resolveBundledDbPath(): string {
  const candidates = [
    path.resolve(currentDir, '../../data/hriday_banquet.db'),
    path.resolve(process.cwd(), 'data/hriday_banquet.db'),
    path.resolve(process.cwd(), 'server/data/hriday_banquet.db'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return candidates[0];
}

const bundledDbPath = resolveBundledDbPath();
let dbFilePath = isVercel ? path.join('/tmp', 'hriday_banquet.db') : bundledDbPath;

export interface PreparedStatementLike {
  run: (...params: any[]) => Promise<any>;
  get: (...params: any[]) => Promise<any>;
  all: (...params: any[]) => Promise<any[]>;
}

export interface SqliteDbLike {
  exec: (sql: string) => Promise<void>;
  prepare: (sql: string) => PreparedStatementLike;
}

let activeDb: SqliteDbLike | null = null;
export let activeDbEngine: 'turso' | 'node:sqlite' | 'sql.js' | 'uninitialized' = 'uninitialized';

function normalizeParams(params: any[]): any[] {
  return params.map((p) => (p === undefined ? null : p));
}

export async function initDatabaseEngine(): Promise<'turso' | 'node:sqlite' | 'sql.js'> {
  if (activeDb && activeDbEngine !== 'uninitialized') {
    return activeDbEngine;
  }

  // 1. Turso Cloud SQLite (libSQL pure-web HTTP/WS client — zero native binary dependencies)
  const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
  if (tursoUrl) {
    const { createClient: createLibsqlClient } = await import('@libsql/client/web');
    const client = createLibsqlClient({
      url: tursoUrl,
      authToken: process.env.TURSO_AUTH_TOKEN?.trim(),
    });
    await client.execute('PRAGMA foreign_keys = ON;');

    activeDb = {
      async exec(sql: string) {
        await client.executeMultiple(sql);
      },
      prepare(sql: string): PreparedStatementLike {
        return {
          async run(...params: any[]) {
            const res = await client.execute({ sql, args: normalizeParams(params) });
            return { changes: res.rowsAffected };
          },
          async get(...params: any[]) {
            const res = await client.execute({ sql, args: normalizeParams(params) });
            return res.rows[0] ? { ...res.rows[0] } : undefined;
          },
          async all(...params: any[]) {
            const res = await client.execute({ sql, args: normalizeParams(params) });
            return res.rows.map((r) => ({ ...r }));
          },
        };
      },
    };

    activeDbEngine = 'turso';
    console.log('☁️ Connected to Turso Cloud SQLite.');
    return activeDbEngine;
  }

  // 2. Local native node:sqlite on Node 22.5+/24
  if (!isVercel) {
    try {
      const localDataDir = path.dirname(dbFilePath);
      if (!fs.existsSync(localDataDir)) {
        fs.mkdirSync(localDataDir, { recursive: true });
      }
      const { DatabaseSync } = await import('node:sqlite');
      const nativeDb = new DatabaseSync(dbFilePath);
      nativeDb.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
      activeDb = {
        async exec(sql: string) {
          nativeDb.exec(sql);
        },
        prepare(sql: string): PreparedStatementLike {
          const stmt = nativeDb.prepare(sql);
          return {
            async run(...params: any[]) {
              return stmt.run(...normalizeParams(params));
            },
            async get(...params: any[]) {
              return stmt.get(...normalizeParams(params));
            },
            async all(...params: any[]) {
              return stmt.all(...normalizeParams(params));
            },
          };
        },
      };
      activeDbEngine = 'node:sqlite';
      return activeDbEngine;
    } catch (err) {
      console.warn('⚠️ node:sqlite unavailable, falling back to sql.js:', err);
    }
  }

  // 3. Pure WASM sql.js fallback (works on any Vercel serverless container)
  if (isVercel && !fs.existsSync(dbFilePath) && fs.existsSync(bundledDbPath)) {
    try {
      fs.copyFileSync(bundledDbPath, dbFilePath);
    } catch {
      // ignore
    }
  }
  const sqlJsModule = await import('sql.js/dist/sql-wasm-inline.js');
  const initSqlJs = (sqlJsModule.default || sqlJsModule) as any;
  const SQL = await initSqlJs();

  const existingBuffer = fs.existsSync(dbFilePath) ? fs.readFileSync(dbFilePath) : undefined;
  const wasmDb = existingBuffer ? new SQL.Database(existingBuffer) : new SQL.Database();
  wasmDb.run('PRAGMA foreign_keys = ON;');

  const persist = () => {
    try {
      const data = wasmDb.export();
      fs.writeFileSync(dbFilePath, Buffer.from(data));
    } catch (e) {
      console.warn('⚠️ Failed to persist sql.js buffer:', e);
    }
  };

  activeDb = {
    async exec(sql: string) {
      wasmDb.exec(sql);
      persist();
    },
    prepare(sql: string): PreparedStatementLike {
      return {
        async run(...params: any[]) {
          const stmt = wasmDb.prepare(sql);
          try {
            stmt.run(normalizeParams(params));
            persist();
            return { changes: wasmDb.getRowsModified() };
          } finally {
            stmt.free();
          }
        },
        async get(...params: any[]) {
          const stmt = wasmDb.prepare(sql);
          try {
            stmt.bind(normalizeParams(params));
            return stmt.step() ? stmt.getAsObject() : undefined;
          } finally {
            stmt.free();
          }
        },
        async all(...params: any[]) {
          const stmt = wasmDb.prepare(sql);
          const rows: any[] = [];
          try {
            stmt.bind(normalizeParams(params));
            while (stmt.step()) {
              rows.push(stmt.getAsObject());
            }
            return rows;
          } finally {
            stmt.free();
          }
        },
      };
    },
  };

  activeDbEngine = 'sql.js';
  return activeDbEngine;
}

export const sqliteDb: SqliteDbLike = {
  async exec(sql: string) {
    if (!activeDb) {
      throw new Error('Database engine not initialized yet');
    }
    return activeDb.exec(sql);
  },
  prepare(sql: string) {
    if (!activeDb) {
      throw new Error('Database engine not initialized yet');
    }
    return activeDb.prepare(sql);
  },
};

// Supabase client instance (lazy-initialized so dotenv env vars are always loaded)
export let supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabase) return supabase;
  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const supabaseKey = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_ANON_KEY
  )?.trim();

  if (supabaseUrl && supabaseKey) {
    try {
      supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      console.log('🔗 Supabase client initialized.');
    } catch (err) {
      console.warn('⚠️ Could not initialize Supabase client:', err);
    }
  }
  return supabase;
}

export async function initDatabase() {
  await sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS website_settings (
      id TEXT PRIMARY KEY,
      site_title TEXT NOT NULL,
      tagline TEXT NOT NULL,
      logo_url TEXT NOT NULL DEFAULT '/hriday-logo.png',
      favicon_url TEXT NOT NULL DEFAULT '/hriday-logo.png',
      seo_title TEXT NOT NULL DEFAULT '',
      seo_description TEXT NOT NULL DEFAULT '',
      hero_heading TEXT NOT NULL,
      hero_subtitle TEXT NOT NULL,
      hero_trust_text TEXT NOT NULL,
      hero_bg_image TEXT NOT NULL,
      hero_bg_opacity INTEGER NOT NULL DEFAULT 45,
      section_visibility TEXT NOT NULL DEFAULT '{"hero":true,"featured_celebrations":true,"about":true,"services":true,"gallery":true,"instagram":true,"sunshine":true,"contact":true}',
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS about_content (
      id TEXT PRIMARY KEY,
      heading TEXT NOT NULL,
      description TEXT NOT NULL,
      venue_image TEXT NOT NULL,
      highlight_card_1_title TEXT NOT NULL,
      highlight_card_1_desc TEXT NOT NULL,
      highlight_card_2_title TEXT NOT NULL,
      highlight_card_2_desc TEXT NOT NULL,
      highlight_card_3_title TEXT NOT NULL,
      highlight_card_3_desc TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL,
      short_description TEXT NOT NULL DEFAULT '',
      full_description TEXT NOT NULL DEFAULT '',
      features TEXT NOT NULL DEFAULT '[]',
      image_url TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'General',
      display_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS service_gallery (
      id TEXT PRIMARY KEY,
      service_id TEXT NOT NULL,
      image_url TEXT NOT NULL,
      caption TEXT NOT NULL DEFAULT '',
      display_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS service_instagram_media (
      id TEXT PRIMARY KEY,
      service_id TEXT NOT NULL,
      instagram_url TEXT NOT NULL,
      cover_image TEXT NOT NULL DEFAULT '',
      media_type TEXT NOT NULL DEFAULT 'reel',
      title TEXT NOT NULL DEFAULT '',
      caption TEXT NOT NULL DEFAULT '',
      display_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS celebrations (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT NOT NULL,
      instagram_url TEXT NOT NULL DEFAULT '',
      tag TEXT NOT NULL DEFAULT '#HridayCelebrations',
      service_slug TEXT NOT NULL DEFAULT '',
      is_featured INTEGER NOT NULL DEFAULT 0,
      featured_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS gallery_images (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      image_url TEXT NOT NULL,
      category TEXT NOT NULL,
      display_order INTEGER NOT NULL DEFAULT 0,
      is_featured INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS social_links (
      id TEXT PRIMARY KEY,
      platform TEXT UNIQUE NOT NULL,
      handle TEXT NOT NULL DEFAULT '',
      url TEXT NOT NULL DEFAULT '',
      is_active INTEGER NOT NULL DEFAULT 1,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS whatsapp_settings (
      id TEXT PRIMARY KEY,
      entity TEXT UNIQUE NOT NULL,
      phone_number TEXT NOT NULL DEFAULT '',
      default_message TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contact_information (
      id TEXT PRIMARY KEY,
      venue_name TEXT NOT NULL,
      full_address TEXT NOT NULL DEFAULT '',
      phone_number TEXT NOT NULL DEFAULT '',
      email_address TEXT NOT NULL DEFAULT '',
      opening_hours TEXT NOT NULL DEFAULT '',
      google_maps_embed_url TEXT NOT NULL DEFAULT '',
      google_maps_directions_url TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sunshine_agency (
      id TEXT PRIMARY KEY,
      agency_name TEXT NOT NULL,
      heading TEXT NOT NULL,
      supporting_text TEXT NOT NULL,
      description TEXT NOT NULL,
      logo_url TEXT NOT NULL DEFAULT '',
      banner_image_url TEXT NOT NULL DEFAULT '',
      attribution_statement TEXT NOT NULL,
      badge_text TEXT NOT NULL DEFAULT 'Digital Partner & Agency Showcase',
      callout_badge_text TEXT NOT NULL DEFAULT 'Official Marketing Partner',
      callout_subtext TEXT NOT NULL DEFAULT 'Grow your local brand presence, boost customer bookings, and launch high-impact digital campaigns with our expert team.',
      email_address TEXT NOT NULL DEFAULT 'sunshineexplores2016@gmail.com',
      cta_button_text TEXT NOT NULL DEFAULT 'Enquire About Digital Marketing',
      is_visible INTEGER NOT NULL DEFAULT 1,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sunshine_services (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      icon_name TEXT NOT NULL DEFAULT 'Sparkles',
      display_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT DEFAULT '',
      event_type TEXT DEFAULT '',
      event_date TEXT DEFAULT '',
      guest_count TEXT DEFAULT '',
      message TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS analytics_events (
      id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      session_id TEXT NOT NULL,
      page_url TEXT NOT NULL DEFAULT '/',
      page_title TEXT NOT NULL DEFAULT '',
      placement TEXT NOT NULL DEFAULT '',
      metadata TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at);
    CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type);
    CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_events(session_id);
  `);

  // Migrate services table columns if table was created previously without them
  try {
    const tableCols = (await sqliteDb.prepare('PRAGMA table_info(services)').all()) as any[];
    const colNames = tableCols.map((c) => c.name);

    if (!colNames.includes('slug')) {
      await sqliteDb.exec("ALTER TABLE services ADD COLUMN slug TEXT NOT NULL DEFAULT ''");
    }
    if (!colNames.includes('short_description')) {
      await sqliteDb.exec("ALTER TABLE services ADD COLUMN short_description TEXT NOT NULL DEFAULT ''");
    }
    if (!colNames.includes('full_description')) {
      await sqliteDb.exec("ALTER TABLE services ADD COLUMN full_description TEXT NOT NULL DEFAULT ''");
    }
    if (!colNames.includes('features')) {
      await sqliteDb.exec("ALTER TABLE services ADD COLUMN features TEXT NOT NULL DEFAULT '[]'");
    }

    const celebrationCols = (await sqliteDb.prepare('PRAGMA table_info(celebrations)').all()) as any[];
    const celebrationColNames = celebrationCols.map((c) => c.name);
    if (!celebrationColNames.includes('service_slug')) {
      await sqliteDb.exec("ALTER TABLE celebrations ADD COLUMN service_slug TEXT NOT NULL DEFAULT ''");
    }

    const instaMediaCols = (await sqliteDb.prepare('PRAGMA table_info(service_instagram_media)').all()) as any[];
    const instaColNames = instaMediaCols.map((c) => c.name);
    if (!instaColNames.includes('cover_image')) {
      await sqliteDb.exec("ALTER TABLE service_instagram_media ADD COLUMN cover_image TEXT NOT NULL DEFAULT ''");
    }

    const settingsCols = (await sqliteDb.prepare('PRAGMA table_info(website_settings)').all()) as any[];
    const settingsColNames = settingsCols.map((c) => c.name);
    if (!settingsColNames.includes('hero_bg_opacity')) {
      await sqliteDb.exec('ALTER TABLE website_settings ADD COLUMN hero_bg_opacity INTEGER NOT NULL DEFAULT 45');
    }

    const sunshineCols = (await sqliteDb.prepare('PRAGMA table_info(sunshine_agency)').all()) as any[];
    const sunshineColNames = sunshineCols.map((c) => c.name);
    if (!sunshineColNames.includes('badge_text')) {
      await sqliteDb.exec("ALTER TABLE sunshine_agency ADD COLUMN badge_text TEXT NOT NULL DEFAULT 'Digital Partner & Agency Showcase'");
    }
    if (!sunshineColNames.includes('callout_badge_text')) {
      await sqliteDb.exec("ALTER TABLE sunshine_agency ADD COLUMN callout_badge_text TEXT NOT NULL DEFAULT 'Official Marketing Partner'");
    }
    if (!sunshineColNames.includes('callout_subtext')) {
      await sqliteDb.exec("ALTER TABLE sunshine_agency ADD COLUMN callout_subtext TEXT NOT NULL DEFAULT 'Grow your local brand presence, boost customer bookings, and launch high-impact digital campaigns with our expert team.'");
    }
    if (!sunshineColNames.includes('email_address')) {
      await sqliteDb.exec("ALTER TABLE sunshine_agency ADD COLUMN email_address TEXT NOT NULL DEFAULT 'sunshineexplores2016@gmail.com'");
    }
    if (!sunshineColNames.includes('cta_button_text')) {
      await sqliteDb.exec("ALTER TABLE sunshine_agency ADD COLUMN cta_button_text TEXT NOT NULL DEFAULT 'Enquire About Digital Marketing'");
    }
  } catch (err) {
    console.warn('Column check error:', err);
  }

  // Ensure default logo is set to /hriday-logo.png
  try {
    await sqliteDb.exec(`
      UPDATE website_settings 
      SET logo_url = '/hriday-logo.png', favicon_url = '/hriday-logo.png' 
      WHERE logo_url = '' OR logo_url = '/favicon.svg'
    `);
  } catch (e) {
    // ignore
  }

  console.log('✅ SQLite Database schema verified & updated.');
}
