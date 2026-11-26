import { WebsiteContent, ServiceItem } from '../types';

const BASE_URL = 'https://hridaybanquethall.com';

/**
 * Builds validated JSON-LD schema graph for the Homepage:
 * - Organization
 * - EventVenue & LocalBusiness
 * - WebSite
 */
export function getHomepageSchema(content?: WebsiteContent | null): Record<string, any> {
  const contact = content?.contact;
  const venueName = contact?.venue_name || 'Hriday Banquet Hall';
  const fullAddress = contact?.full_address || 'Hriday Banquet Hall, Spine Road';
  const phone = contact?.phone_number || '';
  const email = contact?.email_address || '';
  const openingHours = contact?.opening_hours || 'Mo-Su 10:00-22:00';
  const heroImage = content?.settings?.hero_bg_image || `${BASE_URL}/hriday-logo.png`;

  const servicesList = content?.services?.map((s: ServiceItem) => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name: s.title,
      description: s.short_description || s.description,
      url: `${BASE_URL}/services/${s.slug}`,
    },
  })) || [];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      // 1. Organization Schema
      {
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
        name: venueName,
        url: BASE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/hriday-logo.png`,
          caption: 'Hriday Banquet Hall Brand Logo',
        },
        image: heroImage,
        description:
          'Hriday Banquet Hall is a premier luxury hospitality and celebration venue in Pimpri Chinchwad, hosting grand weddings, receptions, corporate galas, and milestone family celebrations.',
        ...(phone ? { telephone: phone } : {}),
        ...(email ? { email: email } : {}),
      },

      // 2. LocalBusiness / EventVenue Schema
      {
        '@type': ['EventVenue', 'LocalBusiness'],
        '@id': `${BASE_URL}/#venue`,
        name: venueName,
        url: BASE_URL,
        logo: `${BASE_URL}/hriday-logo.png`,
        image: [
          heroImage,
          `${BASE_URL}/hriday-logo.png`,
        ],
        description:
          'Premier air-conditioned banquet hall in Pimpri Chinchwad for weddings, engagement ceremonies, birthday parties, anniversaries, and corporate events with bespoke decor and hospitality.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: fullAddress,
          addressLocality: 'Pimpri Chinchwad',
          addressRegion: 'Maharashtra',
          addressCountry: 'IN',
        },
        openingHours: [openingHours],
        priceRange: '₹₹₹',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Banquet & Celebration Hosting Services',
          itemListElement: servicesList,
        },
        ...(phone ? { telephone: phone } : {}),
        ...(email ? { email: email } : {}),
      },

      // 3. WebSite Schema
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: BASE_URL,
        name: venueName,
        description: 'Luxury Banquet Hall in Pimpri Chinchwad for Weddings and Private Celebrations',
        publisher: {
          '@id': `${BASE_URL}/#organization`,
        },
        inLanguage: 'en-IN',
      },
    ],
  };
}

/**
 * Builds validated JSON-LD schema for individual Service Landing Pages:
 * - Service Schema
 * - BreadcrumbList Schema
 */
export function getServicePageSchema(
  service: ServiceItem,
  content?: WebsiteContent | null
): Record<string, any> {
  const serviceUrl = `${BASE_URL}/services/${service.slug}`;
  const venueName = content?.contact?.venue_name || 'Hriday Banquet Hall';
  const imageUrl = service.image_url || `${BASE_URL}/hriday-logo.png`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      // 1. BreadcrumbList Schema
      {
        '@type': 'BreadcrumbList',
        '@id': `${serviceUrl}/#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: BASE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Facilities & Services',
            item: `${BASE_URL}/#facilities`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: service.title,
            item: serviceUrl,
          },
        ],
      },

      // 2. Service Schema
      {
        '@type': 'Service',
        '@id': `${serviceUrl}/#service`,
        name: `${service.title} at ${venueName}`,
        serviceType: 'Banquet & Event Venue Hosting',
        description: service.full_description || service.short_description || service.description,
        provider: {
          '@type': 'EventVenue',
          name: venueName,
          url: BASE_URL,
          image: `${BASE_URL}/hriday-logo.png`,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Pimpri Chinchwad',
            addressRegion: 'Maharashtra',
            addressCountry: 'IN',
          },
        },
        areaServed: {
          '@type': 'City',
          name: 'Pimpri Chinchwad',
        },
        image: imageUrl,
        url: serviceUrl,
      },
    ],
  };
}
