import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase';

type EventParams = Record<string, string | number | boolean | null | undefined>;

function withContext(params: EventParams = {}): EventParams {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  return {
    page_path: pathname,
    page_location: typeof window !== 'undefined' ? window.location.href : '',
    ...params
  };
}

export function trackEvent(eventName: string, params: EventParams = {}) {
  if (!analytics) {
    return;
  }

  logEvent(analytics, eventName, withContext(params));
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
