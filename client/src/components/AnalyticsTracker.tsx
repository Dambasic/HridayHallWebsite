import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, pingSession } from '../services/analytics';

export const AnalyticsTracker: React.FC = () => {
  const location = useLocation();
  const lastPathRef = useRef<string>('');

  useEffect(() => {
    // Only track when path changes
    if (location.pathname !== lastPathRef.current) {
      lastPathRef.current = location.pathname;
      const timeoutId = setTimeout(() => {
        trackPageView(location.pathname, document.title);
      }, 150);
      return () => clearTimeout(timeoutId);
    }
  }, [location.pathname]);

  useEffect(() => {
    // Immediate heartbeat ping on initial visit
    pingSession();

    // Heartbeat every 40 seconds to maintain active user status
    const interval = setInterval(() => {
      pingSession();
    }, 40000);

    return () => clearInterval(interval);
  }, []);

  return null;
};
