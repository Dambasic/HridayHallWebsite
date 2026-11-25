import { Router, Response } from 'express';
import { sqliteDb } from '../db/database.js';
import { requireAdminAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { upload, processImageUpload } from '../middleware/upload.js';

const router = Router();

// Apply admin authentication to all routes in this file
router.use(requireAdminAuth);

// -------------------------------------------------------------
// 1. Dashboard Overview
// -------------------------------------------------------------
router.get('/dashboard', async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const totalGallery = (await sqliteDb.prepare('SELECT COUNT(*) as count FROM gallery_images').get() as any)?.count || 0;
    const activeGallery = (await sqliteDb.prepare('SELECT COUNT(*) as count FROM gallery_images WHERE is_active = 1').get() as any)?.count || 0;

    const totalServices = (await sqliteDb.prepare('SELECT COUNT(*) as count FROM services').get() as any)?.count || 0;
    const activeServices = (await sqliteDb.prepare('SELECT COUNT(*) as count FROM services WHERE is_active = 1').get() as any)?.count || 0;

    const totalCelebrations = (await sqliteDb.prepare('SELECT COUNT(*) as count FROM celebrations').get() as any)?.count || 0;
    const featuredCelebrations = (await sqliteDb.prepare('SELECT COUNT(*) as count FROM celebrations WHERE is_featured = 1 AND is_active = 1').get() as any)?.count || 0;

    const whatsappHriday = await sqliteDb.prepare("SELECT phone_number FROM whatsapp_settings WHERE entity = 'hriday'").get() as any;
    const whatsappSunshine = await sqliteDb.prepare("SELECT phone_number FROM whatsapp_settings WHERE entity = 'sunshine'").get() as any;

    const contact = await sqliteDb.prepare('SELECT * FROM contact_information LIMIT 1').get() as any;
    const settings = await sqliteDb.prepare('SELECT section_visibility FROM website_settings LIMIT 1').get() as any;

    const totalEnquiries = (await sqliteDb.prepare('SELECT COUNT(*) as count FROM enquiries').get() as any)?.count || 0;
    const newEnquiries = (await sqliteDb.prepare("SELECT COUNT(*) as count FROM enquiries WHERE status = 'new'").get() as any)?.count || 0;

    let visibility = { hero: true, about: true, services: true, gallery: true, instagram: true, sunshine: true, contact: true };
    if (settings?.section_visibility) {
      try {
        visibility = typeof settings.section_visibility === 'string'
          ? JSON.parse(settings.section_visibility)
          : settings.section_visibility;
      } catch (e) {
        // use default
      }
    }

    res.json({
      gallery: {
        total: totalGallery,
        active: activeGallery,
      },
      services: {
        total: totalServices,
        active: activeServices,
      },
      celebrations: {
        total: totalCelebrations,
        featured: featuredCelebrations,
      },
      whatsapp: {
        hridayConfigured: Boolean(whatsappHriday?.phone_number?.trim()),
        hridayNumber: whatsappHriday?.phone_number || '',
        sunshineConfigured: Boolean(whatsappSunshine?.phone_number?.trim()),
        sunshineNumber: whatsappSunshine?.phone_number || '',
      },
      contact: {
        addressConfigured: Boolean(contact?.full_address?.trim()),
        phoneConfigured: Boolean(contact?.phone_number?.trim()),
        emailConfigured: Boolean(contact?.email_address?.trim()),
        mapsConfigured: Boolean(contact?.google_maps_embed_url?.trim()),
      },
      enquiries: {
        total: totalEnquiries,
        new: newEnquiries,
      },
      sections: visibility,
    });
  } catch (error: any) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to retrieve dashboard metrics' });
  }
});

