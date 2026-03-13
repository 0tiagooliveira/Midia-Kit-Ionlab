import { logEvent, setUserProperties } from 'firebase/analytics';
import { analytics } from '../firebase';

type EventParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function withContext(params: EventParams = {}): EventParams {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  return {
    page_path: pathname,
    page_location: typeof window !== 'undefined' ? window.location.href : '',
    ...params
  };
}

function sendGtagEvent(eventName: string, params: EventParams) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return false;
  }

  window.gtag('event', eventName, params);
  return true;
}

export function trackEvent(eventName: string, params: EventParams = {}) {
  const payload = withContext(params);

  if (sendGtagEvent(eventName, payload)) {
    return;
  }

  if (!analytics) {
    return;
  }

  logEvent(analytics, eventName, payload);
}

export function trackPageView(pagePath: string, pageTitle: string) {
  trackEvent('page_view', {
    page_path: pagePath,
    page_location: typeof window !== 'undefined' ? window.location.href : '',
    page_title: pageTitle,
    language: 'pt-br'
  });
}

export function setAnalyticsUserProps(properties: EventParams) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('set', 'user_properties', properties);
  }

  if (analytics) {
    setUserProperties(analytics, properties);
  }
}

export function trackNavigationClick(params: {
  source: string;
  label: string;
  destination: string;
  linkType: 'internal' | 'external';
}) {
  trackEvent('navigation_click', {
    click_source: params.source,
    click_label: params.label,
    destination_url: params.destination,
    link_type: params.linkType
  });
}

export function trackCatalogClick(params: {
  source: string;
  destination: string;
  mode: 'manual' | 'automatic';
}) {
  trackEvent('catalog_click', {
    click_source: params.source,
    destination_url: params.destination,
    redirect_mode: params.mode
  });
}

export function trackVideoOpen(params: {
  title: string;
  category: string;
  format: 'horizontal' | 'vertical';
  videoId?: string;
}) {
  trackEvent('video_open', {
    video_title: params.title,
    video_category: params.category,
    video_format: params.format,
    video_id: params.videoId || ''
  });
}

export function trackPhotoDownload(params: {
  title: string;
  category: string;
  model?: string;
  imageCount: number;
}) {
  trackEvent('photo_download', {
    photo_title: params.title,
    photo_category: params.category,
    photo_model: params.model || '',
    image_count: params.imageCount
  });
}
