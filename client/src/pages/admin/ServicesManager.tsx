import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  UploadCloud,
  Eye,
  ExternalLink,
  Camera,
  Instagram,
  FileText,
  AlertCircle,
  Play,
  Save
} from 'lucide-react';
import {
  fetchAdminServices,
  createAdminService,
  updateAdminService,
  deleteAdminService,
  uploadImageFile,
  fetchAdminServiceDetails,
  fetchServiceGallery,
  addServiceGalleryImage,
  deleteServiceGalleryImage,
  fetchServiceInstagramMedia,
  addServiceInstagramMedia,
  updateServiceInstagramMedia,
  deleteServiceInstagramMedia,
} from '../../services/api';
import { ServiceItem, ServiceGalleryImage, ServiceInstagramMedia } from '../../types';
import { useContent } from '../../context/ContentContext';
import { CoverImagePicker, CoverOption } from '../../components/admin/CoverImagePicker';

export const ServicesManager: React.FC = () => {
  const { content, refreshContent } = useContent();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'gallery' | 'instagram'>('details');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Weddings',
    short_description: '',
    full_description: '',
    featuresText: '',
    image_url: '',
    display_order: 0,
    is_active: 1,
  });

  // Media state for editing service
  const [serviceGallery, setServiceGallery] = useState<ServiceGalleryImage[]>([]);
  const [serviceInstagram, setServiceInstagram] = useState<ServiceInstagramMedia[]>([]);

  // Sub-forms for gallery and instagram
  const [newGalleryPhoto, setNewGalleryPhoto] = useState({ image_url: '', caption: '', display_order: 1 });
  const [newInstaMedia, setNewInstaMedia] = useState({
    instagram_url: '',
    cover_image: '',
    media_type: 'reel',
    title: '',
    caption: '',
    display_order: 1,
  });
  const [editingInstaId, setEditingInstaId] = useState<string | null>(null);
  const [editingInstaData, setEditingInstaData] = useState({
    instagram_url: '',
    cover_image: '',
    media_type: 'reel',
    title: '',
    caption: '',
    display_order: 1,
  });
  const [savingInstaEdit, setSavingInstaEdit] = useState(false);
  const [uploadingReelCoverId, setUploadingReelCoverId] = useState<string | null>(null);

  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingGalleryFile, setUploadingGalleryFile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const loadServices = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAdminServices();
      setServices(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setEditId(null);
    setActiveTab('details');
    setFormData({
      title: '',
      slug: '',
      category: 'Weddings',
      short_description: '',
      full_description: '',
      featuresText: 'Grand Banquet Hall Space\nExquisite Floral & Stage Decor\nHigh-Definition Sound & Stage Lighting\nLuxury Bridal & Groom Suites\nDedicated Event Coordinator',
      image_url: '',
      display_order: services.length + 1,
      is_active: 1,
    });
    setServiceGallery([]);
    setServiceInstagram([]);
    setEditingInstaId(null);
    setNewInstaMedia({
      instagram_url: '',
      cover_image: '',
      media_type: 'reel',
      title: '',
      caption: '',
      display_order: 1,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = async (service: ServiceItem) => {
    setIsEditing(true);
    setEditId(service.id);
    setActiveTab('details');

    // Parse features to text
    let featText = '';
    if (Array.isArray(service.features)) {
      featText = service.features.join('\n');
    } else if (typeof service.features === 'string') {
      try {
        const parsed = JSON.parse(service.features);
        featText = Array.isArray(parsed) ? parsed.join('\n') : service.features;
      } catch {
        featText = service.features;
      }
    }

    setFormData({
      title: service.title,
      slug: service.slug || '',
      category: service.category || 'Celebration',
      short_description: service.short_description || service.description || '',
      full_description: service.full_description || service.description || '',
      featuresText: featText,
      image_url: service.image_url,
      display_order: service.display_order,
      is_active: service.is_active,
    });
    setEditingInstaId(null);
    setNewInstaMedia({
      instagram_url: '',
      cover_image: '',
      media_type: 'reel',
      title: '',
      caption: '',
      display_order: 1,
    });
    setFormError('');
    setIsModalOpen(true);

    // Load media for this service
    try {
      const details = await fetchAdminServiceDetails(service.id);
      setServiceGallery(details.gallery || []);
      setServiceInstagram(details.instagram_media || []);
    } catch (err) {
      console.error('Failed to load service media:', err);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const generatedSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug === '' || prev.slug === prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ? generatedSlug : prev.slug,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingFile(true);
      setFormError('');
      const res = await uploadImageFile(file);
      setFormData((prev) => ({ ...prev, image_url: res.url }));
      showToast('Cover photo uploaded successfully');
    } catch (err: any) {
      setFormError(err.message || 'Image upload failed');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleGalleryPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingGalleryFile(true);
      const res = await uploadImageFile(file);
      setNewGalleryPhoto((prev) => ({ ...prev, image_url: res.url }));
    } catch (err: any) {
      alert(err.message || 'Gallery image upload failed');
    } finally {
      setUploadingGalleryFile(false);
    }
  };

  const handleAddGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId || !newGalleryPhoto.image_url.trim()) return;

    try {
      await addServiceGalleryImage(editId, newGalleryPhoto);
      showToast('Image added to service gallery');
      setNewGalleryPhoto({ image_url: '', caption: '', display_order: serviceGallery.length + 2 });
      const updated = await fetchServiceGallery(editId);
      setServiceGallery(updated);
      await refreshContent();
    } catch (err: any) {
      alert(err.message || 'Failed to add gallery image');
    }
  };

  const handleDeleteGalleryImage = async (galleryId: string) => {
    if (!editId) return;
    try {
      await deleteServiceGalleryImage(galleryId);
      showToast('Gallery image removed');
      const updated = await fetchServiceGallery(editId);
      setServiceGallery(updated);
      await refreshContent();
    } catch (err: any) {
      alert(err.message || 'Failed to remove gallery image');
    }
  };

  const handleAddInstagramMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId || !newInstaMedia.instagram_url.trim()) return;

    try {
      await addServiceInstagramMedia(editId, newInstaMedia);
      showToast('Instagram media added to service');
      setNewInstaMedia({
        instagram_url: '',
        cover_image: '',
        media_type: 'reel',
        title: '',
        caption: '',
        display_order: serviceInstagram.length + 2,
      });
      const updated = await fetchServiceInstagramMedia(editId);
      setServiceInstagram(updated);
      await refreshContent();
    } catch (err: any) {
      alert(err.message || 'Failed to add Instagram media');
    }
  };

  const handleStartEditInstagram = (item: ServiceInstagramMedia) => {
    if (editingInstaId === item.id) {
      setEditingInstaId(null);
      return;
    }
    setEditingInstaId(item.id);
    setEditingInstaData({
      instagram_url: item.instagram_url,
      cover_image: item.cover_image || '',
      media_type: item.media_type || 'reel',
      title: item.title || '',
      caption: item.caption || '',
      display_order: item.display_order || 0,
    });
  };

  const handleSaveEditedInstagram = async () => {
    if (!editId || !editingInstaId || !editingInstaData.instagram_url.trim()) return;

    try {
      setSavingInstaEdit(true);
      await updateServiceInstagramMedia(editingInstaId, editingInstaData);
      showToast('Reel cover & details updated');
      setEditingInstaId(null);
      const updated = await fetchServiceInstagramMedia(editId);
      setServiceInstagram(updated);
      await refreshContent();
    } catch (err: any) {
      alert(err.message || 'Failed to update Instagram media');
    } finally {
      setSavingInstaEdit(false);
    }
  };

  const handleQuickUploadReelCover = async (mediaId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editId) return;

    try {
      setUploadingReelCoverId(mediaId);
      const res = await uploadImageFile(file);
      await updateServiceInstagramMedia(mediaId, { cover_image: res.url });
      if (editingInstaId === mediaId) {
        setEditingInstaData((prev) => ({ ...prev, cover_image: res.url }));
      }
      const updated = await fetchServiceInstagramMedia(editId);
      setServiceInstagram(updated);
      await refreshContent();
      showToast('Reel cover image uploaded & saved');
    } catch (err: any) {
      alert(err.message || 'Failed to upload reel cover image');
    } finally {
      setUploadingReelCoverId(null);
      e.target.value = '';
    }
  };

  const handleDeleteInstagramMedia = async (mediaId: string) => {
    if (!editId) return;
    try {
      await deleteServiceInstagramMedia(mediaId);
      showToast('Instagram media removed');
      if (editingInstaId === mediaId) setEditingInstaId(null);
      const updated = await fetchServiceInstagramMedia(editId);
      setServiceInstagram(updated);
      await refreshContent();
    } catch (err: any) {
      alert(err.message || 'Failed to remove Instagram media');
    }
  };

  const reelCoverOptions: CoverOption[] = [
    ...(formData.image_url ? [{ url: formData.image_url, label: `${formData.title || 'Service'} Cover` }] : []),
    ...serviceGallery.map((g, i) => ({ url: g.image_url, label: g.caption || `Service Photo ${i + 1}` })),
    ...(content?.gallery || []).map((g) => ({ url: g.image_url, label: g.title || g.category })),
  ];

  const saveServiceDetails = async (closeAfterSave = true) => {
    if (!formData.title.trim() || !formData.image_url.trim()) {
      setActiveTab('details');
      setFormError('Please enter a service title and cover image.');
      return;
    }

    const featuresArray = formData.featuresText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title.trim(),
      slug: (formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).trim(),
      category: formData.category,
      short_description: formData.short_description || formData.title,
      full_description: formData.full_description || formData.short_description || formData.title,
      description: formData.short_description || formData.title,
      features: featuresArray,
      image_url: formData.image_url,
      display_order: formData.display_order,
      is_active: formData.is_active,
    };

    try {
      setIsSaving(true);
      setFormError('');
      if (isEditing && editId) {
        await updateAdminService(editId, payload);
        showToast('Service changes saved successfully');
      } else {
        await createAdminService(payload);
        showToast('New service created successfully');
      }
      if (closeAfterSave) {
        setIsModalOpen(false);
      }
      await loadServices();
      await refreshContent();
    } catch (err: any) {
      setFormError(err.message || 'Error saving service');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveServiceDetails(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the service "${title}"?`)) return;

    try {
      await deleteAdminService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      showToast('Service deleted successfully');
      await loadServices();
      await refreshContent();
    } catch (err: any) {
      alert(err.message || 'Failed to delete service');
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[110] bg-charcoal-950 text-gold-300 border border-gold-400 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-green-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-gold-200/80 shadow-luxury">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#650A25]/10 border border-[#650A25]/30 text-[#4A071D] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Celebration Catalogue</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon-950">
            Services &amp; Celebration Pages
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-1">
            Manage services appearing on homepage cards and their dedicated individual experience pages (/services/:slug).
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#650A25] to-[#390014] hover:from-[#8B1538] hover:to-[#4A071D] text-gold-100 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition active:scale-95 shrink-0 border border-gold-400/50 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-3xl border border-gold-200/80 shadow-luxury overflow-hidden">
        <div className="p-6 border-b border-charcoal-100 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-maroon-950">
            Available Celebration Categories ({services.length})
          </h2>
          <span className="text-xs text-charcoal-700">
            Click edit to manage details, photo galleries &amp; Instagram reels
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-charcoal-700 text-sm">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="p-12 text-center text-charcoal-600 text-sm">
            No services configured yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-charcoal-700">
              <thead className="bg-ivory-50 text-charcoal-800 font-bold uppercase tracking-wider text-[11px] border-b border-charcoal-200">
                <tr>
                  <th className="py-3.5 px-3.5 xl:px-4">Image</th>
                  <th className="py-3.5 px-3.5 xl:px-4">Service Title &amp; Slug</th>
                  <th className="py-3.5 px-3.5 xl:px-4">Category</th>
                  <th className="py-3.5 px-3.5 xl:px-4 text-center">Order</th>
                  <th className="py-3.5 px-3.5 xl:px-4 text-center">Status</th>
                  <th className="py-3.5 px-3.5 xl:px-4 text-center">Live Preview</th>
                  <th className="py-3.5 px-3.5 xl:px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100">
                {services.map((item) => (
                  <tr key={item.id} className="hover:bg-ivory-50/70 transition-colors">
                    <td className="py-3.5 px-3.5 xl:px-4 w-24">
                      <div className="w-20 h-14 rounded-xl overflow-hidden border border-gold-200 shadow-sm bg-charcoal-900">
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    </td>

                    <td className="py-3.5 px-3.5 xl:px-4 max-w-[200px] xl:max-w-xs">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="font-serif text-base font-bold text-maroon-950 hover:text-[#650A25] hover:underline text-left block cursor-pointer"
                      >
                        {item.title}
                      </button>
                      <span className="text-[11px] font-mono text-gold-700 bg-gold-50 px-2 py-0.5 rounded border border-gold-200 inline-block mt-0.5">
                        /services/{item.slug || item.id}
                      </span>
                      <p className="text-xs text-charcoal-600 line-clamp-1 mt-1 font-normal">
                        {item.short_description || item.description}
                      </p>
                    </td>

                    <td className="py-3.5 px-3.5 xl:px-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-ivory-100 text-maroon-900 border border-gold-200">
                        {item.category || 'General'}
                      </span>
                    </td>

                    <td className="py-3.5 px-3.5 xl:px-4 text-center font-bold text-charcoal-700">
                      {item.display_order}
                    </td>

                    <td className="py-3.5 px-3.5 xl:px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          item.is_active ? 'bg-green-100 text-green-800' : 'bg-charcoal-100 text-charcoal-600'
                        }`}
                      >
                        {item.is_active ? 'Active' : 'Draft'}
                      </span>
                    </td>

                    <td className="py-3.5 px-3.5 xl:px-4 text-center">
                      <a
                        href={`/services/${item.slug || item.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-gold-700 hover:text-gold-900 font-semibold"
                        title="View Live Page"
                      >
                        <span>View Page</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>

                    <td className="py-3.5 px-3.5 xl:px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#390014] bg-gold-50 hover:bg-[#650A25] hover:text-gold-100 border border-gold-300 rounded-xl transition cursor-pointer"
                          title="Edit Service & Media"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-2 text-charcoal-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                          title="Delete Service"
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

      {/* Service Manager Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal-950/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-3xl rounded-3xl border-2 border-gold-300 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-[#26000D] via-[#390014] to-[#650A25] text-white flex items-center justify-between gap-4 shrink-0">
              <div className="min-w-0">
                <h3 className="font-serif text-xl font-bold text-ivory-50 truncate">
                  {isEditing ? `Edit Service: ${formData.title}` : 'Add New Celebration Service'}
                </h3>
                <p className="text-xs text-gold-200 mt-0.5">
                  Configure presentation details, cover photography, gallery images and Instagram reels
                </p>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => saveServiceDetails(false)}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gold-400 hover:bg-gold-300 text-[#26000D] text-xs font-bold shadow transition active:scale-95 disabled:opacity-60 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white cursor-pointer"
                  aria-label="Close service editor"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Navigation Tabs (Only available when editing an existing service) */}
            {isEditing && (
              <div className="flex border-b border-charcoal-200 bg-ivory-50 px-6 gap-6 text-xs sm:text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className={`py-3.5 border-b-2 flex items-center gap-2 transition ${
                    activeTab === 'details'
                      ? 'border-[#650A25] text-[#4A071D] bg-white'
                      : 'border-transparent text-charcoal-700 hover:text-charcoal-800'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Service Details &amp; Highlights</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('gallery')}
                  className={`py-3.5 border-b-2 flex items-center gap-2 transition ${
                    activeTab === 'gallery'
                      ? 'border-[#650A25] text-[#4A071D] bg-white'
                      : 'border-transparent text-charcoal-700 hover:text-charcoal-800'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>Gallery Photos ({serviceGallery.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('instagram')}
                  className={`py-3.5 border-b-2 flex items-center gap-2 transition ${
                    activeTab === 'instagram'
                      ? 'border-[#650A25] text-[#4A071D] bg-white'
                      : 'border-transparent text-charcoal-700 hover:text-charcoal-800'
                  }`}
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram Reels &amp; Videos ({serviceInstagram.length})</span>
                </button>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1">
              {activeTab === 'details' && (
                <form id="service-details-form" onSubmit={handleSubmit} className="space-y-5">
                  {formError && (
                    <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Title & Slug */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                        Service Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={handleTitleChange}
                        placeholder="e.g. Wedding Functions"
                        className="w-full px-4 py-2.5 rounded-xl border border-charcoal-300 focus:outline-none focus:border-gold-500 text-xs sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                        URL Slug (/services/...)
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="wedding-functions"
                        className="w-full px-4 py-2.5 rounded-xl border border-charcoal-300 focus:outline-none focus:border-gold-500 text-xs sm:text-sm font-mono"
                      />
                    </div>
                  </div>

                  {/* Category & Order */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                        Category
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g. Weddings, Engagement"
                        className="w-full px-4 py-2 rounded-xl border border-charcoal-300 text-xs sm:text-sm focus:outline-none focus:border-gold-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                        Display Order
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.display_order}
                        onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) || 0 })}
                        className="w-full px-4 py-2 rounded-xl border border-charcoal-300 text-xs sm:text-sm focus:outline-none focus:border-gold-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                        Status
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

                  {/* Short Description */}
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                      Short Description (Homepage Card) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={formData.short_description}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                      placeholder="Brief teaser for the homepage card (1-2 sentences)..."
                      className="w-full px-4 py-2 rounded-xl border border-charcoal-300 text-xs sm:text-sm focus:outline-none focus:border-gold-500 leading-relaxed"
                    />
                  </div>

                  {/* Full Description */}
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                      Full Description (Dedicated Service Page) *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.full_description}
                      onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                      placeholder="Comprehensive overview of hall aesthetics, decor, stage lighting, catering setup, and event coordination..."
                      className="w-full px-4 py-2.5 rounded-xl border border-charcoal-300 text-xs sm:text-sm focus:outline-none focus:border-gold-500 leading-relaxed"
                    />
                  </div>

                  {/* Features List */}
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                      Arrangement Highlights (One bullet point per line)
                    </label>
                    <textarea
                      rows={4}
                      value={formData.featuresText}
                      onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                      placeholder="Grand Banquet Hall for large guest gatherings&#10;Exquisite Floral & Royal Stage Decor&#10;High-Definition Acoustics & Ambient Lighting&#10;Private Luxury Bridal & Groom Suites"
                      className="w-full px-4 py-2.5 rounded-xl border border-charcoal-300 text-xs sm:text-sm font-mono focus:outline-none focus:border-gold-500 leading-relaxed"
                    />
                    <p className="text-[11px] text-charcoal-700 mt-1">
                      Each line will be displayed as a feature checkmark on the service detail page.
                    </p>
                  </div>

                  {/* Cover Image */}
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                      Cover Photo *
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-full sm:w-36 h-24 rounded-2xl border-2 border-dashed border-gold-300 bg-ivory-50 flex items-center justify-center overflow-hidden shrink-0">
                        {formData.image_url ? (
                          <img src={formData.image_url} alt="Cover Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="w-6 h-6 text-charcoal-600" />
                        )}
                      </div>

                      <div className="flex-1 w-full space-y-2">
                        <input
                          type="text"
                          required
                          value={formData.image_url}
                          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                          placeholder="Image URL (https://...)"
                          className="w-full px-4 py-2 rounded-xl border border-charcoal-300 text-xs focus:outline-none focus:border-gold-500"
                        />

                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="service-cover-upload"
                          />
                          <label
                            htmlFor="service-cover-upload"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ivory-100 hover:bg-gold-100 text-maroon-900 text-xs font-semibold cursor-pointer border border-gold-300 transition"
                          >
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>{uploadingFile ? 'Uploading...' : 'Upload Cover from Computer'}</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                </form>
              )}

              {/* Gallery Tab */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  {/* Add New Gallery Image */}
                  <form onSubmit={handleAddGalleryImage} className="p-4 bg-ivory-50 rounded-2xl border border-gold-200 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-maroon-950 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-gold-600" />
                      <span>Add Photo to {formData.title} Gallery</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-6">
                        <input
                          type="text"
                          required
                          value={newGalleryPhoto.image_url}
                          onChange={(e) => setNewGalleryPhoto({ ...newGalleryPhoto, image_url: e.target.value })}
                          placeholder="Image URL or upload below"
                          className="w-full px-3 py-2 rounded-xl border border-charcoal-300 text-xs"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          value={newGalleryPhoto.caption}
                          onChange={(e) => setNewGalleryPhoto({ ...newGalleryPhoto, caption: e.target.value })}
                          placeholder="Caption (e.g. Royal Mandap)"
                          className="w-full px-3 py-2 rounded-xl border border-charcoal-300 text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <button
                          type="submit"
                          className="w-full py-2 px-3 bg-[#650A25] hover:bg-[#390014] text-white font-bold rounded-xl text-xs transition cursor-pointer"
                        >
                          Add Photo
                        </button>
                      </div>
                    </div>

                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleGalleryPhotoUpload}
                        className="hidden"
                        id="add-gallery-file"
                      />
                      <label
                        htmlFor="add-gallery-file"
                        className="inline-flex items-center gap-1.5 text-xs text-maroon-900 font-semibold cursor-pointer hover:underline"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>{uploadingGalleryFile ? 'Uploading photo...' : 'Or upload image file from computer'}</span>
                      </label>
                    </div>
                  </form>

                  {/* Existing Photos Grid */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-3">
                      Current Gallery Photos ({serviceGallery.length})
                    </h4>
                    {serviceGallery.length === 0 ? (
                      <p className="text-xs text-charcoal-700 italic">No gallery photos added yet.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {serviceGallery.map((g) => (
                          <div
                            key={g.id}
                            className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-charcoal-900 border border-charcoal-200"
                          >
                            <img src={g.image_url} alt={g.caption} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-charcoal-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white">
                              <p className="text-xs font-medium truncate">{g.caption || 'Untitled'}</p>
                              <button
                                type="button"
                                onClick={() => handleDeleteGalleryImage(g.id)}
                                className="self-end p-1.5 bg-red-600 rounded-lg hover:bg-red-700 text-white transition"
                                title="Delete Photo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Instagram Media Tab */}
              {activeTab === 'instagram' && (
                <div className="space-y-6">
                  {/* Add New Instagram Link */}
                  <form onSubmit={handleAddInstagramMedia} className="p-4 bg-pink-50/50 rounded-2xl border border-pink-200 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-pink-900 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-pink-600" />
                      <span>Add Instagram Reel or Video to {formData.title}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-charcoal-700 uppercase mb-1">
                          Instagram Post/Reel URL *
                        </label>
                        <input
                          type="url"
                          required
                          value={newInstaMedia.instagram_url}
                          onChange={(e) => setNewInstaMedia({ ...newInstaMedia, instagram_url: e.target.value })}
                          placeholder="https://www.instagram.com/reel/..."
                          className="w-full px-3 py-2 rounded-xl border border-charcoal-300 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-charcoal-700 uppercase mb-1">
                          Media Type
                        </label>
                        <select
                          value={newInstaMedia.media_type}
                          onChange={(e) => setNewInstaMedia({ ...newInstaMedia, media_type: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-charcoal-300 text-xs"
                        >
                          <option value="reel">Reel</option>
                          <option value="video">Video</option>
                          <option value="post">Post</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-charcoal-700 uppercase mb-1">
                          Title / Headline
                        </label>
                        <input
                          type="text"
                          value={newInstaMedia.title}
                          onChange={(e) => setNewInstaMedia({ ...newInstaMedia, title: e.target.value })}
                          placeholder="e.g. Grand Entry Reveal"
                          className="w-full px-3 py-2 rounded-xl border border-charcoal-300 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-charcoal-700 uppercase mb-1">
                          Caption / Highlights
                        </label>
                        <input
                          type="text"
                          value={newInstaMedia.caption}
                          onChange={(e) => setNewInstaMedia({ ...newInstaMedia, caption: e.target.value })}
                          placeholder="e.g. Bride entry with cold pyro..."
                          className="w-full px-3 py-2 rounded-xl border border-charcoal-300 text-xs"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-pink-200/80">
                      <CoverImagePicker
                        label="Reel Coverpage (Upload or Select Photo)"
                        value={newInstaMedia.cover_image}
                        fallbackUrl={formData.image_url}
                        onChange={(url) => setNewInstaMedia((prev) => ({ ...prev, cover_image: url }))}
                        options={reelCoverOptions}
                        uploadId="new-reel-cover-upload"
                        placeholder="Paste reel cover URL or upload/select photo below"
                        hint="Optional — defaults to Service cover"
                        compact
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="py-2 px-5 bg-gradient-to-r from-[#650A25] to-[#390014] hover:from-[#8B1538] hover:to-[#4A071D] text-gold-100 font-bold rounded-xl text-xs transition shadow border border-gold-400/50 cursor-pointer"
                      >
                        Add to Service
                      </button>
                    </div>
                  </form>

                  {/* Existing Instagram Items */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-3">
                      Linked Instagram Media ({serviceInstagram.length})
                    </h4>
                    {serviceInstagram.length === 0 ? (
                      <p className="text-xs text-charcoal-700 italic">No Instagram reels or videos linked yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {serviceInstagram.map((item) => {
                          const displayThumb = item.cover_image || formData.image_url;
                          const isEditingThis = editingInstaId === item.id;

                          return (
                            <div
                              key={item.id}
                              className="p-3.5 bg-ivory-50 rounded-2xl border border-charcoal-200 space-y-3"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-charcoal-950 border border-gold-300/70 shrink-0 flex items-center justify-center">
                                    {displayThumb ? (
                                      <img
                                        src={displayThumb}
                                        alt={item.title || 'Reel Cover'}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : null}
                                    <span className="absolute inset-0 bg-black/35 flex items-center justify-center text-white">
                                      <Play className="w-4 h-4 fill-current" />
                                    </span>
                                  </div>

                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h5 className="font-semibold text-xs text-maroon-950 truncate">
                                        {item.title || 'Instagram Media'}
                                      </h5>
                                      <span
                                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                          item.cover_image
                                            ? 'bg-[#650A25]/10 text-[#4A071D] border border-[#650A25]/30'
                                            : 'bg-charcoal-200/80 text-charcoal-700'
                                        }`}
                                      >
                                        {item.cover_image ? 'Custom Cover' : 'Service Cover'}
                                      </span>
                                    </div>
                                    <a
                                      href={item.instagram_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[11px] text-[#650A25] font-medium hover:underline flex items-center gap-1 font-mono mt-0.5 truncate"
                                    >
                                      <span className="truncate">{item.instagram_url}</span>
                                      <ExternalLink className="w-3 h-3 shrink-0" />
                                    </a>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 shrink-0">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    id={`quick-cover-${item.id}`}
                                    className="hidden"
                                    onChange={(e) => handleQuickUploadReelCover(item.id, e)}
                                  />
                                  <label
                                    htmlFor={`quick-cover-${item.id}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#650A25] to-[#390014] hover:from-[#8B1538] hover:to-[#4A071D] text-gold-100 text-[11px] font-bold cursor-pointer border border-gold-400/50 transition"
                                    title="Upload custom cover image for this reel"
                                  >
                                    <UploadCloud className="w-3.5 h-3.5 text-gold-300" />
                                    <span>
                                      {uploadingReelCoverId === item.id ? 'Uploading...' : 'Upload Cover'}
                                    </span>
                                  </label>

                                  <button
                                    type="button"
                                    onClick={() => handleStartEditInstagram(item)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                                      isEditingThis
                                        ? 'bg-[#390014] text-gold-100 border-[#650A25]'
                                        : 'bg-white hover:bg-gold-50 text-[#4A071D] border-gold-300'
                                    }`}
                                  >
                                    <Edit2 className="w-3 h-3" />
                                    <span>{isEditingThis ? 'Close' : 'Select Coverpage / Edit'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteInstagramMedia(item.id)}
                                    className="p-2 text-charcoal-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition shrink-0 cursor-pointer"
                                    title="Delete Link"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Inline Coverpage & Details Editor */}
                              {isEditingThis && (
                                <div className="pt-3 border-t border-gold-200 space-y-3 bg-white p-3.5 rounded-xl border">
                                  <CoverImagePicker
                                    label="Change Reel Coverpage"
                                    value={editingInstaData.cover_image}
                                    fallbackUrl={formData.image_url}
                                    onChange={(url) =>
                                      setEditingInstaData((prev) => ({ ...prev, cover_image: url }))
                                    }
                                    options={reelCoverOptions}
                                    uploadId={`edit-reel-cover-${item.id}`}
                                    hint="Click Upload or Select Coverpage"
                                    compact
                                  />

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[11px] font-semibold text-charcoal-700 uppercase mb-1">
                                        Instagram Post/Reel URL *
                                      </label>
                                      <input
                                        type="url"
                                        value={editingInstaData.instagram_url}
                                        onChange={(e) =>
                                          setEditingInstaData((prev) => ({
                                            ...prev,
                                            instagram_url: e.target.value,
                                          }))
                                        }
                                        className="w-full px-3 py-2 rounded-xl border border-charcoal-300 text-xs"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-[11px] font-semibold text-charcoal-700 uppercase mb-1">
                                        Title
                                      </label>
                                      <input
                                        type="text"
                                        value={editingInstaData.title}
                                        onChange={(e) =>
                                          setEditingInstaData((prev) => ({
                                            ...prev,
                                            title: e.target.value,
                                          }))
                                        }
                                        className="w-full px-3 py-2 rounded-xl border border-charcoal-300 text-xs"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="sm:col-span-2">
                                      <label className="block text-[11px] font-semibold text-charcoal-700 uppercase mb-1">
                                        Caption
                                      </label>
                                      <input
                                        type="text"
                                        value={editingInstaData.caption}
                                        onChange={(e) =>
                                          setEditingInstaData((prev) => ({
                                            ...prev,
                                            caption: e.target.value,
                                          }))
                                        }
                                        className="w-full px-3 py-2 rounded-xl border border-charcoal-300 text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[11px] font-semibold text-charcoal-700 uppercase mb-1">
                                        Media Type
                                      </label>
                                      <select
                                        value={editingInstaData.media_type}
                                        onChange={(e) =>
                                          setEditingInstaData((prev) => ({
                                            ...prev,
                                            media_type: e.target.value,
                                          }))
                                        }
                                        className="w-full px-3 py-2 rounded-xl border border-charcoal-300 text-xs bg-white"
                                      >
                                        <option value="reel">Reel</option>
                                        <option value="video">Video</option>
                                        <option value="post">Post</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-end gap-2 pt-1">
                                    <button
                                      type="button"
                                      onClick={() => setEditingInstaId(null)}
                                      className="px-3.5 py-1.5 rounded-xl border border-charcoal-300 text-xs font-semibold text-charcoal-700 hover:bg-charcoal-50 cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleSaveEditedInstagram}
                                      disabled={savingInstaEdit}
                                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#650A25] to-[#390014] hover:from-[#8B1538] hover:to-[#4A071D] text-gold-100 text-xs font-bold border border-gold-400/50 shadow cursor-pointer disabled:opacity-60"
                                    >
                                      <Save className="w-3.5 h-3.5 text-gold-300" />
                                      <span>{savingInstaEdit ? 'Saving...' : 'Save Reel Changes'}</span>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Pinned Modal Footer Bar (Always visible across Details, Gallery & Instagram tabs) */}
            <div className="px-6 py-4 bg-ivory-50 border-t-2 border-gold-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <span className="text-[11px] sm:text-xs text-charcoal-700 font-medium">
                {formData.slug ? (
                  <>Live URL: <span className="font-mono text-[#650A25] font-semibold">/services/{formData.slug}</span></>
                ) : (
                  'Save your edits to update the live website immediately.'
                )}
              </span>

              <div className="flex items-center gap-2.5 ml-auto">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-charcoal-300 bg-white hover:bg-charcoal-50 text-xs font-bold text-charcoal-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => saveServiceDetails(true)}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#650A25] to-[#390014] hover:from-[#8B1538] hover:to-[#4A071D] text-gold-100 text-xs font-bold shadow-md hover:shadow-lg transition active:scale-95 disabled:opacity-60 border border-gold-400/60 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-gold-300" />
                  <span>{isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Service'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
