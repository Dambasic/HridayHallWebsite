import { RealtimeAnalytics } from '../types';

const rawApiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim().replace(/\/+$/, '');
const API_BASE = rawApiUrl ? (rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`) : '/api';

function getSessionId(): string {
  try {
    let sid = sessionStorage.getItem('hriday_analytics_session_id');
    if (!sid) {
      sid = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
      sessionStorage.setItem('hriday_analytics_session_id', sid);
    }
    return sid;
  } catch {
    return 'sess_fallback_' + Date.now();
  }
}

export async function trackEvent(
  eventType: 'page_view' | 'whatsapp_click' | 'session_ping',
  pageUrl: string,
  pageTitle: string,
  placement = '',
  metadata: Record<string, any> = {}
): Promise<void> {
  try {
    const payload = {
      event_type: eventType,
      session_id: getSessionId(),
      page_url: pageUrl || window.location.pathname,
      page_title: pageTitle || document.title,
      placement: placement || '',
      metadata,
    };

    // Use navigator.sendBeacon when possible or normal fetch
    const bodyStr = JSON.stringify(payload);
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([bodyStr], { type: 'application/json' });
      navigator.sendBeacon(`${API_BASE}/public/analytics/track`, blob);
    } else {
      fetch(`${API_BASE}/public/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: bodyStr,
        keepalive: true,
      }).catch(() => {});
    }
  } catch (err) {
    // Non-blocking for analytics
  }
}

export function trackPageView(pageUrl?: string, pageTitle?: string): void {
  trackEvent('page_view', pageUrl || window.location.pathname, pageTitle || document.title);
}

export function trackWhatsAppClick(placement: string, metadata: Record<string, any> = {}): void {
  trackEvent('whatsapp_click', window.location.pathname, document.title, placement, metadata);
}

export function pingSession(): void {
  trackEvent('session_ping', window.location.pathname, document.title, 'heartbeat');
}

export async function fetchRealtimeAnalytics(): Promise<RealtimeAnalytics> {
  const token = localStorage.getItem('hriday_admin_token');
  const res = await fetch(`${API_BASE}/admin/analytics/realtime`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    throw new Error('Failed to load real-time analytics');
  }

  const json = await res.json();
  return json.realtime;
}

export async function resetRealtimeAnalytics(): Promise<void> {
  const token = localStorage.getItem('hriday_admin_token');
  const res = await fetch(`${API_BASE}/admin/analytics/reset`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    throw new Error('Failed to reset analytics');
  }
}
