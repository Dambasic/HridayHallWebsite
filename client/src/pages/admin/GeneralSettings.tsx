import React, { useState, useEffect } from 'react';
import { Settings, Save, Check, Lock, Shield, Eye, AlertCircle } from 'lucide-react';
import {
  fetchAdminSettings,
  updateAdminSettings,
  changeAdminPassword,
} from '../../services/api';
import { WebsiteSettings } from '../../types';
import { useContent } from '../../context/ContentContext';

export const GeneralSettings: React.FC = () => {
  const { refreshContent } = useContent();
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await fetchAdminSettings();
        setSettings(data);
      } catch (err: any) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setIsSaving(true);
      await updateAdminSettings(settings);
      setToastMsg('General website settings and visibility updated!');
      await refreshContent();
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleSection = (sectionKey: keyof WebsiteSettings['section_visibility']) => {
    if (!settings) return;
    const current = settings.section_visibility?.[sectionKey] !== false;
    setSettings({
      ...settings,
      section_visibility: {
        ...(settings.section_visibility || {}),
        [sectionKey]: !current,
      },
    });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New password and confirm password do not match');
      return;
    }

    try {
      setChangingPass(true);
      await changeAdminPassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordSuccess('Password changed successfully! Keep your new password secure.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(''), 5000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password. Verify your current password.');
    } finally {
      setChangingPass(false);
    }
  };

  if (isLoading || !settings) {
    return <div className="py-16 text-center text-charcoal-700 text-sm">Loading general settings...</div>;
  }

  const visibility = settings.section_visibility || {
    hero: true,
    about: true,
    services: true,
    gallery: true,
    instagram: true,
    sunshine: true,
    contact: true,
  };

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm rounded-2xl flex items-center gap-2 shadow-sm animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-charcoal-200">
        <div>
          <h1 className="font-serif text-3xl font-bold text-maroon-950">
            General Website Settings &amp; Security
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-1">
            Configure metadata, SEO tags, section toggles, and update admin credentials.
          </p>
        </div>
      </div>

      {/* Section Visibility Toggles Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold-200 shadow-luxury space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-charcoal-100">
          <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center text-maroon-800">
            <Eye className="w-5 h-5 text-gold-700" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-maroon-950">
              Live Website Section Visibility
            </h3>
            <p className="text-xs text-charcoal-700">
              Toggle visibility for individual sections across the public website.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { key: 'hero', label: 'Homepage Hero Section', desc: 'Main full-width banner & headlines' },
            { key: 'about', label: 'About Us Section', desc: 'Venue narrative & 3 highlight cards' },
            { key: 'services', label: 'Facilities & Services', desc: 'Confirmed celebration service cards' },
            { key: 'gallery', label: 'Banquet Gallery Slider', desc: 'Photographs with Lightbox & filters' },
            { key: 'instagram', label: 'Instagram Showcase', desc: 'Real customer celebration moments' },
            { key: 'sunshine', label: 'Sunshine Events Promo', desc: 'Agency partner promotional block' },
            { key: 'contact', label: 'Contact & Location', desc: 'Address, hours & Google Maps' },
          ].map((item) => {
            const isChecked = visibility[item.key as keyof typeof visibility] !== false;
            return (
              <div
                key={item.key}
                onClick={() => handleToggleSection(item.key as any)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                  isChecked
                    ? 'bg-ivory-50/70 border-gold-300 shadow-xs'
                    : 'bg-charcoal-50 border-charcoal-200 opacity-90'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                  className="w-4 h-4 rounded text-maroon-800 focus:ring-gold-500 mt-0.5 pointer-events-none"
                />
                <div>
                  <h4 className="text-xs font-bold text-maroon-950">{item.label}</h4>
                  <p className="text-[11px] text-charcoal-700 mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SEO & Brand Meta Form */}
      <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-8 border border-gold-200 shadow-luxury space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-charcoal-100">
          <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center text-maroon-800">
            <Settings className="w-5 h-5 text-gold-700" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-maroon-950">
              Brand Identity &amp; SEO Metadata
            </h3>
            <p className="text-xs text-charcoal-700">
              Optimize search engine visibility and browser title tags.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Brand Title
            </label>
            <input
              type="text"
              required
              value={settings.site_title}
              onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
              className="w-full px-4 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs sm:text-sm font-bold text-maroon-950"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Tagline
            </label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full px-4 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs sm:text-sm text-charcoal-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
            SEO Meta Title
          </label>
          <input
            type="text"
            value={settings.seo_title}
            onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })}
            className="w-full px-4 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs sm:text-sm text-charcoal-800"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
            SEO Meta Description
          </label>
          <textarea
            rows={2}
            value={settings.seo_description}
            onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })}
            className="w-full px-4 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs sm:text-sm text-charcoal-800 resize-none"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-charcoal-100">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 bg-maroon-800 hover:bg-maroon-900 text-ivory-100 font-semibold text-xs sm:text-sm rounded-xl shadow-maroon-md transition flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-gold-300" />
            <span>{isSaving ? 'Saving...' : 'Save Website Settings'}</span>
          </button>
        </div>
      </form>

      {/* Admin Password Change Card */}
      <form onSubmit={handleChangePassword} className="bg-white rounded-3xl p-6 sm:p-8 border border-gold-200 shadow-luxury space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-charcoal-100">
          <div className="w-10 h-10 rounded-xl bg-maroon-50 border border-maroon-200 flex items-center justify-center text-maroon-800">
            <Lock className="w-5 h-5 text-maroon-800" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-maroon-950">
              Admin Password Management
            </h3>
            <p className="text-xs text-charcoal-700">
              Update password for the administrator login account.
            </p>
          </div>
        </div>

        {passwordError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{passwordError}</span>
          </div>
        )}

        {passwordSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Current Password *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs text-charcoal-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
              New Password *
            </label>
            <input
              type="password"
              required
              placeholder="Min. 8 characters"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs text-charcoal-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Confirm New Password *
            </label>
            <input
              type="password"
              required
              placeholder="Repeat new password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs text-charcoal-900"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-charcoal-100">
          <button
            type="submit"
            disabled={changingPass}
            className="px-6 py-2.5 bg-maroon-800 hover:bg-maroon-900 text-ivory-100 font-semibold text-xs rounded-xl shadow-maroon-sm transition"
          >
            {changingPass ? 'Updating Password...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
};
