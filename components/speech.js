/* Reusable, explicitly activated content reader. No live announcement of the spoken text. */
(function () {
  'use strict';
  var SV = window.SV, nextId = 0;
  /* Chạm bất kỳ chỗ nào = SeeVia tự đọc (kính tự nói). Nút Nghe chỉ để nghe lại. */
  var INTERACTIVE = 'a,button,input,select,textarea,summary,label,[role="button"],sv-speech-control';
  var gesture = 0, lastGesture = 0, claimed = -1, introDevice = null, backAt = 0;
  var navigationVersion = 0, screenSpeechToken = 0, clickStart = new WeakMap();
  var pendingSpeechKey = 'sv.pendingScreenSpeech';
  function recent() { return gesture > 0 && Date.now() - lastGesture < 3000; }
  function visible(control) { return control.isConnected && control.getClientRects().length > 0; }
  function onGesture(event) {
    gesture++; lastGesture = Date.now();
    // An explicit choice in Settings wins; otherwise the first touch turns automatic reading on.
    if (!SV.settings.get('speechChosen') && SV.settings.get('speechFeedback') !== 'voice') SV.settings.set('speechFeedback', 'voice');
    if (event.type !== 'pointerdown' || !event.target.closest || event.target.closest(INTERACTIVE)) return;
    // Touching plain screen area reads the screen's own Nghe content once per screen.
    var device = document.querySelector('.sv-device');
    if (introDevice === device) return;
    introDevice = device;
    var scope = document.querySelector('dialog[open]') || document;
    var first = [].slice.call(scope.querySelectorAll('sv-speech-control')).find(function (c) { return !c.hasAttribute('manual') && visible(c); });
    if (first) first.autoplay();
  }
  ['pointerdown', 'keydown'].forEach(function (type) { document.addEventListener(type, onGesture, true); });
  /* Mọi nút bấm đều có tiếng: sau khi bấm, đọc tên điều khiển và trạng thái mới của nó.
     Chỉ đọc nhãn, không bao giờ đọc giá trị ô nhập (mật khẩu, OTP, số điện thoại). */
  var NAMED = 'a[href],button,summary,select,textarea,input,[role="button"],[role="radio"],[role="switch"],[role="tab"],[role="checkbox"]';
  document.addEventListener('sv:navigate', function () { navigationVersion++; });
  document.addEventListener('click', function (event) {
    clickStart.set(event, { navigation: navigationVersion, speech: SV.speech.getState().id });
  }, true);
  function textOf(node) {
    var copy = node.cloneNode(true);
    copy.querySelectorAll('[aria-hidden="true"],svg,.visually-hidden').forEach(function (n) { n.remove(); });
    return copy.textContent.replace(/\s+/g, ' ').trim();
  }
  function controlName(el) {
    var label = el.getAttribute('aria-label');
    if (label) return label.trim();
    var ids = el.getAttribute('aria-labelledby');
    if (ids) {
      var joined = ids.split(/\s+/).map(function (id) { var n = document.getElementById(id); return n ? textOf(n) : ''; }).join(' ').trim();
      if (joined) return joined;
    }
    if (el.labels && el.labels[0]) return textOf(el.labels[0]);
    return /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName) ? (el.getAttribute('placeholder') || '') : textOf(el);
  }
  function controlState(el) {
    var on = el.getAttribute('aria-checked') || el.getAttribute('aria-selected') || el.getAttribute('aria-pressed');
    if (on === 'true') return SV.t('speech.stateOn');
    if (on === 'false') return SV.t('speech.stateOff');
    if (el.getAttribute('aria-current')) return SV.t('speech.stateCurrent');
    return '';
  }
  document.addEventListener('click', function (event) {
    if (SV.settings.get('speechFeedback') !== 'voice' || !event.target.closest) return;
    var el = event.target.closest(NAMED);
    if (!el || el.closest('sv-speech-control,sv-sos-button') || el.disabled) return;
    var ic = el.querySelector('.sv-icon');
    var isBack = !!(el.closest('sv-top-bar') && ic && ic.textContent === 'arrow_back');
    if (isBack) backAt = Date.now();
    var before = clickStart.get(event);
    // An action's own feedback or a route change already owns this gesture.
    if (before && (before.navigation !== navigationVersion || before.speech !== SV.speech.getState().id)) return;
    var anchor = el.closest('a[href]');
    if (anchor && anchor.href !== location.href) {
      var destination = new URL(anchor.href, location.href);
      var sameDocumentAnchor = destination.pathname === location.pathname && destination.search === location.search && !!destination.hash;
      var internalScreen = destination.protocol === location.protocol && destination.origin === location.origin && /\/screens\/[^/]+\.html$/.test(destination.pathname);
      if (internalScreen && !sameDocumentAnchor) {
        if (location.protocol === 'file:') {
          var target = isBack && SV.backTarget && SV.backTarget() || anchor.href;
          try { sessionStorage.setItem(pendingSpeechKey, JSON.stringify({ target: target, back: isBack })); } catch (e) { /* storage unavailable */ }
        }
        return;
      }
    }
    if (isBack) return;
    if (el.matches('input[type="password"],input[type="hidden"]') && !controlName(el)) return;
    var text = [controlName(el), controlState(el)].filter(Boolean).join('. ');
    if (text) SV.announce(text);
  });
  /* Chuyển màn (tab, liên kết): chỉ đọc tên màn mới. Nội dung bên trong chỉ đọc khi người dùng thao tác tiếp. */
  document.addEventListener('sv:screen', function () {
    claimed = gesture; // controls on the new screen must not start by themselves
    var token = ++screenSpeechToken;
    if (SV.settings.get('speechFeedback') !== 'voice') return;
    var h1 = document.querySelector('.sv-device h1');
    var name = h1 ? textOf(h1) : '';
    if (Date.now() - backAt < 3000) name = SV.t('common.back') + '. ' + name;
    backAt = 0;
    var speechId = SV.speech.getState().id;
    // Give the previous engine session time to finish cancellation.
    if (name) setTimeout(function () {
      if (token === screenSpeechToken && speechId === SV.speech.getState().id && SV.settings.get('speechFeedback') === 'voice') {
        SV.announce(name);
      }
    }, 150);
  });
  var fileSpeechAnnounced = false;
  function announcePendingFileScreen(event) {
    if (location.protocol !== 'file:' || SV.settings.get('speechFeedback') !== 'voice') return;
    var pending;
    try {
      pending = JSON.parse(sessionStorage.getItem(pendingSpeechKey) || 'null');
      if (pending && pending.target === location.href) sessionStorage.removeItem(pendingSpeechKey);
    } catch (e) { return; }
    var requested = pending && pending.target === location.href;
    if (!requested) {
      if (!event || event.type !== 'pageshow' || fileSpeechAnnounced) return;
      var navigation = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
      if (!event.persisted && (!navigation || navigation.type !== 'back_forward')) return;
    }
    if (fileSpeechAnnounced) return;
    fileSpeechAnnounced = true;
    var h1 = document.querySelector('.sv-device h1');
    var name = h1 ? textOf(h1) : '';
    if (!requested || pending.back) name = SV.t('common.back') + '. ' + name;
    if (name) setTimeout(function () { if (SV.settings.get('speechFeedback') === 'voice') SV.announce(name); }, 150);
  }
  document.addEventListener('DOMContentLoaded', announcePendingFileScreen);
  window.addEventListener('pageshow', announcePendingFileScreen);
  window.addEventListener('pagehide', function () { fileSpeechAnnounced = false; });
  // Opening a guide item by touch reads it.
  document.addEventListener('toggle', function (event) {
    var details = event.target;
    if (!recent() || !details.matches || !details.matches('details') || !details.open) return;
    var control = details.querySelector('sv-speech-control');
    if (control) control.autoplay();
  }, true);
  SV.glassesSpeech = function () {
    var status = SV.glassesStatus();
    if (status.kind === 'unlinked') return SV.t('speech.glassesUnlinked');
    if (status.kind === 'lost') return SV.t('setup.lostSpeech');
    if (status.kind !== 'ready') return SV.t('deviceStatus.' + status.kind + 'Speech');
    return SV.t(status.battery === null ? 'deviceStatus.readyNoBatterySpeech' : 'speech.glassesReady', { battery: status.battery });
  };
  /* manual = chỉ phát khi bấm (nghe thử giọng), không tự đọc khi chạm */
  SV.speechControl = function (text, label, lang, manual) {
    return '<sv-speech-control text="' + SV.esc(text) + '" label-key="' + (label || 'speech.listen') +
      '" lang="' + (lang || 'vi-VN') + '"' + (manual ? ' manual' : '') + '></sv-speech-control>';
  };
  customElements.define('sv-speech-control', class extends HTMLElement {
    connectedCallback() {
      var self = this, id = 'sv-speech-' + (++nextId);
      this.innerHTML = '<button type="button" class="sv-btn sv-btn--tonal" aria-describedby="' + id + '"></button>' +
        '<p id="' + id + '" class="sv-speech__status t-body-s t-muted"></p>';
      this.button = this.querySelector('button'); this.output = this.querySelector('p');
      this.update('idle');
      this._onSpeech = function (event) {
        if (event.detail.owner !== self) return;
        self.update(event.detail.status, event.detail.error);
      };
      document.addEventListener('sv:speech', this._onSpeech);
      this.button.addEventListener('click', function () {
        if (self.playing) { SV.speech.stop(self); return; }
        self.play();
      });
      // Content that appears because the user just touched something is read without another press.
      if (recent() && !this.hasAttribute('manual')) requestAnimationFrame(function () { self.autoplay(); });
    }
    /* Tên mục đọc trước nội dung để người nghe biết nội dung đó thuộc về gì */
    heading() {
      var own = this.getAttribute('speak-title');
      if (own !== null) return own;
      var details = this.closest('details'), dialog = this.closest('dialog');
      if (details && details.querySelector('summary')) return textOf(details.querySelector('summary'));
      var labelled = dialog && document.getElementById(dialog.getAttribute('aria-labelledby') || '');
      if (labelled) return textOf(labelled);
      for (var node = this.parentElement; node && node.tagName !== 'MAIN' && node.tagName !== 'BODY'; node = node.parentElement) {
        var h = node.querySelector('h1,h2,h3');
        if (h && !h.closest('sv-speech-control')) return textOf(h);
      }
      return '';
    }
    play() {
      var text = this.getAttribute('text') || '', title = this.heading();
      if (title && text.indexOf(title) !== 0) text = title + '. ' + text;
      SV.speech.speak(text, { owner: this, lang: this.getAttribute('lang') || 'vi-VN' });
    }
    autoplay() {
      // One automatic reading per touch, so several controls on a screen never talk over each other.
      if (this.hasAttribute('manual') || SV.settings.get('speechFeedback') !== 'voice' || this.playing || claimed === gesture || !visible(this)) return;
      claimed = gesture; this.play();
    }
    disconnectedCallback() { document.removeEventListener('sv:speech', this._onSpeech); SV.speech.stop(this); }
    update(status, error) {
      this.playing = status === 'preparing' || status === 'playing';
      if (status === 'preparing' || status === 'playing' || status === 'completed' || status === 'stopped') this.heard = true;
      var label = this.heard && !this.hasAttribute('manual') ? 'speech.replay' : this.getAttribute('label-key') || 'speech.listen';
      this.button.innerHTML = SV.icon(this.playing ? 'stop' : 'volume_up') + SV.esc(SV.t(this.playing ? 'speech.stop' : label));
      this.output.textContent = status === 'idle' ? '' : status === 'error' ? SV.speech.errorText(error) : SV.t('speech.' + status);
      this.output.classList.toggle('sv-speech__error', status === 'error');
      if (status === 'error') SV.announce(this.output.textContent, false, { speech: false });
    }
  });
  customElements.define('sv-speech-settings', class extends HTMLElement {
    connectedCallback() {
      var self = this;
      this.innerHTML = '<section class="l-section l-stack" aria-labelledby="sv-voice-title">' +
        '<h2 class="sv-section-title" id="sv-voice-title">' + SV.esc(SV.t('speech.settingsTitle')) + '</h2>' +
        '<p class="t-body-m t-muted">' + SV.esc(SV.t('speech.settingsNote')) + '</p>' +
        '<div class="sv-field"><label class="sv-field__label" for="sv-feedback-mode">' + SV.esc(SV.t('speech.feedbackLabel')) + '</label>' +
        '<select class="sv-field__control" id="sv-feedback-mode" aria-describedby="sv-feedback-help">' +
        '<option value="screenReader">' + SV.esc(SV.t('speech.screenReader')) + '</option><option value="voice">' + SV.esc(SV.t('speech.autoVoice')) + '</option></select>' +
        '<p class="sv-field__help" id="sv-feedback-help">' + SV.esc(SV.t('speech.feedbackHelp')) + '</p></div>' +
        '<div class="sv-field"><label class="sv-field__label" for="sv-voice">' + SV.esc(SV.t('speech.voiceLabel')) + '</label>' +
        '<select class="sv-field__control" id="sv-voice" aria-describedby="sv-voice-help"></select><p class="sv-field__help" id="sv-voice-help"></p></div>' +
        '<div class="sv-field"><label class="sv-field__label" for="sv-rate">' + SV.esc(SV.t('speech.rateLabel')) + '</label>' +
        '<select class="sv-field__control" id="sv-rate">' + [0.8, 1, 1.2].map(function (rate) {
          return '<option value="' + rate + '">' + SV.esc(SV.t('speech.rate' + String(rate).replace('.', ''))) + '</option>';
        }).join('') + '</select></div>' + SV.speechControl(SV.t('speech.sample'), 'speech.test', 'vi-VN', true) +
        '<button type="button" class="sv-btn sv-btn--text" data-refresh>' + SV.esc(SV.t('speech.refresh')) + '</button>' +
        '<p class="t-body-s t-muted">' + SV.esc(SV.t('speech.deviceNote')) + '</p></section>';
      this.querySelector('#sv-feedback-mode').value = SV.settings.get('speechFeedback');
      this.querySelector('#sv-rate').value = String(SV.settings.get('speechRate'));
      this._voices = this.updateVoices.bind(this); document.addEventListener('sv:voices', this._voices); this.updateVoices();
      // The first touch may switch the mode while this select is on screen.
      this._mode = function () { self.querySelector('#sv-feedback-mode').value = SV.settings.get('speechFeedback'); };
      document.addEventListener('sv:settings', this._mode);
      this.querySelector('#sv-feedback-mode').addEventListener('change', function (event) {
        var mode = event.target.value;
        SV.settings.set('speechChosen', true);
        SV.settings.set('speechFeedback', mode);
        SV.announce(SV.t('speech.saved'));
      });
      this.querySelector('#sv-rate').addEventListener('change', function (event) { SV.settings.set('speechRate', Number(event.target.value)); SV.announce(SV.t('speech.saved')); });
      this.querySelector('#sv-voice').addEventListener('change', function (event) { SV.settings.set('speechVoice', event.target.value); SV.announce(SV.t('speech.saved')); });
      this.querySelector('[data-refresh]').addEventListener('click', function () { SV.speech.refreshVoices(); SV.announce(SV.t('speech.refreshed'), false, { speech: false }); });
    }
    disconnectedCallback() { document.removeEventListener('sv:voices', this._voices); document.removeEventListener('sv:settings', this._mode); }
    updateVoices() {
      var select = this.querySelector('#sv-voice'), saved = SV.settings.get('speechVoice');
      var voices = SV.speech.getVoices().filter(function (v) { return /^vi(?:[-_]|$)/i.test(v.lang); });
      select.innerHTML = '<option value="">' + SV.esc(SV.t('speech.defaultVoice')) + '</option>' + voices.map(function (v) {
        return '<option value="' + SV.esc(v.voiceURI) + '">' + SV.esc(v.name + ' (' + v.lang + ')') + '</option>';
      }).join('');
      select.value = voices.some(function (v) { return v.voiceURI === saved; }) ? saved : '';
      this.querySelector('#sv-voice-help').textContent = !SV.speech.supported() ? SV.t('speech.unsupported') : !voices.length ? SV.t('speech.missingVoice') : SV.t('speech.voiceHelp');
    }
  });
  customElements.define('sv-speech-diagnostics', class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = '<section class="l-section l-stack"><h2 class="sv-section-title">' + SV.esc(SV.t('speech.diagnosticsTitle')) + '</h2>' +
        '<p class="t-body-m t-muted">' + SV.esc(SV.t('speech.diagnosticsNote')) + '</p><p data-diagnostics class="t-body-m"></p>' +
        SV.speechControl(SV.t('speech.sample'), 'speech.test', 'vi-VN', true) + '</section>';
      this._update = this.update.bind(this);
      document.addEventListener('sv:voices', this._update); document.addEventListener('sv:speech', this._update); this.update();
    }
    disconnectedCallback() { document.removeEventListener('sv:voices', this._update); document.removeEventListener('sv:speech', this._update); }
    update() {
      var voices = SV.speech.getVoices(), state = SV.speech.getState();
      this.querySelector('[data-diagnostics]').textContent = SV.t('speech.diagnostics', {
        supported: SV.t(SV.speech.supported() ? 'common.on' : 'common.off'), count: voices.length,
        vi: voices.filter(function (v) { return /^vi(?:[-_]|$)/i.test(v.lang); }).length,
        en: voices.filter(function (v) { return /^en(?:[-_]|$)/i.test(v.lang); }).length,
        status: state.status === 'error' ? SV.speech.errorText(state.error) : SV.t('speech.' + state.status)
      });
    }
  });
})();
