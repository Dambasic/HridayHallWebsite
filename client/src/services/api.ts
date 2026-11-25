import {
  WebsiteContent,
  WebsiteSettings,
  AboutContent,
  ServiceItem,
  ServiceGalleryImage,
  ServiceInstagramMedia,
  CelebrationItem,
  GalleryImage,
  SocialLink,
  WhatsAppSetting,
  ContactInformation,
  SunshineAgency,
  SunshineService,
  Enquiry,
  DashboardMetrics,
  AdminUser,
} from '../types';

const rawApiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim().replace(/\/+$/, '');
const API_BASE = rawApiUrl ? (rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`) : '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('hriday_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMsg = 'An unexpected error occurred';
    try {
      const errData = await response.json();
      errorMsg = errData.error || errData.message || errorMsg;
    } catch {
      // response wasn't json
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

// ==========================================
// PUBLIC API
// ==========================================
export async function fetchPublicContent(): Promise<WebsiteContent> {
  const res = await fetch(`${API_BASE}/public/content`);
  return handleResponse<WebsiteContent>(res);
}

export async function fetchServiceBySlug(slug: string): Promise<ServiceItem> {
  const res = await fetch(`${API_BASE}/public/services/${encodeURIComponent(slug)}`);
  return handleResponse<ServiceItem>(res);
}

export async function fetchPublicCelebrations(featuredOnly = false): Promise<CelebrationItem[]> {
  const res = await fetch(`${API_BASE}/public/celebrations${featuredOnly ? '?featured=1' : ''}`);
  return handleResponse<CelebrationItem[]>(res);
}

export async function submitQuotationEnquiry(data: Partial<Enquiry>): Promise<{ success: boolean; message: string; enquiry_id: string }> {
  const res = await fetch(`${API_BASE}/public/enquiry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// ==========================================
// AUTH API
// ==========================================
export async function loginAdmin(username: string, password: string): Promise<{ token: string; user: AdminUser }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(res);
}

export async function fetchAdminProfile(): Promise<AdminUser> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { ...getAuthHeader() },
  });
  return handleResponse<AdminUser>(res);
}

export async function changeAdminPassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return handleResponse(res);
}

// ==========================================
// ADMIN DASHBOARD & CMS APIS
// ==========================================
export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const res = await fetch(`${API_BASE}/admin/dashboard`, {
    headers: { ...getAuthHeader() },
  });
  return handleResponse<DashboardMetrics>(res);
}

export async function uploadImageFile(file: File): Promise<{ success: boolean; url: string; filename: string }> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_BASE}/admin/upload`, {
    method: 'POST',
    headers: { ...getAuthHeader() },
    body: formData,
  });
  return handleResponse(res);
}

// Settings
export async function fetchAdminSettings(): Promise<WebsiteSettings> {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    headers: { ...getAuthHeader() },
  });
  return handleResponse<WebsiteSettings>(res);
}

export async function updateAdminSettings(settings: Partial<WebsiteSettings>): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(settings),
  });
  return handleResponse(res);
}

// About
export async function fetchAdminAbout(): Promise<AboutContent> {
  const res = await fetch(`${API_BASE}/admin/about`, {
    headers: { ...getAuthHeader() },
  });
  return handleResponse<AboutContent>(res);
}

export async function updateAdminAbout(about: Partial<AboutContent>): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/admin/about`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(about),
  });
  return handleResponse(res);
}

// Services
export async function fetchAdminServices(): Promise<ServiceItem[]> {
  const res = await fetch(`${API_BASE}/admin/services`, {
    headers: { ...getAuthHeader() },
  });
  return handleResponse<ServiceItem[]>(res);
}

export async function createAdminService(service: Partial<ServiceItem>): Promise<{ success: boolean; id: string }> {
  const res = await fetch(`${API_BASE}/admin/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(service),
  });
  return handleResponse(res);
}

export async function updateAdminService(id: string, service: Partial<ServiceItem>): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/admin/services/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(service),
  });
  return handleResponse(res);
}

export async function deleteAdminService(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/admin/services/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  return handleResponse(res);
}

export async function fetchAdminServiceDetails(id: string): Promise<ServiceItem> {
  const res = await fetch(`${API_BASE}/admin/services/${id}`, {
    headers: { ...getAuthHeader() },
  });
  return handleResponse<ServiceItem>(res);
}

export async function fetchServiceGallery(serviceId: string): Promise<ServiceGalleryImage[]> {
  const res = await fetch(`${API_BASE}/admin/services/${serviceId}/gallery`, {
    headers: { ...getAuthHeader() },
  });
  return handleResponse<ServiceGalleryImage[]>(res);
}

export async function addServiceGalleryImage(serviceId: string, data: { image_url: string; caption?: string; display_order?: number }): Promise<{ success: boolean; id: string }> {
  const res = await fetch(`${API_BASE}/admin/services/${serviceId}/gallery`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteServiceGalleryImage(galleryId: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/admin/services/gallery/${galleryId}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  return handleResponse(res);
}

export async function fetchServiceInstagramMedia(serviceId: string): Promise<ServiceInstagramMedia[]> {
  const res = await fetch(`${API_BASE}/admin/services/${serviceId}/instagram`, {
    headers: { ...getAuthHeader() },
  });
  return handleResponse<ServiceInstagramMedia[]>(res);
}

export async function addServiceInstagramMedia(serviceId: string, data: { instagram_url: string; cover_image?: string; media_type?: string; title?: string; caption?: string; display_order?: number }): Promise<{ success: boolean; id: string }> {
  const res = await fetch(`${API_BASE}/admin/services/${serviceId}/instagram`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateServiceInstagramMedia(mediaId: string, data: { instagram_url?: string; cover_image?: string; media_type?: string; title?: string; caption?: string; display_order?: number }): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/admin/services/instagram/${mediaId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteServiceInstagramMedia(mediaId: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/admin/services/instagram/${mediaId}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  return handleResponse(res);
}

// Celebrations Manager APIs
export async function fetchAdminCelebrations(): Promise<CelebrationItem[]> {
  const res = await fetch(`${API_BASE}/admin/celebrations`, {
    headers: { ...getAuthHeader() },
  });
  return handleResponse<CelebrationItem[]>(res);
}

export async function createAdminCelebration(data: Partial<CelebrationItem>): Promise<{ success: boolean; id: string }> {
  const res = await fetch(`${API_BASE}/admin/celebrations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateAdminCelebration(id: string, data: Partial<CelebrationItem>): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/admin/celebrations/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function toggleCelebrationFeatured(id: string, is_featured: boolean): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/admin/celebrations/${id}/toggle-featured`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ is_featured }),
  });
  return handleResponse(res);
}

export async function updateCelebrationFeaturedOrder(id: string, featured_order: number): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/admin/celebrations/${id}/featured-order`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ featured_order }),
  });
  return handleResponse(res);
}

