-- =========================================================
-- HRIDAY BANQUET HALL - SUPABASE SEED DATA
-- =========================================================

-- Admin User: admin@hridaybanquet.com / HridayAdmin@2026
INSERT INTO public.admin_users (id, username, email, password_hash, role)
VALUES (
  'admin_default',
  'admin',
  'admin@hridaybanquet.com',
  '$2a$10$wK1WqE8z0kXQy6Xg60/E2O5Oqj/uQ5Vp4M9ZlE5yK2Vw1wK1WqE8z',
  'admin'
) ON CONFLICT (id) DO NOTHING;

-- Website Settings
INSERT INTO public.website_settings (
  id, site_title, tagline, logo_url, favicon_url, seo_title, seo_description,
  hero_heading, hero_subtitle, hero_trust_text, hero_bg_image, section_visibility
) VALUES (
  'settings_default',
  'Hriday Banquet Hall',
  'Your Celebrations, Our Commitment.',
  '',
  '/favicon.svg',
  'Hriday Banquet Hall – Luxury Weddings & Celebrations Venue',
  'Celebrate your special moments at Hriday Banquet Hall. An elegant destination for weddings, celebrations, corporate gatherings, and unforgettable memories.',
  'Celebrate Your Special Moments at Hriday Banquet Hall',
  'An elegant destination for weddings, celebrations, corporate gatherings, and unforgettable memories.',
  'Your Celebrations, Our Commitment.',
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2000&q=85',
  '{"hero":true,"about":true,"services":true,"gallery":true,"instagram":true,"sunshine":true,"contact":true}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- About Content
INSERT INTO public.about_content (
  id, heading, description, venue_image,
  highlight_card_1_title, highlight_card_1_desc,
  highlight_card_2_title, highlight_card_2_desc,
  highlight_card_3_title, highlight_card_3_desc
) VALUES (
  'about_default',
  'Where Every Celebration Becomes a Beautiful Memory',
  'At Hriday Banquet Hall, we believe every special occasion deserves a beautiful setting. Whether it is a wedding celebration, engagement, birthday, anniversary, or corporate event, our venue provides a welcoming environment to make every gathering memorable.',
  'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80',
  'Elegant Celebration Space',
  'A thoughtfully designed hall with warm ambient lighting, grand decor, and luxurious aesthetics tailored for your celebrations.',
  'Memorable Events',
  'From intimate family gatherings to grand wedding receptions, every event is hosted with grace and attention to detail.',
  'Dedicated Event Support',
  'Our supportive management team assists you every step of the way to ensure your event runs seamlessly.'
) ON CONFLICT (id) DO NOTHING;

-- Services
INSERT INTO public.services (id, title, description, image_url, category, display_order, is_active)
VALUES
  ('srv_1', 'Wedding Functions', 'Host breathtaking wedding ceremonies and grand receptions in a lavishly decorated setting designed for lifetime memories.', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', 'Weddings', 1, 1),
  ('srv_2', 'Engagement Ceremonies', 'Mark the beginning of your forever with an intimate, beautifully styled engagement celebration with close family and friends.', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80', 'Engagement', 2, 1),
  ('srv_3', 'Birthday Celebrations', 'Turn milestone birthdays into festive gatherings with custom theme decorations, dance floors, and celebratory vibes.', 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80', 'Birthdays', 3, 1),
  ('srv_4', 'Anniversary Celebrations', 'Honor cherished years of togetherness with romantic lighting, premium seating, and warm hospitality for your loved ones.', 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80', 'Anniversary', 4, 1),
  ('srv_5', 'Corporate Events', 'Host executive annual meets, corporate dinners, award ceremonies, and conferences in a sophisticated professional environment.', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80', 'Corporate', 5, 1),
  ('srv_6', 'Family Gatherings', 'Spacious and welcoming banquet arrangements where large families can reunite, celebrate, and bond comfortably.', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80', 'Family', 6, 1),
  ('srv_7', 'Private Celebrations', 'Exclusive, private booking arrangements ensuring complete privacy and dedicated attention for your personal celebrations.', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80', 'Private', 7, 1),
  ('srv_8', 'Event Arrangements', 'Complete banquet coordination including stage lighting, audio setup, seating layout, and welcoming guest reception.', 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80', 'Arrangements', 8, 1)
ON CONFLICT (id) DO NOTHING;

-- Gallery Images
INSERT INTO public.gallery_images (id, title, description, image_url, category, display_order, is_featured, is_active)
VALUES
  ('gal_1', 'Grand Chandelier Hall', 'Majestic banquet interior with sparkling crystal chandeliers and ambient mood lighting.', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85', 'Banquet Interiors', 1, 1, 1),
  ('gal_2', 'Royal Wedding Reception Stage', 'Grand floral archway and ceremonial stage for bride and groom reception.', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85', 'Wedding Events', 2, 1, 1),
  ('gal_3', 'Luxury Table Centerpieces', 'Gold-accented table setting with fresh white and peach floral arrangements.', 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=85', 'Decorations', 3, 1, 1),
  ('gal_4', 'Evening Celebration Ambiance', 'Warm golden illuminations creating a magical celebratory environment.', 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=85', 'Celebrations', 4, 1, 1),
  ('gal_5', 'Ceremonial Mandap & Stage', 'Exquisitely styled stage backdrop with drapery and warm uplighting.', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85', 'Stage Arrangements', 5, 1, 1),
  ('gal_6', 'Executive Banquet Layout', 'Spacious hall arrangement welcoming dinner parties and corporate banquets.', 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=85', 'Banquet Interiors', 6, 0, 1),
  ('gal_7', 'Floral Walkway Entrance', 'Enchanting floral gateway welcoming guests into the celebration hall.', 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85', 'Decorations', 7, 0, 1),
  ('gal_8', 'Joyful Wedding Festivities', 'Festive colors and traditional celebratory atmosphere.', 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85', 'Wedding Events', 8, 0, 1),
  ('gal_9', 'Golden Illuminated Stage', 'Modern stage production with spotlights and elegant framing.', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=85', 'Stage Arrangements', 9, 0, 1),
  ('gal_10', 'Cocktail & Mocktail Lounge', 'Sophisticated drink and beverage counter for social gatherings.', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=85', 'Other Events', 10, 0, 1),
  ('gal_11', 'Anniversary Dinner Setting', 'Intimate candlelit dining arrangement for family anniversaries.', 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85', 'Celebrations', 11, 0, 1),
  ('gal_12', 'Buffet & Dining Hall', 'Comfortable catering and buffet line designed for smooth dining service.', 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=85', 'Banquet Interiors', 12, 0, 1)
ON CONFLICT (id) DO NOTHING;

-- WhatsApp Settings
INSERT INTO public.whatsapp_settings (id, entity, phone_number, default_message, is_active)
VALUES
  ('wa_hriday', 'hriday', '', 'Hello Hriday Banquet Hall Team,\n\nI visited your website and would like to enquire about hosting an event at your venue.\n\nPlease share your available packages, pricing details, facilities, and availability.\n\nKindly send me the required quotation directly on WhatsApp.\n\nThank you!', 1),
  ('wa_sunshine', 'sunshine', '', 'Hello Sunshine Events & Management,\n\nI visited your website and would like to know more about your digital marketing and business promotion services. Please share your service details and quotation.', 1)
ON CONFLICT (id) DO NOTHING;

-- Sunshine Agency
INSERT INTO public.sunshine_agency (
  id, agency_name, heading, supporting_text, description,
  logo_url, banner_image_url, attribution_statement, is_visible
) VALUES (
  'sunshine_default',
  'SUNSHINE EVENTS & MANAGEMENT',
  'Take Your Brand to the Next Level with Sunshine Events & Management',
  'From building your digital presence to creating impactful marketing campaigns, Sunshine Events & Management helps businesses grow with creative strategies and professional digital solutions.',
  'Sunshine Events & Management is a full-service marketing and event management firm empowering brands through strategic storytelling, digital visibility, and high-impact event promotions.',
  '',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1600&q=80',
  'Website Marketing & Promotion of Hriday Banquet Hall is managed by Sunshine Events & Management.',
  1
) ON CONFLICT (id) DO NOTHING;

-- Sunshine Services
INSERT INTO public.sunshine_services (id, title, description, icon_name, display_order, is_active)
VALUES
  ('ss_1', 'Digital Marketing', 'Data-driven online campaigns to expand customer reach and drive event enquiries.', 'TrendingUp', 1, 1),
  ('ss_2', 'Social Media Management', 'Curated Instagram & Facebook content creation, reels production, and engagement growth.', 'Instagram', 2, 1),
  ('ss_3', 'Business Branding', 'Cohesive brand identity, logo design, visual style guides, and brand positioning.', 'Sparkles', 3, 1),
  ('ss_4', 'Website Development', 'High-converting, responsive websites tailored for hospitality and service brands.', 'Globe', 4, 1),
  ('ss_5', 'Online Advertising', 'Targeted Google and Meta ad campaigns designed for maximum return on investment.', 'Megaphone', 5, 1),
  ('ss_6', 'Event Management', 'End-to-end planning, vendor coordination, and on-ground management for premium events.', 'Calendar', 6, 1)
ON CONFLICT (id) DO NOTHING;

-- Contact Information
INSERT INTO public.contact_information (
  id, venue_name, full_address, phone_number, email_address,
  opening_hours, google_maps_embed_url, google_maps_directions_url
) VALUES (
  'contact_default',
  'Hriday Banquet Hall',
  'Near City Center, Main Road, Prime Location (Configurable in Admin)',
  '',
  '',
  'Monday – Sunday: 10:00 AM – 10:00 PM',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117925.21689718428!2d88.26495094970425!3d22.535564937233827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f882db4908f667%3A0x43e330e68f6c2cbc!2sKolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  'https://maps.google.com'
) ON CONFLICT (id) DO NOTHING;

-- Social Links
INSERT INTO public.social_links (id, platform, handle, url, is_active)
VALUES
  ('social_ig', 'instagram', '@hridaybanquethall', 'https://instagram.com', 1),
  ('social_fb', 'facebook', 'Hriday Banquet Hall Official', 'https://facebook.com', 1)
ON CONFLICT (id) DO NOTHING;
