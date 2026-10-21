/* Run with Node and Playwright available via node_modules or NODE_PATH. Uses installed Chrome. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');

const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (error, bytes) => error ? res.writeHead(404).end() : res.end(bytes));
});

function mockSpeech() {
  const engine = new EventTarget();
  const voice = { lang: 'vi-VN', name: 'Test Vietnamese', voiceURI: 'test-vi' };
  window.__calls = [];
  engine.getVoices = () => [voice];
  engine.cancel = () => {};
  engine.speak = utterance => {
    window.__calls.push(utterance.text);
    setTimeout(() => utterance.onstart?.(), 0);
  };
  Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: engine });
  Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: class { constructor(text) { this.text = text; } } });
}

async function main() {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await context.addInitScript(mockSpeech);
    const page = await context.newPage();
    const base = `http://127.0.0.1:${server.address().port}/screens/`;
    const calls = () => page.evaluate(() => window.__calls.slice());
    const expectSpeech = async (expected, count) => {
      await page.waitForFunction(n => window.__calls.length === n, count);
      await page.waitForTimeout(250); // catch duplicate or late speech
      assert.deepEqual(await calls(), expected);
    };

    await page.goto(base + 'home.html');
    await page.locator('sv-nav-bar a[href="profile.html"]').click();
    await page.waitForURL('**/profile.html');
    await expectSpeech(['Hồ sơ'], 1);

    await page.locator('a[href="guide.html?from=profile"]').click();
    await page.waitForURL('**/guide.html?from=profile');
    await expectSpeech(['Hồ sơ', 'Hướng dẫn sử dụng'], 2);

    await page.locator('sv-top-bar a.sv-icon-btn').click();
    await page.waitForURL('**/profile.html');
    await expectSpeech(['Hồ sơ', 'Hướng dẫn sử dụng', 'Quay lại. Hồ sơ'], 3);

    await page.locator('a[href="support.html"]').click();
    await page.waitForURL('**/support.html');
    await expectSpeech(['Hồ sơ', 'Hướng dẫn sử dụng', 'Quay lại. Hồ sơ', 'Hỗ trợ và góp ý'], 4);
    await page.locator('sv-hotline button').click();
    await expectSpeech(['Hồ sơ', 'Hướng dẫn sử dụng', 'Quay lại. Hồ sơ', 'Hỗ trợ và góp ý', 'Bản mô phỏng: chưa có số tổng đài thật.'], 5);
    await page.goBack();
    await page.waitForURL('**/profile.html');
    await expectSpeech(['Hồ sơ', 'Hướng dẫn sử dụng', 'Quay lại. Hồ sơ', 'Hỗ trợ và góp ý', 'Bản mô phỏng: chưa có số tổng đài thật.', 'Hồ sơ'], 6);

    await page.goto('file:///' + path.join(root, 'screens', 'profile.html').replaceAll('\\', '/'), { waitUntil: 'domcontentloaded' });
    const fileScroll = await page.locator('.sv-device__screen').evaluate(el => { el.scrollTop = el.scrollHeight; return el.scrollTop; });
    await page.locator('a[href="guide.html?from=profile"]').click();
    await page.waitForURL('**/guide.html?from=profile');
    await expectSpeech(['Hướng dẫn sử dụng'], 1);
    await page.locator('sv-top-bar a.sv-icon-btn').click();
    await page.waitForURL('**/profile.html');
    await expectSpeech(['Quay lại. Hồ sơ'], 1);
    const restored = await page.locator('.sv-device__screen').evaluate(el => el.scrollTop);
    assert.ok(Math.abs(restored - fileScroll) <= 2);
    await page.evaluate(() => { window.__calls.length = 0; });
    await page.locator('a[href="guide.html?from=profile"]').click();
    await page.waitForURL('**/guide.html?from=profile');
    await expectSpeech(['Hướng dẫn sử dụng'], 1);
    await page.goBack();
    await page.waitForURL('**/profile.html');
    await expectSpeech(['Quay lại. Hồ sơ'], 1);

    console.log('PASS button feedback, tabs and Back speak once in routed and file:// navigation');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
