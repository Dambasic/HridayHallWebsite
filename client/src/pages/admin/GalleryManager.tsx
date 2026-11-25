import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  UploadCloud,
  Star,
  Eye,
  EyeOff,
  Filter,
} from 'lucide-react';
import {
  fetchAdminGallery,
  createAdminGalleryImage,
  updateAdminGalleryImage,
  deleteAdminGalleryImage,
  toggleGalleryActive,
  toggleGalleryFeatured,
  uploadImageFile,
} from '../../services/api';
import { GalleryImage } from '../../types';
import { useContent } from '../../context/ContentContext';

const CATEGORIES = [
  'Banquet Interiors',
  'Wedding Events',
  'Decorations',
  'Celebrations',
  'Stage Arrangements',
  'Other Events',
];

export const GalleryManager: React.FC = () => {
  const { refreshContent } = useContent();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: 'Banquet Interiors',
    display_order: 0,
    is_featured: 0,
    is_active: 1,
  });

  const [uploadingFile, setUploadingFile] = useState(false);
  const [formError, setFormError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const loadGallery = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAdminGallery();
      setImages(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({
      title: '',
      description: '',
      image_url: '',
      category: 'Banquet Interiors',
      display_order: images.length + 1,
      is_featured: 0,
      is_active: 1,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: GalleryImage) => {
    setIsEditing(true);
    setEditId(item.id);
    setFormData({
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      category: item.category,
      display_order: item.display_order,
      is_featured: item.is_featured,
      is_active: item.is_active,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingFile(true);
      setFormError('');
      const res = await uploadImageFile(file);
      setFormData((prev) => ({ ...prev, image_url: res.url }));
    } catch (err: any) {
      setFormError(err.message || 'Image upload failed');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url.trim()) {
      setFormError('Please upload an image or provide an image URL');
      return;
    }

    try {
      setFormError('');
      if (isEditing && editId) {
        await updateAdminGalleryImage(editId, formData);
        setSuccessToast('Photograph updated successfully!');
      } else {
        await createAdminGalleryImage(formData);
        setSuccessToast('Photograph added to gallery!');
      }

      setIsModalOpen(false);
      await loadGallery();
      await refreshContent();
      setTimeout(() => setSuccessToast(''), 4000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save image');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteAdminGalleryImage(id);
      setSuccessToast('Image deleted.');
      await loadGallery();
      await refreshContent();
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await toggleGalleryActive(id);
      await loadGallery();
      await refreshContent();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      await toggleGalleryFeatured(id);
      await loadGallery();
      await refreshContent();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle featured');
    }
  };

  const filtered =
    selectedCategory === 'All'
      ? images
      : images.filter((img) => img.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm rounded-2xl flex items-center gap-2 shadow-sm animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-charcoal-200">
        <div>
          <h1 className="font-serif text-3xl font-bold text-maroon-950">
            Banquet Gallery Manager
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-1">
            Upload, categorize, feature, and reorder banquet photography shown in the website slider.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-maroon-800 hover:bg-maroon-900 text-ivory-100 font-semibold text-xs sm:text-sm transition shadow-maroon-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-gold-300" />
          <span>Add New Photograph</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-semibold text-charcoal-700 mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Category:
        </span>
        {['All', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-maroon-900 text-gold-200 font-semibold shadow-xs'
                : 'bg-white text-charcoal-600 border border-charcoal-200 hover:bg-gold-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Cards Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-charcoal-700 text-sm font-medium">
          Loading gallery images...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-charcoal-200 p-8">
          <ImageIcon className="w-12 h-12 text-charcoal-500 mx-auto mb-3" />
          <p className="text-charcoal-700 font-medium">No images found.</p>
          <button
            onClick={openAddModal}
            className="mt-4 px-4 py-2 bg-maroon-800 text-white rounded-xl text-xs font-semibold"
          >
            Upload the first photograph
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-3xl overflow-hidden border transition shadow-sm hover:shadow-lg flex flex-col ${
                item.is_active ? 'border-charcoal-200' : 'border-rose-300 opacity-90'
              }`}
            >
              {/* Image Preview */}
              <div className="relative aspect-[4/3] bg-charcoal-100 overflow-hidden group">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />

                {/* Top Overlay Badges */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-charcoal-950/80 backdrop-blur-md text-[10px] font-semibold text-gold-300 border border-white/20">
                    {item.category}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleFeatured(item.id)}
                      className={`p-1.5 rounded-full backdrop-blur-md transition ${
                        item.is_featured
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-charcoal-900/60 text-white/70 hover:text-white'
                      }`}
                      title={item.is_featured ? 'Featured on slider' : 'Mark as featured'}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <button
                      onClick={() => handleToggleActive(item.id)}
                      className={`p-1.5 rounded-full backdrop-blur-md transition ${
                        item.is_active
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-rose-600 text-white shadow-sm'
                      }`}
                      title={item.is_active ? 'Active on site' : 'Hidden from site'}
                    >
                      {item.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-maroon-950 truncate mb-1">
                    {item.title}
                  </h3>
                  {item.description ? (
                    <p className="text-xs text-charcoal-700 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  ) : (
                    <p className="text-xs text-charcoal-600 italic">No description</p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-charcoal-100 flex items-center justify-between text-xs">
                  <span className="text-charcoal-700 font-semibold font-mono text-[11px]">
                    Order: #{item.display_order}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-charcoal-700 hover:text-maroon-900 rounded-lg hover:bg-ivory-100 transition"
                      title="Edit Image Details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1.5 text-charcoal-600 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition"
                      title="Delete Image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gold-300">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-charcoal-700 hover:text-charcoal-950 rounded-full hover:bg-ivory-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl font-bold text-maroon-950 mb-1">
              {isEditing ? 'Edit Photograph' : 'Add New Photograph'}
            </h2>
            <p className="text-xs text-charcoal-700 mb-6">
              Fill in details or upload high-resolution banquet photo.
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              {/* File Upload or URL */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                  Photograph Source *
                </label>

                {/* Upload box */}
                <div className="p-4 border-2 border-dashed border-charcoal-300 rounded-2xl bg-ivory-50 text-center mb-3">
                  <input
                    type="file"
                    id="imageFileInput"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="imageFileInput"
                    className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                  >
                    <UploadCloud className="w-8 h-8 text-gold-600" />
                    <span className="text-xs font-semibold text-maroon-900">
                      {uploadingFile ? 'Uploading to Server...' : 'Click to Upload from Device'}
                    </span>
                    <span className="text-[11px] text-charcoal-700 font-medium">
                      Supports JPG, PNG, WEBP, AVIF up to 15MB
                    </span>
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="url"
                    placeholder="Or paste external image URL (e.g. Unsplash, Cloudinary)"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-charcoal-200 rounded-xl text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                {formData.image_url && (
                  <div className="mt-2 relative rounded-xl overflow-hidden aspect-[16/9] border border-gold-200 max-h-36">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                    Photograph Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grand Chandelier Stage"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Optional detail about lighting, arrangement or decor..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 resize-none"
                />
              </div>

              {/* Display Order & Toggles */}
              <div className="grid grid-cols-3 gap-3 items-center pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-charcoal-700 uppercase mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs text-charcoal-900"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="featuredCheck"
                    checked={formData.is_featured === 1}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4 rounded text-gold-600 focus:ring-gold-500"
                  />
                  <label htmlFor="featuredCheck" className="text-xs font-medium text-charcoal-800 cursor-pointer">
                    Featured Slide
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="activeCheck"
                    checked={formData.is_active === 1}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="activeCheck" className="text-xs font-medium text-charcoal-800 cursor-pointer">
                    Visible on Site
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-charcoal-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-charcoal-300 rounded-xl text-xs font-medium text-charcoal-700 hover:bg-ivory-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingFile}
                  className="px-6 py-2.5 bg-maroon-800 hover:bg-maroon-900 text-ivory-100 rounded-xl text-xs font-semibold shadow-maroon-sm"
                >
                  {isEditing ? 'Save Changes' : 'Add to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