export async function deleteAdminCelebration(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/admin/celebrations/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  return handleResponse(res);
}

// Gallery
export async function fetchAdminGallery(): Promise<GalleryImage[]> {
  const res = await fetch(`${API_BASE}/admin/gallery`, {
    headers: { ...getAuthHeader() },
  });
  return handleResponse<GalleryImage[]>(res);
}

export async function createAdminGalleryImage(data: Partial<GalleryImage>): Promise<{ success: boolean; id: string }> {
  const res = await fetch(`${API_BASE}/admin/gallery`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateAdminGalleryImage(id: string, data: Partial<GalleryImage>): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/admin/gallery/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteAdminGalleryImage(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/admin/gallery/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  return handleResponse(res);
}

export async function toggleGalleryActive(id: string): Promise<{ success: boolean; is_active: number }> {
  const res = await fetch(`${API_BASE}/admin/gallery/${id}/toggle-active`, {
    method: 'PATCH',
    headers: { ...getAuthHeader() },
  });
  return handleResponse(res);
}

export async function toggleGalleryFeatured(id: string): Promise<{ success: boolean; is_featured: number }> {
  const res = await fetch(`${API_BASE}/admin/gallery/${id}/toggle-featured`, {
    method: 'PATCH',
    headers: { ...getAuthHeader() },
  });
  return handleResponse(res);
}

// Social Links
export async function fetchAdminSocial(): Promise<SocialLink[]> {
  const res = await fetch(`${API_BASE}/admin/social`, {
    headers: { ...getAuthHeader() },
  });
  return handleResponse<SocialLink[]>(res);
}

export async function updateAdminSocial(links: SocialLink[]): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/admin/social`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ links }),
  });
  return handleResponse(res);
}

// WhatsApp Settings
export async function fetchAdminWhatsApp(): Promise<WhatsAppSetting[]> {
  const res = await fetch(`${API_BASE}/admin/whatsapp`, {
    headers: { ...getAuthHeader() },
  });
  return handleResponse<WhatsAppSetting[]>(res);
}

export async function updateAdminWhatsApp(payload: {
  hriday?: Partial<WhatsAppSetting>;
  sunshine?: Partial<WhatsAppSetting>;
}): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/admin/whatsapp`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// Contact
export async function fetchAdminContact(): Promise<ContactInformation> {
  const res = await fetch(`${API_BASE}/admin/contact`, {
    headers: { ...getAuthHeader() },
  });
  return handleResponse<ContactInformation>(res);
}

export async function updateAdminContact(contact: Partial<ContactInformation>): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/admin/contact`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(contact),
  });
  return handleResponse(res);
}

// Sunshine Agency
export async function fetchAdminSunshine(): Promise<{ agency: SunshineAgency; services: SunshineService[] }> {
  const res = await fetch(`${API_BASE}/admin/sunshine`, {
    headers: { ...getAuthHeader() },
  });
  return handleResponse(res);
}

export async function updateAdminSunshineAgency(agency: Partial<SunshineAgency>): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/admin/sunshine`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(agency),
  });
  return handleResponse(res);
}

export async function createSunshineService(service: Partial<SunshineService>): Promise<{ success: boolean; id: string }> {
  const res = await fetch(`${API_BASE}/admin/sunshine/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(service),
  });
  return handleResponse(res);
}

export async function updateSunshineService(id: string, service: Partial<SunshineService>): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/admin/sunshine/services/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(service),
  });
  return handleResponse(res);
}

export async function deleteSunshineService(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/admin/sunshine/services/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  return handleResponse(res);
}

// Enquiries
export async function fetchAdminEnquiries(): Promise<Enquiry[]> {
  const res = await fetch(`${API_BASE}/admin/enquiries`, {
    headers: { ...getAuthHeader() },
  });
  return handleResponse<Enquiry[]>(res);
}

export async function updateEnquiryStatus(id: string, status: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/admin/enquiries/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}

export async function deleteEnquiry(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/admin/enquiries/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  return handleResponse(res);
}
