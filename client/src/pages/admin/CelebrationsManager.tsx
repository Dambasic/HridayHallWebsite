import React, { useState, useEffect } from 'react';
import {
  PartyPopper,
  Sparkles,
  Plus,
  Pencil,
  Trash2,
  Check,
  Star,
  ExternalLink,
  AlertCircle,
  RefreshCw,
  Heart
} from 'lucide-react';
import {
  fetchAdminCelebrations,
  createAdminCelebration,
  updateAdminCelebration,
  toggleCelebrationFeatured,
  updateCelebrationFeaturedOrder,
  deleteAdminCelebration,
} from '../../services/api';
import { CelebrationItem } from '../../types';
import { useContent } from '../../context/ContentContext';
import { CoverImagePicker, CoverOption } from '../../components/admin/CoverImagePicker';

export const CelebrationsManager: React.FC = () => {
  const { content, refreshContent } = useContent();
  const availableServices = content?.services || [];
  const [celebrations, setCelebrations] = useState<CelebrationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Modal State
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<CelebrationItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    instagram_url: 'https://www.instagram.com/hridaybanquetspineroad/',
    tag: '#HridayCelebrations',
    service_slug: '',
    is_featured: 0,
    featured_order: 0,
    is_active: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const celebrationCoverOptions: CoverOption[] = [
    ...(content?.gallery || []).map((g) => ({ url: g.image_url, label: g.title || g.category })),
    ...availableServices.map((s) => ({ url: s.image_url, label: s.title })),
    ...celebrations.map((c) => ({ url: c.image_url, label: c.title })),
  ];

  const loadData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const data = await fetchAdminCelebrations();
      setCelebrations(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load celebrations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      image_url: '',
      instagram_url: 'https://www.instagram.com/hridaybanquetspineroad/',
      tag: '#HridayCelebrations',
      service_slug: '',
      is_featured: 0,
      featured_order: celebrations.length + 1,
      is_active: 1,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (item: CelebrationItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      instagram_url: item.instagram_url || 'https://www.instagram.com/hridaybanquetspineroad/',
      tag: item.tag || '#HridayCelebrations',
      service_slug: item.service_slug || '',
      is_featured: item.is_featured,
      featured_order: item.featured_order || 0,
      is_active: item.is_active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.image_url.trim()) {
      setErrorMessage('Title and Image are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingItem) {
        await updateAdminCelebration(editingItem.id, formData);
        setSuccessMessage('Celebration updated successfully');
      } else {
        await createAdminCelebration(formData);
        setSuccessMessage('Celebration added successfully');
      }
      setModalOpen(false);
      await loadData();
      await refreshContent();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFeatured = async (id: string, currentStatus: number) => {
    try {
      const nextStatus = currentStatus === 1 ? false : true;
      await toggleCelebrationFeatured(id, nextStatus);
      setSuccessMessage(`Celebration ${nextStatus ? 'added to' : 'removed from'} Featured Celebrations`);
      await loadData();
      await refreshContent();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to toggle featured status');
    }
  };

  const handleOrderChange = async (id: string, order: number) => {
    try {
      await updateCelebrationFeaturedOrder(id, order);
      await loadData();
      await refreshContent();
    } catch (err: any) {
      console.error('Failed to update order:', err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await deleteAdminCelebration(id);
      setSuccessMessage('Celebration deleted successfully');
      await loadData();
      await refreshContent();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete celebration');
    }
  };

  const totalFeatured = celebrations.filter((c) => c.is_featured === 1).length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-gold-200/80 shadow-luxury">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#650A25]/10 border border-[#650A25]/30 text-[#4A071D] text-xs font-bold uppercase tracking-wider mb-2">
            <PartyPopper className="w-3.5 h-3.5 text-gold-600" />
            <span>Celebrations CMS</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon-950">
            Real Celebrations &amp; Featured List
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-1">
            Manage real moments displayed in &quot;Real Celebrations. Real Memories.&quot; and toggle items to feature prominently on the homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="p-3 rounded-2xl border border-charcoal-200 text-charcoal-700 hover:text-[#4A071D] hover:bg-ivory-100 transition shadow-sm"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#650A25] to-[#390014] hover:from-[#8B1538] hover:to-[#4A071D] text-gold-100 border border-gold-400/50 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Celebration</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gold-200/80 shadow-luxury flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#650A25]/10 border border-gold-300 flex items-center justify-center text-[#4A071D]">
            <PartyPopper className="w-6 h-6 text-gold-600" />
          </div>
          <div>
            <p className="text-xs text-charcoal-700 font-medium uppercase tracking-wider">Total Celebrations</p>
            <p className="text-2xl font-serif font-bold text-maroon-950">{celebrations.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gold-200/80 shadow-luxury flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700">
            <Star className="w-6 h-6 fill-gold-500 text-gold-500" />
          </div>
          <div>
            <p className="text-xs text-charcoal-700 font-medium uppercase tracking-wider">Featured on Homepage</p>
            <p className="text-2xl font-serif font-bold text-gold-700">{totalFeatured} Active</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gold-200/80 shadow-luxury flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center text-green-700">
            <Check className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-charcoal-700 font-medium uppercase tracking-wider">Public Showcase</p>
            <p className="text-sm font-semibold text-green-800">Synchronized with Homepage</p>
          </div>
        </div>
      </div>

      {/* Feedback Alerts */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs sm:text-sm flex items-center gap-3">
          <Check className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Celebrations Grid & Toggle Manager */}
      <div className="bg-white rounded-3xl border border-gold-200/80 shadow-luxury overflow-hidden">
        <div className="p-6 border-b border-charcoal-100 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-maroon-950">
            All Celebrations ({celebrations.length})
          </h2>
          <span className="text-xs text-charcoal-700">
            Click checkbox to toggle into &quot;Featured Celebrations&quot;
          </span>
        </div>

        {celebrations.length === 0 ? (
          <div className="text-center py-16 text-charcoal-600">
            <PartyPopper className="w-12 h-12 mx-auto mb-3 opacity-75 text-[#650A25]" />
            <p className="text-sm">No celebrations added yet. Click &quot;Add Celebration&quot; to create one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-charcoal-700">
              <thead className="bg-ivory-50 text-charcoal-800 font-bold uppercase tracking-wider text-[11px] border-b border-charcoal-200">
                <tr>
                  <th className="py-3.5 px-4">Image</th>
                  <th className="py-3.5 px-4">Celebration Details</th>
                  <th className="py-3.5 px-4 text-center">Add to Featured List</th>
                  <th className="py-3.5 px-4 text-center">Featured Order</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100">
                {celebrations.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-ivory-50/80 transition-colors ${
                      item.is_featured ? 'bg-gold-50/30' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 w-24">
                      <div className="w-20 h-14 rounded-xl overflow-hidden border border-gold-200 shadow-sm bg-charcoal-900">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-serif text-base font-bold text-maroon-950">
                          {item.title}
                        </span>
                        {item.tag && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#650A25]/10 text-[#4A071D] border border-gold-300">
                            {item.tag}
                          </span>
                        )}
                        {item.is_featured === 1 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-100 text-gold-900 border border-gold-300">
                            <Star className="w-3 h-3 fill-gold-600 text-gold-600" />
                            <span>Featured</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-charcoal-700 line-clamp-2">
                        {item.description}
                      </p>
                    </td>

                    {/* Featured Toggle Checkbox */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(item.id, item.is_featured)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                          item.is_featured === 1
                            ? 'bg-gold-500 text-burgundy-950 border border-gold-600 shadow-gold-sm'
                            : 'bg-charcoal-100 text-charcoal-600 hover:bg-gold-100 hover:text-gold-900 border border-charcoal-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={item.is_featured === 1}
                          onChange={() => {}} // handled by button
                          className="w-4 h-4 accent-burgundy-900 rounded cursor-pointer"
                        />
                        <span>{item.is_featured === 1 ? 'Featured on Home' : 'Add to Featured'}</span>
                      </button>
                    </td>

                    {/* Order Input */}
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        defaultValue={item.featured_order}
                        onBlur={(e) => handleOrderChange(item.id, Number(e.target.value) || 0)}
                        className="w-16 text-center py-1.5 px-2 bg-ivory-50 border border-gold-300 rounded-lg text-xs font-semibold text-maroon-950 focus:outline-none focus:ring-1 focus:ring-gold-500"
                        title="Display order on Featured list"
                      />
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          item.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-charcoal-100 text-charcoal-600'
                        }`}
                      >
                        {item.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-2 text-charcoal-600 hover:text-gold-700 hover:bg-gold-50 rounded-xl transition"
                          title="Edit Celebration"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-2 text-charcoal-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                          title="Delete Celebration"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Add / Edit Celebration */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-gold-300 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#26000D] via-[#390014] to-[#650A25] text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-ivory-50">
                  {editingItem ? 'Edit Celebration' : 'Add New Celebration'}
                </h3>
                <p className="text-xs text-gold-300 mt-0.5">
                  Creates or updates celebration record for public showcasing
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 overflow-y-auto flex-1">
              {/* Title & Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Celebration Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Royal Wedding Reception"
                    className="w-full px-4 py-2.5 rounded-xl border border-charcoal-300 focus:outline-none focus:border-gold-500 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Hashtag / Badge
                  </label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="e.g. #HridayWeddings"
                    className="w-full px-4 py-2.5 rounded-xl border border-charcoal-300 focus:outline-none focus:border-gold-500 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Short Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the celebration, atmosphere, and decor highlights..."
                  className="w-full px-4 py-2.5 rounded-xl border border-charcoal-300 focus:outline-none focus:border-gold-500 text-xs sm:text-sm leading-relaxed"
                />
              </div>

              {/* Reel / Celebration Coverpage Upload & Selector */}
              <CoverImagePicker
                label="Reel / Celebration Coverpage *"
                value={formData.image_url}
                onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
                options={celebrationCoverOptions}
                uploadId="celebration-photo-upload"
                placeholder="Paste image URL or upload/select a coverpage below"
                required
                hint="Cover shown on homepage Customer Reviews & Reels"
              />

              {/* Instagram URL & Linked Service Page */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Customer Review Instagram Link (Reel / Post URL)
                  </label>
                  <input
                    type="url"
                    value={formData.instagram_url}
                    onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                    placeholder="https://www.instagram.com/reel/..."
                    className="w-full px-4 py-2.5 rounded-xl border border-charcoal-300 focus:outline-none focus:border-gold-500 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Featured Carousel Service Link
                  </label>
                  <select
                    value={formData.service_slug}
                    onChange={(e) => setFormData({ ...formData, service_slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-charcoal-300 focus:outline-none focus:border-gold-500 text-xs sm:text-sm bg-white"
                  >
                    <option value="">Auto-match by category/title</option>
                    {availableServices.map((srv) => (
                      <option key={srv.id} value={srv.slug}>
                        {srv.title} (/services/{srv.slug})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Featured Toggle Checkbox inside Form */}
              <div className="p-4 rounded-2xl bg-gold-50/60 border border-gold-300 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="form-is-featured"
                  checked={formData.is_featured === 1}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked ? 1 : 0 })}
                  className="w-5 h-5 accent-burgundy-900 rounded cursor-pointer mt-0.5"
                />
                <label htmlFor="form-is-featured" className="cursor-pointer text-xs sm:text-sm">
                  <span className="font-bold text-maroon-950 block">Add to Featured List</span>
                  <span className="text-charcoal-700 block mt-0.5">
                    When enabled, this celebration will automatically appear in the &quot;Featured Celebrations&quot; showcase section near the top of the homepage.
                  </span>
                </label>
              </div>

              {/* Order & Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Featured Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.featured_order}
                    onChange={(e) => setFormData({ ...formData, featured_order: Number(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-xl border border-charcoal-300 text-xs sm:text-sm focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Active Status
                  </label>
                  <select
                    value={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl border border-charcoal-300 text-xs sm:text-sm focus:outline-none focus:border-gold-500"
                  >
                    <option value={1}>Active (Visible)</option>
                    <option value={0}>Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-charcoal-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-charcoal-300 text-xs font-semibold text-charcoal-700 hover:bg-charcoal-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#650A25] to-[#390014] hover:from-[#8B1538] hover:to-[#4A071D] text-gold-100 border border-gold-400/50 text-xs font-bold shadow-md hover:shadow-lg transition active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Celebration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
