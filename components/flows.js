/*
 * SeeVia · components/flows.js
 * Component có trạng thái cho từng luồng (nạp sau elements.js). Chữ từ content/vi.js, dữ liệu từ SV.state.
 *
 *   <sv-feature-groups>                 tab Tính năng (features.groups), mỗi mục mở sheet cách dùng
 *   <sv-community-notify>  <sv-sos-status>  <sv-hotline>
 *   <sv-info-list key="community.items"> danh sách chỉ để đọc
 *   <sv-accordion-list key="guide.items" open-first>
 *   <sv-profile-card>  <sv-profile-settings>  <sv-version-tap>
 *   <sv-activity-browser>               lọc + nhóm lịch sử
 *   <sv-album>  <sv-translator>  <sv-recorder>  <sv-glasses-manager>
 *   <sv-account>  <sv-support-form>  <sv-display-settings>  <sv-dev-handlers>
 */
(function () {
  var SV = window.SV;
  var icon = SV.icon, esc = SV.esc;

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
          '<p class="sv-sheet__body t-body-m" id="sv-feat-body">' + esc(it.body) + "</p>" +
          '<p class="sv-sheet__say">' + icon("record_voice_over") + "<span><b>" + esc(sayLabel) + ":</b> " + esc(it.say) + "</span></p>" +
          '<h3 class="sv-sheet__subtitle">' + esc(SV.t("features.stepsTitle")) + "</h3>" +
          '<ol class="sv-steps">' + (it.steps || []).map(function (st) { return "<li>" + esc(st) + "</li>"; }).join("") + "</ol>" +
          '<div class="sv-sheet__actions">' +
            '<button class="sv-btn sv-btn--filled sv-btn--block" value="listen">' + icon("volume_up") + esc(SV.t("features.listen")) + "</button>" +
            '<a class="sv-btn sv-btn--text sv-btn--block" href="guide.html#voice">' + esc(SV.t("features.guide")) + "</a>" +
            '<button class="sv-btn sv-btn--text sv-btn--block" value="cancel">' + esc(SV.t("common.close")) + "</button>" +
          "</div>",
          {
            labelledBy: "sv-feat-title", describedBy: "sv-feat-body", focus: "#sv-feat-title",
            onClose: function (v) { if (v === "listen") SV.snackbar(SV.t("features.listenToast", { say: it.say.replace(/[“”]/g, "") })); }
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
        SV.snackbar(SV.t(e.detail.checked ? "community.notifyOn" : "community.notifyOff"));
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
      this.querySelector("button").addEventListener("click", function () { SV.snackbar(SV.t("support.hotlineToast")); });
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
          '<p class="sv-accordion__body t-body-m">' + esc(it.a) + "</p></details>";
      }).join("");
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
        ["guide.html", "menu_book", "profile.guide", null]
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
        if (SV.state.get("devUnlocked")) { location.href = "dev-test.html"; return; }
        clearTimeout(timer);
        count += 1;
        timer = setTimeout(function () { count = 0; }, 3000);
        if (count >= 7) {
          SV.state.set("devUnlocked", true);
          SV.snackbar(SV.t("profile.devUnlocked"));
          setTimeout(function () { location.href = "dev-test.html"; }, 900);
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
          '<button class="sv-btn sv-btn--filled sv-btn--block" value="listen">' + icon("volume_up") + esc(SV.t("album.listen")) + "</button>" +
          '<button class="sv-btn sv-btn--danger-text sv-btn--block" value="delete">' + icon("delete") + esc(SV.t("album.delete")) + "</button>" +
          '<button class="sv-btn sv-btn--text sv-btn--block" value="cancel">' + esc(SV.t("common.close")) + "</button>" +
        "</div>",
        {
          labelledBy: "sv-photo-title", describedBy: "sv-photo-desc", focus: "#sv-photo-title",
          onClose: function (value) {
            if (value === "listen") SV.snackbar(SV.t("album.listenToast"));
            if (value === "delete") {
              SV.confirmSheet({
                title: SV.t("album.deleteTitle"), body: SV.t("album.deleteBody"),
                confirm: SV.t("album.deleteConfirm"), cancel: SV.t("album.deleteCancel"), danger: true,
                onConfirm: function () {
                  SV.state.set("albumRemoved", (SV.state.get("albumRemoved") || []).concat(index));
                  self.render();
                  SV.snackbar(SV.t("album.deleted"), {
                    label: SV.t("common.undo"),
                    onClick: function () {
                      SV.state.set("albumRemoved", (SV.state.get("albumRemoved") || []).filter(function (n) { return n !== index; }));
                      self.render();
                      var back = self.querySelector('[data-index="' + index + '"]');
                      if (back) back.focus();
                    }
                  });
                }
              });
            }
          }
        }
      );
    }
  });

  /* ---------- Dịch thuật ---------- */
  define("sv-translator", class extends HTMLElement {
    connectedCallback() {
      this.from = "en"; this.to = "vi";
      this.render();
    }
    render(error) {
      var self = this;
      var text = this._text || "";
      this.innerHTML =
        '<div class="sv-langs">' +
          '<div class="sv-langs__side"><span class="sv-langs__label">' + esc(SV.t("translation.from")) + '</span><span class="sv-langs__name">' + esc(SV.t("translation." + this.from)) + "</span></div>" +
          '<button class="sv-icon-btn sv-icon-btn--tonal" type="button" data-swap aria-label="' + esc(SV.t("translation.swap")) + '">' + icon("swap_horiz") + "</button>" +
          '<div class="sv-langs__side sv-langs__side--end"><span class="sv-langs__label">' + esc(SV.t("translation.to")) + '</span><span class="sv-langs__name">' + esc(SV.t("translation." + this.to)) + "</span></div>" +
        "</div>" +
        '<form class="l-stack sv-translator__form" novalidate>' +
          field("sv-tr-input", "translation.inputLabel", { multiline: true, placeholder: "translation.inputPlaceholder", value: text, error: error }) +
          '<div class="l-split">' +
            '<button class="sv-btn sv-btn--tonal" type="button" data-speak>' + icon("mic") + esc(SV.t("translation.speak")) + "</button>" +
            '<button class="sv-btn sv-btn--filled" type="submit">' + icon("translate") + esc(SV.t("translation.translate")) + "</button>" +
          "</div>" +
        "</form>" +
        (this._result ? '<section class="sv-card sv-result" aria-live="polite"><h2 class="t-title-m">' + esc(SV.t("translation.resultTitle")) + "</h2>" +
          '<p class="t-body-l">' + esc(this._result) + "</p>" +
          '<button class="sv-btn sv-btn--outlined" type="button" data-listen>' + icon("volume_up") + esc(SV.t("translation.listen")) + "</button></section>" : "");

      var input = this.querySelector("textarea");
      input.addEventListener("input", function () { self._text = input.value; });
      this.querySelector("[data-swap]").addEventListener("click", function () {
        var t = self.from; self.from = self.to; self.to = t;
        self._result = null;
        self.render();
        self.querySelector("[data-swap]").focus();
        SV.announce(SV.t("translation.swapped", { from: SV.t("translation." + self.from), to: SV.t("translation." + self.to) }));
      });
      this.querySelector("[data-speak]").addEventListener("click", function () { SV.snackbar(SV.t("translation.speakToast")); });
      this.querySelector("form").addEventListener("submit", function (e) {
        e.preventDefault();
        var value = input.value.trim();
        if (!value) {
          self._result = null;
          self.render(SV.t("translation.emptyError"));
          self.querySelector("textarea").focus();
          return;
        }
        self._result = SV.t("translation.resultBody", { to: SV.t("translation." + self.to + "Inline"), text: value });
        self.render();
        self.querySelector("[data-listen]").focus();
      });
      var listen = this.querySelector("[data-listen]");
      if (listen) listen.addEventListener("click", function () { SV.snackbar(SV.t("translation.listenToast")); });
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
          '<p class="sv-recorder__status" aria-live="polite">' + esc(SV.t(this.recording ? "meeting.recording" : "meeting.ready")) + "</p>" +
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
            '<div class="sv-sheet__actions"><button class="sv-btn sv-btn--tonal sv-btn--block" value="cancel">' + esc(SV.t("common.close")) + "</button></div>",
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
        SV.snackbar(SV.t("meeting.saved"));
      }
      this.render();
      this.querySelector(".sv-recorder__button").focus();
    }
  });

  /* ---------- Kính của bạn: liên kết / hủy liên kết ---------- */
  var SERIAL_RE = /^SV-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  define("sv-glasses-manager", class extends HTMLElement {
    connectedCallback() { this.render(); }
    render(error, typed) {
      var self = this;
      var g = SV.state.get("glasses");
      var html = '<sv-glasses-card from-state></sv-glasses-card>';
      if (g.linked) {
        html += '<section class="l-section"><h2 class="sv-section-title">' + esc(SV.t("glassesPage.detailsTitle")) + "</h2>" +
          '<p class="t-body-m t-muted">' + esc(SV.t("glassesPage.unlinkBody")) + "</p>" +
          '<button class="sv-btn sv-btn--outlined sv-btn--block sv-glasses-manager__unlink" type="button" data-unlink>' + icon("link_off") + esc(SV.t("glassesPage.unlink")) + "</button></section>";
      } else {
        html += '<section class="l-section"><h2 class="sv-section-title">' + esc(SV.t("glassesPage.linkTitle")) + "</h2>" +
          '<form class="sv-card l-stack" novalidate><p class="t-body-m">' + esc(SV.t("glassesPage.linkIntro")) + "</p>" +
          field("sv-serial", "glassesPage.serialLabel", { placeholder: "glassesPage.serialPlaceholder", help: "glassesPage.serialHelp", value: typed || "", error: error, autocomplete: "off" }) +
          '<button class="sv-btn sv-btn--filled sv-btn--block" type="submit">' + icon("link") + esc(SV.t("glassesPage.link")) + "</button></form></section>";
      }
      html += '<div class="l-section"><ul class="sv-notes sv-notes--compact" role="list">' +
        '<li><span class="sv-icon" aria-hidden="true">lock</span><span class="sv-notes__body">' + esc(SV.t("glassesPage.noteStorage")) + "</span></li>" +
        '<li><span class="sv-icon" aria-hidden="true">science</span><span class="sv-notes__body">' + esc(SV.t("glassesPage.noteDemo")) + "</span></li></ul></div>";
      this.innerHTML = html;

      var unlink = this.querySelector("[data-unlink]");
      if (unlink) unlink.addEventListener("click", function () {
        SV.confirmSheet({
          title: SV.t("glassesPage.unlinkTitle"), body: SV.t("glassesPage.unlinkBody"),
          confirm: SV.t("glassesPage.unlinkConfirm"), cancel: SV.t("glassesPage.unlinkCancel"), danger: true,
          onConfirm: function () {
            SV.state.set("glasses", Object.assign({}, SV.state.get("glasses"), { linked: false }));
            self.render();
            SV.snackbar(SV.t("glassesPage.unlinked"));
            var input = self.querySelector("input");
            if (input) input.focus();
          }
        });
      });
      var form = this.querySelector("form");
      if (form) form.addEventListener("submit", function (e) {
        e.preventDefault();
        var raw = form.querySelector("input").value;
        var value = raw.trim().toUpperCase();
        var err = !value ? SV.t("glassesPage.serialEmpty") : !SERIAL_RE.test(value) ? SV.t("glassesPage.serialInvalid") : null;
        if (err) { self.render(err, raw); self.querySelector("input").focus(); return; }
        SV.state.set("glasses", Object.assign({}, SV.state.get("glasses"), { linked: true, serial: value }));
        self.render();
        SV.snackbar(SV.t("glassesPage.linked"));
      });
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
              SV.snackbar(SV.t("account.signedOut"));
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
          (reg ? field("sv-name", "account.nameLabel", { autocomplete: "name", value: this.draft.name, error: errors.name }) : "") +
          field("sv-phone", "account.phoneLabel", { type: "tel", inputmode: "tel", autocomplete: "tel", value: this.draft.phone, error: errors.phone }) +
          field("sv-pass", "account.passwordLabel", { type: "password", autocomplete: reg ? "new-password" : "current-password", help: "account.passwordHelp", error: errors.password }) +
          '<button class="sv-btn sv-btn--filled sv-btn--block" type="submit">' + esc(SV.t(reg ? "account.submitRegister" : "account.submitSignIn")) + "</button>" +
        "</form>" +
        '<p class="sv-demo-note t-body-s t-muted">' + esc(SV.t("account.demoNote")) + "</p>";
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
      this.render();
      SV.snackbar(SV.t("account.welcome", { name: acc.name || SV.t("account.name") }));
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
        (this._code ? '<div class="sv-banner sv-banner--success l-section l-section--first" role="status">' + icon("check_circle") +
          '<div><p class="sv-banner__title">' + esc(SV.t("support.sentTitle")) + "</p><p>" + esc(SV.t("support.sentBody", { code: this._code })) + "</p></div></div>" : "");
      var ta = this.querySelector("textarea");
      ta.addEventListener("input", function () { self._text = ta.value; });
      this.querySelector("form").addEventListener("submit", function (e) {
        e.preventDefault();
        if (!ta.value.trim()) { self._code = null; self.render(SV.t("support.emptyError")); self.querySelector("textarea").focus(); return; }
        self._code = "SV-" + String(Math.floor(1000 + Math.random() * 9000));
        self._text = "";
        self.render();
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