// -------------------------------------------------------------
// 1B. Real-Time Analytics Telemetry Endpoint
// -------------------------------------------------------------
router.get('/analytics/realtime', async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000).toISOString();
    const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString();

    // 1. Total & Today's Page Views
    const totalViews = (await sqliteDb.prepare("SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'page_view'").get() as any)?.count || 0;
    const todayViews = (await sqliteDb.prepare("SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'page_view' AND created_at >= ?").get(todayStart) as any)?.count || 0;

    // 2. Real-Time Active Users (distinct session_ids active in last 10 minutes)
    const activeUsersCount = (await sqliteDb.prepare("SELECT COUNT(DISTINCT session_id) as count FROM analytics_events WHERE created_at >= ?").get(tenMinutesAgo) as any)?.count || 0;
    const activeUsers = activeUsersCount;

    // 3. WhatsApp Button Clicks
    const totalWhatsAppClicks = (await sqliteDb.prepare("SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'whatsapp_click'").get() as any)?.count || 0;
    const todayWhatsAppClicks = (await sqliteDb.prepare("SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'whatsapp_click' AND created_at >= ?").get(todayStart) as any)?.count || 0;

    // 4. Conversion Rate (WhatsApp Clicks / Total Views)
    const conversionRate = totalViews > 0 ? Number(((totalWhatsAppClicks / totalViews) * 100).toFixed(1)) : 0;

    // 5. Clicks by Placement
    const placementRows = await sqliteDb.prepare(`
      SELECT placement, COUNT(*) as count 
      FROM analytics_events 
      WHERE event_type = 'whatsapp_click' AND placement != '' 
      GROUP BY placement 
      ORDER BY count DESC
    `).all() as any[];

    const placementMap: Record<string, number> = {
      hero: 0,
      navbar: 0,
      floating_button: 0,
      service_detail: 0,
      lightbox: 0,
      contact: 0,
    };
    placementRows.forEach((r) => {
      placementMap[r.placement] = r.count;
    });

    // 6. Top Visited Pages
    const topPages = await sqliteDb.prepare(`
      SELECT page_url, page_title, COUNT(*) as views 
      FROM analytics_events 
      WHERE event_type = 'page_view' 
      GROUP BY page_url 
      ORDER BY views DESC 
      LIMIT 6
    `).all() as any[];

    // 7. Recent Real-Time Events Stream
    const recentEventsRows = await sqliteDb.prepare(`
      SELECT id, event_type, session_id, page_url, page_title, placement, metadata, created_at 
      FROM analytics_events 
      ORDER BY created_at DESC 
      LIMIT 20
    `).all() as any[];

    const recentEvents = recentEventsRows.map((e) => {
      let parsedMeta = {};
      try {
        parsedMeta = typeof e.metadata === 'string' ? JSON.parse(e.metadata) : e.metadata;
      } catch {
        parsedMeta = {};
      }
      return {
        ...e,
        metadata: parsedMeta,
      };
    });

    // 8. Hourly Traffic Trend for last 12 hours
    const hourlyTrend = [];
    for (let i = 11; i >= 0; i--) {
      const hStart = new Date(now.getTime() - (i + 1) * 60 * 60 * 1000).toISOString();
      const hEnd = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString();
      const views = (await sqliteDb.prepare("SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'page_view' AND created_at >= ? AND created_at < ?").get(hStart, hEnd) as any)?.count || 0;
      const clicks = (await sqliteDb.prepare("SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'whatsapp_click' AND created_at >= ? AND created_at < ?").get(hStart, hEnd) as any)?.count || 0;

      const hourLabel = new Date(now.getTime() - i * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      hourlyTrend.push({
        hour: hourLabel,
        views,
        clicks,
      });
    }

    res.json({
      realtime: {
        active_users: activeUsers,
        total_views: totalViews,
        today_views: todayViews,
        total_whatsapp_clicks: totalWhatsAppClicks,
        today_whatsapp_clicks: todayWhatsAppClicks,
        conversion_rate: conversionRate,
        placements: placementMap,
        top_pages: topPages,
        recent_events: recentEvents,
        hourly_trend: hourlyTrend,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Real-time analytics error:', error);
    res.status(500).json({ error: 'Failed to retrieve real-time analytics' });
  }
});

router.post('/analytics/reset', async (_req: AuthenticatedRequest, res: Response) => {
  try {
    await sqliteDb.exec('DELETE FROM analytics_events');
    res.json({ success: true, message: 'All analytics telemetry has been reset to 0' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to reset analytics' });
  }
});

// -------------------------------------------------------------
// 2. Upload Endpoint
// -------------------------------------------------------------
router.post('/upload', upload.single('image'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imageUrl = await processImageUpload(req.file);
    res.json({
      success: true,
      url: imageUrl,
      filename: req.file.filename,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Image upload failed' });
  }
});

router.post('/upload-multiple', upload.array('images', 10), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No image files uploaded' });
    }

    const uploadedUrls: string[] = [];
    for (const file of files) {
      const url = await processImageUpload(file);
      uploadedUrls.push(url);
    }

    res.json({
      success: true,
      urls: uploadedUrls,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Multiple upload failed' });
  }
});

// -------------------------------------------------------------
// 3. Website Settings
// -------------------------------------------------------------
router.get('/settings', async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const settings = await sqliteDb.prepare('SELECT * FROM website_settings LIMIT 1').get() as any;
    if (settings && typeof settings.section_visibility === 'string') {
      try {
        settings.section_visibility = JSON.parse(settings.section_visibility);
      } catch (e) {
        // default
      }
    }
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.put('/settings', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      site_title,
      tagline,
      logo_url,
      favicon_url,
      seo_title,
      seo_description,
      hero_heading,
      hero_subtitle,
      hero_trust_text,
      hero_bg_image,
      section_visibility,
    } = req.body;

    const now = new Date().toISOString();
    const visStr = typeof section_visibility === 'object' ? JSON.stringify(section_visibility) : section_visibility;

    await sqliteDb.prepare(`
      UPDATE website_settings SET
        site_title = ?,
        tagline = ?,
        logo_url = ?,
        favicon_url = ?,
        seo_title = ?,
        seo_description = ?,
        hero_heading = ?,
        hero_subtitle = ?,
        hero_trust_text = ?,
        hero_bg_image = ?,
        section_visibility = ?,
        updated_at = ?
      WHERE id = 'settings_default'
    `).run(
      site_title || 'Hriday Banquet Hall',
      tagline || '',
      logo_url || '',
      favicon_url || '',
      seo_title || '',
      seo_description || '',
      hero_heading || '',
      hero_subtitle || '',
      hero_trust_text || '',
      hero_bg_image || '',
      visStr || '{}',
      now
    );

    res.json({ success: true, message: 'Settings saved successfully' });
  } catch (error: any) {
    console.error('Settings update error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// -------------------------------------------------------------
// 4. About Content
// -------------------------------------------------------------
router.get('/about', async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const about = await sqliteDb.prepare('SELECT * FROM about_content LIMIT 1').get();
    res.json(about);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch about content' });
  }
});

router.put('/about', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      heading,
      description,
      venue_image,
      highlight_card_1_title,
      highlight_card_1_desc,
      highlight_card_2_title,
      highlight_card_2_desc,
      highlight_card_3_title,
      highlight_card_3_desc,
    } = req.body;

    const now = new Date().toISOString();

    await sqliteDb.prepare(`
      UPDATE about_content SET
        heading = ?,
        description = ?,
        venue_image = ?,
        highlight_card_1_title = ?,
        highlight_card_1_desc = ?,
        highlight_card_2_title = ?,
        highlight_card_2_desc = ?,
        highlight_card_3_title = ?,
        highlight_card_3_desc = ?,
        updated_at = ?
      WHERE id = 'about_default'
    `).run(
      heading || '',
      description || '',
      venue_image || '',
      highlight_card_1_title || '',
      highlight_card_1_desc || '',
      highlight_card_2_title || '',
      highlight_card_2_desc || '',
      highlight_card_3_title || '',
      highlight_card_3_desc || '',
      now
    );

    res.json({ success: true, message: 'About content updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update about content' });
  }
});

