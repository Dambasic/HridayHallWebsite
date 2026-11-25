import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Image as ImageIcon,
  Sparkles,
  FileText,
  MessageCircle,
  Briefcase,
  MapPin,
  Share2,
  Settings,
  Inbox,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User,
  Shield,
  PartyPopper,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { SEOHead } from '../../components/SEOHead';

export const AdminLayout: React.FC = () => {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const { refreshContent } = useContent();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Protected route check
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex items-center justify-center text-ivory-200">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard & Analytics', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Celebrations & Featured', path: '/admin/celebrations', icon: PartyPopper },
    { label: 'Services Manager', path: '/admin/services', icon: Sparkles },
    { label: 'Gallery Manager', path: '/admin/gallery', icon: ImageIcon },
    { label: 'Website Content', path: '/admin/content', icon: FileText },
    { label: 'WhatsApp Settings', path: '/admin/whatsapp', icon: MessageCircle },
    { label: 'Sunshine Agency', path: '/admin/sunshine', icon: Briefcase },
    { label: 'Contact & Location', path: '/admin/contact', icon: MapPin },
    { label: 'Social Media', path: '/admin/social', icon: Share2 },
    { label: 'Customer Enquiries', path: '/admin/enquiries', icon: Inbox },
    { label: 'General Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col lg:flex-row text-charcoal-900">
      <SEOHead title="Admin Management Console | Hriday Banquet Hall" robots="noindex, nofollow" />
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-charcoal-950 text-white px-4 py-3 flex items-center justify-between border-b border-gold-500/20 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-gold-400/80 bg-burgundy-950 flex-shrink-0">
            <img src="/hriday-logo.png" alt="Hriday Banquet Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-serif text-sm font-bold text-ivory-50">Hriday Banquet</h1>
            <p className="text-[10px] text-gold-400 uppercase tracking-widest">Admin CMS</p>
          </div>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-ivory-200 hover:text-white rounded-lg hover:bg-charcoal-900"
          aria-label="Toggle Navigation Drawer"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile Overlay Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-charcoal-950 text-ivory-200 flex flex-col justify-between border-r border-gold-500/20 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-charcoal-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold-400/80 shadow-gold-sm flex-shrink-0 bg-burgundy-950">
                <img src="/hriday-logo.png" alt="Hriday Banquet Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-ivory-50">Hriday Banquet</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Shield className="w-3 h-3 text-gold-400" />
                  <span className="text-[11px] uppercase tracking-wider text-gold-400 font-semibold">
                    Admin Dashboard
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#650A25] to-[#390014] text-gold-100 shadow-maroon-sm border border-gold-400/50 font-semibold'
                        : 'text-ivory-100 hover:bg-charcoal-900 hover:text-gold-200'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 text-gold-400" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: User Profile & Actions */}
        <div className="p-4 border-t border-charcoal-800 space-y-3 bg-charcoal-950">
          <div className="flex items-center justify-between px-2 text-xs text-ivory-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-charcoal-800 flex items-center justify-center text-gold-300 border border-charcoal-600">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="truncate max-w-[120px]">
                <p className="font-semibold text-white truncate">{user?.username || 'Admin'}</p>
                <p className="text-[11px] text-gold-200 truncate">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-ivory-200 hover:text-rose-300 rounded-lg hover:bg-charcoal-800 transition"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 border-t border-charcoal-800/60 flex items-center justify-between">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-xs text-ivory-200 hover:text-gold-300 transition border border-charcoal-700"
            >
              <span>View Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        {/* Top Bar for Desktop */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-charcoal-200/80 sticky top-0 z-30">
          <div className="flex items-center gap-2 text-sm text-charcoal-600">
            <span className="font-semibold text-maroon-900">Hriday Banquet CMS</span>
            <span>/</span>
            <span className="text-gold-700 font-medium">Control Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => refreshContent()}
              className="text-xs px-3 py-1.5 rounded-lg border border-charcoal-200 hover:bg-ivory-100 text-charcoal-700 transition"
              title="Sync frontend cache with latest database values"
            >
              Sync Cache
            </button>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-gold-50 text-maroon-900 border border-gold-300 hover:bg-gold-100 transition"
            >
              <span>Preview Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-gold-600" />
            </Link>
          </div>
        </header>

        {/* Dynamic Nested Route Content */}
        <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
