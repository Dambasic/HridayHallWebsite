import React, { useEffect, useState, useCallback } from 'react';
import {
  Users,
  Eye,
  MessageCircle,
  TrendingUp,
  RefreshCw,
  Activity,
  Globe,
  Radio,
  Clock,
  Sparkles,
  ArrowUpRight,
  Smartphone,
  Layers,
  RotateCcw,
} from 'lucide-react';
import { RealtimeAnalytics } from '../../types';
import { fetchRealtimeAnalytics, resetRealtimeAnalytics } from '../../services/analytics';

export const RealtimeAnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<RealtimeAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [error, setError] = useState('');
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [isResetting, setIsResetting] = useState(false);

  const handleResetToZero = async () => {
    if (!window.confirm('Are you sure you want to reset all telemetry data to 0? This will wipe historical views and click records for fresh real-time tracking.')) {
      return;
    }
    try {
      setIsResetting(true);
      await resetRealtimeAnalytics();
      await loadAnalytics(true);
    } catch (err: any) {
      alert(err.message || 'Failed to reset analytics');
    } finally {
      setIsResetting(false);
    }
  };

  const loadAnalytics = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) setIsRefreshing(true);
      setError('');
      const result = await fetchRealtimeAnalytics();
      setData(result);
      const now = new Date();
      setLastSyncTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err: any) {
      console.error('Failed to load realtime analytics:', err);
      setError(err.message || 'Failed to sync realtime telemetry');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  // Polling interval for live telemetry
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      loadAnalytics(false);
    }, 4000); // 4 seconds live refresh

    return () => clearInterval(interval);
  }, [autoRefresh, loadAnalytics]);

  if (isLoading && !data) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-gold-300/80 shadow-luxury">
        <div className="flex items-center justify-center py-12 gap-3 text-maroon-900">
          <RefreshCw className="w-6 h-6 animate-spin text-gold-600" />
          <span className="font-semibold text-sm">Connecting to Real-Time Telemetry Stream...</span>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-rose-800">
        <p className="font-semibold text-sm">{error}</p>
        <button
          onClick={() => loadAnalytics(true)}
          className="mt-3 px-4 py-2 bg-rose-700 text-white rounded-xl text-xs font-bold"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (!data) return null;

  const placementLabels: Record<string, string> = {
    hero: 'Hero Section Main CTA',
    navbar: 'Sticky Navigation Bar',
    floating_button: 'Floating WhatsApp Widget',
    service_detail: 'Service Detail Pages',
    lightbox: 'Banquet Photo Lightbox',
    contact: 'Contact Us Quotation Channel',
  };

  // Find max hourly views for proportional bar graph
  const maxHourlyViews = Math.max(
    ...data.hourly_trend.map((h) => Math.max(h.views, 1)),
    10
  );

  return (
    <div className="space-y-6">
      {/* 1. REAL-TIME TELEMETRY CONTROL BAR */}
      <div className="bg-gradient-to-r from-[#390014] via-[#4A071D] to-[#26000D] text-white rounded-3xl p-6 border-2 border-gold-400 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400">
              <span className="absolute w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <Radio className="w-5 h-5 relative z-10" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
                  Live Banquet Telemetry
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-ivory-100 font-normal mt-0.5">
                Real-time tracking of active website visitors, page views, and WhatsApp quotation conversions.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            {/* Auto-Refresh Toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition border ${
                autoRefresh
                  ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                  : 'bg-white/10 border-white/20 text-ivory-200 hover:bg-white/20'
              }`}
              title={autoRefresh ? 'Auto-refresh every 4s active' : 'Auto-refresh paused'}
            >
              <Activity className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-pulse text-emerald-400' : ''}`} />
              <span>{autoRefresh ? 'Auto-Sync: ON (4s)' : 'Auto-Sync: PAUSED'}</span>
            </button>

            {/* Manual Refresh Button */}
            <button
              onClick={() => loadAnalytics(true)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-400 hover:bg-gold-300 text-[#26000D] text-xs font-bold transition shadow hover:shadow-lg disabled:opacity-70 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Now'}</span>
            </button>

            {/* Reset to 0 Button */}
            <button
              onClick={handleResetToZero}
              disabled={isResetting}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-rose-900/60 text-ivory-200 hover:text-white text-xs font-semibold transition border border-white/20 hover:border-rose-500/50 cursor-pointer disabled:opacity-50"
              title="Reset all analytics to 0"
            >
              <RotateCcw className={`w-3.5 h-3.5 text-rose-300 ${isResetting ? 'animate-spin' : ''}`} />
              <span>{isResetting ? 'Resetting...' : 'Reset to 0'}</span>
            </button>

            {lastSyncTime && (
              <span className="text-[11px] text-ivory-100 font-medium hidden lg:inline-block">
                Last checked: {lastSyncTime}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. TOP 4 REAL-TIME KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Active Users Right Now */}
        <div className="bg-white rounded-3xl p-6 border-2 border-emerald-300 shadow-luxury hover:border-emerald-400 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-charcoal-700 uppercase tracking-wider">
              Active Visitors
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center relative">
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-serif text-4xl font-bold text-emerald-700">
              {data.active_users}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              Live Now
            </span>
          </div>

          <p className="text-xs text-charcoal-600 font-medium">
            Active within the last 10 minutes
          </p>
        </div>

        {/* KPI 2: Total Page Views */}
        <div className="bg-white rounded-3xl p-6 border-2 border-gold-300 shadow-luxury hover:border-gold-400 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold-50 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-charcoal-700 uppercase tracking-wider">
              Total Page Views
            </span>
            <div className="w-10 h-10 rounded-2xl bg-gold-50 border border-gold-200 text-gold-700 flex items-center justify-center">
              <Eye className="w-5 h-5 text-gold-700" />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-serif text-4xl font-bold text-[#390014]">
              {data.total_views}
            </span>
            <span className="text-xs font-bold text-gold-700 bg-gold-100/80 px-2 py-0.5 rounded-full">
              +{data.today_views} Today
            </span>
          </div>

          <p className="text-xs text-charcoal-600 font-medium">
            Venue impressions across all pages
          </p>
        </div>

        {/* KPI 3: WhatsApp Buttons Clicked */}
        <div className="bg-white rounded-3xl p-6 border-2 border-[#25D366]/40 shadow-luxury hover:border-[#25D366] transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-charcoal-700 uppercase tracking-wider">
              WhatsApp Inquiries
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-400/40 text-[#25D366] flex items-center justify-center">
              <MessageCircle className="w-5 h-5 fill-current text-emerald-600" />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-serif text-4xl font-bold text-emerald-800">
              {data.total_whatsapp_clicks}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              +{data.today_whatsapp_clicks} Today
            </span>
          </div>

          <p className="text-xs text-charcoal-600 font-medium">
            Quotation requests initiated on WhatsApp
          </p>
        </div>

        {/* KPI 4: Direct Conversion Rate */}
        <div className="bg-white rounded-3xl p-6 border-2 border-[#650A25]/30 shadow-luxury hover:border-[#650A25] transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-maroon-50 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-charcoal-700 uppercase tracking-wider">
              Inquiry Conversion
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#650A25]/10 border border-[#650A25]/20 text-[#650A25] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#650A25]" />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-serif text-4xl font-bold text-[#650A25]">
              {data.conversion_rate}%
            </span>
            <span className="text-xs font-bold text-[#650A25] bg-[#650A25]/10 px-2 py-0.5 rounded-full">
              High Intent
            </span>
          </div>

          <p className="text-xs text-charcoal-600 font-medium">
            Visitors converting to direct enquiries
          </p>
        </div>
      </div>

      {/* 3. VISUAL BREAKDOWN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): WhatsApp Clicks by Placement & Hourly Trend */}
        <div className="lg:col-span-7 space-y-6">
          {/* WhatsApp Placement Distribution */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-gold-200/90 shadow-luxury">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gold-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#390014]">
                    WhatsApp Clicks by Button Placement
                  </h3>
                  <p className="text-xs text-charcoal-700">
                    Which buttons visitors click to request banquet quotations
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {data.total_whatsapp_clicks} Total Clicks
              </span>
            </div>

            <div className="space-y-4">
              {Object.entries(placementLabels).map(([key, label]) => {
                const count = data.placements[key] || 0;
                const percent =
                  data.total_whatsapp_clicks > 0
                    ? Math.round((count / data.total_whatsapp_clicks) * 100)
                    : 0;

                return (
                  <div key={key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-charcoal-800">{label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#390014]">{count} clicks</span>
                        <span className="text-[11px] font-bold text-charcoal-700">({percent}%)</span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-charcoal-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-[#25D366] rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percent, count > 0 ? 5 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hourly Traffic & Conversion Trend (12 Hours) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-gold-200/90 shadow-luxury">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gold-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-gold-700" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#390014]">
                    12-Hour Traffic &amp; Quotation Trend
                  </h3>
                  <p className="text-xs text-charcoal-700">
                    Hourly page impressions and WhatsApp conversion peaks
                  </p>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-[11px] font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#650A25]" />
                  <span className="text-charcoal-700">Views</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#25D366]" />
                  <span className="text-charcoal-700">WhatsApp</span>
                </div>
              </div>
            </div>

            {/* CSS Bar Chart */}
            <div className="h-44 flex items-end justify-between gap-1 sm:gap-2 pt-6 pb-2 border-b border-charcoal-200">
              {data.hourly_trend.map((item, idx) => {
                const viewHeight = Math.round((item.views / maxHourlyViews) * 100);
                const clickHeight = Math.round((item.clicks / maxHourlyViews) * 100);

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-charcoal-900 text-white text-[10px] rounded-lg px-2 py-1 shadow-lg pointer-events-none whitespace-nowrap z-20">
                      <div>{item.hour}</div>
                      <div>{item.views} Views | {item.clicks} Inquiries</div>
                    </div>

                    {/* Side-by-side bars */}
                    <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-full">
                      {/* Views bar */}
                      <div
                        className="w-1/2 bg-[#650A25] rounded-t-md transition-all duration-300 group-hover:bg-[#390014]"
                        style={{ height: `${Math.max(viewHeight, 6)}%` }}
                      />
                      {/* WhatsApp clicks bar */}
                      <div
                        className="w-1/2 bg-[#25D366] rounded-t-md transition-all duration-300 group-hover:bg-emerald-600"
                        style={{ height: `${Math.max(clickHeight, item.clicks > 0 ? 8 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hour Labels */}
            <div className="flex justify-between items-center text-[10px] sm:text-[11px] text-charcoal-700 font-semibold pt-2">
              {data.hourly_trend.map((item, idx) => (
                <span key={idx} className="truncate text-center">
                  {item.hour.replace(' AM', 'a').replace(' PM', 'p')}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Top Visited Pages & Live Telemetry Stream */}
        <div className="lg:col-span-5 space-y-6">
          {/* Top Visited Celebration Pages */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-gold-200/90 shadow-luxury">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gold-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-gold-700" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#390014]">
                    Top Visited Pages
                  </h3>
                  <p className="text-xs text-charcoal-700">
                    Most requested celebration categories
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {data.top_pages.slice(0, 6).map((page, idx) => {
                const percent =
                  data.total_views > 0
                    ? Math.round((page.views / data.total_views) * 100)
                    : 0;

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-ivory-50/70 border border-gold-200/60 flex items-center justify-between gap-3 hover:bg-white hover:border-gold-300 transition"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-gold-200 text-[#390014] text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-xs font-bold text-[#390014] truncate">
                          {page.page_title.replace(' - Hriday Banquet Hall', '')}
                        </p>
                      </div>
                      <p className="text-[11px] text-charcoal-700 truncate pl-7 mt-0.5 font-mono">
                        {page.page_url}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-[#390014] block">
                        {page.views} views
                      </span>
                      <span className="text-[10px] font-semibold text-gold-700">
                        {percent}% of traffic
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Activity Stream Ticker */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-gold-200/90 shadow-luxury">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gold-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#390014]">
                    Live Activity Stream
                  </h3>
                  <p className="text-xs text-charcoal-700">
                    Real-time feed of visitor interactions
                  </p>
                </div>
              </div>

              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Telemetry Log
              </span>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {data.recent_events.slice(0, 10).map((ev) => {
                const isWhatsApp = ev.event_type === 'whatsapp_click';
                const isPing = ev.event_type === 'session_ping';
                const eventTime = new Date(ev.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                });

                return (
                  <div
                    key={ev.id}
                    className="p-3 rounded-2xl bg-white border border-charcoal-100 hover:border-gold-300 transition flex items-start gap-3 shadow-xs text-xs"
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isWhatsApp
                          ? 'bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/40'
                          : isPing
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'bg-gold-50 text-gold-700 border border-gold-200'
                      }`}
                    >
                      {isWhatsApp ? (
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      ) : isPing ? (
                        <Radio className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`font-bold text-[11px] uppercase tracking-wider ${
                            isWhatsApp
                              ? 'text-emerald-700'
                              : isPing
                              ? 'text-blue-700'
                              : 'text-[#650A25]'
                          }`}
                        >
                          {isWhatsApp
                            ? 'WhatsApp Click'
                            : isPing
                            ? 'Active Heartbeat'
                            : 'Page Visit'}
                        </span>
                        <span className="text-[10px] text-charcoal-700 font-semibold font-mono">
                          {eventTime}
                        </span>
                      </div>

                      <p className="text-charcoal-900 font-semibold truncate mt-0.5">
                        {isWhatsApp
                          ? `Quotation requested via ${placementLabels[ev.placement] || ev.placement || 'button'}`
                          : ev.page_title.replace(' - Hriday Banquet Hall', '')}
                      </p>

                      <p className="text-[10px] text-charcoal-700 font-mono truncate">
                        {ev.page_url} • {ev.session_id.substring(0, 12)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
