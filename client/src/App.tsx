import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ContentProvider } from './context/ContentContext';
import { HomePage } from './pages/HomePage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { DashboardOverview } from './pages/admin/DashboardOverview';
import { CelebrationsManager } from './pages/admin/CelebrationsManager';
import { GalleryManager } from './pages/admin/GalleryManager';
import { ServicesManager } from './pages/admin/ServicesManager';
import { ContentManager } from './pages/admin/ContentManager';
import { WhatsAppManager } from './pages/admin/WhatsAppManager';
import { SunshineManager } from './pages/admin/SunshineManager';
import { ContactManager } from './pages/admin/ContactManager';
import { SocialMediaManager } from './pages/admin/SocialMediaManager';
import { EnquiriesManager } from './pages/admin/EnquiriesManager';
import { GeneralSettings } from './pages/admin/GeneralSettings';
import { AnalyticsTracker } from './components/AnalyticsTracker';

export function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <BrowserRouter>
          <AnalyticsTracker />
          <Routes>
            {/* Public Website */}
            <Route path="/" element={<HomePage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />

            {/* Admin Authentication */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Secure Admin Dashboard & CMS */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardOverview />} />
              <Route path="celebrations" element={<CelebrationsManager />} />
              <Route path="services" element={<ServicesManager />} />
              <Route path="gallery" element={<GalleryManager />} />
              <Route path="content" element={<ContentManager />} />
              <Route path="whatsapp" element={<WhatsAppManager />} />
              <Route path="sunshine" element={<SunshineManager />} />
              <Route path="contact" element={<ContactManager />} />
              <Route path="social" element={<SocialMediaManager />} />
              <Route path="enquiries" element={<EnquiriesManager />} />
              <Route path="settings" element={<GeneralSettings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;
