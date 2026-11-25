import { WebsiteContent } from '../types';

export function isValidHttpUrl(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : null;
}

/**
 * Resolves the best available official Instagram URL from website content,
 * preferring item-specific post/reel URLs or a configured profile URL over the bare placeholder.
 */
export function resolveInstagramUrl(
  content?: WebsiteContent | null,
  specificUrl?: string
): string | null {
  const itemUrl = isValidHttpUrl(specificUrl);
  if (itemUrl) return itemUrl;

  const rawSocialUrl = isValidHttpUrl(
    content?.social?.find((s) => s.platform === 'instagram')?.url
  );
  if (rawSocialUrl && !/^https?:\/\/(www\.)?instagram\.com\/?$/i.test(rawSocialUrl)) {
    return rawSocialUrl;
  }

  const celebrationUrl = content?.celebrations
    ?.map((c) => isValidHttpUrl(c.instagram_url))
    .find(Boolean);

  return celebrationUrl || rawSocialUrl || null;
}
