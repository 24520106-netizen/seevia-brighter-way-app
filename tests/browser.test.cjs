/* Run with Node and Playwright available via node_modules or NODE_PATH. Uses installed Chrome. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const screens = fs.readdirSync(path.join(root, 'screens')).filter(n => n.endsWith('.html') && !n.startsWith('home-preview'));
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (error, bytes) => { if (error) res.writeHead(404).end(); else { res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream'); res.end(bytes); } });
});
function mockSpeech() {
  const engine = new EventTarget();
  const vi = { lang: 'vi-VN', name: 'Test Vietnamese', voiceURI: 'test-vi' }, en = { lang: 'en-US', name: 'Test English', voiceURI: 'test-en' };
  let current = null;
  window.__speech = { calls: [], cancels: 0, voices: [vi, en], mode: 'normal' };
  engine.getVoices = () => window.__speech.voices;
  engine.speak = utterance => {
    current = utterance; window.__speech.calls.push({ text: utterance.text, lang: utterance.lang, rate: utterance.rate, voice: utterance.voice?.voiceURI });
    if (window.__speech.mode === 'error') { setTimeout(() => utterance.onerror?.({ error: 'audio-busy' }), 0); return; }
    if (window.__speech.mode !== 'stall') setTimeout(() => { if (current === utterance) utterance.onstart?.(); }, 0);
  };
  engine.cancel = () => { window.__speech.cancels++; const old = current; current = null; old?.onerror?.({ error: 'canceled' }); };
  window.__speech.finish = () => { const old = current; current = null; old?.onend?.(); };
  window.__speech.changeVoices = voices => { window.__speech.voices = voices; engine.dispatchEvent(new Event('voiceschanged')); };
  Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: engine });
  Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: class { constructor(text) { this.text = text; } } });
}
async function main() {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, ignoreHTTPSErrors: true });
  await context.addInitScript(mockSpeech);
  // Existing checks press Nghe by hand; touch-to-read has its own check below.
  await context.addInitScript(() => { try { if (!localStorage.getItem('seevia.settings')) localStorage.setItem('seevia.settings', JSON.stringify({ speechChosen: true, speechFeedback: 'screenReader' })); } catch (e) { /* private mode */ } });
  const page = await context.newPage(), issues = [];
  page.on('pageerror', error => issues.push(error.message));
  page.on('console', msg => { if (msg.type() === 'warning' && msg.text().includes('[SeeVia]')) issues.push(msg.text()); });
  const goto = name => page.goto(`${base}/screens/${name}.html`, { waitUntil: 'domcontentloaded' });
  let passed = 0;
  const check = async (name, fn) => { await fn(); passed++; console.log('PASS ' + name); };
  // Spoken content is now "<section title>. <content>"; compare the content part.
  const body = text => text.slice(text.indexOf('. ') + 2);
  const state = () => page.evaluate(() => ({ status: SV.speech.getState().status, active: SV.speech.isActive(), calls: window.__speech.calls }));
  try {
    await check('all production screens load, have named controls and valid ARIA references', async () => {
      const cdp = await context.newCDPSession(page);
      for (const file of screens) {
        await page.goto(`${base}/screens/${file}`, { waitUntil: 'domcontentloaded' });
        assert.equal(await page.locator('script[src="../core/speech.js"]').count(), 1, file);
        assert.equal(await page.locator('h1').count(), 1, file);
        const broken = await page.evaluate(() => [...document.querySelectorAll('[aria-describedby],[aria-labelledby]')].flatMap(el =>
          ['aria-describedby', 'aria-labelledby'].flatMap(attr => (el.getAttribute(attr) || '').split(/\s+/).filter(Boolean).filter(id => !document.getElementById(id)))));
        assert.deepEqual(broken, [], file + ' missing ARIA references');
        const { nodes } = await cdp.send('Accessibility.getFullAXTree');
        const unnamed = nodes.filter(n => !n.ignored && ['button', 'link', 'switch', 'radio', 'textbox', 'combobox'].includes(n.role?.value) && !n.name?.value?.trim());
        assert.deepEqual(unnamed.map(n => n.role.value), [], file + ' unnamed controls');
      }
    });
    await check('every feature sample reads its own command; sheet stays open, stop and close work', async () => {
      await goto('features');
      const count = await page.locator('[data-g]').count();
      for (let i = 0; i < count; i++) {
        await page.locator('[data-g]').nth(i).click();
        assert.equal(await page.locator('dialog[open] [aria-live]').count(), 2);
        const command = await page.locator('dialog .sv-sheet__say > span:not(.sv-icon)').innerText();
        await page.locator('dialog sv-speech-control button').click();
        await page.waitForFunction(() => SV.speech.getState().status === 'playing');
        assert.equal(await page.locator('dialog sv-speech-control button').getAttribute('aria-pressed'), null);
        assert.match(await page.locator('dialog sv-speech-control button').innerText(), /Dừng đọc/);
        assert.ok(command.includes(body((await state()).calls.at(-1).text)));
        assert.equal(await page.locator('dialog[open]').count(), 1);
        await page.locator('dialog sv-speech-control button').click(); assert.equal((await state()).status, 'stopped');
        await page.locator('dialog sv-speech-control button').click();
        await page.locator('dialog button[value="cancel"]').click();
        assert.equal((await state()).active, false);
        assert.equal(await page.locator('[data-g]').nth(i).evaluate(el => el === document.activeElement), true);
      }
    });
    await check('photo description reads correct content; delete and undo keep usable focus', async () => {
      await goto('album'); await page.locator('.sv-photo').first().click();
      const text = await page.locator('dialog #sv-photo-desc').innerText();
      await page.locator('dialog sv-speech-control button').click();
      assert.ok(text.includes(body((await state()).calls.at(-1).text)));
      await page.locator('button[value="delete"]').click();
      assert.equal((await state()).active, false);
      await page.locator('button[value="confirm"]').click();
      assert.equal(await page.evaluate(() => document.activeElement.matches('.sv-photo')), true);
      assert.equal(await page.locator('.sv-snackbar').isVisible(), true);
      await page.locator('.sv-snackbar [data-action]').click();
      assert.equal(await page.locator('.sv-photo').count(), await page.evaluate(() => SV.data('album.items').length));
    });
    await check('translation validates input and reads real demo translations in either language', async () => {
      await goto('translation');
      await page.locator('form button[type="submit"]').click();
      assert.equal(await page.locator('textarea').getAttribute('aria-invalid'), 'true');
      await page.locator('textarea').fill('Not a supported sample'); await page.locator('form button[type="submit"]').click();
      assert.equal(await page.locator('sv-speech-control').count(), 0);
      await page.selectOption('#sv-tr-sample', '0'); await page.locator('form button[type="submit"]').click();
      assert.equal(await page.locator('.sv-result p[lang]').innerText(), 'Xin chào, bạn khỏe không?');
      await page.locator('sv-speech-control button').click(); assert.equal((await state()).calls.at(-1).lang, 'vi-VN');
      await page.locator('[data-swap]').click(); assert.equal((await state()).active, false);
      await page.locator('form button[type="submit"]').click(); await page.locator('sv-speech-control button').click();
      assert.equal(body((await state()).calls.at(-1).text), 'Hello, how are you?'); assert.equal((await state()).calls.at(-1).lang, 'en-US');
      await page.locator('textarea').fill('Changed'); assert.equal((await state()).active, false); assert.equal(await page.locator('.sv-result').count(), 0);
    });
    await check('status reader uses current battery and unlinked/lost state', async () => {
      await goto('home');
      await page.evaluate(() => SV.state.set('glasses', { linked: true, connection: 'ready', online: true, service: 'ready', updatedAt: Date.now(), battery: 37 }));
      await page.locator('sv-connection-status sv-speech-control button').click();
      assert.match((await state()).calls.at(-1).text, /37 phần trăm/);
      await page.evaluate(() => SV.state.set('glasses', { linked: true, connection: 'lost', online: false, service: 'unknown', updatedAt: Date.now(), battery: null }));
      assert.equal((await state()).active, false);
      await page.locator('sv-connection-status sv-speech-control button').click(); assert.match((await state()).calls.at(-1).text, /mất kết nối/);
      await page.evaluate(() => SV.state.set('glasses', { linked: false, connection: 'unlinked' }));
      await page.locator('sv-connection-status sv-speech-control button').click(); assert.match((await state()).calls.at(-1).text, /Chưa liên kết/);
    });
    await check('router, browser Back, new readers and accordion collapse stop old audio', async () => {
      await goto('home'); await page.locator('sv-connection-status sv-speech-control button').click();
      await page.locator('sv-nav-bar a[href$="features.html"]').click(); await page.waitForURL('**/features.html'); assert.equal((await state()).active, false);
      await page.locator('[data-g]').first().click(); await page.locator('dialog sv-speech-control button').click();
      await page.goBack(); await page.waitForURL('**/home.html'); await page.waitForFunction(() => !SV.speech.isActive());
      await goto('guide'); await page.locator('details summary').first().click(); await page.locator('details[open] sv-speech-control button').click();
      await page.locator('details[open] summary').click(); await page.waitForFunction(() => !SV.speech.isActive());
    });
    await check('a first touch turns on automatic reading; Nghe becomes Nghe lại and replays', async () => {
      const fresh = await browser.newContext({ viewport: { width: 390, height: 844 } });
      await fresh.addInitScript(mockSpeech);
      const p = await fresh.newPage(), n = () => p.evaluate(() => window.__speech.calls.length);
      await p.goto(`${base}/screens/start.html`, { waitUntil: 'domcontentloaded' });
      assert.equal(await n(), 0);
      await p.mouse.click(195, 30);
      await p.waitForFunction(() => SV.speech.getState().status === 'playing');
      assert.equal(await n(), 1);
      assert.equal(await p.evaluate(() => SV.settings.get('speechFeedback')), 'voice');
      await p.evaluate(async () => { for (let i = 0; i < 8; i++) { window.__speech.finish(); await new Promise(r => setTimeout(r, 30)); } });
      assert.match(await p.locator('sv-speech-control button').innerText(), /Nghe lại/);
      const before = await n(); await p.locator('sv-speech-control button').click();
      assert.ok(await n() > before);
      await p.goto(`${base}/screens/features.html`, { waitUntil: 'domcontentloaded' });
      const opened = await n(); await p.locator('[data-g]').first().click();
      await p.waitForFunction(count => window.__speech.calls.length > count, opened);
      await fresh.close();
    });
    await check('settings persist and automatic feedback uses one app channel', async () => {
      await goto('display'); await page.selectOption('#sv-rate', '0.8'); await page.selectOption('#sv-voice', 'test-vi');
      await page.selectOption('#sv-feedback-mode', 'voice');
      await page.locator('sv-speech-settings sv-speech-control button').click();
      assert.equal((await state()).calls.at(-1).rate, 0.8);
      await goto('display'); assert.equal(await page.locator('#sv-rate').inputValue(), '0.8'); assert.equal(await page.locator('#sv-voice').inputValue(), 'test-vi');
      await page.evaluate(() => { window.__speech.calls.length = 0; SV.snackbar('A short notice', null, { speech: true }); });
      await page.waitForFunction(() => SV.speech.getState().status === 'playing');
      assert.equal((await state()).calls.length, 1);
      assert.equal(await page.locator('[aria-live]').evaluateAll(els => els.some(el => el.textContent.includes('A short notice'))), false);
      await page.locator('.sv-snackbar [data-dismiss]').click(); assert.equal(await page.locator('.sv-snackbar').isVisible(), false);
      await page.selectOption('#sv-feedback-mode', 'screenReader');
      await page.evaluate(() => { window.__speech.calls.length = 0; SV.snackbar('Reader notice', null, { speech: true }); });
      await page.waitForFunction(() => [...document.querySelectorAll('[aria-live]')].some(el => el.textContent === 'Reader notice'));
      assert.equal((await state()).calls.length, 0);
    });
    await check('missing voice and engine failure are accessible and retryable', async () => {
      await goto('display');
      await page.evaluate(() => window.__speech.changeVoices([]));
      await page.locator('sv-speech-settings sv-speech-control button').click();
      await page.waitForFunction(() => SV.speech.getState().status === 'error');
      assert.equal((await state()).calls.length, 0); assert.match(await page.locator('sv-speech-settings .sv-speech__status').innerText(), /Chưa có giọng/);
      await page.evaluate(() => window.__speech.changeVoices([{ lang: 'vi-VN', name: 'New Vietnamese', voiceURI: 'new' }]));
      await page.locator('sv-speech-settings sv-speech-control button').click();
      await page.waitForFunction(() => SV.speech.getState().status === 'playing');
      await page.locator('sv-speech-settings sv-speech-control button').click();
      await page.evaluate(() => { window.__speech.mode = 'error'; });
      await page.locator('sv-speech-settings sv-speech-control button').click();
      await page.waitForFunction(() => SV.speech.getState().status === 'error');
      assert.match(await page.locator('sv-speech-settings .sv-speech__status').innerText(), /Chưa phát được/);
    });
    await check('meeting summary and guide read the content selected', async () => {
      await goto('meeting'); await page.locator('[data-m]').first().click();
      const summary = await page.locator('#sv-meet-body').innerText();
      await page.locator('dialog sv-speech-control button').click(); assert.ok(summary.startsWith(body((await state()).calls.at(-1).text)));
      await page.keyboard.press('Escape'); assert.equal((await state()).active, false);
      await goto('guide'); await page.locator('details summary').first().click(); await page.locator('details[open] sv-speech-control button').click(); assert.equal((await state()).active, true);
    });
    await check('onboarding, connection errors, recovery and unlink preserve focus and speech', async () => {
      await goto('start'); await page.locator('sv-speech-control button').click();
      await page.locator('[data-setup="start"]').click(); await page.waitForURL('**/account.html?setup=1');
      await page.locator('[data-fill-account]').click(); await page.locator('form button[type="submit"]').click();
      await page.waitForURL('**/glasses.html?setup=1'); await page.locator('[data-setup="find"]').click();
      await page.locator('[data-setup="choose"]').click();
      await page.locator('form button[type="submit"]').click();
      assert.equal(await page.locator('#sv-wifi-name').getAttribute('aria-invalid'), 'true');
      assert.equal(await page.locator('#sv-wifi-name').evaluate(el => el === document.activeElement), true);
      await page.locator('[data-setup="fillWifi"]').click();
      await page.locator('.sv-setup-scenario summary').click(); await page.selectOption('#sv-connect-scenario', 'password');
      await page.locator('form button[type="submit"]').click(); await page.locator('[data-setup="editWifi"]').click();
      await page.locator('.sv-setup-scenario summary').click(); await page.selectOption('#sv-connect-scenario', 'success');
      await page.locator('form button[type="submit"]').click(); await page.locator('[data-setup="unlink"]').waitFor();
      await page.locator('sv-glasses-manager sv-speech-control button').click();
      assert.match((await state()).calls.at(-1).text, /82 phần trăm/);
      await page.locator('.sv-setup-scenario summary').click(); await page.locator('[data-setup="lose"]').click();
      await page.locator('sv-glasses-manager sv-speech-control button').click(); assert.match((await state()).calls.at(-1).text, /mất kết nối/);
      await page.locator('[data-setup="recover"]').click(); await page.locator('[data-setup="unlink"]').waitFor();
      await page.locator('[data-setup="unlink"]').click(); await page.locator('dialog button[value="confirm"]').click();
      await page.locator('[data-setup="find"]').waitFor();
      assert.equal(await page.locator('[data-stage-heading]').evaluate(el => el === document.activeElement), true);
    });
    await check('registration, OTP, sign-out and feedback validation keep accessible results', async () => {
      await page.evaluate(() => SV.state.set('account', { signedIn: false, name: '', phone: '' }));
      await goto('account'); await page.locator('.sv-segmented [value="register"]').click();
      await page.locator('[data-fill-account]').click(); await page.locator('form button[type="submit"]').click();
      await page.locator('#sv-otp').fill('000000'); await page.locator('form button[type="submit"]').click();
      assert.equal(await page.locator('#sv-otp').getAttribute('aria-invalid'), 'true');
      await page.locator('#sv-otp').fill('123456'); await page.locator('form button[type="submit"]').click();
      assert.equal(await page.locator('[data-signout]').evaluate(el => el === document.activeElement), true);
      await page.locator('[data-signout]').click(); await page.locator('dialog button[value="confirm"]').click();
      assert.equal(await page.locator('#sv-phone').evaluate(el => el === document.activeElement), true);
      await goto('support'); await page.locator('sv-support-form button[type="submit"]').click();
      assert.equal(await page.locator('#sv-feedback').getAttribute('aria-invalid'), 'true');
      await page.locator('#sv-feedback').fill('Góp ý mẫu cho bản thử nghiệm.'); await page.locator('sv-support-form button[type="submit"]').click();
      assert.equal(await page.locator('sv-support-form .sv-banner').evaluate(el => el === document.activeElement), true);
    });
    await check('photo empty state, restore and modal speech errors remain reachable', async () => {
      await goto('album');
      await page.evaluate(() => { SV.state.set('albumRemoved', SV.data('album.items').map((_, i) => i)); document.querySelector('sv-album').render(); });
      await page.locator('[data-restore]').click(); assert.equal(await page.locator('.sv-photo').first().evaluate(el => el === document.activeElement), true);
      await page.locator('.sv-photo').first().click(); await page.evaluate(() => window.__speech.changeVoices([]));
      await page.locator('dialog sv-speech-control button').click(); await page.waitForFunction(() => SV.speech.getState().status === 'error');
      await page.waitForFunction(() => document.querySelector('dialog [role="status"]')?.textContent.includes('Chưa có giọng'));
      assert.equal(await page.locator('dialog[open]').count(), 1); await page.keyboard.press('Escape');
    });
    await check('SOS direct access, cancel, priority, no-recipient and completion', async () => {
      await goto('safety');
      await page.evaluate(() => { SV.state.set('emergencyPhone', '0901 234 567'); SV.settings.set('speechFeedback', 'voice'); });
      await page.locator('.sv-sos__direct').focus(); await page.keyboard.press('Enter');
      assert.equal(await page.locator('.sv-sos.is-counting').count(), 1);
      await page.locator('.sv-sos__direct').press('Enter'); assert.equal(await page.locator('.sv-sos.is-idle').count(), 1);
      await page.locator('.sv-sos__direct').press('Enter');
      await page.evaluate(() => SV.state.set('emergencyPhone', '0902 345 678'));
      assert.equal(await page.locator('.sv-sos.is-counting').count(), 0);
      await page.locator('.sv-sos__direct').press('Enter');
      const accepted = await page.evaluate(() => SV.speech.speak('Blocked content', { owner: document.body })); assert.equal(accepted, false);
      await page.waitForSelector('.sv-sos.is-sent', { timeout: 7000 });
      assert.match((await state()).calls.at(-1).text, /SOS mô phỏng/); assert.doesNotMatch((await state()).calls.at(-1).text, /0901/);
      await page.locator('[data-safe]').click();
      await page.evaluate(() => SV.state.set('emergencyPhone', ''));
      await page.locator('.sv-sos__direct').focus(); await page.keyboard.press('Enter');
      assert.equal(await page.locator('.sv-sos.is-counting').count(), 0); assert.equal(await page.locator('#sv-contact-input').evaluate(el => el === document.activeElement), true);
    });
    await check('file:// entry loads service and reads a command without router', async () => {
      await page.goto('file:///' + path.join(root, 'screens', 'features.html').replaceAll('\\', '/'));
      await page.locator('[data-g]').first().click(); await page.locator('dialog sv-speech-control button').click();
      await page.waitForFunction(() => SV.speech.getState().status === 'playing');
      assert.equal(await page.locator('dialog[open]').count(), 1);
    });
    await check('settings render at large text, high contrast and desktop sizes', async () => {
      await goto('display');
      await page.evaluate(() => { SV.settings.set('font', 'lg'); SV.settings.set('contrast', 'on'); });
      await page.locator('sv-speech-settings').evaluate(el => el.scrollIntoView({ block: 'start' }));
      assert.equal(await page.locator('sv-speech-settings').evaluate(el => el.scrollWidth <= el.clientWidth + 1), true);
      fs.mkdirSync(path.join(root, 'tmp'), { recursive: true });
      await page.screenshot({ path: path.join(root, 'tmp/talkback-settings-390.png') });
      await page.setViewportSize({ width: 1100, height: 1000 });
      await page.evaluate(() => { SV.settings.set('font', 'md'); SV.settings.set('contrast', 'off'); });
      await page.screenshot({ path: path.join(root, 'tmp/talkback-settings-1100.png') });
      await goto('features'); await page.locator('[data-g]').first().click(); await page.locator('dialog sv-speech-control button').click();
      await page.waitForFunction(() => SV.speech.getState().status === 'playing');
      await page.screenshot({ path: path.join(root, 'tmp/talkback-feature-sheet.png') });
    });
    assert.deepEqual(issues, [], 'browser errors or missing translation keys');
    const real = await browser.newContext({ ignoreHTTPSErrors: true }); const realPage = await real.newPage();
    await realPage.goto(base + '/screens/display.html', { waitUntil: 'domcontentloaded' });
    await realPage.waitForTimeout(2000); // allow the real OS voice list to populate; no speech mock here
    const voiceReport = await realPage.evaluate(() => ({ supported: SV.speech.supported(), voices: SV.speech.getVoices().map(v => ({ name: v.name, lang: v.lang })) }));
    console.log('REAL_ENGINE ' + JSON.stringify(voiceReport));
    if (voiceReport.voices.some(v => v.lang === 'vi-VN')) {
      await realPage.evaluate(() => { window.__realEvents = []; document.addEventListener('sv:speech', e => window.__realEvents.push({ status: e.detail.status, voice: e.detail.voice, lang: e.detail.lang, error: e.detail.error })); });
      await realPage.locator('sv-speech-settings sv-speech-control').evaluate(el => el.setAttribute('text', 'Xin chào. SeeVia sẵn sàng.'));
      await realPage.locator('sv-speech-settings sv-speech-control button').click();
      await realPage.waitForFunction(() => ['completed', 'error'].includes(SV.speech.getState().status), null, { timeout: 20000 });
      console.log('REAL_PLAYBACK ' + JSON.stringify(await realPage.evaluate(() => window.__realEvents)));
      if (process.env.SEEVIA_VERIFY_REAL_SPEECH === '1') assert.equal(await realPage.evaluate(() => SV.speech.getState().status), 'completed', 'real engine must finish successfully');
    }
    await real.close();
    console.log(`${passed} browser groups passed across ${screens.length} production screens. Audio/TalkBack on hardware is not covered by these tests.`);
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
}
main().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
