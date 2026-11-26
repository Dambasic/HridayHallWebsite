import bcrypt from 'bcryptjs';
import { sqliteDb, initDatabase } from './database.js';

export async function seedDatabase() {
  initDatabase();

  const userCount = (await sqliteDb.prepare('SELECT COUNT(*) as count FROM admin_users').get() as { count: number }).count;
  if (userCount > 0) {
    console.log('Database already has data. Skipping seed.');
    return;
  }

  console.log('🌱 Seeding initial database for Hriday Banquet Hall...');
  const now = new Date().toISOString();

  // 1. Admin User
  const defaultPasswordHash = bcrypt.hashSync('HridayAdmin@2026', 10);
  await sqliteDb.prepare(`
    INSERT INTO admin_users (id, username, email, password_hash, role, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    'admin_default',
    'admin',
    'admin@hridaybanquet.com',
    defaultPasswordHash,
    'admin',
    now,
    now
  );

  // 2. Website Settings
  await sqliteDb.prepare(`
    INSERT INTO website_settings (
      id, site_title, tagline, logo_url, favicon_url, seo_title, seo_description,
      hero_heading, hero_subtitle, hero_trust_text, hero_bg_image, hero_bg_opacity, section_visibility, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'settings_default',
    'Hriday Banquet Hall',
    'Your Celebrations, Our Commitment.',
    '',
    '/favicon.svg',
    'Hriday Banquet Hall – Luxury Weddings & Celebrations Venue in Pimpri Chinchwad',
    'Celebrate your special moments at Hriday Banquet Hall in Pimpri Chinchwad. An elegant destination for weddings, celebrations, corporate gatherings, and unforgettable memories.',
    'Celebrate Your Special Moments at Hriday Banquet Hall',
    'An elegant destination for weddings, celebrations, corporate gatherings, and unforgettable memories.',
    'Your Celebrations, Our Commitment.',
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2000&q=85',
    45,
    JSON.stringify({
      hero: true,
      about: true,
      services: true,
      gallery: true,
      instagram: true,
      sunshine: true,
      contact: true,
    }),
    now
  );

  // 3. About Content
  await sqliteDb.prepare(`
    INSERT INTO about_content (
      id, heading, description, venue_image,
      highlight_card_1_title, highlight_card_1_desc,
      highlight_card_2_title, highlight_card_2_desc,
      highlight_card_3_title, highlight_card_3_desc,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'about_default',
    'Where Every Celebration Becomes a Beautiful Memory',
    'At Hriday Banquet Hall, we believe every special occasion deserves a beautiful setting. Whether it is a wedding celebration, engagement, birthday, anniversary, or corporate event, our venue provides a welcoming environment to make every gathering memorable.',
    'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80',
    'Elegant Celebration Space',
    'A thoughtfully designed hall with warm ambient lighting, grand decor, and luxurious aesthetics tailored for your celebrations.',
    'Memorable Events',
    'From intimate family gatherings to grand wedding receptions, every event is hosted with grace and attention to detail.',
    'Dedicated Event Support',
    'Our supportive management team assists you every step of the way to ensure your event runs seamlessly.',
    now
  );

  // 4. Services (8 verified categories)
  const servicesData = [
    {
      id: 'srv_1',
      title: 'Wedding Functions',
      description: 'Host breathtaking wedding ceremonies and grand receptions in a lavishly decorated setting designed for lifetime memories.',
      image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      category: 'Weddings',
      display_order: 1,
    },
    {
      id: 'srv_2',
      title: 'Engagement Ceremonies',
      description: 'Mark the beginning of your forever with an intimate, beautifully styled engagement celebration with close family and friends.',
      image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      category: 'Engagement',
      display_order: 2,
    },
    {
      id: 'srv_3',
      title: 'Birthday Celebrations',
      description: 'Turn milestone birthdays into festive gatherings with custom theme decorations, dance floors, and celebratory vibes.',
      image_url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80',
      category: 'Birthdays',
      display_order: 3,
    },
    {
      id: 'srv_4',
      title: 'Anniversary Celebrations',
      description: 'Honor cherished years of togetherness with romantic lighting, premium seating, and warm hospitality for your loved ones.',
      image_url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
      category: 'Anniversary',
      display_order: 4,
    },
    {
      id: 'srv_5',
      title: 'Corporate Events',
      description: 'Host executive annual meets, corporate dinners, award ceremonies, and conferences in a sophisticated professional environment.',
      image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      category: 'Corporate',
      display_order: 5,
    },
    {
      id: 'srv_6',
      title: 'Family Gatherings',
      description: 'Spacious and welcoming banquet arrangements where large families can reunite, celebrate, and bond comfortably.',
      image_url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
      category: 'Family',
      display_order: 6,
    },
    {
      id: 'srv_7',
      title: 'Private Celebrations',
      description: 'Exclusive, private booking arrangements ensuring complete privacy and dedicated attention for your personal celebrations.',
      image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
      category: 'Private',
      display_order: 7,
    },
    {
      id: 'srv_8',
      title: 'Event Arrangements',
      description: 'Complete banquet coordination including stage lighting, audio setup, seating layout, and welcoming guest reception.',
      image_url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80',
      category: 'Arrangements',
      display_order: 8,
    },
  ];

  const insertService = sqliteDb.prepare(`
    INSERT INTO services (id, title, description, image_url, category, display_order, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
  `);

  for (const s of servicesData) {
    await insertService.run(s.id, s.title, s.description, s.image_url, s.category, s.display_order, now, now);
  }

  // 5. Gallery Images (12 rich banquet images categorized)
  const galleryData = [
    {
      id: 'gal_1',
      title: 'Grand Chandelier Hall',
      description: 'Majestic banquet interior with sparkling crystal chandeliers and ambient mood lighting.',
      image_url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85',
      category: 'Banquet Interiors',
      display_order: 1,
      is_featured: 1,
    },
    {
      id: 'gal_2',
      title: 'Royal Wedding Reception Stage',
      description: 'Grand floral archway and ceremonial stage for bride and groom reception.',
      image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
      category: 'Wedding Events',
      display_order: 2,
      is_featured: 1,
    },
    {
      id: 'gal_3',
      title: 'Luxury Table Centerpieces',
      description: 'Gold-accented table setting with fresh white and peach floral arrangements.',
      image_url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=85',
      category: 'Decorations',
      display_order: 3,
      is_featured: 1,
    },
    {
      id: 'gal_4',
      title: 'Evening Celebration Ambiance',
      description: 'Warm golden illuminations creating a magical celebratory environment.',
      image_url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=85',
      category: 'Celebrations',
      display_order: 4,
      is_featured: 1,
    },
    {
      id: 'gal_5',
      title: 'Ceremonial Mandap & Stage',
      description: 'Exquisitely styled stage backdrop with drapery and warm uplighting.',
      image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
      category: 'Stage Arrangements',
      display_order: 5,
      is_featured: 1,
    },
    {
      id: 'gal_6',
      title: 'Executive Banquet Layout',
      description: 'Spacious hall arrangement welcoming dinner parties and corporate banquets.',
      image_url: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=85',
      category: 'Banquet Interiors',
      display_order: 6,
      is_featured: 0,
    },
    {
      id: 'gal_7',
      title: 'Floral Walkway Entrance',
      description: 'Enchanting floral gateway welcoming guests into the celebration hall.',
      image_url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85',
      category: 'Decorations',
      display_order: 7,
      is_featured: 0,
    },
    {
      id: 'gal_8',
      title: 'Joyful Wedding Festivities',
      description: 'Festive colors and traditional celebratory atmosphere.',
      image_url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85',
      category: 'Wedding Events',
      display_order: 8,
      is_featured: 0,
    },
    {
      id: 'gal_9',
      title: 'Golden Illuminated Stage',
      description: 'Modern stage production with spotlights and elegant framing.',
      image_url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=85',
      category: 'Stage Arrangements',
      display_order: 9,
      is_featured: 0,
    },
    {
      id: 'gal_10',
      title: 'Cocktail & Mocktail Lounge',
      description: 'Sophisticated drink and beverage counter for social gatherings.',
      image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=85',
      category: 'Other Events',
      display_order: 10,
      is_featured: 0,
    },
    {
      id: 'gal_11',
      title: 'Anniversary Dinner Setting',
      description: 'Intimate candlelit dining arrangement for family anniversaries.',
      image_url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85',
      category: 'Celebrations',
      display_order: 11,
      is_featured: 0,
    },
    {
      id: 'gal_12',
      title: 'Buffet & Dining Hall',
      description: 'Comfortable catering and buffet line designed for smooth dining service.',
      image_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=85',
      category: 'Banquet Interiors',
      display_order: 12,
      is_featured: 0,
    },
  ];

  const insertGallery = sqliteDb.prepare(`
    INSERT INTO gallery_images (id, title, description, image_url, category, display_order, is_featured, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
  `);

  for (const g of galleryData) {
    await insertGallery.run(g.id, g.title, g.description, g.image_url, g.category, g.display_order, g.is_featured, now, now);
  }

  // 6. WhatsApp Settings (Configurable, phone numbers initially empty)
  const defaultHridayMsg = `Hello Hriday Banquet Hall Team,

I visited your website and would like to enquire about hosting an event at your venue.

Please share your available packages, pricing details, facilities, and availability.

Kindly send me the required quotation directly on WhatsApp.

Thank you!`;

  const defaultSunshineMsg = `Hello Sunshine Events & Management,

I visited your website and would like to know more about your digital marketing and business promotion services. Please share your service details and quotation.`;

  await sqliteDb.prepare(`
    INSERT INTO whatsapp_settings (id, entity, phone_number, default_message, is_active, updated_at)
    VALUES (?, ?, ?, ?, 1, ?)
  `).run('wa_hriday', 'hriday', '', defaultHridayMsg, now);

  await sqliteDb.prepare(`
    INSERT INTO whatsapp_settings (id, entity, phone_number, default_message, is_active, updated_at)
    VALUES (?, ?, ?, ?, 1, ?)
  `).run('wa_sunshine', 'sunshine', '', defaultSunshineMsg, now);

  // 7. Sunshine Agency
  await sqliteDb.prepare(`
    INSERT INTO sunshine_agency (
      id, agency_name, heading, supporting_text, description,
      logo_url, banner_image_url, attribution_statement, is_visible, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
  `).run(
    'sunshine_default',
    'SUNSHINE EVENTS & MANAGEMENT',
    'Take Your Brand to the Next Level with Sunshine Events & Management',
    'From building your digital presence to creating impactful marketing campaigns, Sunshine Events & Management helps businesses grow with creative strategies and professional digital solutions.',
    'Sunshine Events & Management is a full-service marketing and event management firm empowering brands through strategic storytelling, digital visibility, and high-impact event promotions.',
    '',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1600&q=80',
    'Website Marketing & Promotion of Hriday Banquet Hall is managed by Sunshine Events & Management.',
    now
  );

  // 8. Sunshine Services
  const sunshineServicesData = [
    { id: 'ss_1', title: 'Digital Marketing', description: 'Data-driven online campaigns to expand customer reach and drive event enquiries.', icon_name: 'TrendingUp', display_order: 1 },
    { id: 'ss_2', title: 'Social Media Management', description: 'Curated Instagram & Facebook content creation, reels production, and engagement growth.', icon_name: 'Instagram', display_order: 2 },
    { id: 'ss_3', title: 'Business Branding', description: 'Cohesive brand identity, logo design, visual style guides, and brand positioning.', icon_name: 'Sparkles', display_order: 3 },
    { id: 'ss_4', title: 'Website Development', description: 'High-converting, responsive websites tailored for hospitality and service brands.', icon_name: 'Globe', display_order: 4 },
    { id: 'ss_5', title: 'Online Advertising', description: 'Targeted Google and Meta ad campaigns designed for maximum return on investment.', icon_name: 'Megaphone', display_order: 5 },
    { id: 'ss_6', title: 'Event Management', description: 'End-to-end planning, vendor coordination, and on-ground management for premium events.', icon_name: 'Calendar', display_order: 6 },
  ];

  const insertSunshineService = sqliteDb.prepare(`
    INSERT INTO sunshine_services (id, title, description, icon_name, display_order, is_active, created_at)
    VALUES (?, ?, ?, ?, ?, 1, ?)
  `);

  for (const ss of sunshineServicesData) {
    await insertSunshineService.run(ss.id, ss.title, ss.description, ss.icon_name, ss.display_order, now);
  }

  // 9. Contact Information (Editable placeholders)
  await sqliteDb.prepare(`
    INSERT INTO contact_information (
      id, venue_name, full_address, phone_number, email_address,
      opening_hours, google_maps_embed_url, google_maps_directions_url, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'contact_default',
    'Hriday Banquet Hall',
    'Near City Center, Main Road, Prime Location (Configurable in Admin)',
    '+91 9604540084',
    'sunshineexplores2016@gmail.com',
    'Monday – Sunday: 10:00 AM – 10:00 PM',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.3199948935157!2d73.8430179118623!3d18.649631182396288!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c7f426197ee3%3A0xfdb9ff46ae7b21dc!2sHriday%20Banquet%20Hall!5e0!3m2!1sen!2sin!4v1795617111797!5m2!1sen!2sin',
    'https://www.google.com/maps/search/?api=1&query=18.649631182396288,73.8430179118623',
    now
  );

  // 10. Social Links
  await sqliteDb.prepare(`
    INSERT INTO social_links (id, platform, handle, url, is_active, updated_at)
    VALUES (?, ?, ?, ?, 1, ?)
  `).run('social_ig', 'instagram', '@hridaybanquetspineroad', 'https://www.instagram.com/hridaybanquetspineroad/', now);

  await sqliteDb.prepare(`
    INSERT INTO social_links (id, platform, handle, url, is_active, updated_at)
    VALUES (?, ?, ?, ?, 1, ?)
  `).run('social_fb', 'facebook', 'Hriday Banquet Hall', 'https://www.facebook.com/share/18q7iCrgxa/?mibextid=wwXIfr', now);

  console.log('✅ Initial database seed successfully completed!');
}

// If run directly via CLI
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedDatabase();
}