// -------------------------------------------------------------
// 5. Services Manager & Service Media
// -------------------------------------------------------------
router.get('/services', async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const services = await sqliteDb.prepare('SELECT * FROM services ORDER BY display_order ASC, created_at ASC').all();
    res.json(services);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

router.get('/services/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const service = await sqliteDb.prepare('SELECT * FROM services WHERE id = ?').get(id) as any;
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    const gallery = await sqliteDb.prepare('SELECT * FROM service_gallery WHERE service_id = ? ORDER BY display_order ASC').all(id);
    const instagramMedia = await sqliteDb.prepare('SELECT * FROM service_instagram_media WHERE service_id = ? ORDER BY display_order ASC').all(id);

    let parsedFeatures: string[] = [];
    if (service.features) {
      try {
        parsedFeatures = typeof service.features === 'string' ? JSON.parse(service.features) : service.features;
      } catch {
        parsedFeatures = [];
      }
    }

    res.json({
      ...service,
      features: parsedFeatures,
      gallery: gallery || [],
      instagram_media: instagramMedia || [],
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch service details' });
  }
});

router.post('/services', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, slug, description, short_description, full_description, features, image_url, category, display_order, is_active } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Service title is required' });
    }

    const id = 'srv_' + Date.now();
    const now = new Date().toISOString();
    const finalSlug = (slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).trim();
    const finalFeatures = typeof features === 'string' ? features : JSON.stringify(features || []);

    await sqliteDb.prepare(`
      INSERT INTO services (id, title, slug, description, short_description, full_description, features, image_url, category, display_order, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      title.trim(),
      finalSlug,
      description || short_description || '',
      short_description || description || '',
      full_description || description || '',
      finalFeatures,
      image_url || '',
      category || 'General',
      display_order || 0,
      is_active !== undefined ? (is_active ? 1 : 0) : 1,
      now,
      now
    );

    res.status(201).json({ success: true, message: 'Service created successfully', id });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

router.put('/services/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { title, slug, description, short_description, full_description, features, image_url, category, display_order, is_active } = req.body;
    const now = new Date().toISOString();
    const finalSlug = (slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).trim();
    const finalFeatures = typeof features === 'string' ? features : JSON.stringify(features || []);

    await sqliteDb.prepare(`
      UPDATE services SET
        title = ?,
        slug = ?,
        description = ?,
        short_description = ?,
        full_description = ?,
        features = ?,
        image_url = ?,
        category = ?,
        display_order = ?,
        is_active = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      title,
      finalSlug,
      description || short_description || '',
      short_description || description || '',
      full_description || description || '',
      finalFeatures,
      image_url,
      category,
      display_order,
      is_active ? 1 : 0,
      now,
      id
    );

    res.json({ success: true, message: 'Service updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

router.delete('/services/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    await sqliteDb.prepare('DELETE FROM service_gallery WHERE service_id = ?').run(id);
    await sqliteDb.prepare('DELETE FROM service_instagram_media WHERE service_id = ?').run(id);
    await sqliteDb.prepare('DELETE FROM services WHERE id = ?').run(id);
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// Service Gallery Endpoints
router.get('/services/:id/gallery', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const gallery = await sqliteDb.prepare('SELECT * FROM service_gallery WHERE service_id = ? ORDER BY display_order ASC, created_at ASC').all(id);
    res.json(gallery);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch service gallery' });
  }
});

router.post('/services/:id/gallery', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const serviceId = String(req.params.id);
    const { image_url, caption, display_order } = req.body;
    if (!image_url || !image_url.trim()) {
      return res.status(400).json({ error: 'Image URL is required' });
    }
    const id = 'sg_' + Date.now() + '_' + Math.round(Math.random() * 1000);
    const now = new Date().toISOString();

    await sqliteDb.prepare(`
      INSERT INTO service_gallery (id, service_id, image_url, caption, display_order, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, serviceId, image_url.trim(), caption || '', display_order || 0, now);

    res.status(201).json({ success: true, message: 'Image added to service gallery', id });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to add image to service gallery' });
  }
});

router.delete('/services/gallery/:galleryId', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const galleryId = String(req.params.galleryId);
    await sqliteDb.prepare('DELETE FROM service_gallery WHERE id = ?').run(galleryId);
    res.json({ success: true, message: 'Gallery image removed' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to remove gallery image' });
  }
});

// Service Instagram Media Endpoints
router.get('/services/:id/instagram', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const media = await sqliteDb.prepare('SELECT * FROM service_instagram_media WHERE service_id = ? ORDER BY display_order ASC, created_at ASC').all(id);
    res.json(media);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch service Instagram media' });
  }
});

router.post('/services/:id/instagram', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const serviceId = String(req.params.id);
    const { instagram_url, cover_image, media_type, title, caption, display_order } = req.body;
    if (!instagram_url || !instagram_url.trim()) {
      return res.status(400).json({ error: 'Instagram URL is required' });
    }
    const id = 'sim_' + Date.now() + '_' + Math.round(Math.random() * 1000);
    const now = new Date().toISOString();

    await sqliteDb.prepare(`
      INSERT INTO service_instagram_media (id, service_id, instagram_url, cover_image, media_type, title, caption, display_order, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, serviceId, instagram_url.trim(), cover_image || '', media_type || 'reel', title || '', caption || '', display_order || 0, now);

    res.status(201).json({ success: true, message: 'Instagram media added to service', id });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to add Instagram media' });
  }
});

