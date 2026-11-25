import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Save,
  Check,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';
import { fetchAdminWhatsApp, updateAdminWhatsApp } from '../../services/api';
import { WhatsAppSetting } from '../../types';
import { useContent } from '../../context/ContentContext';

export const WhatsAppManager: React.FC = () => {
  const { refreshContent } = useContent();
  const [hridaySetting, setHridaySetting] = useState<WhatsAppSetting | null>(null);
  const [sunshineSetting, setSunshineSetting] = useState<WhatsAppSetting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await fetchAdminWhatsApp();
        const hriday = data.find((d) => d.entity === 'hriday');
        const sunshine = data.find((d) => d.entity === 'sunshine');
        if (hriday) setHridaySetting(hriday);
        if (sunshine) setSunshineSetting(sunshine);
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
    setValidationError('');

    // Phone validation
    const validate = (num: string, label: string) => {
      if (!num || !num.trim()) return true; // allowed to be blank
      const clean = num.replace(/[^0-9]/g, '');
      if (clean.length < 10 || clean.length > 15) {
        setValidationError(`${label} must have between 10 to 15 digits including country code (e.g. 919876543210).`);
        return false;
      }
      return true;
    };

    if (hridaySetting && !validate(hridaySetting.phone_number, 'Hriday Banquet WhatsApp Number')) return;
    if (sunshineSetting && !validate(sunshineSetting.phone_number, 'Sunshine Events WhatsApp Number')) return;

    try {
      setIsSaving(true);
      await updateAdminWhatsApp({
        hriday: hridaySetting || undefined,
        sunshine: sunshineSetting || undefined,
      });

      setToastMsg('WhatsApp settings saved successfully!');
      await refreshContent();
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err: any) {
      setValidationError(err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const getPreviewUrl = (setting: WhatsAppSetting | null) => {
    if (!setting || !setting.phone_number?.trim()) return null;
    const clean = setting.phone_number.replace(/[^0-9]/g, '');
    return `https://wa.me/${clean}?text=${encodeURIComponent(setting.default_message || '')}`;
  };

  if (isLoading) {
    return <div className="py-16 text-center text-charcoal-700 text-sm">Loading WhatsApp configuration...</div>;
  }

  const hridayPreviewUrl = getPreviewUrl(hridaySetting);
  const sunshinePreviewUrl = getPreviewUrl(sunshineSetting);

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
            WhatsApp Integration Settings
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-1">
            Configure independent WhatsApp contact numbers and automated quotation messages for Hriday Banquet Hall and Sunshine Events.
          </p>
        </div>
      </div>

      {validationError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Informational Guidance Notice */}
      <div className="p-5 bg-gold-50/70 border border-gold-300 rounded-2xl text-xs text-charcoal-700 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-gold-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-maroon-950">Important Phone Number Format Tip:</p>
          <p className="text-charcoal-800 leading-relaxed">
            Enter phone numbers with country code and without plus signs, spaces, or hyphens (e.g. for India: <strong>919876543210</strong>).
            If left blank, the website displays an elegant notification informing users that the line is being connected.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Hriday Banquet Hall WhatsApp Settings */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold-200 shadow-luxury space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-charcoal-100 gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-700">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-maroon-950">
                  Hriday Banquet Hall WhatsApp Line
                </h3>
                <span className="text-[11px] text-charcoal-700">
                  Powers navbar button, hero CTA, gallery quotation prompt, and floating button.
                </span>
              </div>
            </div>

            <div>
              {hridaySetting?.phone_number ? (
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                  Active Line
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                  Unconfigured / Blank
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                WhatsApp Phone Number (with Country Code)
              </label>
              <input
                type="text"
                placeholder="e.g. 919876543210"
                value={hridaySetting?.phone_number || ''}
                onChange={(e) =>
                  setHridaySetting((prev) => (prev ? { ...prev, phone_number: e.target.value } : null))
                }
                className="w-full px-4 py-3 bg-ivory-50 border border-charcoal-200 rounded-xl text-sm font-mono text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <p className="text-[11px] text-charcoal-700 mt-1">
                Leave blank if phone number is not available yet.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Active Switch
              </label>
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hridayWaActive"
                  checked={hridaySetting?.is_active === 1}
                  onChange={(e) =>
                    setHridaySetting((prev) => (prev ? { ...prev, is_active: e.target.checked ? 1 : 0 } : null))
                  }
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="hridayWaActive" className="text-xs font-medium text-charcoal-800 cursor-pointer">
                  Enable WhatsApp CTA buttons on public website
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Default Quotation Pre-filled Message
            </label>
            <textarea
              rows={5}
              value={hridaySetting?.default_message || ''}
              onChange={(e) =>
                setHridaySetting((prev) => (prev ? { ...prev, default_message: e.target.value } : null))
              }
              className="w-full px-4 py-3 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 font-mono"
            />
          </div>

          {hridayPreviewUrl && (
            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
              <span className="font-mono text-emerald-800 truncate mr-2">
                {hridayPreviewUrl}
              </span>
              <a
                href={hridayPreviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shrink-0"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Sunshine Events & Management WhatsApp Settings */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold-200 shadow-luxury space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-charcoal-100 gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-700">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-maroon-950">
                  Sunshine Events &amp; Management WhatsApp Line
                </h3>
                <span className="text-[11px] text-charcoal-700">
                  Powers the &quot;Enquire About Digital Marketing&quot; button in the promotional block.
                </span>
              </div>
            </div>

            <div>
              {sunshineSetting?.phone_number ? (
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                  Active Line
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                  Unconfigured / Blank
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Sunshine Agency WhatsApp Number
              </label>
              <input
                type="text"
                placeholder="e.g. 919876543210"
                value={sunshineSetting?.phone_number || ''}
                onChange={(e) =>
                  setSunshineSetting((prev) => (prev ? { ...prev, phone_number: e.target.value } : null))
                }
                className="w-full px-4 py-3 bg-ivory-50 border border-charcoal-200 rounded-xl text-sm font-mono text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <p className="text-[11px] text-charcoal-700 mt-1">
                Can be same or distinct from banquet phone number.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Active Switch
              </label>
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sunshineWaActive"
                  checked={sunshineSetting?.is_active === 1}
                  onChange={(e) =>
                    setSunshineSetting((prev) => (prev ? { ...prev, is_active: e.target.checked ? 1 : 0 } : null))
                  }
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="sunshineWaActive" className="text-xs font-medium text-charcoal-800 cursor-pointer">
                  Enable WhatsApp for agency promotion
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Default Agency Pre-filled Message
            </label>
            <textarea
              rows={4}
              value={sunshineSetting?.default_message || ''}
              onChange={(e) =>
                setSunshineSetting((prev) => (prev ? { ...prev, default_message: e.target.value } : null))
              }
              className="w-full px-4 py-3 bg-ivory-50 border border-charcoal-200 rounded-xl text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 font-mono"
            />
          </div>

          {sunshinePreviewUrl && (
            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
              <span className="font-mono text-emerald-800 truncate mr-2">
                {sunshinePreviewUrl}
              </span>
              <a
                href={sunshinePreviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shrink-0"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 bg-maroon-800 hover:bg-maroon-900 text-ivory-100 font-semibold text-sm rounded-xl shadow-maroon-md transition flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-gold-300" />
            <span>{isSaving ? 'Saving Configurations...' : 'Save WhatsApp Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
