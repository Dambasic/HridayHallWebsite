import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Phone,
  Mail,
  Calendar,
  Users,
  MessageSquare,
  Trash2,
  CheckCircle2,
  Clock,
  Filter,
} from 'lucide-react';
import { fetchAdminEnquiries, updateEnquiryStatus, deleteEnquiry } from '../../services/api';
import { Enquiry } from '../../types';

export const EnquiriesManager: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [toastMsg, setToastMsg] = useState('');

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAdminEnquiries();
      setEnquiries(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateEnquiryStatus(id, newStatus);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete quotation request from "${name}"?`)) return;
    try {
      await deleteEnquiry(id);
      setToastMsg('Enquiry record deleted.');
      await loadData();
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete enquiry');
    }
  };

  const filtered =
    filterStatus === 'all'
      ? enquiries
      : enquiries.filter((e) => e.status === filterStatus);

  if (isLoading) {
    return <div className="py-16 text-center text-charcoal-700 text-sm font-medium">Loading quotation enquiries...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm rounded-2xl flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-charcoal-200">
        <div>
          <h1 className="font-serif text-3xl font-bold text-maroon-950">
            Customer Quotation Enquiries
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-1">
            Real event quotation requests received directly from prospective customers visiting your website.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-charcoal-700 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {['all', 'new', 'contacted', 'quoted', 'closed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider transition ${
                filterStatus === status
                  ? 'bg-maroon-900 text-gold-200 font-bold shadow-xs'
                  : 'bg-white text-charcoal-600 border border-charcoal-200 hover:bg-gold-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-charcoal-200 p-8">
          <Inbox className="w-12 h-12 text-charcoal-500 mx-auto mb-3" />
          <p className="text-charcoal-700 font-medium">No enquiries matching status &quot;{filterStatus}&quot;.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((enq) => (
            <div
              key={enq.id}
              className={`bg-white rounded-3xl p-6 border transition shadow-sm hover:shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${
                enq.status === 'new' ? 'border-gold-400 bg-gold-50/20' : 'border-charcoal-200'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-serif text-xl font-bold text-maroon-950">
                    {enq.name}
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      enq.status === 'new'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : enq.status === 'contacted'
                        ? 'bg-amber-100 text-amber-800'
                        : enq.status === 'quoted'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {enq.status}
                  </span>
                  <span className="text-xs text-charcoal-700 font-semibold font-mono">
                    {new Date(enq.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal-800 pt-1">
                  <a
                    href={`tel:${enq.phone}`}
                    className="flex items-center gap-1.5 font-semibold text-maroon-900 hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5 text-gold-700" />
                    <span>{enq.phone}</span>
                  </a>

                  {enq.email && (
                    <a
                      href={`mailto:${enq.email}`}
                      className="flex items-center gap-1.5 text-charcoal-800 hover:underline"
                    >
                      <Mail className="w-3.5 h-3.5 text-charcoal-600" />
                      <span>{enq.email}</span>
                    </a>
                  )}

                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-ivory-100 rounded-md border border-charcoal-200 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-maroon-800" />
                    <span>{enq.event_type}</span>
                  </span>

                  {enq.event_date && (
                    <span className="flex items-center gap-1 text-charcoal-800">
                      <Clock className="w-3.5 h-3.5 text-charcoal-600" />
                      Date: {enq.event_date}
                    </span>
                  )}

                  {enq.guest_count && (
                    <span className="flex items-center gap-1 text-charcoal-800">
                      <Users className="w-3.5 h-3.5 text-charcoal-600" />
                      {enq.guest_count}
                    </span>
                  )}
                </div>

                {enq.message && (
                  <p className="text-xs text-charcoal-800 bg-ivory-50 p-3 rounded-xl border border-charcoal-200 mt-2">
                    &quot;{enq.message}&quot;
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2.5 pt-4 lg:pt-0 border-t lg:border-t-0 border-charcoal-100">
                <a
                  href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello ${enq.name}, thank you for contacting Hriday Banquet Hall regarding your ${enq.event_type}. Here are the details and packages:`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Reply on WhatsApp</span>
                </a>

                <select
                  value={enq.status}
                  onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                  className="px-3 py-1.5 bg-white border border-charcoal-300 rounded-xl text-xs font-medium text-charcoal-800"
                >
                  <option value="new">Mark New</option>
                  <option value="contacted">Mark Contacted</option>
                  <option value="quoted">Mark Quoted</option>
                  <option value="closed">Mark Closed</option>
                </select>

                <button
                  onClick={() => handleDelete(enq.id, enq.name)}
                  className="p-2 text-charcoal-600 hover:text-rose-700 rounded-xl hover:bg-rose-50 transition"
                  title="Delete Enquiry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
