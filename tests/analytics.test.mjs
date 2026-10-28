import test from 'node:test';
import assert from 'node:assert/strict';
import { createAnalyticsController, MEASUREMENT_ID, CONSENT_KEY } from '../src/analytics/analytics.js';

function fixture({ host = 'departmentofemotions.com', gpc = false } = {}) {
  const memory = new Map(), scripts = [], deleted = [];
  const win = {
    navigator: { globalPrivacyControl: gpc },
    location: { hostname: host, origin: `https://${host}`, pathname: '/explore', search: '?emotion=anxious&email=private@example.com', hash: '#private' },
    localStorage: { getItem: k => memory.get(k) ?? null, setItem: (k, v) => memory.set(k, v) },
  };
  const doc = { referrer: 'https://example.com/private/path?email=private@example.com', createElement: () => ({}), head: { appendChild: s => scripts.push(s) } };
  Object.defineProperty(doc, 'cookie', { get: () => '_ga=abc; _ga_TEST=def; wheel=keep', set: v => deleted.push(v) });
  const controller = createAnalyticsController(win, doc, () => 1800000000000);
  const events = () => (win.dataLayer || []).map(args => Array.from(args));
  return { win, memory, scripts, deleted, controller, events };
}

test('no Google script or events are sent before opt-in or after decline', () => {
  const f = fixture();
  f.controller.apply(null);
  f.controller.choose('denied');
  assert.equal(f.scripts.length, 0);
  assert.deepEqual(f.events(), []);
  assert.equal(f.win[`ga-disable-${MEASUREMENT_ID}`], true);
});

test('opt-in initializes once, with denied advertising and sanitized page data', () => {
  const f = fixture();
  f.controller.choose('granted');
  f.controller.apply('granted');
  assert.equal(f.scripts.length, 1);
  assert.equal(f.scripts[0].src, `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`);
  const events = f.events();
  assert.equal(events.filter(e => e[0] === 'event' && e[1] === 'page_view').length, 1);
  assert.equal(events[0][2].ad_user_data, 'denied');
  assert.equal(events[0][2].ad_personalization, 'denied');
  const config = events.find(e => e[0] === 'config')[2];
  assert.equal(config.page_location, 'https://departmentofemotions.com/explore');
  assert.equal(config.page_referrer, 'https://example.com');
  assert.equal(config.allow_google_signals, false);
  assert.equal(config.allow_ad_personalization_signals, false);
  assert.equal(config.send_page_view, false);
  assert.doesNotMatch(JSON.stringify(events), /private|anxious|email=/);
});

test('revoking consent disables measurement and removes only Analytics cookies', () => {
  const f = fixture();
  f.controller.choose('granted');
  f.controller.choose('denied');
  assert.equal(f.win[`ga-disable-${MEASUREMENT_ID}`], true);
  assert.ok(f.deleted.some(x => x.startsWith('_ga=')));
  assert.ok(f.deleted.some(x => x.startsWith('_ga_TEST=')));
  assert.ok(f.deleted.every(x => !x.startsWith('wheel=')));
  assert.equal(f.controller.readChoice(), 'denied');
});

test('Global Privacy Control and local previews do not load Analytics', () => {
  const gpc = fixture({ gpc: true });
  assert.equal(gpc.controller.choose('granted'), 'denied');
  assert.equal(gpc.scripts.length, 0);
  const local = fixture({ host: 'localhost' });
  local.controller.choose('granted');
  assert.equal(local.scripts.length, 0);
});

test('expired, invalid, future, or unavailable storage cannot opt users in', () => {
  const f = fixture();
  for (const saved of ['broken', JSON.stringify({ value: 'granted', at: 1 }), JSON.stringify({ value: 'granted', at: 1900000000000 }), JSON.stringify({ value: 'anything', at: 1800000000000 })]) {
    f.memory.set(CONSENT_KEY, saved);
    assert.equal(f.controller.readChoice(), null);
  }
  f.win.localStorage.getItem = () => { throw Error('blocked'); };
  f.win.localStorage.setItem = () => { throw Error('blocked'); };
  assert.equal(f.controller.readChoice(), null);
  assert.doesNotThrow(() => f.controller.choose('denied'));
});