router.put('/services/instagram/:mediaId', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const mediaId = String(req.params.mediaId);
    const existing = await sqliteDb.prepare('SELECT * FROM service_instagram_media WHERE id = ?').get(mediaId) as any;
    if (!existing) {
      return res.status(404).json({ error: 'Instagram media not found' });
    }

    const { instagram_url, cover_image, media_type, title, caption, display_order } = req.body;
    const nextUrl = instagram_url !== undefined ? String(instagram_url).trim() : existing.instagram_url;
    if (!nextUrl) {
      return res.status(400).json({ error: 'Instagram URL is required' });
    }

    await sqliteDb.prepare(`
      UPDATE service_instagram_media SET
        instagram_url = ?,
        cover_image = ?,
        media_type = ?,
        title = ?,
        caption = ?,
        display_order = ?
      WHERE id = ?
    `).run(
      nextUrl,
      cover_image !== undefined ? cover_image : (existing.cover_image || ''),
      media_type !== undefined ? media_type : existing.media_type,
      title !== undefined ? title : existing.title,
      caption !== undefined ? caption : existing.caption,
      display_order !== undefined ? display_order : existing.display_order,
      mediaId
    );

    res.json({ success: true, message: 'Instagram media updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update Instagram media' });
  }
});

router.delete('/services/instagram/:mediaId', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const mediaId = String(req.params.mediaId);
    await sqliteDb.prepare('DELETE FROM service_instagram_media WHERE id = ?').run(mediaId);
    res.json({ success: true, message: 'Instagram media removed' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to remove Instagram media' });
  }
});

