import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageCircle, Calendar, Users, HeartHandshake } from 'lucide-react';
import { submitQuotationEnquiry } from '../services/api';
import { useContent } from '../context/ContentContext';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, onClose, initialService }) => {
  const { getHridayWhatsAppUrl, getHridayWhatsAppNumber } = useContent();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    event_type: initialService || 'Wedding Functions',
    event_date: '',
    guest_count: '100 - 250 Guests',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMessage('Please provide your name and phone number');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      await submitQuotationEnquiry(formData);
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      event_type: 'Wedding Functions',
      event_date: '',
      guest_count: '100 - 250 Guests',
      message: '',
    });
    onClose();
  };

  const hasWhatsApp = Boolean(getHridayWhatsAppNumber());
  const customWhatsAppMsg = `Hello Hriday Banquet Hall,

I submitted a quotation enquiry:
- Name: ${formData.name}
- Phone: ${formData.phone}
- Event Type: ${formData.event_type}
- Event Date: ${formData.event_date || 'TBD'}
- Guests: ${formData.guest_count}
- Message: ${formData.message || 'Please share packages & availability'}

Thank you!`;

  const waUrl = getHridayWhatsAppUrl(customWhatsAppMsg);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-gold-200 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-charcoal-800">
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 text-charcoal-700 hover:text-charcoal-950 transition rounded-full hover:bg-ivory-200"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="font-serif text-3xl font-bold text-maroon-900 mb-2">
              Quotation Request Received!
            </h3>
            <p className="text-sm text-charcoal-800 mb-6 leading-relaxed max-w-sm mx-auto">
              Thank you, <strong>{formData.name}</strong>. Our banquet reservations desk will review your requirements for <strong>{formData.event_type}</strong> and contact you promptly.
            </p>

            {hasWhatsApp && waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mb-3 py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition shadow-md flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Forward to WhatsApp Directly
              </a>
            )}

            <button
              onClick={handleReset}
              className="w-full py-3 px-5 border border-charcoal-300 hover:bg-ivory-100 text-charcoal-700 text-sm font-medium rounded-xl transition"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-100/70 border border-gold-300 text-maroon-900 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                <HeartHandshake className="w-3.5 h-3.5 text-gold-700" />
                Event Quotation
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-maroon-950">
                Plan Your Event at Hriday Banquet
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-700 mt-1">
                Fill in your celebration details to receive personalized package options and pricing.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Event Type
                  </label>
                  <select
                    value={formData.event_type}
                    onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition"
                  >
                    <option value="Wedding Functions">Wedding Functions</option>
                    <option value="Engagement Ceremonies">Engagement Ceremonies</option>
                    <option value="Birthday Celebrations">Birthday Celebrations</option>
                    <option value="Anniversary Celebrations">Anniversary Celebrations</option>
                    <option value="Corporate Events">Corporate Events</option>
                    <option value="Family Gatherings">Family Gatherings</option>
                    <option value="Private Celebrations">Private Celebrations</option>
                    <option value="Event Arrangements">Event Arrangements</option>
                    <option value="Other Celebrations">Other Celebrations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Guest Count
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-charcoal-600 absolute left-3 top-3 pointer-events-none" />
                    <select
                      value={formData.guest_count}
                      onChange={(e) => setFormData({ ...formData, guest_count: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition"
                    >
                      <option value="50 - 100 Guests">50 – 100 Guests</option>
                      <option value="100 - 250 Guests">100 – 250 Guests</option>
                      <option value="250 - 500 Guests">250 – 500 Guests</option>
                      <option value="500+ Guests">500+ Guests</option>
                      <option value="Not Confirmed Yet">Not Confirmed Yet</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Tentative Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-charcoal-600 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="date"
                      value={formData.event_date}
                      onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Specific Requirements / Message
                </label>
                <textarea
                  rows={3}
                  placeholder="Share details like catering preferences, timing, decor requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-charcoal-200 rounded-xl text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-[#650A25] to-[#390014] hover:from-[#8B1538] hover:to-[#4A071D] text-gold-100 font-bold rounded-xl transition shadow-maroon-md flex items-center justify-center gap-2 disabled:opacity-50 border border-gold-400/50 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-gold-300" />
                  {isSubmitting ? 'Sending Enquiry...' : 'Submit Quotation Request'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
