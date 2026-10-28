import test from 'node:test';
import assert from 'node:assert/strict';
import { createAnalyticsController, MEASUREMENT_ID, LEGACY_CONSENT_KEY } from '../src/analytics/analytics.js';

function fixture({ host = 'departmentofemotions.com', gpc = false } = {}) {
  const memory = new Map(), scripts = [], deleted = [];
  let writes = 0;
  const win = {
    navigator: { globalPrivacyControl: gpc },
    location: { hostname: host, origin: `https://${host}`, pathname: '/explore', search: '?emotion=anxious&email=private@example.com', hash: '#private' },
    localStorage: { getItem: k => memory.get(k) ?? null, setItem: () => { writes++; } },
  };
  const doc = { referrer: 'https://example.com/private/path?email=private@example.com', createElement: () => ({}), head: { appendChild: s => scripts.push(s) } };
  Object.defineProperty(doc, 'cookie', { get: () => '_ga=abc; _ga_TEST=def; wheel=keep', set: v => deleted.push(v) });
  const controller = createAnalyticsController(win, doc);
  const events = () => (win.dataLayer || []).map(args => Array.from(args));
  return { win, memory, scripts, deleted, controller, events, writes: () => writes };
}

test('cookieless measurement initializes once and never grants any storage', () => {
  const f = fixture();
  f.controller.start();
  f.controller.start();
  assert.equal(f.scripts.length, 1);
  assert.equal(f.scripts[0].src, `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`);
  const events = f.events();
  assert.deepEqual(events[0], ['consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }]);
  assert.equal(events.filter(e => e[0] === 'event').length, 1);
  assert.doesNotMatch(JSON.stringify(events), /granted/);
  assert.equal(f.writes(), 0);
});

test('page pings exclude emotion selections, query strings, fragments, and referrer paths', () => {
  const f = fixture();
  f.controller.start();
  const events = f.events();
  const config = events.find(e => e[0] === 'config')[2];
  assert.equal(config.page_location, 'https://departmentofemotions.com/explore');
  assert.equal(config.page_referrer, 'https://example.com');
  assert.equal(config.allow_google_signals, false);
  assert.equal(config.allow_ad_personalization_signals, false);
  assert.equal(config.send_page_view, false);
  assert.doesNotMatch(JSON.stringify(events), /private|anxious|email=/);
});

test('old Analytics cookies are removed while appearance preferences are retained', () => {
  const f = fixture();
  f.controller.start();
  assert.ok(f.deleted.some(x => x.startsWith('_ga=')));
  assert.ok(f.deleted.some(x => x.startsWith('_ga_TEST=')));
  assert.ok(f.deleted.every(x => /Max-Age=0/.test(x) && !x.startsWith('wheel=')));
});

test('Global Privacy Control and previously saved refusals block all Google loading', () => {
  const gpc = fixture({ gpc: true });
  gpc.controller.start();
  assert.equal(gpc.scripts.length, 0);
  assert.equal(gpc.win[`ga-disable-${MEASUREMENT_ID}`], true);
  const declined = fixture();
  declined.memory.set(LEGACY_CONSENT_KEY, JSON.stringify({ value: 'denied', at: 1 }));
  declined.controller.start();
  assert.equal(declined.scripts.length, 0);
});

test('local previews and GitHub Pages do not load the Google tag', () => {
  for (const host of ['localhost', '127.0.0.1', 'juleshaggard.github.io']) {
    const f = fixture({ host });
    f.controller.start();
    assert.equal(f.scripts.length, 0);
  }
});

test('old opt-ins and unavailable storage cannot enable cookie-based tracking', () => {
  for (const saved of [JSON.stringify({ value: 'granted', at: Date.now() }), 'broken']) {
    const f = fixture();
    f.memory.set(LEGACY_CONSENT_KEY, saved);
    f.controller.start();
    assert.doesNotMatch(JSON.stringify(f.events()), /granted/);
  }
  const f = fixture();
  f.win.localStorage.getItem = () => { throw Error('blocked'); };
  assert.doesNotThrow(() => f.controller.start());
  assert.equal(f.events()[0][2].analytics_storage, 'denied');
});