// -------------------------------------------------------------
// 5B. Celebrations Manager (Real Celebrations & Featured List)
// -------------------------------------------------------------
router.get('/celebrations', async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const celebrations = await sqliteDb.prepare('SELECT * FROM celebrations ORDER BY featured_order ASC, created_at ASC').all();
    res.json(celebrations);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch celebrations' });
  }
});

router.post('/celebrations', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, image_url, instagram_url, tag, service_slug, is_featured, featured_order, is_active } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Celebration title is required' });
    }
    if (!image_url || !image_url.trim()) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const id = 'cel_' + Date.now();
    const now = new Date().toISOString();

    await sqliteDb.prepare(`
      INSERT INTO celebrations (id, title, description, image_url, instagram_url, tag, service_slug, is_featured, featured_order, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      title.trim(),
      description || '',
      image_url.trim(),
      instagram_url || '',
      tag || '#HridayCelebrations',
      service_slug || '',
      is_featured ? 1 : 0,
      featured_order || 0,
      is_active !== undefined ? (is_active ? 1 : 0) : 1,
      now,
      now
    );

    res.status(201).json({ success: true, message: 'Celebration created successfully', id });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create celebration' });
  }
});

router.put('/celebrations/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { title, description, image_url, instagram_url, tag, service_slug, is_featured, featured_order, is_active } = req.body;
    const now = new Date().toISOString();

    await sqliteDb.prepare(`
      UPDATE celebrations SET
        title = ?,
        description = ?,
        image_url = ?,
        instagram_url = ?,
        tag = ?,
        service_slug = ?,
        is_featured = ?,
        featured_order = ?,
        is_active = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      title,
      description,
      image_url,
      instagram_url,
      tag,
      service_slug || '',
      is_featured ? 1 : 0,
      featured_order || 0,
      is_active ? 1 : 0,
      now,
      id
    );

    res.json({ success: true, message: 'Celebration updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update celebration' });
  }
});

