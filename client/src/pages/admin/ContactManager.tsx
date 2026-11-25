import React, { useState, useEffect } from 'react';
import { MapPin, Save, Check, ExternalLink, HelpCircle } from 'lucide-react';
import { fetchAdminContact, updateAdminContact } from '../../services/api';
import { ContactInformation } from '../../types';
import { useContent } from '../../context/ContentContext';

export const ContactManager: React.FC = () => {
  const { refreshContent } = useContent();
  const [formData, setFormData] = useState<ContactInformation>({
    id: 'contact_default',
    venue_name: 'Hriday Banquet Hall',
    full_address: '',
    phone_number: '',
    email_address: '',
    opening_hours: '',
    google_maps_embed_url: '',
    google_maps_directions_url: '',
    updated_at: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await fetchAdminContact();
        if (data) setFormData(data);
      } catch (err: any) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await updateAdminContact(formData);
      setToastMsg('Contact details and Google Maps saved!');
      await refreshContent();
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to save contact information');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="py-16 text-center text-charcoal-700 text-sm">Loading contact configuration...</div>;
  }

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
            Location &amp; Contact Manager
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-1">
            Configure official address, visiting hours, contact phone, email, and interactive Google Maps embed.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-gold-200 shadow-luxury space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Venue Name *
            </label>
            <input
              type="text"
              required
              value={formData.venue_name}
              onChange={(e) => setFormData({ ...formData, venue_name: e.target.value })}
              className="w-full px-4 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs sm:text-sm font-serif font-bold text-maroon-950"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Opening / Visiting Hours
            </label>
            <input
              type="text"
              placeholder="e.g. Monday – Sunday: 10:00 AM – 10:00 PM"
              value={formData.opening_hours}
              onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
              className="w-full px-4 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs sm:text-sm text-charcoal-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
            Full Venue Address
          </label>
          <textarea
            rows={2}
            placeholder="Provide complete street address, landmark, city, and pin code..."
            value={formData.full_address}
            onChange={(e) => setFormData({ ...formData, full_address: e.target.value })}
            className="w-full px-4 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs sm:text-sm text-charcoal-800 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Public Calling Number
            </label>
            <input
              type="tel"
              placeholder="e.g. +91 9876543210 (Leave blank if pending)"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              className="w-full px-4 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs sm:text-sm text-charcoal-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Official Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. contact@hridaybanquet.com (Leave blank if pending)"
              value={formData.email_address}
              onChange={(e) => setFormData({ ...formData, email_address: e.target.value })}
              className="w-full px-4 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs sm:text-sm text-charcoal-800"
            />
          </div>
        </div>

        {/* Google Maps Embed & Directions */}
        <div className="pt-6 border-t border-charcoal-100 space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gold-600" />
            <h4 className="font-serif text-lg font-bold text-maroon-950">
              Google Maps Embed Configuration
            </h4>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Google Maps Iframe Embed URL (src)
            </label>
            <input
              type="url"
              placeholder="https://www.google.com/maps/embed?pb=..."
              value={formData.google_maps_embed_url}
              onChange={(e) => setFormData({ ...formData, google_maps_embed_url: e.target.value })}
              className="w-full px-4 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs font-mono text-charcoal-900"
            />
            <p className="text-[11px] text-charcoal-700 mt-1">
              In Google Maps, click &quot;Share&quot; &rarr; &quot;Embed a map&quot; &rarr; copy only the URL inside the src=&quot;...&quot; attribute.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Google Maps Directions Link
            </label>
            <input
              type="url"
              placeholder="https://maps.google.com/?q=..."
              value={formData.google_maps_directions_url}
              onChange={(e) => setFormData({ ...formData, google_maps_directions_url: e.target.value })}
              className="w-full px-4 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs font-mono text-charcoal-900"
            />
          </div>

          {formData.google_maps_embed_url && (
            <div className="mt-4 rounded-2xl overflow-hidden aspect-[21/9] border border-charcoal-200 max-h-56">
              <iframe
                title="Google Maps Preview"
                src={formData.google_maps_embed_url}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-charcoal-100">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 bg-maroon-800 hover:bg-maroon-900 text-ivory-100 font-semibold text-xs sm:text-sm rounded-xl shadow-maroon-md transition flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-gold-300" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Location & Contact'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
