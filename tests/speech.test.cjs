const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function fixture({ voices = [{ lang: 'vi-VN', name: 'Vietnamese', voiceURI: 'vi' }], supported = true } = {}) {
  const document = new EventTarget(), window = new EventTarget(), engine = new EventTarget();
  const calls = [], events = [], timers = new Map();
  let now = 0, next = 0, current;
  engine.getVoices = () => voices;
  engine.speak = utterance => { current = utterance; calls.push(utterance); };
  engine.cancel = () => { if (current && current.onerror) current.onerror({ error: 'canceled' }); current = null; };
  const settings = { speechRate: 1, speechVoice: '' };
  window.SV = { settings: { get: key => settings[key] }, t: key => key };
  if (supported) { window.speechSynthesis = engine; window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } }; }
  document.addEventListener('sv:speech', e => events.push(e.detail));
  const context = { window, document, CustomEvent, console,
    setTimeout: (fn, ms) => { const id = ++next; timers.set(id, { fn, at: now + ms }); return id; }, clearTimeout: id => timers.delete(id) };
  vm.runInNewContext(fs.readFileSync(require.resolve('../core/speech.js'), 'utf8'), context);
  function tick(ms) {
    const until = now + ms;
    while (true) {
      const found = [...timers.entries()].filter(([, t]) => t.at <= until).sort((a, b) => a[1].at - b[1].at)[0];
      if (!found) break;
      timers.delete(found[0]); now = found[1].at; found[1].fn();
    }
    now = until;
  }
  return { speech: window.SV.speech, settings, document, window, calls, events, timers, tick,
    setVoices: value => { voices = value; engine.dispatchEvent(new Event('voiceschanged')); } };
}
test('a late callback cannot finish or cancel the replacement request', () => {
  const f = fixture(), first = {}, second = {};
  f.speech.speak('First', { owner: first }); const old = f.calls[0]; old.onstart();
  f.speech.speak('Second', { owner: second }); const next = f.calls[1]; next.onstart();
  old.onend(); old.onerror({ error: 'failed' });
  assert.equal(f.speech.getState().owner, second); assert.equal(f.speech.getState().status, 'playing');
  next.onend(); assert.equal(f.speech.getState().status, 'completed'); assert.equal(f.timers.size, 0);
});
test('loads voices asynchronously, selects language, and falls back when a saved voice is gone', () => {
  const f = fixture({ voices: [] }); f.settings.speechVoice = 'removed';
  f.speech.speak('Xin chào'); assert.equal(f.calls.length, 0);
  f.setVoices([{ lang: 'en-US', voiceURI: 'en' }, { lang: 'vi-VN', voiceURI: 'vi' }]);
  assert.equal(f.calls[0].voice.voiceURI, 'vi');
  f.speech.speak('Hello', { lang: 'en-US' }); assert.equal(f.calls[1].voice.voiceURI, 'en');
});
test('missing language and unsupported engine report errors instead of false completion', () => {
  const f = fixture({ voices: [{ lang: 'en-US', voiceURI: 'en' }] });
  f.speech.speak('Xin chào'); f.tick(1800);
  assert.equal(f.calls.length, 0); assert.equal(f.speech.getState().error, 'language-unavailable');
  const unsupported = fixture({ supported: false }); unsupported.speech.speak('Hello');
  assert.equal(unsupported.speech.getState().error, 'unsupported');
});
test('stop cancels pending voice loading and subsequent stale events', () => {
  const f = fixture({ voices: [] }), owner = {};
  f.speech.speak('Hello', { owner }); f.speech.stop(owner); f.setVoices([{ lang: 'vi', voiceURI: 'vi' }]); f.tick(2000);
  assert.equal(f.calls.length, 0); assert.equal(f.speech.getState().status, 'stopped'); assert.equal(f.timers.size, 0);
});
test('long content reads in order; stopping cancels every remaining chunk', () => {
  const f = fixture(), text = Array(30).fill('Câu tiếng Việt có dấu.').join(' ');
  f.speech.speak(text); let count = 0;
  while (f.speech.isActive()) { const utterance = f.calls[count++]; utterance.onstart(); utterance.onend(); }
  assert.ok(count > 1); assert.equal(f.calls.map(u => u.text).join(' '), text);
  const g = fixture(); g.speech.speak(text); g.calls[0].onstart(); g.speech.stop(); g.calls[0].onend();
  assert.equal(g.calls.length, 1); assert.equal(g.speech.getState().status, 'stopped');
});
test('startup timeout and engine error clear state and allow retry', () => {
  const f = fixture(); f.speech.speak('Hello'); f.tick(7000);
  assert.equal(f.speech.getState().error, 'timeout');
  f.speech.speak('Retry'); f.calls[1].onerror({ error: 'audio-busy' });
  assert.equal(f.speech.getState().error, 'audio-busy'); assert.equal(f.timers.size, 0);
  f.speech.speak('Again'); f.calls[2].onstart(); assert.equal(f.speech.getState().status, 'playing');
});
test('SOS takes priority, blocks content and releases cleanly', () => {
  const f = fixture(), sos = {};
  f.speech.speak('Long content'); f.speech.hold(sos);
  assert.equal(f.speech.getState().status, 'stopped');
  f.speech.speak('SOS', { owner: sos, priority: 'urgent' });
  assert.equal(f.speech.speak('Blocked', { owner: {} }), false); assert.equal(f.calls.length, 2);
  assert.equal(f.speech.getState().owner, sos);
  f.speech.release(sos); f.speech.speak('Allowed'); assert.equal(f.calls.length, 3);
});
test('ordinary feedback cannot interrupt explicit reading, background and settings stop it', () => {
  const f = fixture(); f.speech.speak('Content');
  assert.equal(f.speech.speak('Notice', { priority: 'feedback' }), false); assert.equal(f.calls.length, 1);
  f.document.hidden = true; f.document.dispatchEvent(new Event('visibilitychange'));
  assert.equal(f.speech.getState().status, 'stopped');
  f.document.hidden = false; f.speech.speak('Retry'); f.document.dispatchEvent(new Event('sv:settings'));
  assert.equal(f.speech.getState().status, 'stopped');
});
