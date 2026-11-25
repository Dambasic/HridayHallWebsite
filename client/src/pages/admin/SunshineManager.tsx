import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Save,
  Check,
  Plus,
  Trash2,
  Edit2,
  X,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import {
  fetchAdminSunshine,
  updateAdminSunshineAgency,
  createSunshineService,
  updateSunshineService,
  deleteSunshineService,
} from '../../services/api';
import { SunshineAgency, SunshineService } from '../../types';
import { useContent } from '../../context/ContentContext';

export const SunshineManager: React.FC = () => {
  const { refreshContent } = useContent();
  const [agency, setAgency] = useState<SunshineAgency | null>(null);
  const [services, setServices] = useState<SunshineService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  // Service Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingService, setIsEditingService] = useState(false);
  const [serviceEditId, setServiceEditId] = useState<string | null>(null);
  const [serviceFormData, setServiceFormData] = useState({
    title: '',
    description: '',
    icon_name: 'Sparkles',
    display_order: 1,
    is_active: 1,
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAdminSunshine();
      setAgency(data.agency);
      setServices(data.services || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agency) return;

    try {
      await updateAdminSunshineAgency(agency);
      setToastMsg('Sunshine Events & Management configuration saved!');
      await refreshContent();
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to update agency settings');
    }
  };

  const openAddService = () => {
    setIsEditingService(false);
    setServiceEditId(null);
    setServiceFormData({
      title: '',
      description: '',
      icon_name: 'Sparkles',
      display_order: services.length + 1,
      is_active: 1,
    });
    setIsModalOpen(true);
  };

  const openEditService = (srv: SunshineService) => {
    setIsEditingService(true);
    setServiceEditId(srv.id);
    setServiceFormData({
      title: srv.title,
      description: srv.description,
      icon_name: srv.icon_name || 'Sparkles',
      display_order: srv.display_order,
      is_active: srv.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditingService && serviceEditId) {
        await updateSunshineService(serviceEditId, serviceFormData);
      } else {
        await createSunshineService(serviceFormData);
      }
      setIsModalOpen(false);
      await loadData();
      await refreshContent();
    } catch (err: any) {
      alert(err.message || 'Failed to save service');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm('Delete this marketing service?')) return;
    try {
      await deleteSunshineService(id);
      await loadData();
      await refreshContent();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  if (isLoading || !agency) {
    return <div className="py-16 text-center text-charcoal-700 text-sm">Loading agency settings...</div>;
  }

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
            Sunshine Events &amp; Management CMS
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-1">
            Manage the promotional marketing agency block, branding text, services, and visibility on the public website.
          </p>
        </div>
      </div>

      {/* Agency Details Form */}
      <form onSubmit={handleSaveAgency} className="bg-white rounded-3xl p-6 sm:p-8 border border-gold-200 shadow-luxury space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-charcoal-100 gap-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-maroon-950">
              Agency Identity &amp; Content
            </h3>
            <p className="text-xs text-charcoal-700">
              Configure branding for the associated online marketing agency.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="agencyVisibilityCheck"
                checked={agency.is_visible === 1}
                onChange={(e) => setAgency({ ...agency, is_visible: e.target.checked ? 1 : 0 })}
                className="w-4 h-4 rounded text-gold-600 focus:ring-gold-500"
              />
              <label htmlFor="agencyVisibilityCheck" className="text-xs font-semibold text-charcoal-800 cursor-pointer">
                Show Promotional Block on Website
              </label>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-maroon-800 hover:bg-maroon-900 text-ivory-100 rounded-xl text-xs sm:text-sm font-semibold shadow-maroon-sm transition"
            >
              <Save className="w-4 h-4 text-gold-300" />
              <span>Save Agency Details</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Agency Business Name *
            </label>
            <input
              type="text"
              required
              value={agency.agency_name}
              onChange={(e) => setAgency({ ...agency, agency_name: e.target.value })}
              className="w-full px-4 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs sm:text-sm font-bold text-maroon-950"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Attribution Statement *
            </label>
            <input
              type="text"
              required
              value={agency.attribution_statement}
              onChange={(e) => setAgency({ ...agency, attribution_statement: e.target.value })}
              className="w-full px-4 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs sm:text-sm text-charcoal-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
            Promotional Heading *
          </label>
          <input
            type="text"
            required
            value={agency.heading}
            onChange={(e) => setAgency({ ...agency, heading: e.target.value })}
            className="w-full px-4 py-3 bg-ivory-50 border border-charcoal-200 rounded-xl text-sm font-serif font-bold text-maroon-950"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
            Supporting Promotional Text
          </label>
          <textarea
            rows={3}
            value={agency.supporting_text}
            onChange={(e) => setAgency({ ...agency, supporting_text: e.target.value })}
            className="w-full px-4 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs sm:text-sm text-charcoal-800 resize-none"
          />
        </div>
      </form>

      {/* Agency Services Management */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold-200 shadow-luxury space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-charcoal-100">
          <div>
            <h3 className="font-serif text-xl font-bold text-maroon-950">
              Agency Services Grid
            </h3>
            <p className="text-xs text-charcoal-700">
              Services shown inside the promotional section (Digital Marketing, Branding, etc.).
            </p>
          </div>

          <button
            onClick={openAddService}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-charcoal-950 font-semibold text-xs rounded-full shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Agency Service</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="p-5 rounded-2xl bg-ivory-50 border border-charcoal-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-maroon-950">{srv.title}</span>
                  <span className="text-[10px] text-charcoal-700 font-mono">#{srv.display_order}</span>
                </div>
                <p className="text-xs text-charcoal-800 mb-4 line-clamp-3">
                  {srv.description}
                </p>
              </div>

              <div className="pt-3 border-t border-charcoal-100 flex items-center justify-between">
                <span className="text-[11px] text-gold-700 font-semibold font-mono">
                  Icon: {srv.icon_name}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditService(srv)}
                    className="p-1 text-charcoal-700 hover:text-maroon-900"
                    title="Edit Service"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(srv.id)}
                    className="p-1 text-charcoal-600 hover:text-rose-600"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gold-300">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-charcoal-600 hover:text-charcoal-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-maroon-950 mb-1">
              {isEditingService ? 'Edit Agency Service' : 'Add Agency Service'}
            </h3>

            <form onSubmit={handleSaveService} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Social Media Management"
                  value={serviceFormData.title}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs text-charcoal-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={serviceFormData.description}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs text-charcoal-900 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                    Icon Style
                  </label>
                  <select
                    value={serviceFormData.icon_name}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, icon_name: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs text-charcoal-900"
                  >
                    <option value="TrendingUp">TrendingUp (Marketing)</option>
                    <option value="Instagram">Instagram (Social)</option>
                    <option value="Sparkles">Sparkles (Branding)</option>
                    <option value="Globe">Globe (Websites)</option>
                    <option value="Megaphone">Megaphone (Ads)</option>
                    <option value="Calendar">Calendar (Events)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={serviceFormData.display_order}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, display_order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs text-charcoal-900"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-charcoal-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-charcoal-300 rounded-xl text-xs text-charcoal-700 hover:bg-ivory-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-maroon-800 hover:bg-maroon-900 text-ivory-100 rounded-xl text-xs font-semibold shadow-maroon-sm"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
