export interface SectionVisibility {
  hero: boolean;
  featured_celebrations?: boolean;
  about: boolean;
  services: boolean;
  gallery: boolean;
  instagram: boolean;
  sunshine: boolean;
  contact: boolean;
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
  section_visibility: SectionVisibility;
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

export interface ServiceGalleryImage {
  id: string;
  service_id: string;
  image_url: string;
  caption: string;
  display_order: number;
  created_at?: string;
}

export interface ServiceInstagramMedia {
  id: string;
  service_id: string;
  instagram_url: string;
  cover_image?: string;
  media_type: 'reel' | 'video' | 'post';
  title: string;
  caption: string;
  display_order: number;
  created_at?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  full_description?: string;
  features?: string[] | string;
  image_url: string;
  category: string;
  display_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  gallery?: ServiceGalleryImage[];
  instagram_media?: ServiceInstagramMedia[];
}

export interface CelebrationItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  instagram_url?: string;
  tag?: string;
  service_slug?: string;
  is_featured: number; // 0 or 1 -> toggle in admin
  featured_order: number;
  is_active: number; // 0 or 1
  created_at?: string;
  updated_at?: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  display_order: number;
  is_featured: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  service_slug?: string;
  target_url?: string;
  service_title?: string;
  instagram_url?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  handle: string;
  url: string;
  is_active: number;
  updated_at: string;
}

export interface WhatsAppSetting {
  id: string;
  entity: 'hriday' | 'sunshine';
  phone_number: string;
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

export interface SunshineService {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
  is_active: number;
  created_at: string;
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
  services?: SunshineService[];
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

export interface WebsiteContent {
  settings: WebsiteSettings;
  about: AboutContent;
  services: ServiceItem[];
  gallery: GalleryImage[];
  celebrations?: CelebrationItem[];
  featured_celebrations?: CelebrationItem[];
  social: SocialLink[];
  whatsapp: WhatsAppSetting[];
  contact: ContactInformation;
  sunshine: SunshineAgency;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at?: string;
}

export interface DashboardMetrics {
  gallery: { total: number; active: number };
  services: { total: number; active: number };
  celebrations?: { total: number; featured: number };
  whatsapp: {
    hridayConfigured: boolean;
    hridayNumber: string;
    sunshineConfigured: boolean;
    sunshineNumber: string;
  };
  contact: {
    addressConfigured: boolean;
    phoneConfigured: boolean;
    emailConfigured: boolean;
    mapsConfigured: boolean;
  };
  enquiries: { total: number; new: number };
  sections: SectionVisibility;
}

export interface RealtimeAnalytics {
  active_users: number;
  total_views: number;
  today_views: number;
  total_whatsapp_clicks: number;
  today_whatsapp_clicks: number;
  conversion_rate: number;
  placements: Record<string, number>;
  top_pages: Array<{ page_url: string; page_title: string; views: number }>;
  recent_events: Array<{
    id: string;
    event_type: 'page_view' | 'whatsapp_click' | 'session_ping';
    session_id: string;
    page_url: string;
    page_title: string;
    placement: string;
    metadata: Record<string, any>;
    created_at: string;
  }>;
  hourly_trend: Array<{ hour: string; views: number; clicks: number }>;
  timestamp: string;
}
