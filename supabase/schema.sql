-- =========================================================
-- HRIDAY BANQUET HALL - SUPABASE POSTGRESQL SCHEMA
-- =========================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Admin Users
CREATE TABLE IF NOT EXISTS public.admin_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Website Settings
CREATE TABLE IF NOT EXISTS public.website_settings (
  id TEXT PRIMARY KEY,
  site_title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  logo_url TEXT NOT NULL DEFAULT '',
  favicon_url TEXT NOT NULL DEFAULT '',
  seo_title TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  hero_heading TEXT NOT NULL,
  hero_subtitle TEXT NOT NULL,
  hero_trust_text TEXT NOT NULL,
  hero_bg_image TEXT NOT NULL,
  section_visibility JSONB NOT NULL DEFAULT '{"hero":true,"about":true,"services":true,"gallery":true,"instagram":true,"sunshine":true,"contact":true}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. About Content
CREATE TABLE IF NOT EXISTS public.about_content (
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
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Services
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  display_order INT NOT NULL DEFAULT 0,
  is_active INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Gallery Images
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_featured INT NOT NULL DEFAULT 0,
  is_active INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Social Links
CREATE TABLE IF NOT EXISTS public.social_links (
  id TEXT PRIMARY KEY,
  platform TEXT UNIQUE NOT NULL,
  handle TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  is_active INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. WhatsApp Settings
CREATE TABLE IF NOT EXISTS public.whatsapp_settings (
  id TEXT PRIMARY KEY,
  entity TEXT UNIQUE NOT NULL,
  phone_number TEXT NOT NULL DEFAULT '',
  default_message TEXT NOT NULL,
  is_active INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Contact Information
CREATE TABLE IF NOT EXISTS public.contact_information (
  id TEXT PRIMARY KEY,
  venue_name TEXT NOT NULL,
  full_address TEXT NOT NULL DEFAULT '',
  phone_number TEXT NOT NULL DEFAULT '',
  email_address TEXT NOT NULL DEFAULT '',
  opening_hours TEXT NOT NULL DEFAULT '',
  google_maps_embed_url TEXT NOT NULL DEFAULT '',
  google_maps_directions_url TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Sunshine Agency
CREATE TABLE IF NOT EXISTS public.sunshine_agency (
  id TEXT PRIMARY KEY,
  agency_name TEXT NOT NULL,
  heading TEXT NOT NULL,
  supporting_text TEXT NOT NULL,
  description TEXT NOT NULL,
  logo_url TEXT NOT NULL DEFAULT '',
  banner_image_url TEXT NOT NULL DEFAULT '',
  attribution_statement TEXT NOT NULL,
  is_visible INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Sunshine Services
CREATE TABLE IF NOT EXISTS public.sunshine_services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Sparkles',
  display_order INT NOT NULL DEFAULT 0,
  is_active INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Enquiries
CREATE TABLE IF NOT EXISTS public.enquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT DEFAULT '',
  event_type TEXT DEFAULT '',
  event_date TEXT DEFAULT '',
  guest_count TEXT DEFAULT '',
  message TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_information ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sunshine_agency ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sunshine_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Public Read Policies for Website Content
CREATE POLICY "Public Read Website Settings" ON public.website_settings FOR SELECT USING (true);
CREATE POLICY "Public Read About Content" ON public.about_content FOR SELECT USING (true);
CREATE POLICY "Public Read Active Services" ON public.services FOR SELECT USING (is_active = 1);
CREATE POLICY "Public Read Active Gallery" ON public.gallery_images FOR SELECT USING (is_active = 1);
CREATE POLICY "Public Read Social Links" ON public.social_links FOR SELECT USING (is_active = 1);
CREATE POLICY "Public Read WhatsApp Settings" ON public.whatsapp_settings FOR SELECT USING (is_active = 1);
CREATE POLICY "Public Read Contact Info" ON public.contact_information FOR SELECT USING (true);
CREATE POLICY "Public Read Sunshine Agency" ON public.sunshine_agency FOR SELECT USING (is_visible = 1);
CREATE POLICY "Public Read Sunshine Services" ON public.sunshine_services FOR SELECT USING (is_active = 1);

-- Public Insert for Enquiries
CREATE POLICY "Public Insert Enquiry" ON public.enquiries FOR INSERT WITH CHECK (true);