router.patch('/celebrations/:id/toggle-featured', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { is_featured } = req.body;
    const now = new Date().toISOString();

    await sqliteDb.prepare(`
      UPDATE celebrations SET
        is_featured = ?,
        updated_at = ?
      WHERE id = ?
    `).run(is_featured ? 1 : 0, now, id);

    res.json({ success: true, message: `Celebration ${is_featured ? 'added to' : 'removed from'} featured list` });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to toggle featured status' });
  }
});

router.patch('/celebrations/:id/featured-order', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { featured_order } = req.body;
    const now = new Date().toISOString();

    await sqliteDb.prepare(`
      UPDATE celebrations SET
        featured_order = ?,
        updated_at = ?
      WHERE id = ?
    `).run(Number(featured_order) || 0, now, id);

    res.json({ success: true, message: 'Featured order updated' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

router.delete('/celebrations/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    await sqliteDb.prepare('DELETE FROM celebrations WHERE id = ?').run(id);
    res.json({ success: true, message: 'Celebration deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete celebration' });
  }
});

// -------------------------------------------------------------
// 6. Gallery Manager
// -------------------------------------------------------------
router.get('/gallery', async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const images = await sqliteDb.prepare('SELECT * FROM gallery_images ORDER BY display_order ASC, created_at DESC').all();
    res.json(images);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
});

router.post('/gallery', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, image_url, category, display_order, is_featured, is_active } = req.body;
    if (!image_url || !image_url.trim()) {
      return res.status(400).json({ error: 'Image URL or upload is required' });
    }

    const id = 'gal_' + Date.now();
    const now = new Date().toISOString();

    await sqliteDb.prepare(`
      INSERT INTO gallery_images (id, title, description, image_url, category, display_order, is_featured, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      title || 'Banquet Photograph',
      description || '',
      image_url.trim(),
      category || 'Banquet Interiors',
      display_order || 0,
      is_featured ? 1 : 0,
      is_active !== undefined ? (is_active ? 1 : 0) : 1,
      now,
      now
    );

    res.status(201).json({ success: true, message: 'Gallery image added successfully', id });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to add gallery image' });
  }
});

router.put('/gallery/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { title, description, image_url, category, display_order, is_featured, is_active } = req.body;
    const now = new Date().toISOString();

    await sqliteDb.prepare(`
      UPDATE gallery_images SET
        title = ?,
        description = ?,
        image_url = ?,
        category = ?,
        display_order = ?,
        is_featured = ?,
        is_active = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      title,
      description,
      image_url,
      category,
      display_order,
      is_featured ? 1 : 0,
      is_active ? 1 : 0,
      now,
      id
    );

    res.json({ success: true, message: 'Gallery image updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update gallery image' });
  }
});

router.delete('/gallery/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    await sqliteDb.prepare('DELETE FROM gallery_images WHERE id = ?').run(id);
    res.json({ success: true, message: 'Gallery image deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete gallery image' });
  }
});

// Toggle active/inactive for gallery
router.patch('/gallery/:id/toggle-active', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const item = await sqliteDb.prepare('SELECT is_active FROM gallery_images WHERE id = ?').get(id) as any;
    if (!item) return res.status(404).json({ error: 'Image not found' });

    const newStatus = item.is_active === 1 ? 0 : 1;
    await sqliteDb.prepare('UPDATE gallery_images SET is_active = ?, updated_at = ? WHERE id = ?').run(
      newStatus,
      new Date().toISOString(),
      id
    );
    res.json({ success: true, is_active: newStatus });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to toggle status' });
  }
});

