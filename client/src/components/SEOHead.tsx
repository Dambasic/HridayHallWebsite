import React, { useEffect } from 'react';

export interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  robots?: string;
  schema?: Record<string, any> | Array<Record<string, any>>;
}

const SITE_URL = 'https://hridaybanquethall.com';
const DEFAULT_TITLE = 'Hriday Banquet Hall – Luxury Weddings & Celebrations Venue in Kolkata';
const DEFAULT_DESCRIPTION =
  'Celebrate your special moments at Hriday Banquet Hall. An elegant destination for weddings, receptions, engagements, corporate events, and milestone parties in Kolkata with regal ambiance and bespoke decor.';
const DEFAULT_OG_IMAGE = `${SITE_URL}/hriday-logo.png`;

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  canonicalUrl,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  schema,
}) => {
  const fullTitle = title
    ? title.includes('Hriday')
      ? title
      : `${title} | Hriday Banquet Hall`
    : DEFAULT_TITLE;

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const cleanCanonical = canonicalUrl || `${SITE_URL}${currentPath === '/' ? '' : currentPath}`;

  useEffect(() => {
    // 1. Update Document Title
    document.title = fullTitle;

    // Helper to upsert a meta tag by name or property
    const upsertMeta = (attribute: 'name' | 'property', key: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Metadata
    upsertMeta('name', 'description', description);
    if (keywords) {
      upsertMeta('name', 'keywords', keywords);
    }
    upsertMeta('name', 'robots', robots);

    // 3. Canonical Link Tag
    let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', cleanCanonical);

    // 4. Open Graph Metadata
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', cleanCanonical);
    upsertMeta('property', 'og:type', ogType);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('property', 'og:site_name', 'Hriday Banquet Hall');
    upsertMeta('property', 'og:locale', 'en_IN');

    // 5. Twitter Card Metadata
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', ogImage);

    // 6. JSON-LD Structured Data
    const schemaScriptId = 'hriday-seo-jsonld';
    let scriptElement = document.getElementById(schemaScriptId) as HTMLScriptElement | null;

    if (schema) {
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.id = schemaScriptId;
        scriptElement.type = 'application/ld+json';
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(schema, null, 2);
    } else if (scriptElement) {
      scriptElement.remove();
    }

    // Cleanup when component unmounts
    return () => {
      // Intentionally keep current tags until next route sets them to avoid flicker
    };
  }, [fullTitle, description, keywords, cleanCanonical, ogImage, ogType, robots, schema]);

  return null;
};
