import React, { useState, useEffect } from 'react';
import { FileText, Save, Check, UploadCloud, Sparkles, Award } from 'lucide-react';
import {
  fetchAdminSettings,
  updateAdminSettings,
  fetchAdminAbout,
  updateAdminAbout,
  uploadImageFile,
} from '../../services/api';
import { useContent } from '../../context/ContentContext';

export const ContentManager: React.FC = () => {
  const { refreshContent } = useContent();
  const [activeTab, setActiveTab] = useState<'hero' | 'about'>('hero');
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Hero state
  const [fullSettings, setFullSettings] = useState<any>(null);
  const [heroData, setHeroData] = useState({
    hero_heading: '',
    hero_subtitle: '',
    hero_trust_text: '',
    hero_bg_image: '',
    hero_bg_opacity: 45,
  });

  // About state
  const [aboutData, setAboutData] = useState({
    heading: '',
    description: '',
    venue_image: '',
    highlight_card_1_title: '',
    highlight_card_1_desc: '',
    highlight_card_2_title: '',
    highlight_card_2_desc: '',
    highlight_card_3_title: '',
    highlight_card_3_desc: '',
  });

  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingAbout, setUploadingAbout] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [settings, about] = await Promise.all([
          fetchAdminSettings(),
          fetchAdminAbout(),
        ]);

        if (settings) {
          setFullSettings(settings);
          setHeroData({
            hero_heading: settings.hero_heading || '',
            hero_subtitle: settings.hero_subtitle || '',
            hero_trust_text: settings.hero_trust_text || '',
            hero_bg_image: settings.hero_bg_image || '',
            hero_bg_opacity: settings.hero_bg_opacity ?? 45,
          });
        }

        if (about) {
          setAboutData({
            heading: about.heading || '',
            description: about.description || '',
            venue_image: about.venue_image || '',
            highlight_card_1_title: about.highlight_card_1_title || '',
            highlight_card_1_desc: about.highlight_card_1_desc || '',
            highlight_card_2_title: about.highlight_card_2_title || '',
            highlight_card_2_desc: about.highlight_card_2_desc || '',
            highlight_card_3_title: about.highlight_card_3_title || '',
            highlight_card_3_desc: about.highlight_card_3_desc || '',
          });
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to load content');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingHero(true);
      const res = await uploadImageFile(file);
      setHeroData((prev) => ({ ...prev, hero_bg_image: res.url }));
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploadingHero(false);
    }
  };

  const handleAboutUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingAbout(true);
      const res = await uploadImageFile(file);
      setAboutData((prev) => ({ ...prev, venue_image: res.url }));
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploadingAbout(false);
    }
  };

  const saveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAdminSettings({ ...(fullSettings || {}), ...heroData });
      setToastMsg('Hero Section content saved successfully!');
      await refreshContent();
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to save');
    }
  };

  const saveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAdminAbout(aboutData);
      setToastMsg('About Section content saved successfully!');
      await refreshContent();
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to save');
    }
  };

  if (isLoading) {
    return <div className="py-16 text-center text-charcoal-700 text-sm">Loading content editor...</div>;
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
            Website Content Manager
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-1">
            Update hero headlines, trust subtitles, venue description narrative, and highlight cards without editing code.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-charcoal-200 pb-3">
        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'hero'
              ? 'bg-maroon-900 text-gold-200 shadow-maroon-sm'
              : 'bg-white text-charcoal-600 border border-charcoal-200 hover:bg-gold-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Homepage Hero Section</span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'about'
              ? 'bg-maroon-900 text-gold-200 shadow-maroon-sm'
              : 'bg-white text-charcoal-600 border border-charcoal-200 hover:bg-gold-50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>About Section &amp; Highlights</span>
        </button>
      </div>

      {/* Hero Tab */}
      {activeTab === 'hero' && (
        <form onSubmit={saveHero} className="bg-white rounded-3xl p-6 sm:p-8 border border-gold-200 shadow-luxury space-y-6">
          <div className="flex items-center justify-between border-b border-charcoal-100 pb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-maroon-950">
                Hero Section Configuration
              </h3>
              <p className="text-xs text-charcoal-700">
                The first visual experience visitors see upon loading Hriday Banquet Hall.
              </p>
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-maroon-800 hover:bg-maroon-900 text-ivory-100 rounded-xl text-xs sm:text-sm font-semibold shadow-maroon-sm transition"
            >
              <Save className="w-4 h-4 text-gold-300" />
              <span>Save Hero Content</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Hero Main Heading *
              </label>
              <input
                type="text"
                required
                value={heroData.hero_heading}
                onChange={(e) => setHeroData({ ...heroData, hero_heading: e.target.value })}
                className="w-full px-4 py-3 bg-ivory-50 border border-charcoal-200 rounded-xl text-sm font-serif font-bold text-maroon-950 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Supporting Subtitle
              </label>
              <textarea
                rows={2}
                value={heroData.hero_subtitle}
                onChange={(e) => setHeroData({ ...heroData, hero_subtitle: e.target.value })}
                className="w-full px-4 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs sm:text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-gold-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Trust Subtitle / Brand Slogan
              </label>
              <input
                type="text"
                value={heroData.hero_trust_text}
                onChange={(e) => setHeroData({ ...heroData, hero_trust_text: e.target.value })}
                className="w-full px-4 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs sm:text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            {/* Hero Background Image */}
            <div className="pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Full-width Hero Background Image
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div>
                  <div className="p-4 border-2 border-dashed border-charcoal-300 rounded-2xl bg-ivory-50 text-center mb-3">
                    <input
                      type="file"
                      id="heroBgInput"
                      accept="image/*"
                      onChange={handleHeroUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="heroBgInput"
                      className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                    >
                      <UploadCloud className="w-7 h-7 text-gold-600" />
                      <span className="text-xs font-semibold text-maroon-900">
                        {uploadingHero ? 'Uploading...' : 'Upload Background Image'}
                      </span>
                    </label>
                  </div>

                  <input
                    type="url"
                    placeholder="Or enter image URL"
                    value={heroData.hero_bg_image}
                    onChange={(e) => setHeroData({ ...heroData, hero_bg_image: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-charcoal-200 rounded-xl text-xs text-charcoal-900"
                  />

                  {/* Color Overlay Opacity Slider */}
                  <div className="mt-4 p-4 rounded-2xl bg-ivory-50 border border-gold-200/80 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <label
                        htmlFor="heroBgOpacitySlider"
                        className="text-xs font-semibold uppercase tracking-wider text-charcoal-800"
                      >
                        Background Color Overlay Opacity
                      </label>
                      <span className="px-2.5 py-0.5 rounded-full bg-maroon-900 text-gold-200 text-xs font-bold tabular-nums">
                        {heroData.hero_bg_opacity}%
                      </span>
                    </div>
                    <input
                      id="heroBgOpacitySlider"
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={heroData.hero_bg_opacity}
                      onChange={(e) =>
                        setHeroData({ ...heroData, hero_bg_opacity: Number(e.target.value) })
                      }
                      className="w-full accent-maroon-800 cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-[11px] text-charcoal-600 font-medium">
                      <span>0% (Clear Image)</span>
                      <span>45% (Balanced)</span>
                      <span>100% (Dark Overlay)</span>
                    </div>
                  </div>
                </div>

                {heroData.hero_bg_image && (
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-gold-300 shadow">
                    <img
                      src={heroData.hero_bg_image}
                      alt="Hero Background Preview"
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0 transition-opacity duration-150 pointer-events-none"
                      style={{ opacity: heroData.hero_bg_opacity / 100 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-[#120B0F] via-[#26000D]/80 to-[#180007]/85" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#120B0F]/85 via-[#180007]/55 to-[#26000D]/55" />
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-xs font-medium drop-shadow">
                      <span>Live Hero Preview</span>
                      <span className="text-[11px] text-gold-200 mt-0.5">
                        Overlay Opacity: {heroData.hero_bg_opacity}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      )}

      {/* About Tab */}
      {activeTab === 'about' && (
        <form onSubmit={saveAbout} className="bg-white rounded-3xl p-6 sm:p-8 border border-gold-200 shadow-luxury space-y-8">
          <div className="flex items-center justify-between border-b border-charcoal-100 pb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-maroon-950">
                About Section &amp; Highlights
              </h3>
              <p className="text-xs text-charcoal-700">
                Detailed venue narrative and the 3 editable highlight cards.
              </p>
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-maroon-800 hover:bg-maroon-900 text-ivory-100 rounded-xl text-xs sm:text-sm font-semibold shadow-maroon-sm transition"
            >
              <Save className="w-4 h-4 text-gold-300" />
              <span>Save About Section</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Section Heading *
              </label>
              <input
                type="text"
                required
                value={aboutData.heading}
                onChange={(e) => setAboutData({ ...aboutData, heading: e.target.value })}
                className="w-full px-4 py-3 bg-ivory-50 border border-charcoal-200 rounded-xl text-sm font-serif font-bold text-maroon-950 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Venue Description Narrative
              </label>
              <textarea
                rows={4}
                value={aboutData.description}
                onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
                className="w-full px-4 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs sm:text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            {/* Venue Image */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Venue Interior Showcase Image
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div>
                  <div className="p-4 border-2 border-dashed border-charcoal-300 rounded-2xl bg-ivory-50 text-center mb-3">
                    <input
                      type="file"
                      id="aboutVenueInput"
                      accept="image/*"
                      onChange={handleAboutUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="aboutVenueInput"
                      className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                    >
                      <UploadCloud className="w-7 h-7 text-gold-600" />
                      <span className="text-xs font-semibold text-maroon-900">
                        {uploadingAbout ? 'Uploading...' : 'Upload Interior Photo'}
                      </span>
                    </label>
                  </div>

                  <input
                    type="url"
                    placeholder="Or enter image URL"
                    value={aboutData.venue_image}
                    onChange={(e) => setAboutData({ ...aboutData, venue_image: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-charcoal-200 rounded-xl text-xs text-charcoal-900"
                  />
                </div>

                {aboutData.venue_image && (
                  <div className="rounded-2xl overflow-hidden aspect-[4/3] border border-gold-300 shadow max-h-48">
                    <img
                      src={aboutData.venue_image}
                      alt="About Venue Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 3 Highlight Cards */}
            <div className="pt-6 border-t border-charcoal-100">
              <h4 className="font-serif text-lg font-bold text-maroon-950 mb-4">
                Three Highlight Cards
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="p-4 rounded-2xl bg-ivory-50 border border-gold-200 space-y-3">
                  <span className="text-[11px] font-bold text-gold-700 uppercase tracking-wider block">
                    Card 1: Space &amp; Decor
                  </span>
                  <div>
                    <label className="block text-[11px] text-charcoal-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={aboutData.highlight_card_1_title}
                      onChange={(e) => setAboutData({ ...aboutData, highlight_card_1_title: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-charcoal-200 rounded-lg text-xs font-semibold text-maroon-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-charcoal-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={aboutData.highlight_card_1_desc}
                      onChange={(e) => setAboutData({ ...aboutData, highlight_card_1_desc: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-charcoal-200 rounded-lg text-xs text-charcoal-800 resize-none"
                    />
                  </div>
                </div>

                {/* Card 2 */}
                <div className="p-4 rounded-2xl bg-ivory-50 border border-gold-200 space-y-3">
                  <span className="text-[11px] font-bold text-gold-700 uppercase tracking-wider block">
                    Card 2: Events
                  </span>
                  <div>
                    <label className="block text-[11px] text-charcoal-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={aboutData.highlight_card_2_title}
                      onChange={(e) => setAboutData({ ...aboutData, highlight_card_2_title: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-charcoal-200 rounded-lg text-xs font-semibold text-maroon-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-charcoal-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={aboutData.highlight_card_2_desc}
                      onChange={(e) => setAboutData({ ...aboutData, highlight_card_2_desc: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-charcoal-200 rounded-lg text-xs text-charcoal-800 resize-none"
                    />
                  </div>
                </div>

                {/* Card 3 */}
                <div className="p-4 rounded-2xl bg-ivory-50 border border-gold-200 space-y-3">
                  <span className="text-[11px] font-bold text-gold-700 uppercase tracking-wider block">
                    Card 3: Hospitality Support
                  </span>
                  <div>
                    <label className="block text-[11px] text-charcoal-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={aboutData.highlight_card_3_title}
                      onChange={(e) => setAboutData({ ...aboutData, highlight_card_3_title: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-charcoal-200 rounded-lg text-xs font-semibold text-maroon-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-charcoal-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={aboutData.highlight_card_3_desc}
                      onChange={(e) => setAboutData({ ...aboutData, highlight_card_3_desc: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-charcoal-200 rounded-lg text-xs text-charcoal-800 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
