export interface AdminUser {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface WebsiteSettings {
  id: string;
  site_title: string;
  tagline: string;
  logo_url: string;
  favicon_url: string;
  seo_title: string;
  seo_description: string;
  hero_heading: string;
  hero_subtitle: string;
  hero_trust_text: string;
  hero_bg_image: string;
  hero_bg_opacity?: number;
  section_visibility: {
    hero: boolean;
    featured_celebrations?: boolean;
    about: boolean;
    services: boolean;
    gallery: boolean;
    instagram: boolean;
    sunshine: boolean;
    contact: boolean;
  };
  updated_at: string;
}

export interface AboutContent {
  id: string;
  heading: string;
  description: string;
  venue_image: string;
  highlight_card_1_title: string;
  highlight_card_1_desc: string;
  highlight_card_2_title: string;
  highlight_card_2_desc: string;
  highlight_card_3_title: string;
  highlight_card_3_desc: string;
  updated_at: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  full_description?: string;
  features?: string; // JSON array of string highlights
  image_url: string;
  category: string;
  display_order: number;
  is_active: number; // 0 or 1
  created_at: string;
  updated_at: string;
  gallery?: ServiceGalleryImage[];
  instagram_media?: ServiceInstagramMedia[];
}

export interface ServiceGalleryImage {
  id: string;
  service_id: string;
  image_url: string;
  caption: string;
  display_order: number;
  created_at: string;
}

export interface ServiceInstagramMedia {
  id: string;
  service_id: string;
  instagram_url: string;
  cover_image?: string;
  media_type: string; // reel, post, video
  title: string;
  caption: string;
  display_order: number;
  created_at: string;
}

export interface CelebrationItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  instagram_url: string;
  tag: string;
  is_featured: number; // 0 or 1 -> [ ] Add to Featured List
  featured_order: number;
  is_active: number; // 0 or 1
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  display_order: number;
  is_featured: number; // 0 or 1
  is_active: number; // 0 or 1
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string; // instagram, facebook, youtube
  handle: string;
  url: string;
  is_active: number;
  updated_at: string;
}

export interface WhatsAppSetting {
  id: string;
  entity: 'hriday' | 'sunshine';
  phone_number: string; // blank initially until owner configures
  default_message: string;
  is_active: number;
  updated_at: string;
}

export interface ContactInformation {
  id: string;
  venue_name: string;
  full_address: string;
  phone_number: string;
  email_address: string;
  opening_hours: string;
  google_maps_embed_url: string;
  google_maps_directions_url: string;
  updated_at: string;
}

export interface SunshineAgency {
  id: string;
  agency_name: string;
  heading: string;
  supporting_text: string;
  description: string;
  logo_url: string;
  banner_image_url: string;
  attribution_statement: string;
  badge_text?: string;
  callout_badge_text?: string;
  callout_subtext?: string;
  email_address?: string;
  cta_button_text?: string;
  is_visible: number;
  updated_at: string;
}

export interface SunshineService {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
  is_active: number;
  created_at: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  event_type?: string;
  event_date?: string;
  guest_count?: string;
  message?: string;
  status: 'new' | 'contacted' | 'quoted' | 'closed';
  created_at: string;
}
