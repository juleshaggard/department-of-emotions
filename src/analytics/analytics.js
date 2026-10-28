export const MEASUREMENT_ID = 'G-PDGYB10MNQ';
export const CONSENT_KEY = 'doe-analytics-consent-v1';
const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
const HOSTS = new Set(['departmentofemotions.com', 'www.departmentofemotions.com']);

export function createAnalyticsController(win, doc, now = Date.now) {
  let started = false;
  const blocked = () => win.navigator.globalPrivacyControl === true;
  function readChoice() {
    if (blocked()) return 'denied';
    try {
      const saved = JSON.parse(win.localStorage.getItem(CONSENT_KEY));
      if (saved && ['granted', 'denied'].includes(saved.value) && saved.at <= now() && now() - saved.at < MAX_AGE) return saved.value;
    } catch { /* Storage can be unavailable. Consent then lasts for this visit. */ }
    return null;
  }
  function clearCookies() {
    for (const cookie of doc.cookie.split(';')) {
      const name = cookie.trim().split('=')[0];
      if (!/^_ga(?:_|$)/.test(name)) continue;
      for (const domain of ['', win.location.hostname, '.departmentofemotions.com']) {
        doc.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ''} SameSite=Lax; Secure`;
      }
    }
  }
  function apply(value) {
    const granted = value === 'granted' && !blocked();
    win[`ga-disable-${MEASUREMENT_ID}`] = !granted;
    if (!granted) {
      clearCookies();
      if (started) win.gtag('consent', 'update', { analytics_storage: 'denied' });
      return;
    }
    if (!HOSTS.has(win.location.hostname)) return;
    if (started) {
      win.gtag('consent', 'update', { analytics_storage: 'granted' });
      return;
    }
    started = true;
    win.dataLayer = win.dataLayer || [];
    win.gtag = function () { win.dataLayer.push(arguments); };
    win.gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied',
    });
    win.gtag('consent', 'update', { analytics_storage: 'granted' });
    win.gtag('js', new Date(now()));
    // Only known page paths leave the browser; no query strings, fragments,
    // emotion selections, custom user IDs, or third-party referrer paths.
    const path = /^\/explore\/?$/.test(win.location.pathname) ? '/explore' : '/';
    let referrer = '';
    try { referrer = new URL(doc.referrer).origin; } catch { /* No referrer. */ }
    const page = { page_location: win.location.origin + path, page_referrer: referrer, page_title: 'Department of Emotions' };
    win.gtag('config', MEASUREMENT_ID, {
      ...page, send_page_view: false, allow_google_signals: false,
      allow_ad_personalization_signals: false, cookie_expires: MAX_AGE / 1000,
      cookie_update: false,
    });
    win.gtag('event', 'page_view', { ...page, send_to: MEASUREMENT_ID });
    const script = doc.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    doc.head.appendChild(script);
  }
  function choose(value) {
    const effective = value === 'granted' && !blocked() ? 'granted' : 'denied';
    try { win.localStorage.setItem(CONSENT_KEY, JSON.stringify({ value: effective, at: now() })); } catch { /* Keep the current visit usable without storage. */ }
    apply(effective);
    return effective;
  }
  return { readChoice, apply, choose, blocked };
}

let controller;
export function getAnalyticsController() {
  return controller ||= createAnalyticsController(window, document);
}
