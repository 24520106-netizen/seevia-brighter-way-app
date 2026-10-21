/* SeeVia · one speech session for the app. No microphone or glasses connection. */
(function () {
  'use strict';
  var SV = window.SV, synth = window.speechSynthesis;
  var active = null, sequence = 0, priorityOwner = null;
  var last = { status: 'idle', owner: null, error: null };
  var voices = [];
  function supported() { return !!(synth && window.SpeechSynthesisUtterance); }
  function refresh() {
    try { voices = supported() ? synth.getVoices() : []; } catch (e) { voices = []; }
    document.dispatchEvent(new CustomEvent('sv:voices'));
    if (active && active.waiting) start(active);
    return voices.slice();
  }
  function emit(session, status, error) {
    last = { id: session.id, owner: session.owner, status: status, error: error || null,
      lang: session.lang, voice: session.voice ? session.voice.name : '', priority: session.priority };
    session.snapshot = last;
    document.dispatchEvent(new CustomEvent('sv:speech', { detail: Object.assign({}, last) }));
  }
  function clear(session) { clearTimeout(session.waitTimer); clearTimeout(session.startTimer); clearTimeout(session.endTimer); }
  function finish(session, status, error, cancel) {
    if (active !== session) return;
    clear(session);
    active = null; // invalidate callbacks before cancel(), which can fire error synchronously
    if (cancel && supported()) { try { synth.cancel(); } catch (e) { /* already stopped */ } }
    emit(session, status, error);
    if (status === 'error' && session.onError) session.onError(error);
  }
  function stop(owner) {
    if (!active || (owner && active.owner !== owner && !(owner.contains && active.owner && active.owner.nodeType && owner.contains(active.owner)))) return;
    finish(active, 'stopped', null, true);
  }
  function choose(session) {
    var language = session.lang.toLowerCase().replace('_', '-');
    var base = language.split('-')[0];
    var matches = voices.filter(function (v) { return v.lang.toLowerCase().replace('_', '-').split('-')[0] === base; });
    var saved = SV.settings.get('speechVoice');
    return matches.find(function (v) { return v.voiceURI === saved; }) ||
      matches.find(function (v) { return v.lang.toLowerCase().replace('_', '-') === language; }) || matches[0];
  }
  /* Short utterances avoid engine limits. Split at punctuation/whitespace, never drop text. */
  function chunks(text) {
    var parts = [], rest = String(text).trim();
    while (rest.length > 220) {
      var head = rest.slice(0, 221), cut = -1;
      var re = /[.!?…;]\s/g, match;
      while ((match = re.exec(head))) cut = match.index + 1;
      if (cut < 60) cut = head.lastIndexOf(' ');
      if (cut < 1) cut = 220;
      // do not split a UTF-16 surrogate pair
      if (/[\uD800-\uDBFF]/.test(rest.charAt(cut - 1))) cut--;
      parts.push(rest.slice(0, cut).trim()); rest = rest.slice(cut).trim();
    }
    if (rest) parts.push(rest);
    return parts;
  }
  function play(session) {
    if (active !== session) return;
    var utterance = new window.SpeechSynthesisUtterance(session.parts[session.index]);
    session.utterance = utterance;
    utterance.lang = session.lang; utterance.voice = session.voice; utterance.rate = session.rate;
    var current = function () { return active === session && session.utterance === utterance; };
    utterance.onstart = function () {
      if (!current()) return;
      clearTimeout(session.startTimer);
      emit(session, 'playing');
      session.endTimer = setTimeout(function () {
        if (current()) finish(session, 'error', 'timeout', true);
      }, Math.max(20000, utterance.text.length * 250 / session.rate + 10000));
    };
    utterance.onend = function () {
      if (!current()) return;
      clearTimeout(session.startTimer); clearTimeout(session.endTimer);
      session.index++;
      if (session.index < session.parts.length) play(session);
      else finish(session, 'completed');
    };
    utterance.onerror = function (event) {
      if (!current()) return;
      var canceled = event.error === 'canceled' || event.error === 'interrupted';
      finish(session, canceled ? 'stopped' : 'error', canceled ? null : event.error || 'failed', true);
    };
    session.startTimer = setTimeout(function () { if (current()) finish(session, 'error', 'timeout', true); }, 7000);
    try { synth.speak(utterance); } catch (e) { finish(session, 'error', 'failed', true); }
  }
  function start(session) {
    if (active !== session) return;
    session.voice = choose(session);
    if (!session.voice) return;
    session.waiting = false; clearTimeout(session.waitTimer);
    play(session);
  }
  function speak(text, options) {
    options = options || {};
    var session = { id: ++sequence, owner: options.owner || document, lang: options.lang || 'vi-VN',
      priority: options.priority || 'content', index: 0, parts: chunks(text), onError: options.onError };
    var rate = Number(options.rate || SV.settings.get('speechRate'));
    session.rate = Number.isFinite(rate) ? Math.max(0.6, Math.min(1.4, rate)) : 1;
    if (priorityOwner && session.owner !== priorityOwner) { emit(session, 'error', 'busy'); return false; }
    if (active && active.priority === 'content' && session.priority === 'feedback') return false;
    if (SV.clearAnnouncements) SV.clearAnnouncements();
    stop(); active = session; emit(session, 'preparing');
    if (!session.parts.length) { finish(session, 'error', 'empty'); return false; }
    if (!supported()) { finish(session, 'error', 'unsupported'); return false; }
    try { voices = synth.getVoices(); } catch (e) { voices = []; }
    session.waiting = true;
    session.waitTimer = setTimeout(function () {
      if (active === session && session.waiting) finish(session, 'error', 'language-unavailable');
    }, 1800);
    start(session);
    return true;
  }
  SV.speech = {
    speak: speak, stop: stop, supported: supported, refreshVoices: refresh,
    getVoices: function () { return voices.slice(); },
    getState: function () { return Object.assign({}, active && active.snapshot || last); },
    isActive: function () { return !!active; },
    hold: function (owner) { stop(); priorityOwner = owner; },
    release: function (owner) { if (priorityOwner === owner) priorityOwner = null; },
    reset: function () { priorityOwner = null; stop(); },
    errorText: function (error) {
      var key = error === 'language-unavailable' || error === 'voice-unavailable' ? 'missingVoice' :
        error === 'unsupported' ? 'unsupported' : error === 'busy' ? 'busy' : error === 'empty' ? 'empty' : 'failed';
      return SV.t('speech.' + key);
    }
  };
  if (supported() && synth.addEventListener) synth.addEventListener('voiceschanged', refresh);
  refresh();
  window.addEventListener('pagehide', SV.speech.reset);
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); });
  document.addEventListener('sv:settings', function () { stop(); });
})();
