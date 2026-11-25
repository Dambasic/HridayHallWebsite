import { Router, Request, Response } from 'express';
import { sqliteDb } from '../db/database.js';

const router = Router();

// GET /api/public/content - Unified payload for fast, SSR-friendly or single-query rendering
router.get('/content', (_req: Request, res: Response) => {
  try {
    const settingsRow = sqliteDb.prepare('SELECT * FROM website_settings LIMIT 1').get() as any;
    const aboutRow = sqliteDb.prepare('SELECT * FROM about_content LIMIT 1').get() as any;
    const servicesRows = sqliteDb.prepare('SELECT * FROM services WHERE is_active = 1 ORDER BY display_order ASC, created_at ASC').all() as any[];
    const galleryRows = sqliteDb.prepare('SELECT * FROM gallery_images WHERE is_active = 1 ORDER BY display_order ASC, created_at ASC').all() as any[];
    const socialRows = sqliteDb.prepare('SELECT * FROM social_links WHERE is_active = 1').all() as any[];
    const whatsappRows = sqliteDb.prepare('SELECT * FROM whatsapp_settings WHERE is_active = 1').all() as any[];
    const contactRow = sqliteDb.prepare('SELECT * FROM contact_information LIMIT 1').get() as any;
    const sunshineRow = sqliteDb.prepare('SELECT * FROM sunshine_agency LIMIT 1').get() as any;
    const sunshineServicesRows = sqliteDb.prepare('SELECT * FROM sunshine_services WHERE is_active = 1 ORDER BY display_order ASC').all() as any[];
    
    // Celebrations & Featured Celebrations
    const celebrationsRows = sqliteDb.prepare('SELECT * FROM celebrations WHERE is_active = 1 ORDER BY featured_order ASC, created_at ASC').all() as any[];
    const featuredCelebrationsRows = celebrationsRows.filter((c) => c.is_featured === 1);

    // Parse section visibility
    let sectionVisibility = {
      hero: true,
      about: true,
      services: true,
      gallery: true,
      instagram: true,
      sunshine: true,
      contact: true,
    };
    if (settingsRow?.section_visibility) {
      try {
        sectionVisibility = typeof settingsRow.section_visibility === 'string'
          ? JSON.parse(settingsRow.section_visibility)
          : settingsRow.section_visibility;
      } catch (e) {
        // use default
      }
    }

    res.json({
      settings: settingsRow ? { ...settingsRow, section_visibility: sectionVisibility } : null,
      about: aboutRow || null,
      services: servicesRows || [],
      gallery: galleryRows || [],
      celebrations: celebrationsRows || [],
      featured_celebrations: featuredCelebrationsRows || [],
      social: socialRows || [],
      whatsapp: whatsappRows || [],
      contact: contactRow || null,
      sunshine: sunshineRow ? { ...sunshineRow, services: sunshineServicesRows || [] } : null,
    });
  } catch (error: any) {
    console.error('Error fetching public content:', error);
    res.status(500).json({ error: 'Failed to retrieve website content' });
  }
});

// GET /api/public/gallery - Categorized gallery
router.get('/gallery', (req: Request, res: Response) => {
  try {
    const category = req.query.category as string;
    let query = 'SELECT * FROM gallery_images WHERE is_active = 1';
    const params: any[] = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY display_order ASC, created_at ASC';
    const images = sqliteDb.prepare(query).all(...params);
    res.json(images);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve gallery images' });
  }
});

// GET /api/public/services
router.get('/services', (_req: Request, res: Response) => {
  try {
    const services = sqliteDb.prepare('SELECT * FROM services WHERE is_active = 1 ORDER BY display_order ASC').all();
    res.json(services);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve services' });
  }
});

// GET /api/public/services/:slug
router.get('/services/:slug', (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const service = sqliteDb.prepare(`
      SELECT * FROM services 
      WHERE (slug = ? OR id = ?) AND is_active = 1 
      LIMIT 1
    `).get(slug, slug) as any;

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Parse features if stored as JSON string
    let parsedFeatures: string[] = [];
    if (service.features) {
      try {
        parsedFeatures = typeof service.features === 'string' ? JSON.parse(service.features) : service.features;
      } catch {
        parsedFeatures = [];
      }
    }

    const gallery = sqliteDb.prepare(`
      SELECT * FROM service_gallery 
      WHERE service_id = ? 
      ORDER BY display_order ASC, created_at ASC
    `).all(service.id);

    const instagramMedia = sqliteDb.prepare(`
      SELECT * FROM service_instagram_media 
      WHERE service_id = ? 
      ORDER BY display_order ASC, created_at ASC
    `).all(service.id);

    res.json({
      ...service,
      features: parsedFeatures,
      gallery: gallery || [],
      instagram_media: instagramMedia || [],
    });
  } catch (error: any) {
    console.error('Error fetching service details:', error);
    res.status(500).json({ error: 'Failed to retrieve service details' });
  }
});

// GET /api/public/celebrations
router.get('/celebrations', (req: Request, res: Response) => {
  try {
    const featuredOnly = req.query.featured === '1' || req.query.featured === 'true';
    let query = 'SELECT * FROM celebrations WHERE is_active = 1';
    if (featuredOnly) {
      query += ' AND is_featured = 1';
    }
    query += ' ORDER BY featured_order ASC, created_at ASC';
    const celebrations = sqliteDb.prepare(query).all();
    res.json(celebrations);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve celebrations' });
  }
});

// POST /api/public/enquiry
router.post('/enquiry', (req: Request, res: Response) => {
  try {
    const { name, phone, email, event_type, event_date, guest_count, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const id = 'enq_' + Date.now() + '_' + Math.round(Math.random() * 1000);
    const now = new Date().toISOString();

    sqliteDb.prepare(`
      INSERT INTO enquiries (id, name, phone, email, event_type, event_date, guest_count, message, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)
    `).run(
      id,
      name.trim(),
      phone.trim(),
      (email || '').trim(),
      event_type || 'General Celebration',
      event_date || '',
      guest_count || '',
      message || '',
      now
    );

    res.status(201).json({
      success: true,
      message: 'Thank you! Your quotation enquiry has been received. Our team will contact you shortly.',
      enquiry_id: id,
    });
  } catch (error: any) {
    console.error('Error submitting enquiry:', error);
    res.status(500).json({ error: 'Failed to submit quotation enquiry' });
  }
});

// POST /api/public/analytics/track
router.post('/analytics/track', (req: Request, res: Response) => {
  try {
    const { event_type, session_id, page_url, page_title, placement, metadata } = req.body;
    if (!event_type || !session_id) {
      return res.status(400).json({ error: 'event_type and session_id are required' });
    }

    const id = 'ev_' + Date.now() + '_' + Math.round(Math.random() * 10000);
    const now = new Date().toISOString();
    const metaStr = typeof metadata === 'string' ? metadata : JSON.stringify(metadata || {});

    sqliteDb.prepare(`
      INSERT INTO analytics_events (id, event_type, session_id, page_url, page_title, placement, metadata, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      event_type,
      String(session_id),
      String(page_url || '/'),
      String(page_title || ''),
      String(placement || ''),
      metaStr,
      now
    );

    res.status(201).json({ success: true, event_id: id });
  } catch (error: any) {
    console.error('Analytics tracking error:', error);
    res.status(500).json({ error: 'Failed to track event' });
  }
});

export default router;
