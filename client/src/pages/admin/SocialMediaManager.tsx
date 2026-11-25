import React, { useState, useEffect } from 'react';
import { Share2, Save, Check, Instagram, Facebook, ExternalLink } from 'lucide-react';
import { fetchAdminSocial, updateAdminSocial } from '../../services/api';
import { SocialLink } from '../../types';
import { useContent } from '../../context/ContentContext';

export const SocialMediaManager: React.FC = () => {
  const { refreshContent } = useContent();
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await fetchAdminSocial();
        setLinks(data);
      } catch (err: any) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const updateField = (platform: string, field: 'handle' | 'url' | 'is_active', value: any) => {
    setLinks((prev) =>
      prev.map((item) => (item.platform === platform ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await updateAdminSocial(links);
      setToastMsg('Social media links updated successfully!');
      await refreshContent();
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to update links');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="py-16 text-center text-charcoal-700 text-sm">Loading social links...</div>;
  }

  const ig = links.find((l) => l.platform === 'instagram') || {
    platform: 'instagram',
    handle: '',
    url: '',
    is_active: 1,
  };

  const fb = links.find((l) => l.platform === 'facebook') || {
    platform: 'facebook',
    handle: '',
    url: '',
    is_active: 1,
  };

  return (
    <div className="space-y-6">
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
            Social Media Settings
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-1">
            Connect official Hriday Banquet Hall Instagram and Facebook accounts shown in navbar, footer, and community showcase.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Instagram Settings Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold-200 shadow-luxury space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-charcoal-100">
            <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-maroon-950">
                Official Instagram Profile
              </h3>
              <p className="text-xs text-charcoal-700">
                Showcased in header icon and customer memories section.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Instagram Handle
              </label>
              <input
                type="text"
                placeholder="e.g. @hridaybanquethall"
                value={ig.handle}
                onChange={(e) => updateField('instagram', 'handle', e.target.value)}
                className="w-full px-4 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs sm:text-sm text-charcoal-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Profile URL
              </label>
              <input
                type="url"
                placeholder="https://instagram.com/hridaybanquethall"
                value={ig.url}
                onChange={(e) => updateField('instagram', 'url', e.target.value)}
                className="w-full px-4 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs sm:text-sm text-charcoal-900 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Facebook Settings Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold-200 shadow-luxury space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-charcoal-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Facebook className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-maroon-950">
                Official Facebook Page
              </h3>
              <p className="text-xs text-charcoal-700">
                Connected in navbar and footer quick links.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Facebook Page Name / Handle
              </label>
              <input
                type="text"
                placeholder="e.g. Hriday Banquet Hall Official"
                value={fb.handle}
                onChange={(e) => updateField('facebook', 'handle', e.target.value)}
                className="w-full px-4 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs sm:text-sm text-charcoal-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Facebook Page URL
              </label>
              <input
                type="url"
                placeholder="https://facebook.com/hridaybanquethall"
                value={fb.url}
                onChange={(e) => updateField('facebook', 'url', e.target.value)}
                className="w-full px-4 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs sm:text-sm text-charcoal-900 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 bg-maroon-800 hover:bg-maroon-900 text-ivory-100 font-semibold text-xs sm:text-sm rounded-xl shadow-maroon-md transition flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-gold-300" />
            <span>{isSaving ? 'Saving...' : 'Save Social Media Links'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
