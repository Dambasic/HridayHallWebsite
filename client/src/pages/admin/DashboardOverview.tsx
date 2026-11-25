import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Image as ImageIcon,
  Sparkles,
  MessageCircle,
  Inbox,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  PhoneCall,
  MapPin,
  PartyPopper,
} from 'lucide-react';
import { fetchDashboardMetrics } from '../../services/api';
import { DashboardMetrics } from '../../types';
import { RealtimeAnalyticsDashboard } from '../../components/admin/RealtimeAnalyticsDashboard';

export const DashboardOverview: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await fetchDashboardMetrics();
      setMetrics(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <div className="w-8 h-8 border-4 border-gold-400 border-t-maroon-800 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-charcoal-700">Loading website overview metrics...</p>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm">
        <p>{error || 'Unable to load dashboard metrics'}</p>
        <button
          onClick={loadData}
          className="mt-3 px-4 py-1.5 bg-rose-700 text-white rounded-lg text-xs font-semibold"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { gallery, services, whatsapp, contact, enquiries, sections } = metrics;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-charcoal-200">
        <div>
          <h1 className="font-serif text-3xl font-bold text-maroon-950">
            Website Overview &amp; Health
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-1">
            Real-time status of banquet gallery images, active services, WhatsApp lines, and customer enquiries.
          </p>
        </div>

        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-charcoal-200 hover:bg-ivory-50 text-charcoal-700 text-xs font-semibold rounded-xl transition shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Configuration Status Notice / Alert Box */}
      {(!whatsapp.hridayConfigured || !contact.phoneConfigured) && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-4 shadow-xs">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-amber-950 mb-1">
              Configuration Pending
            </h3>
            <p className="text-xs text-amber-800 leading-relaxed mb-3">
              {!whatsapp.hridayConfigured && '• The official Hriday Banquet WhatsApp number is currently blank. '}
              {!contact.phoneConfigured && '• Public contact phone number is pending configuration. '}
              Add these details to allow visitors to contact you seamlessly.
            </p>
            <div className="flex items-center gap-3">
              {!whatsapp.hridayConfigured && (
                <Link
                  to="/admin/whatsapp"
                  className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold transition"
                >
                  Configure WhatsApp
                </Link>
              )}
              {!contact.phoneConfigured && (
                <Link
                  to="/admin/contact"
                  className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold transition"
                >
                  Configure Contact Info
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Real-time Analytics & Conversions Dashboard */}
      <RealtimeAnalyticsDashboard />

      {/* Website Content & CMS Inventory */}
      <div className="pt-4 border-t border-charcoal-200">
        <div className="mb-6">
          <h2 className="font-serif text-2xl font-bold text-maroon-950">
            Website Content &amp; Media Management
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-1">
            Manage your banquet gallery photos, celebration categories, active services, and customer enquiries.
          </p>
        </div>

        {/* Metrics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {/* Card 1: Celebrations & Featured */}
        <div className="bg-white rounded-3xl p-6 border border-gold-200/80 shadow-luxury hover:border-gold-400 transition">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider">
              Celebrations
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#650A25]/10 border border-gold-300 flex items-center justify-center text-maroon-800">
              <PartyPopper className="w-5 h-5 text-gold-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-serif text-3xl font-bold text-maroon-950">
              {metrics.celebrations?.total || 0}
            </span>
            <span className="text-xs text-gold-700 font-semibold">
              ({metrics.celebrations?.featured || 0} featured)
            </span>
          </div>
          <Link
            to="/admin/celebrations"
            className="text-xs font-semibold text-gold-700 hover:text-gold-900 flex items-center gap-1 pt-2 border-t border-charcoal-100"
          >
            <span>Manage Featured</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 2: Gallery Images */}
        <div className="bg-white rounded-3xl p-6 border border-gold-200/80 shadow-luxury hover:border-gold-400 transition">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider">
              Banquet Gallery
            </span>
            <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center text-maroon-800">
              <ImageIcon className="w-5 h-5 text-gold-700" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-serif text-3xl font-bold text-maroon-950">{gallery.total}</span>
            <span className="text-xs text-charcoal-700 font-medium">({gallery.active} active)</span>
          </div>
          <Link
            to="/admin/gallery"
            className="text-xs font-semibold text-gold-700 hover:text-gold-900 flex items-center gap-1 pt-2 border-t border-charcoal-100"
          >
            <span>Manage Photography</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 2: Active Services */}
        <div className="bg-white rounded-3xl p-6 border border-gold-200/80 shadow-luxury hover:border-gold-400 transition">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider">
              Banquet Services
            </span>
            <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center text-maroon-800">
              <Sparkles className="w-5 h-5 text-gold-700" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-serif text-3xl font-bold text-maroon-950">{services.total}</span>
            <span className="text-xs text-charcoal-700 font-medium">({services.active} active)</span>
          </div>
          <Link
            to="/admin/services"
            className="text-xs font-semibold text-gold-700 hover:text-gold-900 flex items-center gap-1 pt-2 border-t border-charcoal-100"
          >
            <span>Edit Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 3: Real Quotation Enquiries */}
        <div className="bg-white rounded-3xl p-6 border border-gold-200/80 shadow-luxury hover:border-gold-400 transition">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider">
              Quotation Inquiries
            </span>
            <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center text-maroon-800">
              <Inbox className="w-5 h-5 text-gold-700" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-serif text-3xl font-bold text-maroon-950">{enquiries.total}</span>
            {enquiries.new > 0 ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {enquiries.new} new
              </span>
            ) : (
              <span className="text-xs text-charcoal-700 font-medium">(All reviewed)</span>
            )}
          </div>
          <Link
            to="/admin/enquiries"
            className="text-xs font-semibold text-gold-700 hover:text-gold-900 flex items-center gap-1 pt-2 border-t border-charcoal-100"
          >
            <span>View Enquiries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 4: WhatsApp Integration */}
        <div className="bg-white rounded-3xl p-6 border border-gold-200/80 shadow-luxury hover:border-gold-400 transition">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider">
              WhatsApp Integration
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <MessageCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mb-2">
            {whatsapp.hridayConfigured ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Configured ({whatsapp.hridayNumber})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                <AlertTriangle className="w-3.5 h-3.5" /> Pending Number
              </span>
            )}
          </div>
          <Link
            to="/admin/whatsapp"
            className="text-xs font-semibold text-gold-700 hover:text-gold-900 flex items-center gap-1 pt-2 border-t border-charcoal-100"
          >
            <span>WhatsApp Settings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>

      {/* Website Sections & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Section Visibility Status */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold-200 shadow-luxury">
          <h3 className="font-serif text-xl font-bold text-maroon-950 mb-1">
            Website Sections Status
          </h3>
          <p className="text-xs text-charcoal-700 mb-6">
            Control which sections appear on the live website anytime.
          </p>

          <div className="space-y-3">
            {[
              { key: 'hero', name: 'Homepage Hero Section' },
              { key: 'about', name: 'About Hriday Banquet Hall' },
              { key: 'services', name: 'Facilities & Services' },
              { key: 'gallery', name: 'Banquet Gallery Slider' },
              { key: 'instagram', name: 'Instagram Showcase' },
              { key: 'sunshine', name: 'Sunshine Events Promotional Block' },
              { key: 'contact', name: 'Contact & Google Maps Section' },
            ].map((sec) => {
              const isLive = sections[sec.key as keyof typeof sections] !== false;
              return (
                <div
                  key={sec.key}
                  className="flex items-center justify-between p-3 rounded-xl bg-ivory-50 border border-charcoal-100"
                >
                  <span className="text-xs sm:text-sm font-medium text-charcoal-800">
                    {sec.name}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      isLive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-charcoal-200 text-charcoal-700'
                    }`}
                  >
                    {isLive ? 'Active on Site' : 'Hidden'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-charcoal-100">
            <Link
              to="/admin/settings"
              className="text-xs font-semibold text-gold-700 hover:text-gold-900 inline-flex items-center gap-1"
            >
              <span>Modify Section Visibility in General Settings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right: Quick Action Shortcuts */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold-200 shadow-luxury flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-maroon-950 mb-1">
              Quick Admin Tasks
            </h3>
            <p className="text-xs text-charcoal-700 mb-6">
              Instant shortcuts to keep your banquet hall presence updated.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/admin/gallery"
                className="p-4 rounded-2xl bg-ivory-50 border border-gold-200 hover:border-gold-400 hover:bg-gold-50/50 transition flex flex-col gap-1 text-left"
              >
                <ImageIcon className="w-5 h-5 text-maroon-800 mb-1" />
                <span className="text-xs font-bold text-maroon-950">Add Photos</span>
                <span className="text-[11px] text-charcoal-700">Upload new interior &amp; event shots</span>
              </Link>

              <Link
                to="/admin/whatsapp"
                className="p-4 rounded-2xl bg-ivory-50 border border-gold-200 hover:border-gold-400 hover:bg-gold-50/50 transition flex flex-col gap-1 text-left"
              >
                <MessageCircle className="w-5 h-5 text-emerald-700 mb-1" />
                <span className="text-xs font-bold text-maroon-950">Update WhatsApp</span>
                <span className="text-[11px] text-charcoal-700">Add phone &amp; quotation prompt</span>
              </Link>

              <Link
                to="/admin/content"
                className="p-4 rounded-2xl bg-ivory-50 border border-gold-200 hover:border-gold-400 hover:bg-gold-50/50 transition flex flex-col gap-1 text-left"
              >
                <Sparkles className="w-5 h-5 text-gold-700 mb-1" />
                <span className="text-xs font-bold text-maroon-950">Edit Venue Texts</span>
                <span className="text-[11px] text-charcoal-700">Update headings &amp; highlight cards</span>
              </Link>

              <Link
                to="/admin/sunshine"
                className="p-4 rounded-2xl bg-ivory-50 border border-gold-200 hover:border-gold-400 hover:bg-gold-50/50 transition flex flex-col gap-1 text-left"
              >
                <ShieldCheck className="w-5 h-5 text-purple-700 mb-1" />
                <span className="text-xs font-bold text-maroon-950">Sunshine Events</span>
                <span className="text-[11px] text-charcoal-700">Manage marketing partner promo</span>
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-charcoal-100 flex items-center justify-between">
            <span className="text-xs text-charcoal-700">
              Changes reflect on the public website immediately.
            </span>
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-maroon-900 hover:text-gold-700"
            >
              <span>Visit Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