// Toggle featured for gallery
router.patch('/gallery/:id/toggle-featured', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const item = await sqliteDb.prepare('SELECT is_featured FROM gallery_images WHERE id = ?').get(id) as any;
    if (!item) return res.status(404).json({ error: 'Image not found' });

    const newFeatured = item.is_featured === 1 ? 0 : 1;
    await sqliteDb.prepare('UPDATE gallery_images SET is_featured = ?, updated_at = ? WHERE id = ?').run(
      newFeatured,
      new Date().toISOString(),
      id
    );
    res.json({ success: true, is_featured: newFeatured });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to toggle featured' });
  }
});

// -------------------------------------------------------------
// 7. Social Links Manager
// -------------------------------------------------------------
router.get('/social', async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const links = await sqliteDb.prepare('SELECT * FROM social_links').all();
    res.json(links);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch social links' });
  }
});

router.put('/social', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { links } = req.body; // array of { platform, handle, url, is_active }
    if (!Array.isArray(links)) {
      return res.status(400).json({ error: 'Invalid links payload' });
    }

    const now = new Date().toISOString();
    const updateStmt = await sqliteDb.prepare(`
      INSERT INTO social_links (id, platform, handle, url, is_active, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(platform) DO UPDATE SET
        handle = excluded.handle,
        url = excluded.url,
        is_active = excluded.is_active,
        updated_at = excluded.updated_at
    `);

    for (const link of links) {
      updateStmt.run(
        'social_' + link.platform,
        link.platform,
        link.handle || '',
        link.url || '',
        link.is_active !== undefined ? (link.is_active ? 1 : 0) : 1,
        now
      );
    }

    res.json({ success: true, message: 'Social links updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update social links' });
  }
});

// -------------------------------------------------------------
// 8. WhatsApp Manager
// -------------------------------------------------------------
router.get('/whatsapp', async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const settings = await sqliteDb.prepare('SELECT * FROM whatsapp_settings').all();
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch WhatsApp settings' });
  }
});

router.put('/whatsapp', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { hriday, sunshine } = req.body;
    const now = new Date().toISOString();

    const cleanPhone = (phone: string) => {
      if (!phone) return '';
      return phone.replace(/[^0-9+]/g, '');
    };

    if (hriday) {
      const phone = cleanPhone(hriday.phone_number || '');
      await sqliteDb.prepare(`
        UPDATE whatsapp_settings SET
          phone_number = ?,
          default_message = ?,
          is_active = ?,
          updated_at = ?
        WHERE entity = 'hriday'
      `).run(
        phone,
        hriday.default_message || '',
        hriday.is_active !== undefined ? (hriday.is_active ? 1 : 0) : 1,
        now
      );
    }

    if (sunshine) {
      const phone = cleanPhone(sunshine.phone_number || '');
      await sqliteDb.prepare(`
        UPDATE whatsapp_settings SET
          phone_number = ?,
          default_message = ?,
          is_active = ?,
          updated_at = ?
        WHERE entity = 'sunshine'
      `).run(
        phone,
        sunshine.default_message || '',
        sunshine.is_active !== undefined ? (sunshine.is_active ? 1 : 0) : 1,
        now
      );
    }

    res.json({ success: true, message: 'WhatsApp configuration saved successfully' });
  } catch (error: any) {
    console.error('WhatsApp update error:', error);
    res.status(500).json({ error: 'Failed to save WhatsApp configuration' });
  }
});

// -------------------------------------------------------------
// 9. Contact & Location Manager
// -------------------------------------------------------------
router.get('/contact', async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const contact = await sqliteDb.prepare('SELECT * FROM contact_information LIMIT 1').get();
    res.json(contact);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch contact information' });
  }
});

