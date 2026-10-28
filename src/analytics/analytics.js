export const MEASUREMENT_ID = 'G-PDGYB10MNQ';
export const LEGACY_CONSENT_KEY = 'doe-analytics-consent-v1';
const HOSTS = new Set(['departmentofemotions.com', 'www.departmentofemotions.com']);

export function createAnalyticsController(win, doc) {
  let started = false;
  function previouslyDeclined() {
    try { return JSON.parse(win.localStorage.getItem(LEGACY_CONSENT_KEY))?.value === 'denied'; }
    catch { return false; }
  }
  function clearLegacyCookies() {
    for (const cookie of doc.cookie.split(';')) {
      const name = cookie.trim().split('=')[0];
      if (!/^_ga(?:_|$)/.test(name)) continue;
      for (const domain of ['', win.location.hostname, '.departmentofemotions.com']) {
        doc.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ''} SameSite=Lax; Secure`;
      }
    }
  }
  function start() {
    if (!HOSTS.has(win.location.hostname)) return;
    clearLegacyCookies();
    const blocked = win.navigator.globalPrivacyControl === true || previouslyDeclined();
    win[`ga-disable-${MEASUREMENT_ID}`] = blocked;
    if (blocked || started) return;
    started = true;
    win.dataLayer = win.dataLayer || [];
    win.gtag = function () { win.dataLayer.push(arguments); };
    // Storage stays denied permanently. The Google tag sends only the limited
    // cookieless measurements supported by advanced consent mode.
    win.gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied',
    });
    win.gtag('set', 'ads_data_redaction', true);
    win.gtag('set', 'url_passthrough', false);
    win.gtag('js', new Date());
    const path = /^\/explore\/?$/.test(win.location.pathname) ? '/explore' : '/';
    let referrer = '';
    try { referrer = new URL(doc.referrer).origin; } catch { /* No referrer. */ }
    const page = { page_location: win.location.origin + path, page_referrer: referrer, page_title: 'Department of Emotions' };
    win.gtag('config', MEASUREMENT_ID, {
      ...page, send_page_view: false, allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    win.gtag('event', 'page_view', { ...page, send_to: MEASUREMENT_ID });
    const script = doc.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    doc.head.appendChild(script);
  }
  return { start };
}

let controller;
export function getAnalyticsController() {
  return controller ||= createAnalyticsController(window, document);
}
