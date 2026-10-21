/* Offline DOM tests: no browser, network, camera, microphone or real speech.
   npm.cmd install --prefix tmp/dom-test --no-save --package-lock=false --ignore-scripts jsdom
   node --test tests/product-flows.test.cjs tests/speech.test.cjs */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
let JSDOM, VirtualConsole;
try { ({ JSDOM, VirtualConsole } = require('jsdom')); }
catch { ({ JSDOM, VirtualConsole } = require('../tmp/dom-test/node_modules/jsdom')); }
const root = path.resolve(__dirname, '..');
const scripts = ['brand/brand.js', 'content/vi.js', 'core/app.js', 'core/speech.js', 'components/elements.js', 'components/speech.js', 'components/flows.js'];

async function fixture(screen = 'start', state = {}) {
  const issues = [], vc = new VirtualConsole();
  vc.on('jsdomError', e => issues.push(e.message));
  vc.on('warn', (...args) => issues.push(args.join(' ')));
  const dom = new JSDOM(fs.readFileSync(path.join(root, 'screens', screen.split('?')[0] + '.html'), 'utf8'), {
    url: 'https://seevia.test/screens/' + screen.split('?')[0] + '.html' + (screen.includes('?') ? '?' + screen.split('?')[1] : ''),
    runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole: vc
  });
  const w = dom.window, timers = new Map(), calls = [];
  let now = Date.parse('2026-10-21T09:00:00Z'), nextId = 0, current;
  const schedule = (fn, delay, repeat) => { const id = ++nextId; timers.set(id, { fn, at: now + Number(delay || 0), repeat }); return id; };
  w.setTimeout = (fn, delay) => schedule(fn, delay, 0);
  w.setInterval = (fn, delay) => schedule(fn, delay, delay);
  w.clearTimeout = w.clearInterval = id => timers.delete(id);
  w.Date.now = () => now;
  w.matchMedia = query => ({ matches: query.includes('reduced-motion'), addEventListener() {}, removeEventListener() {} });
  w.HTMLElement.prototype.scrollIntoView = function () {};
  w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  w.HTMLDialogElement.prototype.close = function (value) { this.returnValue = value; this.open = false; this.dispatchEvent(new w.Event('close')); };
  w.fetch = async url => {
    const parsed = new URL(url, w.location.href), name = path.basename(parsed.pathname);
    const file = path.join(root, 'screens', name);
    if (parsed.origin !== 'https://seevia.test' || !fs.existsSync(file)) return { ok: false, status: 404 };
    return { ok: true, text: async () => fs.readFileSync(file, 'utf8') };
  };
  const engine = new w.EventTarget();
  engine.getVoices = () => [{ lang: 'vi-VN', name: 'Test Vietnamese', voiceURI: 'test-vi' }, { lang: 'en-US', name: 'Test English', voiceURI: 'test-en' }];
  engine.speak = utterance => { current = utterance; calls.push(utterance); w.setTimeout(() => { if (current === utterance) utterance.onstart?.(); }, 0); };
  engine.cancel = () => { const old = current; current = null; old?.onerror?.({ error: 'canceled' }); };
  w.speechSynthesis = engine;
  w.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
  w.localStorage.setItem('seevia.demo', JSON.stringify(state));
  for (const script of scripts) w.eval(fs.readFileSync(path.join(root, script), 'utf8'));
  await new Promise(resolve => setImmediate(resolve));
  function tick(ms) {
    const end = now + ms;
    while (true) {
      const due = [...timers].filter(([, v]) => v.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
      if (!due) break;
      const [id, timer] = due; now = timer.at;
      if (timer.repeat) timer.at += timer.repeat; else timers.delete(id);
      timer.fn();
    }
    now = end;
  }
  function get(selector) { const el = w.document.querySelector(selector); assert.ok(el, selector); return el; }
  async function click(selector) { get(selector).click(); await new Promise(resolve => setImmediate(resolve)); tick(0); }
  function select(selector, value) { const el = get(selector); el.value = value; el.dispatchEvent(new w.Event('change', { bubbles: true })); tick(0); }
  return { w, SV: w.SV, get, click, select, tick, calls, issues, now: () => now,
    close() { dom.window.close(); timers.clear(); },
    check() { assert.deepEqual(issues, []); }
  };
}

test('all product screens load without missing copy, broken ARIA references or internal destinations', async () => {
  for (const file of fs.readdirSync(path.join(root, 'screens')).filter(f => f.endsWith('.html') && !f.startsWith('home-preview'))) {
    const f = await fixture(file.slice(0, -5));
    try {
      assert.equal(f.w.document.querySelectorAll('h1').length, 1, file);
      for (const el of f.w.document.querySelectorAll('[aria-describedby],[aria-labelledby]')) {
        for (const attr of ['aria-describedby', 'aria-labelledby']) {
          for (const id of (el.getAttribute(attr) || '').split(/\s+/).filter(Boolean)) assert.ok(f.w.document.getElementById(id), `${file}: ${id}`);
        }
      }
      for (const a of f.w.document.querySelectorAll('a[href]')) {
        const url = new URL(a.href);
        if (url.origin === 'https://seevia.test' && url.pathname.endsWith('.html')) assert.ok(fs.existsSync(path.join(root, url.pathname)), a.href);
      }
      f.check();
    } finally { f.close(); }
  }
});

test('legacy linked data, stale snapshots and missing battery never imply current readiness', async () => {
  const f = await fixture('home', { glasses: { linked: true, connection: 'ready', battery: 82 } });
  try {
    assert.equal(f.SV.glassesStatus().kind, 'unknown');
    assert.doesNotMatch(f.get('sv-glasses-card').textContent, /82%/);
    assert.doesNotMatch(f.SV.glassesSpeech(), /sẵn sàng/);
    const ready = { linked: true, online: true, service: 'ready', connection: 'ready', battery: 82, updatedAt: f.now() };
    assert.equal(f.SV.glassesStatus(ready).kind, 'ready');
    for (const battery of [null, undefined, '', 'bad', -1, 101]) assert.equal(f.SV.glassesStatus({ ...ready, battery }).battery, null);
    assert.equal(f.SV.glassesStatus({ ...ready, battery: 0 }).battery, 0);
    assert.equal(f.SV.glassesStatus({ ...ready, updatedAt: f.now() + 120000 }).kind, 'unknown');
    f.SV.state.set('glasses', ready);
    assert.match(f.get('sv-glasses-card').textContent, /82%/);
    f.tick(6 * 60000);
    assert.equal(f.SV.glassesStatus().kind, 'stale');
    assert.doesNotMatch(f.get('sv-glasses-card').textContent, /82%/);
    assert.match(f.get('sv-connection-status').textContent, /quá 5 phút/);
    f.check();
  } finally { f.close(); }
});

test('first-run accessibility settings are reachable before sign-in and survive starting setup', async () => {
  const f = await fixture();
  try {
    await f.click('a[href="display.html?from=start"]');
    assert.match(f.w.location.href, /display.html\?from=start$/);
    assert.equal(f.SV.state.get('account').signedIn, false);
    await f.click('sv-display-settings button[value="lg"]');
    await f.click('#sv-hc');
    assert.equal(f.SV.settings.get('font'), 'lg');
    assert.equal(f.SV.settings.get('contrast'), 'on');
    f.SV.go('start.html'); await new Promise(resolve => setImmediate(resolve));
    await f.click('[data-setup="start"]');
    assert.match(f.w.location.href, /account.html\?setup=1$/);
    assert.equal(f.w.document.documentElement.dataset.font, 'lg');
    assert.equal(f.w.document.documentElement.dataset.contrast, 'high');
    f.check();
  } finally { f.close(); }
});

test('setup reaches a four-step reading journey and errors remain recoverable', async () => {
  const f = await fixture();
  try {
    await f.click('[data-setup="start"]');
    await f.click('[data-fill-account]');
    await f.click('form button[type="submit"]');
    assert.match(f.w.location.href, /glasses.html\?setup=1$/);
    await f.click('[data-setup="find"]'); f.tick(1100);
    await f.click('[data-setup="choose"]');
    await f.click('form button[type="submit"]');
    assert.equal(f.get('#sv-wifi-name').getAttribute('aria-invalid'), 'true');
    await f.click('[data-setup="fillWifi"]');
    f.select('#sv-connect-scenario', 'password');
    await f.click('form button[type="submit"]'); f.tick(1200);
    assert.match(f.get('[data-stage-heading]').textContent, /Chưa kết nối/);
    await f.click('[data-setup="editWifi"]');
    f.select('#sv-connect-scenario', 'success');
    await f.click('form button[type="submit"]'); f.tick(1200);
    assert.equal(f.SV.glassesStatus().kind, 'ready');
    assert.equal(f.w.document.querySelectorAll('.sv-setup-progress li').length, 4);
    await f.click('a[href="read-practice.html?setup=1"]');
    assert.equal(f.get('.sv-setup-progress [aria-current="step"]').textContent, '4. Đọc thử');
    f.check();
  } finally { f.close(); }
});

test('device scenarios distinguish network, service, unknown and stale state, then recover', async () => {
  const f = await fixture('glasses', { account: { signedIn: true }, glasses: { linked: true } });
  try {
    for (const kind of ['ready', 'lost', 'serviceUnavailable', 'serviceUnknown', 'stale', 'unknown']) {
      f.select('#sv-device-state', kind);
      assert.equal(f.SV.glassesStatus().kind, kind);
      assert.match(f.get('sv-glasses-card').textContent, new RegExp(f.SV.t('deviceStatus.' + kind)));
      if (kind !== 'ready') assert.doesNotMatch(f.SV.glassesSpeech(), /pin 82/i);
    }
    f.select('#sv-connect-scenario', 'service');
    await f.click('[data-setup="recover"]'); f.tick(1200);
    assert.equal(f.SV.glassesStatus().kind, 'serviceUnavailable');
    f.select('#sv-connect-scenario', 'success');
    await f.click('[data-setup="retry"]'); f.tick(1200);
    assert.equal(f.SV.glassesStatus().kind, 'ready');
    assert.equal(f.SV.state.get('glasses').linked, true);
    f.check();
  } finally { f.close(); }
});

test('reading practice supports unclear image, retry, listen/stop/replay and explicit completion', async () => {
  const f = await fixture('read-practice');
  try {
    await f.click('[data-read-action="blur"]');
    assert.match(f.get('[data-read-heading]').textContent, /Chưa đọc rõ/);
    assert.equal(f.w.document.activeElement, f.get('[data-read-heading]'));
    await f.click('[data-read-action="read"]');
    await f.click('sv-read-practice sv-speech-control button');
    assert.equal(f.SV.speech.getState().status, 'playing');
    assert.equal(f.calls.at(-1).text, f.SV.t('readPractice.sample'));
    await f.click('sv-read-practice sv-speech-control button');
    assert.equal(f.SV.speech.getState().status, 'stopped');
    assert.equal(f.SV.state.get('firstReadDone'), false);
    await f.click('sv-read-practice sv-speech-control button');
    await f.click('[data-read-action="retry"]');
    assert.equal(f.SV.speech.isActive(), false);
    await f.click('[data-read-action="read"]');
    await f.click('[data-read-action="confirm"]');
    assert.equal(f.SV.state.get('firstReadDone'), true);
    assert.match(f.get('[data-read-heading]').textContent, /hoàn thành/);
    f.check();
  } finally { f.close(); }
});

test('SOS failure never becomes sent, can be retried, and changing conditions cancels countdown', async () => {
  const f = await fixture('safety');
  try {
    let sent = 0; f.get('sv-sos-button').addEventListener('sv:sos', () => sent++);
    for (const scenario of ['offline', 'permission', 'failed']) {
      f.select('#sv-sos-scenario', scenario);
      await f.click('.sv-sos__direct'); f.tick(5000);
      assert.ok(f.get('.sv-sos.is-failed'));
      assert.equal(sent, 0);
      assert.equal(f.w.document.activeElement, f.get('.sv-sos-sent__title'));
      await f.click('[data-sos-reset]');
    }
    f.select('#sv-sos-scenario', 'success');
    await f.click('.sv-sos__direct');
    f.select('#sv-sos-scenario', 'offline'); f.tick(5000);
    assert.ok(f.get('.sv-sos.is-idle')); assert.equal(sent, 0);
    f.select('#sv-sos-scenario', 'success');
    await f.click('.sv-sos__direct'); f.tick(5000);
    assert.ok(f.get('.sv-sos.is-sent')); assert.equal(sent, 1);
    assert.match(f.get('.sv-sos__result').textContent, /Chưa có tin nhắn hoặc cuộc gọi thật/);
    f.check();
  } finally { f.close(); }
});

test('navigation prioritizes guidance and every capability carries its implementation status', async () => {
  const f = await fixture('home');
  try {
    const nav = [...f.w.document.querySelectorAll('sv-nav-bar a')].map(a => path.basename(new URL(a.href).pathname));
    assert.deepEqual(nav, ['home.html', 'activity.html', 'safety.html', 'features.html', 'profile.html']);
    assert.ok(f.get('#home-use').compareDocumentPosition(f.get('#home-recent')) & f.w.Node.DOCUMENT_POSITION_FOLLOWING);
    assert.equal(f.get('details.sv-accordion').open, false);
    await f.click('sv-nav-bar a[href="features.html"]');
    const items = f.w.document.querySelectorAll('[data-g]');
    assert.ok(items.length > 0);
    for (const item of items) assert.match(item.querySelector('.sv-feature__phase').textContent, /mô phỏng|chưa triển khai/);
    await f.click('[data-g]');
    assert.match(f.get('dialog[open]').textContent, /Chưa có kính thật/);
    f.check();
  } finally { f.close(); }
});
