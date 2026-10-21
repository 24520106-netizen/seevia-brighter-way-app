/*
 * SeeVia · components/flows.js
 * Component có trạng thái cho từng luồng (nạp sau elements.js). Chữ từ content/vi.js, dữ liệu từ SV.state.
 *
 *   <sv-feature-groups>                 tab Tính năng (features.groups), mỗi mục mở sheet cách dùng
 *   <sv-community-notify>  <sv-sos-status>  <sv-hotline>
 *   <sv-info-list key="community.items"> danh sách chỉ để đọc
 *   <sv-accordion-list key="guide.items">
 *   <sv-profile-card>  <sv-profile-settings>  <sv-version-tap>
 *   <sv-activity-browser>               lọc + nhóm lịch sử
 *   <sv-album>  <sv-translator>  <sv-recorder>  <sv-glasses-manager>
 *   <sv-account>  <sv-support-form>  <sv-display-settings>  <sv-dev-handlers>
 */
(function () {
  var SV = window.SV;
  var icon = SV.icon, esc = SV.esc;

  function selfFocus(el) { if (el) el.focus({ preventScroll: true }); }
  function define(name, cls) { if (!customElements.get(name)) customElements.define(name, cls); }
  function field(id, labelKey, opts) {
    opts = opts || {};
    var err = opts.error;
    return '<div class="sv-field' + (err ? " sv-field--error" : "") + '">' +
      '<label class="sv-field__label" for="' + id + '">' + esc(SV.t(labelKey)) + "</label>" +
      (opts.multiline
        ? '<textarea class="sv-field__control" id="' + id + '"' + (opts.placeholder ? ' placeholder="' + esc(SV.t(opts.placeholder)) + '"' : "") +
          ' aria-describedby="' + id + '-help"' + (err ? ' aria-invalid="true"' : "") + ">" + esc(opts.value || "") + "</textarea>"
        : '<input class="sv-field__control" id="' + id + '" type="' + (opts.type || "text") + '"' +
          (opts.inputmode ? ' inputmode="' + opts.inputmode + '"' : "") +
          (opts.autocomplete ? ' autocomplete="' + opts.autocomplete + '"' : "") +
          (opts.maxlength ? ' maxlength="' + opts.maxlength + '"' : "") +
          (opts.placeholder ? ' placeholder="' + esc(SV.t(opts.placeholder)) + '"' : "") +
          ' value="' + esc(opts.value || "") + '" aria-describedby="' + id + '-help"' + (err ? ' aria-invalid="true"' : "") + ">") +
      '<p class="sv-field__help" id="' + id + '-help">' +
        (err ? icon("error") + "<span>" + esc(err) + "</span>" : opts.help ? esc(SV.t(opts.help)) : "") + "</p></div>";
  }
  SV.fieldHtml = field;

  /* ---------- Tính năng: nhóm + câu lệnh mẫu; chạm một tính năng để xem cách dùng ---------- */
  define("sv-feature-groups", class extends HTMLElement {
    connectedCallback() {
      var groups = SV.data("features.groups") || [];
      var sayLabel = SV.t("features.sayLabel");
      this.innerHTML = groups.map(function (g, gi) {
        return '<section class="l-section"><h2 class="sv-section-title">' + esc(g.title) + "</h2>" +
          '<ul class="sv-list" role="list">' + g.items.map(function (it, ii) {
            return '<li><button class="sv-list-item sv-feature" type="button" data-g="' + gi + '" data-i="' + ii + '">' +
              '<span class="sv-list-item__lead">' + icon(it.icon) + "</span>" +
              '<span class="sv-list-item__body"><span class="sv-list-item__title">' + esc(it.title) + "</span>" +
              '<span class="sv-feature__phase">' + esc(SV.t(it.phase === 'core' ? 'features.coreLabel' : 'features.conceptLabel')) + '</span>' +
              '<span class="sv-list-item__sub">' + esc(it.body) + "</span>" +
              '<span class="sv-feature__say">' + icon("record_voice_over") + "<span><b>" + esc(sayLabel) + ":</b> " + esc(it.say) + "</span></span>" +
              '</span><span class="sv-list-item__trail">' + icon("chevron_right") + "</span></button></li>";
          }).join("") + "</ul></section>";
      }).join("");
      this.addEventListener("click", function (event) {
        var btn = event.target.closest("[data-g]");
        if (!btn) return;
        var it = groups[+btn.getAttribute("data-g")].items[+btn.getAttribute("data-i")];
        SV.openSheet(
          '<div class="sv-sheet__lead">' + icon(it.icon) + "</div>" +
          '<h2 class="sv-sheet__title t-headline-s" id="sv-feat-title">' + esc(it.title) + "</h2>" +
          '<p class="sv-feature__phase">' + esc(SV.t(it.phase === 'core' ? 'features.coreLabel' : 'features.conceptLabel')) + '</p>' +
          '<p class="sv-sheet__body t-body-m" id="sv-feat-body">' + esc(it.body) + "</p>" +
          '<p class="t-body-m t-muted">' + esc(SV.t('features.limit')) + '</p>' +
          '<p class="sv-sheet__say">' + icon("record_voice_over") + "<span><b>" + esc(sayLabel) + ":</b> " + esc(it.say) + "</span></p>" +
          '<h3 class="sv-sheet__subtitle">' + esc(SV.t("features.stepsTitle")) + "</h3>" +
          '<ol class="sv-steps">' + (it.steps || []).map(function (st) { return "<li>" + esc(st) + "</li>"; }).join("") + "</ol>" +
          '<div class="sv-sheet__actions">' +
            SV.speechControl(it.say.replace(/[“”]/g, ''), 'features.listen') +
            '<a class="sv-btn sv-btn--text sv-btn--block" href="guide.html#voice">' + esc(SV.t("features.guide")) + "</a>" +
            '<button class="sv-btn sv-btn--text sv-btn--block" value="cancel">' + esc(SV.t("common.close")) + "</button>" +
          "</div>",
          {
            labelledBy: "sv-feat-title", describedBy: "sv-feat-body", focus: "#sv-feat-title"
          }
        );
      });
    }
  });

  /* ---------- Cộng đồng: bật thông báo buổi gặp ---------- */
  define("sv-community-notify", class extends HTMLElement {
    connectedCallback() {
      var on = !!SV.state.get("communityNotify");
      this.innerHTML = '<ul class="sv-list" role="list"><li><label class="sv-list-item" for="sv-notify">' +
        '<span class="sv-list-item__lead">' + icon("notifications_active") + "</span>" +
        '<span class="sv-list-item__body"><span class="sv-list-item__title">' + esc(SV.t("community.notifyTitle")) + "</span>" +
        '<span class="sv-list-item__sub">' + esc(SV.t("community.notifySub")) + "</span></span>" +
        '<span class="sv-list-item__trail"><button class="sv-switch" id="sv-notify" role="switch" aria-checked="' + on + '">' +
        '<span class="sv-switch__handle">' + icon("check") + "</span></button></span></label></li></ul>";
      this.querySelector("#sv-notify").addEventListener("sv:change", function (e) {
        SV.state.set("communityNotify", e.detail.checked);
        SV.snackbar(SV.t(e.detail.checked ? "community.notifyOn" : "community.notifyOff"), null, { speech: true });
      });
    }
  });

  /* ---------- Trang chủ: dòng trạng thái SOS trong vùng Dusk ---------- */
  define("sv-sos-status", class extends HTMLElement {
    connectedCallback() {
      var phone = SV.state.get("emergencyPhone");
      this.innerHTML = '<a class="sv-sos-status' + (phone ? "" : " sv-sos-status--missing") + '" href="safety.html">' +
        '<span class="sv-sos-status__icon">' + icon(phone ? "emergency_home" : "add_call", "sv-icon--fill") + "</span>" +
        '<span class="sv-sos-status__body"><span class="sv-sos-status__title">' + esc(phone ? SV.t("home.sosReady", { phone: SV.keepTogether(phone) }) : SV.t("home.sosMissing")) + "</span>" +
        '<span class="sv-sos-status__sub">' + esc(SV.t(phone ? "home.sosReadySub" : "home.sosMissingSub")) + "</span></span>" +
        icon("chevron_right") + "</a>";
    }
  });

  /* ---------- Hỗ trợ: hotline (mô phỏng) ---------- */
  define("sv-hotline", class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = '<button class="sv-hotline" type="button">' + icon("support_agent") +
        '<span class="sv-hotline__text"><span class="sv-hotline__title">' + esc(SV.t("support.hotlineTitle")) + "</span>" +
        '<span class="sv-hotline__body">' + esc(SV.t("support.hotlineBody")) + "</span></span>" +
        icon("call", "sv-icon--fill sv-hotline__call") + "</button>";
      this.querySelector("button").addEventListener("click", function () { SV.snackbar(SV.t("support.hotlineToast"), null, { speech: true }); });
    }
  });

  /* ---------- Danh sách chỉ để đọc ---------- */
  define("sv-info-list", class extends HTMLElement {
    connectedCallback() {
      var items = SV.data(this.getAttribute("key")) || [];
      this.innerHTML = '<ul class="sv-info-list" role="list">' + items.map(function (it) {
        return '<li class="sv-info"><span class="sv-info__icon">' + icon(it.icon) + "</span>" +
          '<div class="sv-info__body"><h3 class="sv-info__title">' + esc(it.title) + "</h3>" +
          '<p class="sv-info__text">' + esc(it.body) + "</p></div></li>";
      }).join("") + "</ul>";
    }
  });

  /* ---------- Accordion từ content (q, a, icon) ---------- */
  define("sv-accordion-list", class extends HTMLElement {
    connectedCallback() {
      var items = SV.data(this.getAttribute("key")) || [];
      /* Mở mục khớp với #id trên đường dẫn (ví dụ guide.html#voice), nếu không thì mục đầu */
      var hash = location.hash.slice(1);
      var target = items.some(function (it) { return it.id && it.id === hash; }) ? hash : null;
      var openFirst = this.hasAttribute("open-first") && !target;
      this.innerHTML = items.map(function (it, i) {
        var open = target ? it.id === target : openFirst && i === 0;
        return '<details class="sv-accordion"' + (it.id ? ' id="' + it.id + '"' : "") + (open ? " open" : "") + ">" +
          "<summary>" + icon(it.icon || "help") + "<span>" + esc(it.q) + "</span>" + icon("expand_more") + "</summary>" +
          '<div class="sv-accordion__body"><p class="t-body-m">' + esc(it.a) + '</p>' + SV.speechControl(it.a, 'speech.guideListen') + '</div></details>';
      }).join("");
      this.addEventListener('toggle', function (event) { if (event.target.matches('details') && !event.target.open) SV.speech.stop(event.target); }, true);
      if (target) {
        var el = this.querySelector("#" + target + " summary");
        setTimeout(function () { el.scrollIntoView({ block: "start" }); el.focus({ preventScroll: true }); }, 0);
      }
    }
  });

  /* ---------- Hồ sơ ---------- */
  define("sv-profile-card", class extends HTMLElement {
    connectedCallback() {
      var g = SV.state.get("glasses");
      var acc = SV.state.get("account");
      var name = acc.signedIn ? acc.name || SV.t("profile.name") : SV.t("profile.guest");
      var sub = acc.signedIn ? SV.t("profile.ids", { serial: SV.keepTogether(g.linked ? g.serial : "—") }) : SV.t("profile.guestSub");
      this.innerHTML = '<section class="sv-profile">' +
        '<span class="sv-profile__avatar">' + icon("person", "sv-icon--fill") + "</span>" +
        '<div><p class="sv-profile__name">' + esc(name) + "</p>" +
        '<p class="sv-profile__ids">' + esc(sub) + "</p></div></section>";
    }
  });

  SV.profileValue = {
    display: function () {
      var v = SV.t("profile.fontValue." + SV.settings.get("font"));
      return SV.settings.get("contrast") === "on" ? v + " · " + SV.t("profile.contrastValue") : v;
    },
    glasses: function () { return SV.t(SV.state.get("glasses").linked ? "profile.glassesLinked" : "profile.glassesUnlinked"); },
    emergency: function () { return SV.state.get("emergencyPhone") || SV.t("profile.emergencyNone"); },
    account: function () { return SV.t(SV.state.get("account").signedIn ? "profile.accountIn" : "profile.accountOut"); }
  };

  define("sv-profile-settings", class extends HTMLElement {
    connectedCallback() {
      var rows = [
        ["display.html", "contrast", "profile.display", "display"],
        ["glasses.html", "eyeglasses", "profile.glasses", "glasses"],
        ["safety.html", "contact_emergency", "profile.emergency", "emergency"],
        ["account.html", "account_circle", "profile.account", "account"],
        ["support.html", "support_agent", "profile.support", null],
        ["guide.html?from=profile", "menu_book", "profile.guide", null]
      ];
      this.innerHTML = '<ul class="sv-list" role="list">' + rows.map(function (r) {
        return '<li><a class="sv-list-item sv-list-item--compact" href="' + r[0] + '">' +
          '<span class="sv-list-item__lead">' + icon(r[1]) + "</span>" +
          '<span class="sv-list-item__body"><span class="sv-list-item__title">' + esc(SV.t(r[2])) + "</span>" +
          (r[3] ? '<span class="sv-list-item__sub">' + esc(SV.profileValue[r[3]]()) + "</span>" : "") + "</span>" +
          '<span class="sv-list-item__trail">' + icon("chevron_right") + "</span></a></li>";
      }).join("") + "</ul>";
    }
  });

  /* Chạm 7 lần vào dòng phiên bản để mở Kiểm thử action */
  define("sv-version-tap", class extends HTMLElement {
    connectedCallback() {
      var self = this, count = 0, timer;
      /* Trông như một dòng cài đặt bấm được (đúng là bấm được: 7 lần mở công cụ nội bộ) */
      this.innerHTML = '<ul class="sv-list" role="list"><li><button class="sv-list-item sv-list-item--compact sv-version" type="button">' +
        '<span class="sv-list-item__lead">' + icon("info") + "</span>" +
        '<span class="sv-list-item__body"><span class="sv-list-item__title">' + esc(SV.t("profile.versionTitle")) + "</span></span>" +
        '<span class="sv-list-item__trail"><span>' + esc(SV.t("profile.versionValue")) + "</span></span></button></li></ul>";
      this.querySelector("button").addEventListener("click", function () {
        if (SV.state.get("devUnlocked")) { SV.go("dev-test.html"); return; }
        clearTimeout(timer);
        count += 1;
        timer = setTimeout(function () { count = 0; }, 3000);
        if (count >= 7) {
          SV.state.set("devUnlocked", true);
          SV.snackbar(SV.t("profile.devUnlocked"));
          setTimeout(function () { SV.go("dev-test.html"); }, 900);
        } else if (count >= 3) {
          SV.snackbar(SV.t("profile.versionHint", { count: 7 - count }));
        }
      });
    }
  });

  /* ---------- Lịch sử: chip lọc + danh sách nhóm theo ngày ---------- */
  define("sv-activity-browser", class extends HTMLElement {
    connectedCallback() {
      var self = this;
      this.innerHTML =
        '<div class="sv-chip-row" role="group" aria-label="' + esc(SV.t("activityPage.filterLabel")) + '">' +
          '<button class="sv-chip" type="button" data-filter="" aria-pressed="true">' + icon("check") + esc(SV.t("activityPage.filterAll")) + "</button>" +
          '<button class="sv-chip" type="button" data-filter="done" aria-pressed="false">' + esc(SV.t("activityPage.filterDone")) + "</button>" +
          '<button class="sv-chip" type="button" data-filter="failed" aria-pressed="false">' + esc(SV.t("activityPage.filterFailed")) + "</button>" +
        "</div><sv-activity-list grouped></sv-activity-list>";
      var list = this.querySelector("sv-activity-list");
      this.querySelectorAll("[data-filter]").forEach(function (chip) {
        chip.addEventListener("click", function () {
          /* Lọc là chọn một: bỏ hành vi bật/tắt chung của chip */
          self.querySelectorAll("[data-filter]").forEach(function (c) {
            var on = c === chip;
            c.setAttribute("aria-pressed", String(on));
            var check = c.querySelector(".sv-icon");
            if (on && !check) c.insertAdjacentHTML("afterbegin", icon("check"));
            if (!on && check) check.remove();
          });
          var v = chip.getAttribute("data-filter");
          if (v) list.setAttribute("status", v); else list.removeAttribute("status");
          SV.announce(SV.t('speech.filterResult', { count: list.querySelectorAll('[data-act]').length }));
        });
      });
    }
  });

  /* ---------- Ảnh và video ---------- */
  define("sv-album", class extends HTMLElement {
    connectedCallback() { this.render(); }
    render() {
      var self = this;
      var removed = SV.state.get("albumRemoved") || [];
      var items = (SV.data("album.items") || []).map(function (it, i) { return Object.assign({ index: i }, it); })
        .filter(function (it) { return removed.indexOf(it.index) < 0; });
      if (!items.length) {
        this.innerHTML = '<div class="sv-empty"><div class="sv-empty__mark">' + SV.sparkSvg() + "</div>" +
          '<p class="sv-empty__title">' + esc(SV.t("album.emptyTitle")) + "</p>" +
          '<p class="sv-empty__body t-body-m">' + esc(SV.t("album.emptyBody")) + "</p>" +
          '<a class="sv-btn sv-btn--tonal" href="guide.html">' + esc(SV.t("album.emptyAction")) + "</a>" +
          '<button class="sv-btn sv-btn--text" type="button" data-restore>' + esc(SV.t("album.restore")) + "</button></div>";
        this.querySelector("[data-restore]").addEventListener("click", function () {
          SV.state.set("albumRemoved", []);
          self.render();
          var first = self.querySelector('.sv-photo'); if (first) first.focus();
        });
        return;
      }
      this.innerHTML = '<ul class="sv-album" role="list">' + items.map(function (it) {
        return '<li><button class="sv-photo" type="button" data-index="' + it.index + '" aria-label="' + esc(SV.t("album.openAriaFull", { title: it.title, desc: it.desc, time: it.time })) + '">' +
          '<span class="sv-photo__frame">' + icon(it.icon) + '<span class="sv-photo__tag">' + esc(SV.t("album.illustration")) + "</span></span>" +
          '<span class="sv-photo__title">' + esc(it.title) + "</span>" +
          '<span class="sv-photo__time">' + icon("photo_camera") + esc(it.time) + "</span></button></li>";
      }).join("") + "</ul>";
      this.querySelectorAll(".sv-photo").forEach(function (btn) {
        btn.addEventListener("click", function () { self.open(parseInt(btn.getAttribute("data-index"), 10)); });
      });
    }
    open(index) {
      var self = this;
      var it = SV.data("album.items")[index];
      SV.openSheet(
        '<div class="sv-photo__frame sv-photo__frame--large">' + icon(it.icon) + '<span class="sv-photo__tag">' + esc(SV.t("album.illustration")) + "</span></div>" +
        '<h2 class="sv-sheet__title t-headline-s" id="sv-photo-title">' + esc(it.title) + "</h2>" +
        '<p class="sv-sheet__body t-body-l" id="sv-photo-desc">' + esc(it.desc) + '<br><span class="t-body-s t-muted">' + esc(it.time) + "</span></p>" +
        '<p class="sv-sheet__note t-body-s">' + icon("info") + "<span>" + esc(SV.t("album.verifyNote")) + "</span></p>" +
        '<div class="sv-sheet__actions">' +
          SV.speechControl(it.desc, 'album.listen') +
          '<button class="sv-btn sv-btn--danger-text sv-btn--block" value="delete">' + icon("delete") + esc(SV.t("album.delete")) + "</button>" +
          '<button class="sv-btn sv-btn--text sv-btn--block" value="cancel">' + esc(SV.t("common.close")) + "</button>" +
        "</div>",
        {
          labelledBy: "sv-photo-title", describedBy: "sv-photo-desc", focus: "#sv-photo-title",
          onClose: function (value) {
            if (value === "delete") {
              SV.confirmSheet({
                title: SV.t("album.deleteTitle"), body: SV.t("album.deleteBody"),
                confirm: SV.t("album.deleteConfirm"), cancel: SV.t("album.deleteCancel"), danger: true,
                onConfirm: function () {
                  SV.state.set("albumRemoved", (SV.state.get("albumRemoved") || []).concat(index));
                  self.render();
                  var remaining = self.querySelector('[data-index="' + (index + 1) + '"]') || self.querySelector('.sv-photo') || self.querySelector('.sv-empty__title');
                  if (remaining) { remaining.setAttribute('tabindex', remaining.matches('button') ? '0' : '-1'); remaining.focus(); }
                  SV.snackbar(SV.t("album.deleted"), {
                    label: SV.t("common.undo"),
                    onClick: function () {
                      SV.state.set("albumRemoved", (SV.state.get("albumRemoved") || []).filter(function (n) { return n !== index; }));
                      self.render();
                      var back = self.querySelector('[data-index="' + index + '"]');
                      if (back) back.focus();
                    }
                  }, { speech: true });
                }
              });
            }
          }
        }
      );
    }
  });

  /* ---------- Dịch thuật ---------- */
  define('sv-translator', class extends HTMLElement {
    connectedCallback() { this.from = 'en'; this.to = 'vi'; this.render(); }
    render(error) {
      var self = this, samples = SV.data('translation.samples'), text = this._text || '';
      this.innerHTML = '<div class="sv-langs">' +
        '<div class="sv-langs__side"><span class="sv-langs__label">' + esc(SV.t('translation.from')) + '</span><span class="sv-langs__name">' + esc(SV.t('translation.' + this.from)) + '</span></div>' +
        '<button class="sv-icon-btn sv-icon-btn--tonal" type="button" data-swap aria-label="' + esc(SV.t('translation.swap')) + '">' + icon('swap_horiz') + '</button>' +
        '<div class="sv-langs__side sv-langs__side--end"><span class="sv-langs__label">' + esc(SV.t('translation.to')) + '</span><span class="sv-langs__name">' + esc(SV.t('translation.' + this.to)) + '</span></div></div>' +
        '<form class="l-stack sv-translator__form" novalidate>' +
        '<div class="sv-field"><label class="sv-field__label" for="sv-tr-sample">' + esc(SV.t('translation.sampleLabel')) + '</label>' +
        '<select class="sv-field__control" id="sv-tr-sample" aria-describedby="sv-tr-sample-help"><option value="">' + esc(SV.t('translation.samplePlaceholder')) + '</option>' +
        samples.map(function (sample, i) { return '<option value="' + i + '"' + (sample[self.from] === text ? ' selected' : '') + '>' + esc(sample[self.from]) + '</option>'; }).join('') + '</select>' +
        '<p class="sv-field__help" id="sv-tr-sample-help">' + esc(SV.t('translation.sampleHint')) + '</p></div>' +
        field('sv-tr-input', 'translation.inputLabel', { multiline: true, placeholder: 'translation.inputPlaceholder', value: text, error: error }) +
        '<div class="l-split"><button class="sv-btn sv-btn--tonal" type="button" data-speak>' + icon('mic') + esc(SV.t('translation.speak')) + '</button>' +
        '<button class="sv-btn sv-btn--filled" type="submit">' + icon('translate') + esc(SV.t('translation.translate')) + '</button></div></form>' +
        (this._result ? '<section class="sv-card sv-result"><h2 class="t-title-m" tabindex="-1" id="sv-tr-result">' + esc(SV.t('translation.resultTitle')) + '</h2>' +
          '<p class="t-body-l" lang="' + this.to + '">' + esc(this._result) + '</p>' +
          SV.speechControl(this._result, 'translation.listen', this.to === 'vi' ? 'vi-VN' : 'en-US') + '</section>' : '');
      var input = this.querySelector('textarea');
      input.addEventListener('input', function () {
        self._text = input.value;
        // An edited source invalidates the old translation and its audio immediately.
        if (self._result) { SV.speech.stop(self); self._result = null; var result = self.querySelector('.sv-result'); if (result) result.remove(); }
      });
      this.querySelector('#sv-tr-sample').addEventListener('change', function (event) {
        if (event.target.value === '') return;
        SV.speech.stop(self); self._text = samples[Number(event.target.value)][self.from]; self._result = null;
        self.render(); self.querySelector('#sv-tr-sample').focus();
      });
      this.querySelector('[data-swap]').addEventListener('click', function () {
        SV.speech.stop(self);
        var previous = samples.find(function (sample) { return sample[self.from] === self._text; });
        var from = self.from; self.from = self.to; self.to = from;
        self._text = previous ? previous[self.from] : ''; self._result = null; self.render();
        self.querySelector('[data-swap]').focus();
        SV.announce(SV.t('translation.swapped', { from: SV.t('translation.' + self.from), to: SV.t('translation.' + self.to) }));
      });
      this.querySelector('[data-speak]').addEventListener('click', function () { SV.snackbar(SV.t('translation.speakToast'), null, { speech: true }); });
      this.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault(); SV.speech.stop(self);
        var value = input.value.trim();
        var sample = samples.find(function (item) { return item[self.from].toLocaleLowerCase() === value.toLocaleLowerCase(); });
        self._result = sample ? sample[self.to] : null;
        if (!sample) { self.render(SV.t(value ? 'translation.unsupportedInput' : 'translation.emptyError')); self.querySelector('textarea').focus(); return; }
        self.render(); self.querySelector('sv-speech-control button').focus();
        SV.announce(SV.t('translation.resultTitle'));
      });
    }
  });

  /* ---------- Biên bản họp: ghi âm mô phỏng ---------- */
  function mmss(sec) { return String(Math.floor(sec / 60)).padStart(2, "0") + ":" + String(sec % 60).padStart(2, "0"); }

  define("sv-recorder", class extends HTMLElement {
    connectedCallback() { this.recording = false; this.seconds = 0; this.render(); }
    disconnectedCallback() { clearInterval(this.timer); }
    render() {
      var self = this;
      var saved = (SV.state.get("meetings") || []).concat(SV.data("meeting.items") || []);
      this.innerHTML =
        '<section class="sv-recorder' + (this.recording ? " is-recording" : "") + '">' +
          '<button class="sv-recorder__button" type="button">' +
            '<span class="sv-recorder__circle">' + icon(this.recording ? "stop" : "mic", "sv-icon--fill") + "</span>" +
            '<span class="sv-recorder__label">' + esc(SV.t(this.recording ? "meeting.stop" : "meeting.start")) + "</span></button>" +
          '<p class="sv-recorder__status">' + esc(SV.t(this.recording ? "meeting.recording" : "meeting.ready")) + "</p>" +
          '<p class="sv-recorder__timer"><span class="visually-hidden">' + esc(SV.t("meeting.timerLabel")) + " </span><span data-timer>" + mmss(this.seconds) + "</span></p>" +
          '<p class="sv-recorder__hint t-body-m t-muted">' + esc(SV.t("meeting.hint")) + "</p>" +
        "</section>" +
        '<section class="l-section"><h2 class="sv-section-title">' + esc(SV.t("meeting.savedTitle")) + "</h2>" +
          '<ul class="sv-list" role="list">' + saved.map(function (m, i) {
            return '<li><button class="sv-list-item sv-activity" type="button" data-m="' + i + '" aria-label="' + esc(SV.t("meeting.openAria", { title: m.title, time: m.time })) + '">' +
              '<span class="sv-list-item__lead">' + icon("groups") + "</span>" +
              '<span class="sv-list-item__body"><span class="sv-list-item__title">' + esc(m.title) + "</span>" +
              '<span class="sv-list-item__sub">' + esc(m.summary) + "</span>" +
              '<span class="sv-activity__time">' + esc(m.time) + "</span></span>" +
              '<span class="sv-list-item__trail">' + icon("chevron_right") + "</span></button></li>";
          }).join("") + "</ul></section>";
      this.querySelector(".sv-recorder__button").addEventListener("click", function () { self.toggle(); });
      this.querySelectorAll("[data-m]").forEach(function (row) {
        row.addEventListener("click", function () {
          var m = saved[+row.getAttribute("data-m")];
          SV.openSheet(
            '<div class="sv-sheet__lead">' + icon("groups") + "</div>" +
            '<h2 class="sv-sheet__title t-headline-s" id="sv-meet-title">' + esc(m.title) + "</h2>" +
            '<p class="sv-sheet__meta"><span class="t-body-s t-muted">' + esc(m.time) + "</span></p>" +
            '<h3 class="sv-sheet__subtitle">' + esc(SV.t("meeting.summaryTitle")) + "</h3>" +
            '<p class="sv-sheet__body t-body-l" id="sv-meet-body">' + esc(m.summary) + "</p>" +
            '<div class="sv-sheet__actions">' + SV.speechControl(m.summary, 'speech.meetingListen') + '<button class="sv-btn sv-btn--text sv-btn--block" value="cancel">' + esc(SV.t("common.close")) + "</button></div>",
            { labelledBy: "sv-meet-title", describedBy: "sv-meet-body", focus: "#sv-meet-title" }
          );
        });
      });
    }
    toggle() {
      var self = this;
      if (!this.recording) {
        this.recording = true; this.seconds = 0;
        this.timer = setInterval(function () {
          self.seconds += 1;
          var t = self.querySelector("[data-timer]");
          if (t) t.textContent = mmss(self.seconds);
        }, 1000);
      } else {
        clearInterval(this.timer);
        this.recording = false;
        var list = SV.state.get("meetings") || [];
        list.unshift({ title: SV.t("meeting.newTitle"), summary: SV.t("meeting.newSummary"), time: SV.t("meeting.newTime", { duration: mmss(this.seconds) }) });
        SV.state.set("meetings", list.slice(0, 5));
        this.seconds = 0;
        SV.snackbar(SV.t("meeting.saved"), null, { speech: true });
      }
      this.render();
      this.querySelector(".sv-recorder__button").focus();
      if (this.recording) SV.announce(SV.t('meeting.recording'));
    }
  });

  /* ---------- Thiết lập và khôi phục kính: chỉ mô phỏng, không gọi thiết bị/API ---------- */
  function setupButton(key, action, kind) {
    return '<button type="button" class="sv-btn sv-btn--' + (kind || 'filled') + ' sv-btn--block" data-setup="' + action + '">' + esc(SV.t('setup.' + key)) + '</button>';
  }
  function setupLink(key, href, kind) {
    return '<a class="sv-btn sv-btn--' + (kind || 'text') + ' sv-btn--block" href="' + href + '">' + esc(SV.t('setup.' + key)) + '</a>';
  }
  function scenarioSelect(id, label, options, selected) {
    return '<div class="sv-field"><label class="sv-field__label" for="' + id + '">' + esc(SV.t('setup.' + label)) + '</label>' +
      '<select class="sv-field__control" id="' + id + '">' + options.map(function (o) {
        return '<option value="' + o[0] + '"' + (selected === o[0] ? ' selected' : '') + '>' + esc(SV.t('setup.' + o[1])) + '</option>';
      }).join('') + '</select></div>';
  }
  function scenarioDetails(content) {
    return '<details class="sv-setup-scenario"><summary>' + esc(SV.t('setup.scenarioTitle')) + '</summary>' + content + '</details>';
  }
  function deviceStateSelect(kind) {
    return '<div class="sv-field"><label class="sv-field__label" for="sv-device-state">' + esc(SV.t('deviceStatus.scenarioLabel')) + '</label>' +
      '<select class="sv-field__control" id="sv-device-state">' + ['ready', 'lost', 'serviceUnavailable', 'serviceUnknown', 'unknown', 'stale'].map(function (value) {
        return '<option value="' + value + '"' + (kind === value ? ' selected' : '') + '>' + esc(SV.t('deviceStatus.' + value)) + '</option>';
      }).join('') + '</select></div>';
  }
  function bindStatusSpeech(host) {
    host._stopVoice = function () { SV.speech.stop(host); };
    var control = host.querySelector('sv-speech-control');
    if (control) control.setAttribute('text', SV.glassesSpeech());
  }
  function speechControls() {
    return SV.speechControl(SV.glassesSpeech(), 'setup.listen');
  }
  define('sv-setup-progress', class extends HTMLElement {
    connectedCallback() {
      if (!this.hasAttribute('always') && new URLSearchParams(location.search).get('setup') !== '1') { this.hidden = true; return; }
      var step = Number(this.getAttribute('step')) || 1;
      var keys = ['stepAccount', 'stepConnect', 'stepReady', 'stepFirstRead'];
      this.innerHTML = '<p class="visually-hidden">' + esc(SV.t('setup.stepOf', { n: step, name: SV.t('setup.' + keys[step - 1]).replace(/^\d+\.\s*/, '') })) + '</p>' +
        '<ol class="sv-setup-progress" aria-hidden="true">' +
        ['stepAccount', 'stepConnect', 'stepReady', 'stepFirstRead'].map(function (key, i) {
          return '<li' + (i + 1 === step ? ' aria-current="step"' : '') + '>' + esc(SV.t('setup.' + key)) + '</li>';
        }).join('') + '</ol>';
    }
  });
  define('sv-setup-start', class extends HTMLElement {
    connectedCallback() {
      var more = (SV.state.get('account').signedIn ? setupLink('resume', 'home.html', 'tonal') : '') +
        '<p class="t-body-m t-muted">' + esc(SV.t('setup.startNote')) + '</p>' +
        '<p class="t-body-m t-muted">' + esc(SV.t('setup.demoNote')) + '</p>' + setupLink('explore', 'home.html');
      this.innerHTML = '<div class="sv-setup-brand"><sv-logo variant="full" height="48"></sv-logo></div>' +
        '<p class="t-label-m sv-setup-badge">' + esc(SV.t('setup.mockBadge')) + '</p>' +
        '<h1 class="t-headline-l sv-setup-heading">' + esc(SV.t('setup.welcomeTitle')) + '</h1>' +
        '<p class="t-body-l sv-setup-lead">' + esc(SV.t('setup.welcomeBody')) + '</p>' +
        '<div class="sv-setup-actions">' + setupButton('start', 'start') +
        SV.speechControl(SV.t('setup.welcomeTitle') + '. ' + SV.t('setup.welcomeBody') + ' ' + SV.t('setup.demoNote'), 'speech.welcomeListen') +
        setupLink('accessSettings', 'display.html?from=start', 'text') + '</div>' +
        '<details class="sv-setup-scenario"><summary>' + esc(SV.t('setup.moreTitle')) + '</summary><div class="sv-setup-actions">' + more + '</div></details>';
      this.querySelector('[data-setup="start"]').addEventListener('click', function () {
        SV.state.set('account', { signedIn: false, name: '', phone: '' });
        SV.state.set('glasses', { linked: false, connection: 'unlinked', online: null, service: 'unknown', updatedAt: null, battery: null, version: '2.1.4', serial: 'SV-DEMO-2026' });
        SV.state.set('firstReadDone', false);
        SV.go('account.html?setup=1');
      });
    }
  });
  define('sv-glasses-manager', class extends HTMLElement {
    connectedCallback() {
      var g = SV.state.get('glasses');
      var status = SV.glassesStatus(g);
      this.phase = !SV.state.get('account').signedIn ? 'signin' : !g.linked ? 'find' : status.kind === 'ready' ? 'ready' : status.kind === 'lost' ? 'lost' : 'unknown';
      this.network = g.network || '';
      this.password = '';
      this.scenario = 'success';
      this.findScenario = 'found';
      this.render();
      this.speakPhase();
      var self = this;
      this._freshness = setInterval(function () {
        var kind = SV.glassesStatus().kind;
        if (['ready', 'lost', 'unknown'].indexOf(self.phase) !== -1 && self._statusKind !== kind) {
          var hadFocus = self.contains(document.activeElement);
          self.phase = kind === 'ready' ? 'ready' : kind === 'lost' ? 'lost' : 'unknown'; self.render();
          if (hadFocus) self.querySelector('[data-stage-heading]').focus();
          else SV.announce(SV.glassesStatusText(SV.glassesStatus()));
        }
      }, 30000);
    }
    disconnectedCallback() { clearTimeout(this.timer); clearInterval(this._freshness); if (this._stopVoice) this._stopVoice(); this.password = ''; }
    move(phase) {
      clearTimeout(this.timer);
      this.phase = phase;
      this.render();
      var heading = this.querySelector('[data-stage-heading]');
      if (heading) heading.focus();
      this.speakPhase();
    }
    /* Tự nói trạng thái mỗi khi vào bước mới, không cần chạm. Nếu trình duyệt chặn tiếng
       (chưa có thao tác nào trên trang) thì rơi về vùng thông báo cho trình đọc màn hình. */
    speakPhase() {
      var p = this.phase, status = SV.glassesStatus();
      var titles = { signin: 'signInTitle', find: 'findTitle', searching: 'searchingTitle', found: 'foundTitle', notFound: 'notFoundTitle', wifi: 'wifiTitle', connecting: 'connectingTitle', recovering: 'recoveringTitle', error: this.failure === 'password' ? 'wrongPasswordTitle' : 'serviceTitle' };
      var bodies = { signin: 'signInBody', find: 'findBody', searching: 'searchingBody', found: 'foundBody', notFound: 'notFoundBody', wifi: 'wifiBody', connecting: 'connectingBody', recovering: 'recoveringBody', error: this.failure === 'password' ? 'wrongPasswordBody' : 'serviceBody' };
      var text = titles[p] ? SV.t('setup.' + titles[p]) + '. ' + SV.t('setup.' + bodies[p]) : SV.glassesSpeech() + (p === 'ready' ? ' ' + SV.t('setup.readyBody') : '');
      var chosen = SV.settings.get('speechChosen') && SV.settings.get('speechFeedback') === 'screenReader';
      var done = false, fallback = function () { if (!done) { done = true; SV.announce(text, false, { speech: false }); } };
      if (chosen || document.hidden) { fallback(); return; }
      if (!SV.speech.speak(text, { owner: this, priority: 'feedback', onError: fallback })) fallback();
    }
    search() {
      var self = this;
      this.move('searching');
      this.timer = setTimeout(function () { if (self.isConnected) self.move(self.findScenario === 'missing' ? 'notFound' : 'found'); }, 1100);
    }
    connect(recovery) {
      var self = this;
      this.recovery = recovery;
      this.move(recovery ? 'recovering' : 'connecting');
      this.timer = setTimeout(function () {
        if (!self.isConnected) return;
        if (self.scenario !== 'success') {
          if (self.scenario === 'service' && SV.state.get('glasses').linked)
            SV.state.set('glasses', Object.assign({}, SV.state.get('glasses'), { connection: 'linked', online: true, service: 'unavailable', battery: null, updatedAt: Date.now() }));
          self.failure = self.scenario; self.move('error'); return;
        }
        SV.state.set('glasses', Object.assign({}, SV.state.get('glasses'), {
          linked: true, connection: 'ready', online: true, service: 'ready', updatedAt: Date.now(), battery: 82,
          network: self.network || 'SeeVia Demo 2.4 GHz'
        }));
        self.password = '';
        self.recovered = recovery;
        self.move('ready');
      }, 1200);
    }
    render(errors) {
      if (this._stopVoice) this._stopVoice();
      errors = errors || {};
      var self = this, p = this.phase, g = SV.state.get('glasses'), status = SV.glassesStatus(g);
      this._statusKind = status.kind;
      var busy = ['searching', 'connecting', 'recovering'].indexOf(p) !== -1;
      var titles = { signin: 'signInTitle', find: 'findTitle', searching: 'searchingTitle', found: 'foundTitle', notFound: 'notFoundTitle', wifi: 'wifiTitle', connecting: 'connectingTitle', ready: 'readyTitle', lost: 'lostTitle', recovering: 'recoveringTitle' };
      var bodies = { signin: 'signInBody', find: 'findBody', searching: 'searchingBody', found: 'foundBody', notFound: 'notFoundBody', wifi: 'wifiBody', connecting: 'connectingBody', ready: 'readyBody', lost: 'lostBody', recovering: 'recoveringBody' };
      if (p === 'error') {
        titles.error = this.failure === 'password' ? 'wrongPasswordTitle' : 'serviceTitle';
        bodies.error = this.failure === 'password' ? 'wrongPasswordBody' : 'serviceBody';
      }
      var html = (!g.linked || p === 'ready') && p !== 'signin' ? '<sv-setup-progress always step="' + (p === 'ready' ? '3' : '2') + '"></sv-setup-progress>' : '';
      html += '<section class="sv-setup-stage"><h2 class="t-headline-s sv-setup-heading" tabindex="-1" data-stage-heading aria-describedby="sv-connection-description">' + esc(p === 'unknown' ? SV.glassesStatusText(status) : SV.t('setup.' + titles[p])) + '</h2>' +
        '<p class="t-body-m" id="sv-connection-description">' + esc(p === 'unknown' ? SV.t('deviceStatus.' + status.kind + 'Help') : SV.t('setup.' + (p === 'ready' && this.recovered ? 'recovered' : bodies[p]))) + '</p>';
      if (busy) html += '<div class="sv-setup-busy" aria-hidden="true"></div>';
      if (p === 'signin') html += '<div class="sv-setup-actions">' + setupLink('signIn', 'account.html?setup=1', 'filled') + '</div>';
      if (p === 'find' || p === 'notFound') {
        html += '<div class="sv-setup-actions">' + setupButton(p === 'find' ? 'find' : 'searchAgain', 'find') + '</div>' +
          scenarioDetails(scenarioSelect('sv-find-scenario', 'findScenario', [['found', 'findSuccess'], ['missing', 'findFailure']], this.findScenario));
      }
      if (p === 'found') html += '<div class="sv-setup-actions">' + setupButton('choose', 'choose') + setupButton('searchAgain', 'find', 'text') + '</div>';
      if (busy) html += '<div class="sv-setup-actions">' + setupButton('cancel', 'cancel', 'outlined') + '</div>';
      if (p === 'wifi') {
        html += '<form class="l-stack sv-setup-stage" novalidate>' +
          field('sv-wifi-name', 'setup.wifiLabel', { value: this.network, help: 'setup.wifiHelp', error: errors.network, autocomplete: 'off' }) +
          field('sv-wifi-pass', 'setup.wifiPassword', { value: this.password, type: 'password', help: 'setup.passwordHelp', error: errors.password, autocomplete: 'off' }) +
          '<button class="sv-btn sv-btn--filled sv-btn--block" type="submit">' + esc(SV.t('setup.connect')) + '</button>' + setupButton('fillWifi', 'fillWifi', 'tonal') + '</form>' +
          scenarioDetails(scenarioSelect('sv-connect-scenario', 'connectScenario', [['success', 'success'], ['password', 'wrongPassword'], ['service', 'serviceFailure']], this.scenario));
      }
      if (p === 'error') html += '<div class="sv-setup-actions">' +
        (this.failure === 'password' ? setupButton('editWifi', 'editWifi') : setupButton('retry', 'retry') + setupButton('editWifi', 'editWifi', 'text')) + '</div>' +
        scenarioDetails(scenarioSelect('sv-connect-scenario', 'connectScenario', [['success', 'success'], ['password', 'wrongPassword'], ['service', 'serviceFailure']], this.scenario));
      if (p === 'ready' || p === 'lost' || p === 'unknown') {
        html += '<div class="sv-setup-stage"><sv-glasses-card from-state compact></sv-glasses-card></div>' +
          (g.network ? '<p class="t-body-s sv-setup-note">' + esc(SV.t('setup.network', { name: g.network })) + '</p>' : '') +
          '<div class="sv-setup-actions">' + (p !== 'ready' ? setupButton('retry', 'recover') + setupButton('editWifi', 'editWifi', 'outlined') : '') +
          (p === 'ready' ? setupLink('firstRead', 'read-practice.html?setup=1', 'filled') : '') + speechControls() +
          setupLink('home', 'home.html', 'text') + '</div>';
        html += scenarioDetails(deviceStateSelect(status.kind) + (p === 'ready' ? setupButton('lose', 'lose', 'outlined') : scenarioSelect('sv-connect-scenario', 'connectScenario', [['success', 'success'], ['service', 'serviceFailure']], this.scenario)) + setupLink('replay', 'start.html'));
        html += '<div class="sv-setup-help">' + '<button type="button" class="sv-btn sv-btn--text sv-btn--block" data-setup="unlink">' + esc(SV.t('glassesPage.unlink')) + '</button></div>';
      }
      if (p !== 'ready' && p !== 'lost' && p !== 'unknown') html += speechControls();
      html += '</section>' + (p === 'wifi' ? '<p class="t-body-s sv-setup-note">' + esc(SV.t('setup.privacyNote')) + '</p>' : '');
      this.innerHTML = html;
      this.querySelectorAll('[data-setup]').forEach(function (button) {
        button.addEventListener('click', function () {
          var action = button.getAttribute('data-setup');
          if (action === 'find') self.search();
          if (action === 'choose' || action === 'editWifi') self.move('wifi');
          if (action === 'cancel') self.move(p === 'searching' ? 'find' : p === 'recovering' ? 'lost' : 'wifi');
          if (action === 'retry') self.connect(!!self.recovery);
          if (action === 'recover') self.connect(true);
          if (action === 'fillWifi') {
            self.network = 'SeeVia Demo 2.4 GHz';
            self.password = 'seevia-demo';
            self.render();
            self.querySelector('[data-setup="fillWifi"]').focus();
            SV.announce(SV.t('setup.wifiFilled'));
          }
          if (action === 'lose') {
            SV.state.set('glasses', Object.assign({}, SV.state.get('glasses'), { connection: 'lost', online: false, service: 'unknown', battery: null, updatedAt: Date.now() }));
            self.scenario = 'success'; self.move('lost');
          }
          if (action === 'unlink') SV.confirmSheet({
            title: SV.t('glassesPage.unlinkTitle'), body: SV.t('glassesPage.unlinkBody'),
            confirm: SV.t('glassesPage.unlinkConfirm'), cancel: SV.t('glassesPage.unlinkCancel'), danger: true,
            onConfirm: function () {
              SV.state.set('glasses', Object.assign({}, SV.state.get('glasses'), { linked: false, connection: 'unlinked', online: null, service: 'unknown', updatedAt: null, battery: null, network: '' }));
              self.network = ''; self.password = ''; self.move('find');
            }
          });
        });
      });
      var findSelect = this.querySelector('#sv-find-scenario');
      var deviceSelect = this.querySelector('#sv-device-state');
      if (deviceSelect) deviceSelect.addEventListener('change', function () {
        var kind = deviceSelect.value;
        SV.state.set('glasses', Object.assign({}, SV.state.get('glasses'), {
          linked: true,
          connection: kind === 'ready' ? 'ready' : kind === 'lost' ? 'lost' : 'linked',
          online: kind === 'lost' ? false : kind === 'unknown' ? null : true,
          service: kind === 'serviceUnavailable' ? 'unavailable' : kind === 'serviceUnknown' || kind === 'lost' || kind === 'unknown' ? 'unknown' : 'ready',
          updatedAt: kind === 'unknown' ? null : Date.now() - (kind === 'stale' ? 6 * 60 * 1000 : 0),
          battery: kind === 'ready' ? 82 : null
        }));
        self.scenario = 'success';
        self.move(kind === 'ready' ? 'ready' : kind === 'lost' ? 'lost' : 'unknown');
      });
      if (findSelect) findSelect.addEventListener('change', function () { self.findScenario = findSelect.value; });
      var connectSelect = this.querySelector('#sv-connect-scenario');
      if (connectSelect) connectSelect.addEventListener('change', function () { self.scenario = connectSelect.value; });
      var form = this.querySelector('form');
      if (form) form.addEventListener('submit', function (event) {
        event.preventDefault();
        self.network = self.querySelector('#sv-wifi-name').value.trim();
        self.password = self.querySelector('#sv-wifi-pass').value;
        var errors = {};
        if (!self.network) errors.network = SV.t('setup.wifiEmpty');
        else if (/5\s*g(?:hz)?\b/i.test(self.network)) errors.network = SV.t('setup.wifiBand');
        if (self.password.length < 8) errors.password = SV.t('setup.passwordEmpty');
        if (Object.keys(errors).length) { self.render(errors); self.querySelector('[aria-invalid="true"]').focus(); return; }
        self.connect(!!g.linked);
      });
      bindStatusSpeech(this);
    }
  });
  define('sv-connection-status', class extends HTMLElement {
    connectedCallback() {
      this._stateListener = function (event) { if (event.detail.name === 'glasses') this.render(); }.bind(this);
      document.addEventListener('sv:state', this._stateListener);
      this._freshness = setInterval(function () { if (this._kind !== SV.glassesStatus().kind) this.render(); }.bind(this), 30000);
      this.render();
    }
    disconnectedCallback() { document.removeEventListener('sv:state', this._stateListener); clearInterval(this._freshness); if (this._stopVoice) this._stopVoice(); }
    render() {
      var restoreFocus = this.contains(document.activeElement);
      var wasSpeech = restoreFocus && !!document.activeElement.closest('sv-speech-control');
      if (this._stopVoice) this._stopVoice();
      var status = SV.glassesStatus(), kind = status.kind;
      var changed = this._kind && this._kind !== kind;
      this._kind = kind;
      this.innerHTML = '<section class="sv-connection-status" aria-label="' + esc(SV.t('setup.title')) + '">' +
        '<sv-glasses-card from-state compact></sv-glasses-card>' +
        '<div class="sv-setup-actions">' + (kind === 'ready' ? setupLink('firstRead', 'read-practice.html', 'filled') : '') +
        setupLink(kind === 'ready' ? 'manage' : 'recoverTitle', 'glasses.html', kind === 'ready' ? 'text' : 'filled') + speechControls() + '</div></section>';
      bindStatusSpeech(this);
      if (restoreFocus) this.querySelector(wasSpeech ? 'sv-speech-control button' : 'a').focus();
      else if (changed) SV.announce(SV.glassesStatusText(status));
    }
  });

  /* Bài đọc có thể thử độc lập; người dùng tự xác nhận đã đọc/nghe nội dung. */
  define('sv-read-practice', class extends HTMLElement {
    connectedCallback() {
      this.phase = 'prepare';
      this.addEventListener('click', function (event) {
        var button = event.target.closest('[data-read-action]');
        if (!button) return;
        var action = button.getAttribute('data-read-action');
        if (action === 'confirm') SV.state.set('firstReadDone', true);
        this.move(action === 'confirm' ? 'done' : action === 'read' ? 'result' : action === 'blur' ? 'blur' : 'prepare');
      }.bind(this));
      this.render();
    }
    disconnectedCallback() { SV.speech.stop(this); }
    move(phase) {
      SV.speech.stop(this);
      this.phase = phase;
      this.render();
      this.querySelector('[data-read-heading]').focus();
    }
    render() {
      var phase = this.phase;
      var title = phase === 'prepare' ? 'prepareTitle' : phase === 'result' ? 'resultTitle' : phase === 'blur' ? 'blurTitle' : 'doneTitle';
      var text = phase === 'prepare' ? 'prepareBody' : phase === 'result' ? 'resultHelp' : phase === 'blur' ? 'blurBody' : 'doneBody';
      function button(key, action, kind) {
        return '<button type="button" class="sv-btn sv-btn--' + (kind || 'filled') + ' sv-btn--block" data-read-action="' + action + '">' + esc(SV.t('readPractice.' + key)) + '</button>';
      }
      this.innerHTML = '<section class="sv-reading-stage l-stack" aria-labelledby="sv-read-heading">' +
        '<h2 class="t-title-l" id="sv-read-heading" tabindex="-1" data-read-heading aria-describedby="sv-read-help">' + esc(SV.t('readPractice.' + title)) + '</h2>' +
        '<p class="t-body-m" id="sv-read-help">' + esc(SV.t('readPractice.' + text)) + '</p>' +
        (phase === 'result' ? SV.speechControl(SV.t('readPractice.sample'), 'readPractice.listen') + '<div class="sv-reading-sample"><h3 class="t-title-s">' + esc(SV.t('readPractice.sampleLabel')) + '</h3><p class="t-body-l">' + esc(SV.t('readPractice.sample')) + '</p></div>' : '') +
        (phase === 'prepare' ? button('read', 'read') + button('blur', 'blur', 'outlined') : '') +
        (phase === 'result' ? button('confirm', 'confirm') + button('retry', 'retry', 'text') : '') +
        (phase === 'blur' ? button('retryClear', 'read') + '<a class="sv-btn sv-btn--text sv-btn--block" href="display.html">' + esc(SV.t('readPractice.help')) + '</a>' : '') +
        (phase === 'done' ? '<a class="sv-btn sv-btn--filled sv-btn--block" href="home.html">' + esc(SV.t('readPractice.home')) + '</a>' + button('retry', 'retry', 'text') : '') +
        '</section>';
    }
  });

  /* ---------- Tài khoản: đăng nhập / đăng ký / OTP / đăng xuất ---------- */
  var PHONE_RE = /^0\d{9}$/;
  define("sv-account", class extends HTMLElement {
    connectedCallback() { this.mode = "signIn"; this.step = "form"; this.draft = {}; this.render(); }
    render(errors) {
      errors = errors || {};
      var self = this;
      var acc = SV.state.get("account");
      if (acc.signedIn) {
        var name = acc.name || SV.t("account.name");
        this.innerHTML =
          '<section class="sv-card sv-account-card">' +
            '<span class="sv-profile__avatar">' + icon("person", "sv-icon--fill") + "</span>" +
            '<span class="sv-badge sv-badge--success">' + icon("check_circle") + esc(SV.t("account.signedIn")) + "</span>" +
            '<p class="t-title-l">' + esc(name) + "</p>" +
            '<p class="t-body-m t-muted">' + esc(SV.t("account.phone", { phone: acc.phone })) + "</p></section>" +
          '<button class="sv-btn sv-btn--outlined sv-btn--block l-section l-section--first" type="button" data-signout>' + icon("logout") + esc(SV.t("account.signOut")) + "</button>" +
          '<p class="sv-demo-note t-body-s t-muted">' + esc(SV.t("account.demoNote")) + "</p>";
        this.querySelector("[data-signout]").addEventListener("click", function () {
          SV.confirmSheet({
            title: SV.t("account.signOutTitle"), body: SV.t("account.signOutBody"),
            confirm: SV.t("account.signOutConfirm"), cancel: SV.t("account.signOutCancel"),
            onConfirm: function () {
              SV.state.set("account", Object.assign({}, acc, { signedIn: false }));
              self.mode = "signIn"; self.step = "form"; self.render();
              self.querySelector('#sv-phone').focus();
              SV.snackbar(SV.t("account.signedOut"), null, { speech: true });
            }
          });
        });
        return;
      }
      if (this.step === "otp") {
        this.innerHTML =
          '<form class="sv-card l-stack" novalidate>' +
            '<h2 class="t-headline-s">' + esc(SV.t("account.otpTitle")) + "</h2>" +
            '<p class="t-body-m">' + esc(SV.t("account.otpBody", { phone: this.draft.phone })) + "</p>" +
            field("sv-otp", "account.otpLabel", { inputmode: "numeric", autocomplete: "one-time-code", maxlength: 6, error: errors.otp }) +
            '<button class="sv-btn sv-btn--filled sv-btn--block" type="submit">' + esc(SV.t("account.otpSubmit")) + "</button>" +
            '<button class="sv-btn sv-btn--text sv-btn--block" type="button" data-back>' + esc(SV.t("account.otpBack")) + "</button>" +
          "</form>";
        this.querySelector("#sv-otp").classList.add("sv-field__control--otp");
        this.querySelector("[data-back]").addEventListener("click", function () { self.step = "form"; self.render(); });
        this.querySelector("form").addEventListener("submit", function (e) {
          e.preventDefault();
          var code = self.querySelector("#sv-otp").value.replace(/\s/g, "");
          if (code !== "123456") { self.render({ otp: SV.t("account.otpError") }); self.querySelector("#sv-otp").focus(); return; }
          self.finish();
        });
        return;
      }
      var reg = this.mode === "register";
      this.innerHTML =
        '<div class="sv-segmented" role="radiogroup" aria-label="' + esc(SV.t("account.modeLabel")) + '">' +
          '<button class="sv-segmented__item" role="radio" value="signIn" aria-checked="' + !reg + '" tabindex="' + (reg ? -1 : 0) + '">' + icon("check") + esc(SV.t("account.signIn")) + "</button>" +
          '<button class="sv-segmented__item" role="radio" value="register" aria-checked="' + reg + '" tabindex="' + (reg ? 0 : -1) + '">' + icon("check") + esc(SV.t("account.register")) + "</button>" +
        "</div>" +
        '<form class="sv-card l-stack l-section l-section--first" novalidate>' +
          '<button class="sv-btn sv-btn--tonal sv-btn--block" type="button" data-fill-account>' + esc(SV.t('account.fillDemo')) + '</button>' +
          (reg ? field("sv-name", "account.nameLabel", { autocomplete: "name", value: this.draft.name, error: errors.name }) : "") +
          field("sv-phone", "account.phoneLabel", { type: "tel", inputmode: "tel", autocomplete: "tel", value: this.draft.phone, error: errors.phone }) +
          field("sv-pass", "account.passwordLabel", { type: "password", autocomplete: reg ? "new-password" : "current-password", help: "account.passwordHelp", error: errors.password }) +
          '<button class="sv-btn sv-btn--filled sv-btn--block" type="submit">' + esc(SV.t(reg ? "account.submitRegister" : "account.submitSignIn")) + "</button>" +
        "</form>" +
        '<p class="sv-demo-note t-body-s t-muted">' + esc(SV.t("account.demoNote")) + "</p>";
      this.querySelector('[data-fill-account]').addEventListener('click', function () {
        self.draft = { name: self.mode === 'register' ? SV.t('account.name') : '', phone: '0912345678' };
        self.render();
        self.querySelector('#sv-pass').value = 'seevia-demo';
        self.querySelector('[data-fill-account]').focus();
        SV.announce(SV.t('account.demoFilled'));
      });
      this.querySelector(".sv-segmented").addEventListener("sv:change", function (e) {
        self.mode = e.detail.value; self.render();
        self.querySelector('.sv-segmented [aria-checked="true"]').focus();
      });
      this.querySelector("form").addEventListener("submit", function (e) {
        e.preventDefault();
        var nameEl = self.querySelector("#sv-name");
        var d = { name: nameEl ? nameEl.value.trim() : "", phone: self.querySelector("#sv-phone").value.replace(/[\s.\-]/g, ""), pass: self.querySelector("#sv-pass").value };
        var errs = {};
        if (reg && !d.name) errs.name = SV.t("account.errName");
        if (!PHONE_RE.test(d.phone)) errs.phone = SV.t("account.errPhone");
        if (d.pass.length < 6) errs.password = SV.t("account.errPassword");
        self.draft = { name: d.name, phone: d.phone ? SV.formatPhone(d.phone) || d.phone : "" };
        if (Object.keys(errs).length) {
          self.render(errs);
          var firstBad = self.querySelector("[aria-invalid=true]");
          if (firstBad) firstBad.focus();
          return;
        }
        if (reg) { self.step = "otp"; self.render(); self.querySelector("#sv-otp").focus(); }
        else self.finish();
      });
    }
    finish() {
      var acc = { signedIn: true, name: this.draft.name || "", phone: this.draft.phone };
      SV.state.set("account", acc);
      this.step = "form";
      if (new URLSearchParams(location.search).get('setup') === '1') { SV.go('glasses.html?setup=1'); return; }
      this.render();
      selfFocus(this.querySelector('[data-signout]'));
      SV.snackbar(SV.t("account.welcome", { name: acc.name || SV.t("account.name") }), null, { speechText: SV.t('speech.accountWelcome') });
    }
  });

  /* ---------- Góp ý ---------- */
  define("sv-support-form", class extends HTMLElement {
    connectedCallback() { this.render(); }
    render(error) {
      var self = this;
      this.innerHTML =
        '<form class="sv-card l-stack" novalidate>' +
          field("sv-feedback", "support.formLabel", { multiline: true, placeholder: "support.formPlaceholder", help: "support.formHelp", error: error, value: this._text }) +
          '<button class="sv-btn sv-btn--filled sv-btn--block" type="submit">' + icon("send") + esc(SV.t("support.submit")) + "</button>" +
        "</form>" +
        (this._code ? '<div class="sv-banner sv-banner--success l-section l-section--first" tabindex="-1">' + icon("check_circle") +
          '<div><p class="sv-banner__title">' + esc(SV.t("support.sentTitle")) + "</p><p>" + esc(SV.t("support.sentBody", { code: this._code })) + "</p></div></div>" : "");
      var ta = this.querySelector("textarea");
      ta.addEventListener("input", function () { self._text = ta.value; });
      this.querySelector("form").addEventListener("submit", function (e) {
        e.preventDefault();
        if (!ta.value.trim()) { self._code = null; self.render(SV.t("support.emptyError")); self.querySelector("textarea").focus(); return; }
        self._code = "SV-" + String(Math.floor(1000 + Math.random() * 9000));
        self._text = "";
        self.render();
        selfFocus(self.querySelector('.sv-banner'));
        if (SV.settings.get('speechFeedback') === 'voice') SV.announce(SV.t('speech.feedbackSent'));
      });
    }
  });

  /* ---------- Hiển thị: cỡ chữ, tương phản cao ---------- */
  define("sv-display-settings", class extends HTMLElement {
    connectedCallback() { this.render(); }
    render() {
      var self = this;
      var font = SV.settings.get("font");
      var hc = SV.settings.get("contrast") === "on";
      this.innerHTML =
        '<section class="sv-card sv-preview" aria-labelledby="sv-preview-title">' +
          '<p class="t-label-m t-muted" id="sv-preview-title">' + esc(SV.t("display.previewTitle")) + "</p>" +
          '<span class="sv-badge sv-badge--success">' + icon("check_circle") + esc(SV.t("status.connected")) + "</span>" +
          '<p class="t-title-l">' + esc(SV.t("display.previewHeading")) + "</p>" +
          '<p class="t-body-m">' + esc(SV.t("display.previewBody")) + "</p></section>" +
        '<section class="l-section"><h2 class="sv-section-title" id="sv-font-title">' + esc(SV.t("display.fontTitle")) + "</h2>" +
          '<div class="sv-segmented" role="radiogroup" aria-labelledby="sv-font-title">' +
            ["sm", "md", "lg"].map(function (k) {
              var on = k === font;
              return '<button class="sv-segmented__item sv-font-option sv-font-option--' + k + '" role="radio" value="' + k + '" aria-checked="' + on + '" tabindex="' + (on ? 0 : -1) + '">' + icon("check") +
                esc(SV.t("display.font" + k.charAt(0).toUpperCase() + k.slice(1))) + "</button>";
            }).join("") +
          "</div>" +
          '<p class="t-body-m t-muted sv-display__hint">' + esc(SV.t("display.fontHint." + font)) + "</p></section>" +
        '<section class="l-section"><h2 class="sv-section-title">' + esc(SV.t("display.colorTitle")) + "</h2>" +
          '<ul class="sv-list" role="list"><li><label class="sv-list-item" for="sv-hc">' +
            '<span class="sv-list-item__lead">' + icon("contrast") + "</span>" +
            '<span class="sv-list-item__body"><span class="sv-list-item__title">' + esc(SV.t("display.contrastTitle")) + "</span>" +
            '<span class="sv-list-item__sub">' + esc(SV.t("display.contrastSub")) + "</span></span>" +
            '<span class="sv-list-item__trail"><button class="sv-switch" id="sv-hc" role="switch" aria-checked="' + hc + '">' +
              '<span class="sv-switch__handle">' + icon("check") + "</span></button></span></label></li></ul>" +
          '<p class="t-body-s t-muted sv-display__hint">' + icon("dark_mode") + esc(SV.t("display.darkNote")) + "</p></section>";
      this.querySelector(".sv-segmented").addEventListener("sv:change", function (e) {
        SV.settings.set("font", e.detail.value);
        self.render();
        self.querySelector('.sv-segmented [aria-checked="true"]').focus();
        SV.announce(SV.t("display.changedFont", { value: SV.t("display.font" + e.detail.value.charAt(0).toUpperCase() + e.detail.value.slice(1)) }));
      });
      this.querySelector("#sv-hc").addEventListener("sv:change", function (e) {
        SV.settings.set("contrast", e.detail.checked ? "on" : "off");
        SV.announce(SV.t("display.changedContrast", { value: SV.t(e.detail.checked ? "common.on" : "common.off") }));
      });
    }
  });

  /* ---------- Kiểm thử action (nội bộ) ---------- */
  define("sv-dev-handlers", class extends HTMLElement {
    connectedCallback() {
      var items = SV.data("devtest.items") || [];
      this.innerHTML = '<ul class="sv-list" role="list">' + items.map(function (it, i) {
        return '<li><div class="sv-list-item sv-dev">' +
          '<span class="sv-list-item__body"><span class="sv-list-item__title">' + esc(it.name) + "</span>" +
          '<code class="sv-dev__code">' + esc(it.code) + "</code>" +
          '<span class="sv-list-item__sub" id="sv-dev-' + i + '" aria-live="polite">' + esc(SV.t("devtest.idle")) + "</span></span>" +
          '<button class="sv-btn sv-btn--tonal" type="button" data-i="' + i + '" aria-label="' + esc(SV.t("devtest.runAria", { name: it.name })) + '" aria-describedby="sv-dev-' + i + '">' +
            icon("play_arrow") + esc(SV.t("devtest.run")) + "</button></div></li>";
      }).join("") + "</ul>";
      this.querySelectorAll("[data-i]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var now = new Date();
          var time = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0") + ":" + String(now.getSeconds()).padStart(2, "0");
          var out = document.getElementById("sv-dev-" + btn.getAttribute("data-i"));
          out.textContent = SV.t("devtest.ok", { time: time });
          out.classList.add("is-ok");
        });
      });
    }
  });
})();
