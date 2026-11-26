import { sqliteDb } from './database.js';

export async function runMigrationsAndSeed() {
  console.log('🔄 Running database migrations and content synchronization...');
  const now = new Date().toISOString();

  // 1. Ensure services table columns exist
  try {
    const tableCols = await sqliteDb.prepare('PRAGMA table_info(services)').all() as any[];
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
  } catch (err) {
    console.warn('Migration error for services columns:', err);
  }

  // 2. Ensure celebrations table exists and has service_slug column
  await sqliteDb.exec(`
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
  `);

  try {
    const celCols = await sqliteDb.prepare('PRAGMA table_info(celebrations)').all() as any[];
    const celColNames = celCols.map((c) => c.name);
    if (!celColNames.includes('service_slug')) {
      await sqliteDb.exec("ALTER TABLE celebrations ADD COLUMN service_slug TEXT NOT NULL DEFAULT ''");
    }
  } catch (err) {
    console.warn('Migration error for celebrations columns:', err);
  }

  // 3. Ensure service_gallery table exists
  await sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS service_gallery (
      id TEXT PRIMARY KEY,
      service_id TEXT NOT NULL,
      image_url TEXT NOT NULL,
      caption TEXT NOT NULL DEFAULT '',
      display_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);

  // 4. Ensure service_instagram_media table exists
  await sqliteDb.exec(`
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
  `);
  try {
    const instaCols = await sqliteDb.prepare('PRAGMA table_info(service_instagram_media)').all() as any[];
    if (!instaCols.some((c) => c.name === 'cover_image')) {
      await sqliteDb.exec("ALTER TABLE service_instagram_media ADD COLUMN cover_image TEXT NOT NULL DEFAULT ''");
    }
  } catch (e) {
    // ignore
  }

  // 5. Update services with rich content and slugs
  const defaultServices = [
    {
      id: 'srv_1',
      title: 'Wedding Functions',
      slug: 'wedding-functions',
      category: 'Weddings',
      display_order: 1,
      short_description: 'Host breathtaking wedding ceremonies and grand receptions in a lavishly decorated setting.',
      full_description: 'Hriday Banquet Hall offers a magnificent venue for your dream wedding. From traditional floral mandaps and dazzling crystal chandeliers to VIP bridal suites and vast banquet dining, our dedicated team ensures every sacred ritual and gala reception unfolds with regal grace and perfection.',
      features: JSON.stringify([
        'Grand banquet hall accommodating large guest gatherings',
        'Exquisite floral, crystal chandelier & royal stage decor',
        'High-definition acoustics and dynamic celebratory lighting',
        'Private luxury bridal & groom dressing suites',
        'Dedicated catering setup and live food counter area',
        'Personal banquet event coordinator and hospitality team'
      ]),
      image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 'srv_2',
      title: 'Engagement Ceremonies',
      slug: 'engagement-ceremonies',
      category: 'Engagement',
      display_order: 2,
      short_description: 'Mark the beginning of your forever with an intimate, beautifully styled engagement celebration.',
      full_description: 'An engagement ceremony marks the official beginning of a lifetime journey. At Hriday Banquet Hall, we create an enchanting ambiance with bespoke ring-ceremony stage designs, romantic floral walkways, and tailored seating that brings both families together in joyous harmony.',
      features: JSON.stringify([
        'Custom ring ceremony stage decor with personalized monogramming',
        'Romantic candlelit and fairy-light entryway walkways',
        'Integrated premium sound system for music and family speeches',
        'Dedicated family lounge and celebration photo booth zone',
        'Gourmet dining support with welcome mocktail service'
      ]),
      image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 'srv_3',
      title: 'Birthday Celebrations',
      slug: 'birthday-celebrations',
      category: 'Birthdays',
      display_order: 3,
      short_description: 'Turn milestone birthdays into festive gatherings with custom theme decorations and celebratory vibes.',
      full_description: 'From joyful first birthdays to grand 50th and 60th milestone jubilees, celebrate your special milestones with unmatched flair at Hriday Banquet Hall. We support vibrant customized themes, dynamic balloon and floral artistry, DJ dance floor setups, and mouthwatering culinary catering.',
      features: JSON.stringify([
        'Vibrant theme styling, balloon arches & backdrop installations',
        'DJ audio console and spacious illuminated dance floor',
        'Dedicated cake cutting stage with spotlight focus',
        'Custom buffet dining setups tailored for all age groups',
        'Party entertainment support and banquet hospitality'
      ]),
      image_url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 'srv_4',
      title: 'Anniversary Celebrations',
      slug: 'anniversary-celebrations',
      category: 'Anniversary',
      display_order: 4,
      short_description: 'Honor cherished years of togetherness with romantic lighting and warm hospitality.',
      full_description: 'Celebrate enduring love and cherished milestones surrounded by family and lifelong friends. Hriday Banquet Hall provides a warm, elegant atmosphere adorned with ambient golden lighting, curated memory photo walls, couple stage floral arches, and silver or golden jubilee banquet feasts.',
      features: JSON.stringify([
        'Intimate golden glow ambiance with crystal table centerpieces',
        'Curated couple memory wall and video presentation support',
        'Couple stage styled with fresh floral arches and warm uplighting',
        'Exquisite multi-course banquet dining coordination',
        'Custom anniversary cake table and champagne toast area'
      ]),
      image_url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 'srv_5',
      title: 'Corporate Events',
      slug: 'corporate-events',
      category: 'Corporate',
      display_order: 5,
      short_description: 'Host executive meets, conferences, corporate dinners, and award nights with professional excellence.',
      full_description: 'Elevate your enterprise gatherings at Hriday Banquet Hall. Perfectly structured for annual general meetings, corporate award galas, product unveilings, dealer meets, and executive dinners. Equipped with high-definition audiovisuals, flexible seating arrangements, and impeccable banquet service.',
      features: JSON.stringify([
        'High-definition projection screens and wireless podium microphones',
        'Flexible seating configurations (Theater, Classroom, Cluster, Banquet)',
        'High-speed Wi-Fi and reliable uninterrupted power backup',
        'Networking tea & coffee counters with executive lunch buffets',
        'Dedicated reception desk for attendee check-in and delegate kit distribution'
      ]),
      image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 'srv_6',
      title: 'Family Gatherings',
      slug: 'family-gatherings',
      category: 'Family',
      display_order: 6,
      short_description: 'Spacious and welcoming banquet arrangements where large families can reunite and bond comfortably.',
      full_description: 'Bring extended generations together under one luxurious roof. Whether hosting a family reunion, sacred pooja function, retirement celebration, or baby shower, Hriday Banquet Hall offers generous space, comfortable seating for senior members, and welcoming hospitality that makes every guest feel at home.',
      features: JSON.stringify([
        'Spacious hall layout with comfortable seating for all generations',
        'Dedicated space for traditional rituals, poojas, or blessings',
        'Senior-friendly venue accessibility and comfortable lounge seating',
        'Traditional feast and modern buffet dining arrangements',
        'Attentive banquet service staff attending to family needs'
      ]),
      image_url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 'srv_7',
      title: 'Private Celebrations',
      slug: 'private-celebrations',
      category: 'Private',
      display_order: 7,
      short_description: 'Exclusive, private booking arrangements ensuring complete privacy and dedicated attention.',
      full_description: 'For private soirees, VIP cocktail dinners, intimate bridal showers, and exclusive family celebrations, enjoy complete private access to our banquet facilities. Our attentive hospitality staff ensures complete discretion, personalized menus, and bespoke thematic styling.',
      features: JSON.stringify([
        'Exclusive venue access with complete privacy for your guests',
        'Bespoke decor themes with curated ambient mood lighting',
        'Customized culinary menus prepared for discerning tastes',
        'Private sound system and personalized musical playlist',
        'Dedicated floor manager and discreet hospitality service'
      ]),
      image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 'srv_8',
      title: 'Event Arrangements',
      slug: 'event-arrangements',
      category: 'Arrangements',
      display_order: 8,
      short_description: 'Complete banquet coordination including stage lighting, audio setup, and welcoming guest reception.',
      full_description: 'A flawless event requires precision planning and expert coordination. Hriday Banquet Hall provides comprehensive event arrangements, including stage fabrication, thematic floral decoration, crystal chandeliers, state-of-the-art audiovisual setups, guest reception assistance, and seamless timeline execution.',
      features: JSON.stringify([
        'End-to-end audiovisual, acoustic and dynamic lighting production',
        'Thematic stage design, floral artistry and fabric drapery',
        'Welcoming guest registration desk and ushering assistance',
        'Comprehensive timeline management and vendor coordination',
        'Complete heavy-duty generator backup ensuring zero disruptions'
      ]),
      image_url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85',
    },
  ];

  const serviceCountRow = (await sqliteDb.prepare('SELECT COUNT(*) as count FROM services').get()) as { count: number };
  if (serviceCountRow.count === 0) {
    for (const s of defaultServices) {
      await sqliteDb.prepare(`
        INSERT INTO services (id, title, slug, description, short_description, full_description, features, image_url, category, display_order, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
      `).run(s.id, s.title, s.slug, s.short_description, s.short_description, s.full_description, s.features, s.image_url, s.category, s.display_order, now, now);
    }
  } else {
    // Only backfill legacy rows that are missing slug/full_description; never re-insert deleted services or overwrite admin edits
    for (const s of defaultServices) {
      const existing = await sqliteDb.prepare('SELECT id, slug FROM services WHERE id = ?').get(s.id) as any;
      if (existing && (!existing.slug || existing.slug === '')) {
        await sqliteDb.prepare(`
          UPDATE services SET
            slug = ?,
            short_description = ?,
            full_description = ?,
            features = ?,
            updated_at = ?
          WHERE id = ?
        `).run(s.slug, s.short_description, s.full_description, s.features, now, s.id);
      }
    }
  }

  // 6. Seed celebrations if empty or fewer than 6
  const celebrationCount = (await sqliteDb.prepare('SELECT COUNT(*) as count FROM celebrations').get() as { count: number }).count;
  if (celebrationCount === 0) {
    console.log('🎉 Seeding celebrations...');
    const celebrationsData = [
      {
        id: 'cel_1',
        title: 'Royal Wedding Reception',
        description: 'A majestic evening celebrating love with grand crystal chandeliers, royal stage decor, and timeless elegance.',
        image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
        instagram_url: 'https://www.instagram.com/hridaybanquetspineroad/',
        tag: '#HridayWeddings',
        is_featured: 1,
        featured_order: 1,
      },
      {
        id: 'cel_2',
        title: 'Grand Sangeet & Engagement',
        description: 'Vibrant colors, energetic rhythms, and intimate moments capturing the beginning of a lifetime togetherness.',
        image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
        instagram_url: 'https://www.instagram.com/hridaybanquetspineroad/',
        tag: '#HridayMoments',
        is_featured: 1,
        featured_order: 2,
      },
      {
        id: 'cel_3',
        title: 'Golden Milestone Birthday',
        description: 'Cherished memories and joyous celebrations honoring a milestone birthday with exquisite dining and decor.',
        image_url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1200&q=85',
        instagram_url: 'https://www.instagram.com/hridaybanquetspineroad/',
        tag: '#HridayCelebrations',
        is_featured: 1,
        featured_order: 3,
      },
      {
        id: 'cel_4',
        title: 'Silver Jubilee 25th Anniversary',
        description: 'Honoring 25 years of love and companionship surrounded by loved ones in a warm, romantic candlelit setting.',
        image_url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85',
        instagram_url: 'https://www.instagram.com/hridaybanquetspineroad/',
        tag: '#HridayLove',
        is_featured: 1,
        featured_order: 4,
      },
      {
        id: 'cel_5',
        title: 'Corporate Leadership Gala',
        description: 'An executive evening recognizing excellence with state-of-the-art audiovisual setups and banquet dining.',
        image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85',
        instagram_url: 'https://www.instagram.com/hridaybanquetspineroad/',
        tag: '#HridayCorporate',
        is_featured: 0,
        featured_order: 5,
      },
      {
        id: 'cel_6',
        title: 'Grand Family Reunion Feast',
        description: 'Multi-generational warmth and togetherness with spacious seating, authentic cuisine, and heartwarming memories.',
        image_url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=85',
        instagram_url: 'https://www.instagram.com/hridaybanquetspineroad/',
        tag: '#HridayFamily',
        is_featured: 0,
        featured_order: 6,
      },
    ];

    const insertCelebration = sqliteDb.prepare(`
      INSERT INTO celebrations (id, title, description, image_url, instagram_url, tag, is_featured, featured_order, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `);

    for (const c of celebrationsData) {
      await insertCelebration.run(c.id, c.title, c.description, c.image_url, c.instagram_url, c.tag, c.is_featured, c.featured_order, now, now);
    }
  }

  // Ensure default celebrations link to their corresponding service_slug if unset
  const defaultSlugMappings: Array<[string, string]> = [
    ['cel_1', 'wedding-functions'],
    ['cel_2', 'engagement-ceremonies'],
    ['cel_3', 'birthday-celebrations'],
    ['cel_4', 'anniversary-celebrations'],
    ['cel_5', 'corporate-events'],
    ['cel_6', 'family-gatherings'],
  ];
  const updateSlugStmt = await sqliteDb.prepare(`
    UPDATE celebrations SET service_slug = ? WHERE id = ? AND (service_slug = '' OR service_slug IS NULL)
  `);
  for (const [celId, slug] of defaultSlugMappings) {
    updateSlugStmt.run(slug, celId);
  }

  // 7. Seed service_gallery if empty
  const serviceGalleryCount = (await sqliteDb.prepare('SELECT COUNT(*) as count FROM service_gallery').get() as { count: number }).count;
  if (serviceGalleryCount === 0) {
    console.log('📸 Seeding service galleries...');
    const serviceGalleries: Record<string, Array<{ url: string; caption: string }>> = {
      srv_1: [
        { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85', caption: 'Royal Mandap & Floral Arch' },
        { url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85', caption: 'Main Banquet Hall with Crystal Chandeliers' },
        { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85', caption: 'Bride & Groom Stage Setup' },
        { url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=85', caption: 'Gold & Ivory Banquet Dining Tables' },
      ],
      srv_2: [
        { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85', caption: 'Intimate Ring Ceremony Stage' },
        { url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=85', caption: 'Fairy Light Celebration Setting' },
        { url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85', caption: 'Floral Entrance Gateway' },
      ],
      srv_3: [
        { url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1200&q=85', caption: 'Theme Birthday Cake Stage' },
        { url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=85', caption: 'Mocktail & Refreshment Counter' },
        { url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=85', caption: 'Illuminated Dance Floor & DJ' },
      ],
      srv_4: [
        { url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85', caption: 'Candlelit Anniversary Table' },
        { url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85', caption: 'Grand Reception Ambiance' },
        { url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=85', caption: 'Celebratory Gold Floral Setting' },
      ],
      srv_5: [
        { url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85', caption: 'Corporate Conference & Gala Layout' },
        { url: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=85', caption: 'Executive Dinner Table Setting' },
        { url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=85', caption: 'Stage with Presentation AV Screens' },
      ],
      srv_6: [
        { url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=85', caption: 'Welcoming Family Gathering Space' },
        { url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=85', caption: 'Multi-Cuisine Buffet Line' },
        { url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85', caption: 'Grand Hall Seating Layout' },
      ],
      srv_7: [
        { url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=85', caption: 'Private VIP Lounge Ambiance' },
        { url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85', caption: 'Exclusive Dining Experience' },
        { url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=85', caption: 'Warm Mood Lighting for Private Party' },
      ],
      srv_8: [
        { url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85', caption: 'Complete Venue Lighting & Floral Fabrication' },
        { url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=85', caption: 'Acoustic Audio & Stage Lighting Rig' },
        { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85', caption: 'Custom Grand Stage Fabrication' },
      ],
    };

    const insertGallery = sqliteDb.prepare(`
      INSERT INTO service_gallery (id, service_id, image_url, caption, display_order, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const [srvId, photos] of Object.entries(serviceGalleries)) {
      for (let idx = 0; idx < photos.length; idx++) {
        const photo = photos[idx];
        await insertGallery.run(`sg_${srvId}_${idx + 1}`, srvId, photo.url, photo.caption, idx + 1, now);
      }
    }
  }

  // 8. Seed service_instagram_media if empty
  const serviceInstaCount = (await sqliteDb.prepare('SELECT COUNT(*) as count FROM service_instagram_media').get() as { count: number }).count;
  if (serviceInstaCount === 0) {
    console.log('📱 Seeding service Instagram media...');
    const instagramMediaData = [
      {
        id: 'sim_1',
        service_id: 'srv_1',
        instagram_url: 'https://www.instagram.com/hridaybanquetspineroad/',
        media_type: 'reel',
        title: 'Grand Wedding Mandap & Entry Reveal',
        caption: 'Watch the breathtaking bride & groom grand entry with royal fireworks and chandelier ambiance at Hriday Banquet Hall.',
        display_order: 1,
      },
      {
        id: 'sim_2',
        service_id: 'srv_1',
        instagram_url: 'https://www.instagram.com/hridaybanquetspineroad/',
        media_type: 'video',
        title: 'Lavish Reception Highlights & Royal Decor',
        caption: 'A glimpse of the royal floral stage and gold table settings created for our couples.',
        display_order: 2,
      },
      {
        id: 'sim_3',
        service_id: 'srv_2',
        instagram_url: 'https://www.instagram.com/hridaybanquetspineroad/',
        media_type: 'reel',
        title: 'Enchanting Engagement Night',
        caption: 'Rings, roses, and eternal promises! Magical engagement evening at Hriday.',
        display_order: 1,
      },
      {
        id: 'sim_4',
        service_id: 'srv_3',
        instagram_url: 'https://www.instagram.com/hridaybanquetspineroad/',
        media_type: 'reel',
        title: 'Milestone 50th Birthday Bash',
        caption: 'DJ beats, energetic dancing, and custom balloon installations celebrating a golden jubilee.',
        display_order: 1,
      },
      {
        id: 'sim_5',
        service_id: 'srv_4',
        instagram_url: 'https://www.instagram.com/hridaybanquetspineroad/',
        media_type: 'reel',
        title: '25 Years of Togetherness Celebration',
        caption: 'Silver Jubilee anniversary with warm candlelight and family love.',
        display_order: 1,
      },
      {
        id: 'sim_6',
        service_id: 'srv_5',
        instagram_url: 'https://www.instagram.com/hridaybanquetspineroad/',
        media_type: 'video',
        title: 'Corporate Leadership Gala 2026',
        caption: 'Executive conferences and award ceremonies hosted with seamless hospitality.',
        display_order: 1,
      },
      {
        id: 'sim_7',
        service_id: 'srv_6',
        instagram_url: 'https://www.instagram.com/hridaybanquetspineroad/',
        media_type: 'reel',
        title: 'Grand Family Reunion & Feast',
        caption: 'Three generations celebrating together with traditional hospitality and love.',
        display_order: 1,
      },
      {
        id: 'sim_8',
        service_id: 'srv_8',
        instagram_url: 'https://www.instagram.com/hridaybanquetspineroad/',
        media_type: 'reel',
        title: 'Behind the Scenes: Banquet Transformation',
        caption: 'From an empty hall to a majestic palace: watch our decor and lighting setup in action.',
        display_order: 1,
      },
    ];

    const insertMedia = sqliteDb.prepare(`
      INSERT INTO service_instagram_media (id, service_id, instagram_url, media_type, title, caption, display_order, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const m of instagramMediaData) {
      await insertMedia.run(m.id, m.service_id, m.instagram_url, m.media_type, m.title, m.caption, m.display_order, now);
    }
  }

  // 9. Ensure website settings has logo_url set to /hriday-logo.png
  try {
    await sqliteDb.exec(`
      UPDATE website_settings 
      SET logo_url = '/hriday-logo.png', favicon_url = '/hriday-logo.png'
      WHERE logo_url = '' OR logo_url = '/favicon.svg' OR logo_url IS NULL
    `);
  } catch (e) {
    // ignore
  }

  // 10. Ensure analytics_events table exists and seed baseline telemetry
  await sqliteDb.exec(`
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

  // Telemetry starts clean from 0 for genuine real-time visitor tracking
  console.log('✅ Database migrations & seed synchronization complete.');
}
