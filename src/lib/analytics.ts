import posthog from 'posthog-js';

let inited = false;

/** Initialise PostHog if a project key is configured (VITE_POSTHOG_KEY). No-op otherwise. */
export function initAnalytics() {
  if (inited) return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY as string | undefined;
  const host = (process.env.NEXT_PUBLIC_POSTHOG_HOST as string | undefined) || 'https://us.i.posthog.com';
  if (!key) return;
  posthog.init(key, {
    api_host: host,
    capture_pageview: false, // SPA — we send pageviews manually on route change
    autocapture: true, // captures clicks/inputs automatically (covers most CTAs)
    capture_pageleave: true,
    persistence: 'localStorage+cookie',
  });
  inited = true;
}

export function track(event: string, props?: Record<string, unknown>) {
  if (!inited) return;
  try { posthog.capture(event, props); } catch { /* noop */ }
}

export function trackPageview(path: string) {
  if (!inited) return;
  try { posthog.capture('$pageview', { path }); } catch { /* noop */ }
}

export { posthog };
