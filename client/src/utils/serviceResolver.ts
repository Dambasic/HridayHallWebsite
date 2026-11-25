import { ServiceItem } from '../types';

export interface ResolvedServiceDestination {
  service: ServiceItem;
  slug: string;
  url: string;
  title: string;
}

const KEYWORD_MATCHERS: Array<{ patterns: string[]; serviceKeys: string[] }> = [
  {
    patterns: ['wedding', 'marriage', 'mandap', 'bridal', 'groom', 'reception'],
    serviceKeys: ['wedding', 'weddings'],
  },
  {
    patterns: ['engagement', 'sangeet', 'ring ceremony', 'roka', 'moments'],
    serviceKeys: ['engagement'],
  },
  {
    patterns: ['birthday', 'milestone birthday', 'cake'],
    serviceKeys: ['birthday', 'birthdays'],
  },
  {
    patterns: ['anniversary', 'jubilee', 'silver jubilee', 'golden jubilee', 'love'],
    serviceKeys: ['anniversary'],
  },
  {
    patterns: ['corporate', 'executive', 'conference', 'seminar', 'gala', 'award night'],
    serviceKeys: ['corporate'],
  },
  {
    patterns: ['family', 'reunion', 'gathering', 'get-together'],
    serviceKeys: ['family'],
  },
  {
    patterns: ['private celebration', 'private party', 'vip party'],
    serviceKeys: ['private'],
  },
  {
    patterns: ['stage', 'decor', 'decoration', 'centerpiece', 'chandelier', 'walkway', 'arrangement', 'interior'],
    serviceKeys: ['arrangement', 'arrangements'],
  },
];

/**
 * Resolves a celebration, gallery image, or review item to its exact dedicated service page
 * using live service records from the API.
 */
export function resolveServiceForItem(
  item: {
    service_slug?: string;
    title?: string;
    tag?: string;
    category?: string;
    description?: string;
  },
  services: ServiceItem[] = []
): ResolvedServiceDestination | null {
  if (!services || services.length === 0) return null;

  // 1. Exact explicit service_slug match from database / admin selection
  if (item.service_slug && item.service_slug.trim()) {
    const cleanSlug = item.service_slug.trim().toLowerCase();
    const direct = services.find(
      (s) => s.slug?.toLowerCase() === cleanSlug || s.id?.toLowerCase() === cleanSlug
    );
    if (direct && direct.slug) {
      return {
        service: direct,
        slug: direct.slug,
        url: `/services/${direct.slug}`,
        title: direct.title,
      };
    }
  }

  // Build normalized searchable text from item fields (prioritize tag/category/title)
  const primaryText = `${item.title || ''} ${item.tag || ''} ${item.category || ''}`.toLowerCase();

  // 2. Direct match against service title or category
  for (const s of services) {
    const sTitle = (s.title || '').toLowerCase();
    const sCat = (s.category || '').toLowerCase();
    if (
      (sTitle && primaryText.includes(sTitle)) ||
      (sCat && sCat.length > 3 && primaryText.includes(sCat))
    ) {
      if (s.slug) {
        return {
          service: s,
          slug: s.slug,
          url: `/services/${s.slug}`,
          title: s.title,
        };
      }
    }
  }

  // 3. Semantic keyword matching against live services
  for (const matcher of KEYWORD_MATCHERS) {
    if (matcher.patterns.some((kw) => primaryText.includes(kw))) {
      const matchedService = services.find((s) => {
        const hay = `${s.slug} ${s.title} ${s.category}`.toLowerCase();
        return matcher.serviceKeys.some((sk) => hay.includes(sk));
      });
      if (matchedService && matchedService.slug) {
        return {
          service: matchedService,
          slug: matchedService.slug,
          url: `/services/${matchedService.slug}`,
          title: matchedService.title,
        };
      }
    }
  }

  return null;
}