router.put('/contact', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      venue_name,
      full_address,
      phone_number,
      email_address,
      opening_hours,
      google_maps_embed_url,
      google_maps_directions_url,
    } = req.body;

    const now = new Date().toISOString();

    await sqliteDb.prepare(`
      UPDATE contact_information SET
        venue_name = ?,
        full_address = ?,
        phone_number = ?,
        email_address = ?,
        opening_hours = ?,
        google_maps_embed_url = ?,
        google_maps_directions_url = ?,
        updated_at = ?
      WHERE id = 'contact_default'
    `).run(
      venue_name || 'Hriday Banquet Hall',
      full_address || '',
      phone_number || '',
      email_address || '',
      opening_hours || '',
      google_maps_embed_url || '',
      google_maps_directions_url || '',
      now
    );

    res.json({ success: true, message: 'Contact & location updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update contact information' });
  }
});

// -------------------------------------------------------------
// 10. Sunshine Events & Management Agency Manager
// -------------------------------------------------------------
router.get('/sunshine', async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const agency = await sqliteDb.prepare('SELECT * FROM sunshine_agency LIMIT 1').get() as any;
    const services = await sqliteDb.prepare('SELECT * FROM sunshine_services ORDER BY display_order ASC').all();
    res.json({ agency, services });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch Sunshine Agency data' });
  }
});

router.put('/sunshine', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      agency_name,
      heading,
      supporting_text,
      description,
      logo_url,
      banner_image_url,
      attribution_statement,
      is_visible,
    } = req.body;

    const now = new Date().toISOString();

    await sqliteDb.prepare(`
      UPDATE sunshine_agency SET
        agency_name = ?,
        heading = ?,
        supporting_text = ?,
        description = ?,
        logo_url = ?,
        banner_image_url = ?,
        attribution_statement = ?,
        is_visible = ?,
        updated_at = ?
      WHERE id = 'sunshine_default'
    `).run(
      agency_name || 'SUNSHINE EVENTS & MANAGEMENT',
      heading || '',
      supporting_text || '',
      description || '',
      logo_url || '',
      banner_image_url || '',
      attribution_statement || '',
      is_visible !== undefined ? (is_visible ? 1 : 0) : 1,
      now
    );

    res.json({ success: true, message: 'Sunshine Agency promotional settings saved successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update Sunshine Agency settings' });
  }
});

// Sunshine Services CRUD
router.post('/sunshine/services', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, icon_name, display_order, is_active } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ error: 'Service title required' });

    const id = 'ss_' + Date.now();
    const now = new Date().toISOString();

    await sqliteDb.prepare(`
      INSERT INTO sunshine_services (id, title, description, icon_name, display_order, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      title.trim(),
      description || '',
      icon_name || 'Sparkles',
      display_order || 0,
      is_active !== undefined ? (is_active ? 1 : 0) : 1,
      now
    );

    res.status(201).json({ success: true, id });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create agency service' });
  }
});

router.put('/sunshine/services/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { title, description, icon_name, display_order, is_active } = req.body;

    await sqliteDb.prepare(`
      UPDATE sunshine_services SET
        title = ?,
        description = ?,
        icon_name = ?,
        display_order = ?,
        is_active = ?
      WHERE id = ?
    `).run(
      title,
      description,
      icon_name,
      display_order,
      is_active ? 1 : 0,
      id
    );

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update agency service' });
  }
});

router.delete('/sunshine/services/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    await sqliteDb.prepare('DELETE FROM sunshine_services WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete agency service' });
  }
});

// -------------------------------------------------------------
// 11. Enquiries Management
// -------------------------------------------------------------
router.get('/enquiries', async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const enquiries = await sqliteDb.prepare('SELECT * FROM enquiries ORDER BY created_at DESC').all();
    res.json(enquiries);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

router.patch('/enquiries/:id/status', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { status } = req.body;

    await sqliteDb.prepare('UPDATE enquiries SET status = ? WHERE id = ?').run(status, id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update enquiry status' });
  }
});

router.delete('/enquiries/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    await sqliteDb.prepare('DELETE FROM enquiries WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
});

export default router;
