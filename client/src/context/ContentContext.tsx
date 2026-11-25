import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WebsiteContent, CelebrationItem } from '../types';
import { fetchPublicContent } from '../services/api';

interface ContentContextType {
  content: WebsiteContent | null;
  celebrations: CelebrationItem[];
  featuredCelebrations: CelebrationItem[];
  isLoading: boolean;
  error: string | null;
  refreshContent: () => Promise<void>;
  getHridayWhatsAppNumber: () => string;
  getSunshineWhatsAppNumber: () => string;
  getHridayWhatsAppUrl: (customMessage?: string) => string | null;
  getSunshineWhatsAppUrl: (customMessage?: string) => string | null;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadContent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchPublicContent();
      setContent(data);
    } catch (err: any) {
      console.error('Failed to load website content:', err);
      setError(err.message || 'Failed to load content');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const getHridayWhatsAppNumber = useCallback(() => {
    const wa = content?.whatsapp?.find((w) => w.entity === 'hriday');
    return wa?.phone_number?.trim() || '';
  }, [content]);

  const getSunshineWhatsAppNumber = useCallback(() => {
    const wa = content?.whatsapp?.find((w) => w.entity === 'sunshine');
    return wa?.phone_number?.trim() || '';
  }, [content]);

  const getHridayWhatsAppUrl = useCallback(
    (customMessage?: string) => {
      const wa = content?.whatsapp?.find((w) => w.entity === 'hriday');
      const number = wa?.phone_number?.trim();
      if (!number) return null;

      const cleanNum = number.replace(/[^0-9]/g, '');
      const msg = customMessage || wa?.default_message || 'Hello Hriday Banquet Hall, I would like to get a quotation.';
      return `https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`;
    },
    [content]
  );

  const getSunshineWhatsAppUrl = useCallback(
    (customMessage?: string) => {
      const wa = content?.whatsapp?.find((w) => w.entity === 'sunshine');
      const number = wa?.phone_number?.trim();
      if (!number) return null;

      const cleanNum = number.replace(/[^0-9]/g, '');
      const msg = customMessage || wa?.default_message || 'Hello Sunshine Events, I would like to enquire about your services.';
      return `https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`;
    },
    [content]
  );

  return (
    <ContentContext.Provider
      value={{
        content,
        celebrations: content?.celebrations || [],
        featuredCelebrations: content?.featured_celebrations || [],
        isLoading,
        error,
        refreshContent: loadContent,
        getHridayWhatsAppNumber,
        getSunshineWhatsAppNumber,
        getHridayWhatsAppUrl,
        getSunshineWhatsAppUrl,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
