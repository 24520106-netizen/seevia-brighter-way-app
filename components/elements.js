/*
 * SeeVia · components/elements.js
 * Component viết một lần, dùng lại trong mọi màn hình (custom element, light DOM).
 * Chữ lấy từ content/vi.js qua SV.t; tên app và logo lấy từ brand/brand.js.
 *
 *   <sv-logo variant="full|mark|icon|wordmark" height="32">
 *   <sv-status-bar>
 *   <sv-top-bar heading="key" back="home.html" variant="small|large|dusk">[nút hành động]</sv-top-bar>
 *   <sv-nav-bar active="home|features|safety|community|profile">
 *   <sv-list-item href="x.html" icon="photo_library" heading="key" sub="key" trailing="chevron|switch|value:key">
 *   <sv-glasses-card connected battery="82" version="2.1.4" href="glasses.html">
 *   <sv-sos-button>
 */
(function () {
  var SV = window.SV;

  function icon(name, extra) {
    return '<span class="sv-icon' + (extra ? " " + extra : "") + '" aria-hidden="true">' + name + "</span>";
  }
  SV.icon = icon;

  /* Giữ số điện thoại, mã... trên một dòng (khoảng trắng không ngắt) */
  SV.keepTogether = function (text) { return String(text).replace(/ /g, "\u00A0").replace(/-/g, "\u2011"); };

  /* Ngôi sao bốn cánh của bộ nhận diện: dấu "brighter way" */
  SV.sparkSvg = function (cls) {
    return '<svg class="' + (cls || "") + '" viewBox="-6 -6 12 12" aria-hidden="true" focusable="false">' +
      '<path d="M0,-6 C0.6,-1.6 1.6,-0.6 6,0 C1.6,0.6 0.6,1.6 0,6 C-0.6,1.6 -1.6,0.6 -6,0 C-1.6,-0.6 -0.6,-1.6 0,-6 Z"/></svg>';
  };

  function esc(text) {
    return String(text).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function define(name, cls) {
    if (!customElements.get(name)) customElements.define(name, cls);
  }

  /* ---------- Logo: đổi file trong brand/ là mọi nơi đổi theo ---------- */
  define("sv-logo", class extends HTMLElement {
    connectedCallback() {
      this.render();
      this._onScheme = this.render.bind(this);
      document.addEventListener("sv:settings", this._onScheme);
      if (window.matchMedia) {
        this._mq = matchMedia("(prefers-color-scheme: dark)");
        this._mq.addEventListener("change", this._onScheme);
      }
    }
    disconnectedCallback() {
      document.removeEventListener("sv:settings", this._onScheme);
      if (this._mq) this._mq.removeEventListener("change", this._onScheme);
    }
    render() {
      var variant = this.getAttribute("variant") || "full";
      var tone = this.getAttribute("tone") || SV.activeScheme(); /* light | dark | contrast */
      var file = variant;
      if (variant === "full" && tone === "dark") file = "fullDark";
      if (variant === "full" && tone === "contrast") file = "white";
      var height = this.getAttribute("height") || "32";
      this.className = "sv-logo";
      this.style.height = height + "px";
      var decorative = this.hasAttribute("decorative");
      this.innerHTML = '<img src="' + SV.brandAsset(file) + '" alt="' + (decorative ? "" : esc(SV.brand.name)) + '">';
    }
  });

  /* ---------- Thanh trạng thái giả (chỉ hiện trong khung điện thoại) ---------- */
  define("sv-status-bar", class extends HTMLElement {
    connectedCallback() {
      this.className = "sv-status-bar";
      this.setAttribute("aria-hidden", "true");
      this.innerHTML = "<span>14:30</span><span class=\"sv-status-bar__icons\">" +
        icon("signal_cellular_4_bar") + icon("wifi") + icon("battery_5_bar") + "</span>";
    }
  });

  /* ---------- Top app bar ---------- */
  define("sv-top-bar", class extends HTMLElement {
    connectedCallback() {
      if (this._done) return;
      this._done = true;
      var variant = this.getAttribute("variant") || "small";
      var back = this.getAttribute("back");
      var heading = this.getAttribute("heading");
      var actions = Array.prototype.slice.call(this.childNodes);
      var bar = document.createElement("header");
      bar.className = "sv-top-bar sv-top-bar--" + variant;
      var html = "";
      if (back) {
        html += '<a class="sv-icon-btn" href="' + back + '" aria-label="' + esc(SV.t("common.back")) + '">' + icon("arrow_back") + "</a>";
      }
      if (heading) {
        /* collapsing: tiêu đề lớn nằm trong nội dung; tiêu đề trên thanh chỉ hiện khi cuộn (ẩn với trình đọc màn hình) */
        html += variant === "collapsing"
          ? '<p class="sv-top-bar__title" aria-hidden="true">' + esc(SV.t(heading)) + "</p>"
          : '<h1 class="sv-top-bar__title">' + esc(SV.t(heading)) + "</h1>";
      }
      html += '<div class="sv-top-bar__actions"></div>';
      bar.innerHTML = html;
      var slot = bar.querySelector(".sv-top-bar__actions");
      actions.forEach(function (node) { slot.appendChild(node); });
      this.appendChild(bar);
      SV.applyText(bar);
      /* ← về màn vừa xem nếu đến từ một màn trong app; nếu không thì về đích mặc định */
      var backLink = bar.querySelector("a.sv-icon-btn");
      if (backLink) backLink.addEventListener("click", function (event) {
        var ref = document.referrer;
        if (ref && ref.indexOf("/screens/") > -1 && ref.split("#")[0] !== location.href.split("#")[0] && history.length > 1) {
          event.preventDefault();
          history.back();
        }
      });
    }
  });

  /* ---------- Navigation bar: 5 đích của app ---------- */
  var DESTINATIONS = [
    { id: "home", icon: "home", href: "home.html" },
    { id: "features", icon: "auto_awesome", href: "features.html" },
    { id: "safety", icon: "emergency_home", href: "safety.html" },
    { id: "community", icon: "diversity_3", href: "community.html" },
    { id: "profile", icon: "person", href: "profile.html" }
  ];
  SV.destinations = DESTINATIONS;

  define("sv-nav-bar", class extends HTMLElement {
    connectedCallback() {
      var active = this.getAttribute("active");
      var base = this.getAttribute("base") || "";
      var html = '<nav class="sv-nav-bar" aria-label="' + esc(SV.t("nav.label")) + '">';
      DESTINATIONS.forEach(function (d) {
        var current = d.id === active;
        html += '<a class="sv-nav-bar__item" href="' + base + d.href + '"' + (current ? ' aria-current="page"' : "") + ">" +
          '<span class="sv-nav-bar__indicator">' + icon(d.icon) + "</span>" +
          '<span class="sv-nav-bar__label">' + esc(SV.t("nav." + d.id)) + "</span></a>";
      });
      this.innerHTML = html + "</nav>";
    }
  });

  /* ---------- Dòng danh sách ---------- */
  define("sv-list-item", class extends HTMLElement {
    connectedCallback() {
      if (this._done) return;
      this._done = true;
      var href = this.getAttribute("href");
      var ic = this.getAttribute("icon");
      var heading = SV.t(this.getAttribute("heading"));
      var subKey = this.getAttribute("sub");
      var trailing = this.getAttribute("trailing") || (href ? "chevron" : "");
      var tag = href ? "a" : this.hasAttribute("button") ? "button" : "div";
      var inner = "";
      if (ic) inner += '<span class="sv-list-item__lead' + (this.hasAttribute("plain-icon") ? " sv-list-item__lead--plain" : "") + '">' + icon(ic) + "</span>";
      inner += '<span class="sv-list-item__body"><span class="sv-list-item__title">' + esc(heading) + "</span>";
      if (subKey) inner += '<span class="sv-list-item__sub">' + esc(SV.t(subKey)) + "</span>";
      inner += "</span>";
      var trail = "";
      if (trailing === "chevron") trail = icon("chevron_right");
      else if (trailing.indexOf("value:") === 0) trail = "<span>" + esc(SV.t(trailing.slice(6))) + "</span>" + (href ? icon("chevron_right") : "");
      else if (trailing === "switch") {
        var checked = this.hasAttribute("checked");
        trail = '<button class="sv-switch" role="switch" aria-checked="' + checked + '" aria-label="' + esc(heading) + '">' +
          '<span class="sv-switch__handle">' + icon("check") + "</span></button>";
      }
      if (trail) inner += '<span class="sv-list-item__trail">' + trail + "</span>";
      var el = document.createElement(tag);
      el.className = "sv-list-item" + (this.hasAttribute("compact") ? " sv-list-item--compact" : "");
      if (href) el.setAttribute("href", href);
      if (tag === "button") el.type = "button";
      el.innerHTML = inner;
      this.appendChild(el);
    }
  });

  /* ---------- Thẻ trạng thái kính (Dusk) ---------- */
  /* from-state: đọc kính từ SV.state (dùng chung với màn Kính của bạn) */
  define("sv-glasses-card", class extends HTMLElement {
    connectedCallback() {
      this.render();
      if (this.hasAttribute("from-state")) {
        this._onState = this.render.bind(this);
        document.addEventListener("sv:state", this._onState);
      }
    }
    disconnectedCallback() { if (this._onState) document.removeEventListener("sv:state", this._onState); }
    render() {
      var g = this.hasAttribute("from-state") ? SV.state.get("glasses") : null;
      var connected = g ? g.linked : this.hasAttribute("connected");
      var battery = g ? String(g.battery) : this.getAttribute("battery") || "0";
      var version = g ? g.version : this.getAttribute("version") || "";
      var href = this.getAttribute("href");
      if (!connected) {
        this.innerHTML = '<section class="sv-glasses" aria-label="' + esc(SV.t("glasses.title")) + '">' +
          '<div class="sv-glasses__head"><span class="sv-glasses__icon">' + icon("eyeglasses") + "</span>" +
          '<div><p class="sv-glasses__name">' + esc(SV.t("glasses.name")) + '</p><span class="sv-glasses__state sv-glasses__state--off">' +
          icon("link_off") + esc(SV.t("status.disconnected")) + "</span></div>" +
          (href ? '<span class="sv-glasses__chevron">' + icon("chevron_right") + "</span>" : "") +
          '</div><p class="sv-glasses__meta">' + esc(SV.t(href ? "glasses.notLinkedHint" : "glasses.notLinkedHere")) + "</p></section>";
        if (href) this.wrapLink(href, SV.t("glasses.name") + ". " + SV.t("status.disconnected") + ". " + SV.t("glasses.notLinkedHint"));
        return;
      }
      var state = connected
        ? '<span class="sv-glasses__state">' + SV.sparkSvg() + esc(SV.t("status.connected")) + "</span>"
        : '<span class="sv-glasses__state sv-glasses__state--off">' + icon("link_off") + esc(SV.t("status.disconnected")) + "</span>";
      var html =
        '<div class="sv-glasses__head">' +
          '<span class="sv-glasses__icon">' + icon("eyeglasses") + "</span>" +
          '<div><p class="sv-glasses__name">' + esc(SV.t("glasses.name")) + "</p>" + state + "</div>" +
          (href ? '<span class="sv-glasses__chevron">' + icon("chevron_right") + "</span>" : "") +
        "</div>" +
        '<div class="sv-meter">' +
          '<div class="sv-meter__row" aria-hidden="true"><span>' + esc(SV.t("glasses.batteryLabel")) + '</span><span class="sv-meter__value">' + esc(battery) + "%</span></div>" +
          '<div class="sv-meter__track" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + esc(battery) + '" aria-valuetext="' + esc(battery) + '%" aria-label="' + esc(SV.t("glasses.batteryLabel")) + '">' +
            '<span class="sv-meter__fill" style="--value:' + esc(battery) + '%"></span></div>' +
        "</div>" +
        (this.hasAttribute("compact") ? "" :
        '<p class="sv-glasses__meta"><span>' + esc(SV.t("glasses.serialLabel")) + " <b>" + esc(SV.keepTogether(g ? g.serial : SV.t("glasses.serial"))) + "</b></span>" +
          "<span>" + esc(SV.t("glasses.version", { value: version })) + "</span></p>");
      this.innerHTML = '<section class="sv-glasses" aria-label="' + esc(SV.t("glasses.title")) + '">' + html + "</section>";
      if (href) this.wrapLink(href, SV.t("glasses.name") + ". " + SV.t("glasses.connectedSummary", { battery: battery, version: version }) + ". " + SV.t("glasses.openHint"));
    }
    /* Cả thẻ là một liên kết: một vùng chạm lớn, một tên đọc rõ cho trình đọc màn hình */
    wrapLink(href, label) {
      var section = this.querySelector(".sv-glasses");
      var a = document.createElement("a");
      a.className = section.className + " sv-glasses--link";
      a.href = href;
      a.setAttribute("aria-label", label);
      while (section.firstChild) a.appendChild(section.firstChild);
      section.replaceWith(a);
      a.querySelectorAll("[role=meter]").forEach(function (m) { m.removeAttribute("role"); m.setAttribute("aria-hidden", "true"); });
    }
  });

  /* ---------- Nút SOS: nhấn 3 lần trong 2 giây ---------- */
  /* ---------- Nút SOS ----------
   * Nhấn 3 lần liên tiếp (mỗi lần cách nhau dưới 2 giây) → đếm ngược 5 giây, chạm để hủy → đã gửi (mô phỏng).
   * with-recipient: hiện người nhận và thẻ kết quả dưới nút (màn An toàn). */
  var SOS_TAPS = 3, SOS_GAP = 2000, SOS_COUNTDOWN = 5;

  define("sv-sos-button", class extends HTMLElement {
    connectedCallback() {
      var self = this;
      this.full = this.hasAttribute("with-recipient");
      this.innerHTML =
        '<div class="sv-sos">' +
          '<button class="sv-sos__button" type="button">' +
            '<svg class="sv-sos__ring" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><circle cx="50" cy="50" r="47"/></svg>' +
            '<span class="sv-sos__face"></span></button>' +
          '<div class="sv-sos__dots" aria-hidden="true">' + new Array(SOS_TAPS + 1).join('<span class="sv-sos__dot"></span>') + "</div>" +
          '<p class="sv-sos__hint"></p>' +
          (this.full ? '<button class="sv-sos__direct visually-hidden-focusable" type="button">' + esc(SV.t("safety.directSos")) + "</button>" +
            '<p class="sv-sos__recipient t-body-m t-muted"></p><div class="sv-sos__result" hidden></div>' : "") +
        "</div>";
      this.wrap = this.querySelector(".sv-sos");
      this.button = this.querySelector(".sv-sos__button");
      this.mode = "idle";
      this.taps = 0;
      this.button.addEventListener("click", function () { self.press(); });
      var direct = this.querySelector(".sv-sos__direct");
      if (direct) direct.addEventListener("click", function () { if (self.mode === "idle") self.start(); });
      this._onState = function () { if (self.mode === "idle") self.paint(); else self.paintRecipient(); };
      document.addEventListener("sv:state", this._onState);
      this.paint();
    }
    disconnectedCallback() {
      clearTimeout(this.tapTimer);
      clearInterval(this.tick);
      document.removeEventListener("sv:state", this._onState);
    }
    phone() { return SV.state.get("emergencyPhone"); }
    paintRecipient() {
      var el = this.querySelector(".sv-sos__recipient");
      if (!el) return;
      /* Chưa có số: câu hướng dẫn trên nút đã nói, không lặp lại ở đây */
      el.hidden = !this.phone();
      el.textContent = this.phone() ? SV.t("safety.recipient", { phone: SV.keepTogether(this.phone()) }) : "";
    }
    paint() {
      var face = this.querySelector(".sv-sos__face");
      var hint = this.querySelector(".sv-sos__hint");
      var dots = this.querySelectorAll(".sv-sos__dot");
      var taps = this.taps;
      var noPhone = this.mode === "idle" && !this.phone();
      this.wrap.className = "sv-sos is-" + this.mode + (noPhone ? " is-nophone" : "");
      dots.forEach(function (d, i) { d.classList.toggle("is-on", i < taps); });
      if (this.mode === "counting") {
        face.innerHTML = '<span class="sv-sos__count">' + this.left + '</span><span class="sv-sos__sub">' + esc(SV.t("safety.countdownLabel")) + "</span>";
        this.button.setAttribute("aria-label", SV.t("safety.countdownAria", { n: this.left }));
        hint.textContent = SV.t("safety.countdownHint");
      } else if (this.mode === "sent") {
        face.innerHTML = icon("check", "sv-icon--fill") + '<span class="sv-sos__sub">' + esc(SV.t("safety.sentLabel")) + "</span>";
        this.button.setAttribute("aria-label", SV.t("safety.sentAria", { time: this.sentAt }));
        hint.textContent = "";
      } else if (noPhone) {
        face.innerHTML = icon("add_call", "sv-icon--fill") + '<span class="sv-sos__sub">' + esc(SV.t("safety.noPhoneLabel")) + "</span>";
        this.button.setAttribute("aria-label", SV.t("safety.noPhoneAria"));
        hint.textContent = SV.t("safety.noPhoneHint");
      } else {
        face.innerHTML = icon("emergency_home", "sv-icon--fill") + '<span class="sv-sos__word">' + esc(SV.t("demo.sos.label")) + "</span>";
        this.button.setAttribute("aria-label", SV.t("demo.sos.aria"));
        hint.textContent = SV.t("demo.sos.hint");
      }
      this.paintRecipient();
    }
    press() {
      var self = this;
      if (this.mode === "counting") return this.cancel();
      if (this.mode === "sent") { this.focusResult(); return; }
      if (!this.phone()) { this.needPhone(); return; }
      clearTimeout(this.tapTimer);
      this.taps += 1;
      if (this.taps < SOS_TAPS) {
        this.paint();
        SV.announce(SV.t("demo.sos.progress", { count: this.taps }), true);
        this.tapTimer = setTimeout(function () { self.taps = 0; self.paint(); }, SOS_GAP);
        return;
      }
      this.start();
    }
    /* Không có người nhận thì không gửi: đưa người dùng tới ô nhập số */
    needPhone() {
      SV.announce(SV.t("safety.noPhoneAlert"), true);
      var input = document.querySelector("#sv-contact-input");
      if (input) { input.scrollIntoView({ block: "center", behavior: "smooth" }); input.focus({ preventScroll: true }); }
    }
    start() {
      var self = this;
      if (!this.phone()) { this.needPhone(); return; }
      clearTimeout(this.tapTimer);
      this.taps = 0;
      this.mode = "counting";
      this.left = SOS_COUNTDOWN;
      this.paint();
      SV.announce(SV.t("safety.countdownStart"), true);
      this.tick = setInterval(function () {
        self.left -= 1;
        if (self.left <= 0) { clearInterval(self.tick); self.send(); return; }
        self.paint();
      }, 1000);
    }
    cancel() {
      clearInterval(this.tick);
      this.mode = "idle";
      this.paint();
      SV.snackbar(SV.t("safety.cancelled"));
    }
    send() {
      var self = this;
      var now = new Date();
      this.sentAt = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
      this.mode = "sent";
      this.paint();
      var phone = SV.keepTogether(this.phone());
      this.dispatchEvent(new CustomEvent("sv:sos", { bubbles: true }));
      var result = this.querySelector(".sv-sos__result");
      if (!result) {
        /* Không có thẻ kết quả: báo bằng lời. Có thẻ kết quả: focus chuyển tới thẻ (một kênh duy nhất) */
        SV.announce(SV.t("safety.sentTitle") + ". " + SV.t("safety.sentMeta", { time: this.sentAt, phone: phone }), true);
        setTimeout(function () { self.mode = "idle"; self.paint(); }, 4000);
        return;
      }
      result.innerHTML =
        '<section class="sv-sos-sent" aria-labelledby="sv-sos-sent-title">' +
          '<span class="sv-sos-sent__mark">' + icon("emergency_home", "sv-icon--fill") + "</span>" +
          '<div class="sv-sos-sent__body">' +
            '<h2 class="sv-sos-sent__title" id="sv-sos-sent-title" tabindex="-1">' + esc(SV.t("safety.sentTitle")) + "</h2>" +
            '<p class="sv-sos-sent__meta">' + esc(SV.t("safety.sentMeta", { time: this.sentAt, phone: phone })) + "</p>" +
            '<p class="sv-sos-sent__text">' + esc(SV.t("safety.sentBody")) + "</p>" +
          "</div>" +
          '<button class="sv-btn sv-btn--filled sv-btn--block" type="button" data-safe>' + icon("verified_user") + esc(SV.t("safety.safe")) + "</button>" +
        "</section>";
      result.hidden = false;
      result.querySelector("[data-safe]").addEventListener("click", function () {
        result.hidden = true;
        self.mode = "idle";
        self.paint();
        /* Không đưa focus về nút SOS sau lúc căng thẳng: về tiêu đề màn */
        var heading = document.querySelector("main h1") || self.button;
        if (heading !== self.button) heading.setAttribute("tabindex", "-1");
        heading.focus();
        SV.snackbar(SV.t("safety.safeDone"));
      });
      this.focusResult();
    }
    focusResult() {
      var title = this.querySelector(".sv-sos-sent__title");
      if (!title) return;
      title.scrollIntoView({ block: "center", behavior: "smooth" });
      title.focus({ preventScroll: true });
    }
  });

  /* ---------- Danh sách hoạt động (từ content activity.items) ----------
   * limit="2": chỉ lấy N mục đầu · status="done|failed": lọc · grouped: chia "Hôm nay" / "Trước đó" */
  SV.activityRow = function (it, opts) {
    opts = opts || {};
    var ok = it.status === "done";
    /* Trong nhóm "Hôm nay" bỏ chữ "Hôm nay," cho đỡ lặp */
    var time = opts.shortTime && it.day === "today" ? it.time.replace(/^[^,]+,\s*/, "") : it.time;
    return '<li><button class="sv-list-item sv-activity" type="button" data-act="' + it.index + '">' +
      '<span class="sv-list-item__lead">' + icon(it.icon) + "</span>" +
      '<span class="sv-list-item__body">' +
        '<span class="sv-list-item__title">' + esc(it.title) + "</span>" +
        '<span class="sv-list-item__sub">' + esc(it.detail) + "</span>" +
        '<span class="sv-activity__meta"><span class="sv-activity__time">' + esc(time) + "</span>" +
        '<span class="sv-badge ' + (ok ? "sv-badge--success" : "sv-badge--error") + '">' + icon(ok ? "check_circle" : "error") + esc(SV.t("status." + it.status)) + "</span></span>" +
      '</span><span class="sv-list-item__trail">' + icon("chevron_right") + "</span></button></li>";
  };

  SV.openActivity = function (index) {
    var it = SV.data("activity.items")[index];
    var ok = it.status === "done";
    SV.openSheet(
      '<div class="sv-sheet__lead">' + icon(it.icon) + "</div>" +
      '<h2 class="sv-sheet__title t-headline-s" id="sv-act-title">' + esc(it.title) + "</h2>" +
      '<p class="sv-sheet__meta"><span class="sv-badge ' + (ok ? "sv-badge--success" : "sv-badge--error") + '">' + icon(ok ? "check_circle" : "error") + esc(SV.t("status." + it.status)) + "</span>" +
        '<span class="t-body-s t-muted">' + esc(it.time) + "</span></p>" +
      '<p class="sv-sheet__body t-body-l" id="sv-act-body">' + esc(it.detail) + "</p>" +
      (ok ? "" : '<p class="sv-sheet__note t-body-m">' + esc(SV.t("activityPage.failedNote")) + "</p>") +
      '<div class="sv-sheet__actions"><button class="sv-btn sv-btn--tonal sv-btn--block" value="cancel">' + esc(SV.t("common.close")) + "</button></div>",
      { labelledBy: "sv-act-title", describedBy: "sv-act-body", focus: "#sv-act-title" }
    );
  };

  define("sv-activity-list", class extends HTMLElement {
    static get observedAttributes() { return ["status"]; }
    connectedCallback() {
      this.render();
      this.addEventListener("click", function (event) {
        var row = event.target.closest("[data-act]");
        if (row) SV.openActivity(parseInt(row.getAttribute("data-act"), 10));
      });
    }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    render() {
      var items = (SV.data("activity.items") || []).map(function (it, i) { return Object.assign({ index: i }, it); });
      var status = this.getAttribute("status");
      if (status) items = items.filter(function (it) { return it.status === status; });
      var limit = parseInt(this.getAttribute("limit") || "0", 10);
      if (limit) items = items.slice(0, limit);
      if (!items.length) {
        this.innerHTML = '<div class="sv-empty"><div class="sv-empty__mark">' + SV.sparkSvg() + "</div>" +
          '<p class="sv-empty__title">' + esc(SV.t("activityPage.emptyTitle")) + "</p>" +
          '<p class="sv-empty__body t-body-m">' + esc(SV.t("activityPage.emptyBody")) + "</p></div>";
        return;
      }
      if (!this.hasAttribute("grouped")) {
        this.innerHTML = '<ul class="sv-list" role="list">' + items.map(function (it) { return SV.activityRow(it); }).join("") + "</ul>";
        return;
      }
      var html = "";
      [["today", "activityPage.today"], ["earlier", "activityPage.earlier"]].forEach(function (g) {
        var part = items.filter(function (it) { return it.day === g[0]; });
        if (!part.length) return;
        html += '<section class="sv-activity-group"><h2 class="sv-section-title">' + esc(SV.t(g[1])) + "</h2>" +
          '<ul class="sv-list" role="list">' + part.map(function (it) { return SV.activityRow(it, { shortTime: true }); }).join("") + "</ul></section>";
      });
      this.innerHTML = html;
    }
  });

  /* ---------- Người thân khẩn cấp: xem, sửa, kiểm tra, lưu, gọi thử ---------- */
  var PHONE_RE = /^0\d{9}$/;
  SV.formatPhone = function (digits) {
    return digits.replace(/^(\d{4})(\d{3})(\d{3})$/, "$1 $2 $3");
  };

  define("sv-emergency-contact", class extends HTMLElement {
    connectedCallback() {
      var self = this;
      this.editing = !SV.state.get("emergencyPhone");
      this.render();
      document.addEventListener("sv:state", function (e) {
        if (e.detail.name === "emergencyPhone" && !e.detail.value && !self.editing) { self.editing = true; self.render(); }
      });
    }
    render(error, typed) {
      var self = this;
      var phone = SV.state.get("emergencyPhone") || "";
      var draft = typed !== undefined ? typed : phone;
      var html = '<ul class="sv-list" role="list">';
      if (this.editing) {
        html += '<li><div class="sv-list-item sv-contact-edit">' +
          '<form class="sv-field' + (error ? " sv-field--error" : "") + '" novalidate>' +
            '<label class="sv-field__label" for="sv-contact-input">' + esc(SV.t("safety.contactLabel")) + "</label>" +
            '<input class="sv-field__control" id="sv-contact-input" type="tel" inputmode="tel" autocomplete="tel" value="' + esc(draft) + '"' +
              ' aria-describedby="sv-contact-help"' + (error ? ' aria-invalid="true"' : "") + ">" +
            '<p class="sv-field__help" id="sv-contact-help">' + (error ? icon("error") + "<span>" + esc(error) + "</span>" : esc(SV.t("safety.contactHelp"))) + "</p>" +
            '<div class="sv-contact-edit__actions">' +
              '<button class="sv-btn sv-btn--filled" type="submit">' + esc(SV.t("safety.contactSave")) + "</button>" +
              (phone ? '<button class="sv-btn sv-btn--text" type="button" data-cancel>' + esc(SV.t("common.cancel")) + "</button>" : "") +
            "</div>" +
          "</form></div></li>";
      } else {
        html += '<li><div class="sv-list-item sv-contact">' +
          '<span class="sv-list-item__lead">' + icon("contact_emergency") + "</span>" +
          '<span class="sv-list-item__body"><span class="sv-list-item__sub">' + esc(SV.t("safety.contactShort")) + "</span>" +
          '<span class="sv-contact__phone">' + esc(phone) + "</span></span>" +
          '<button class="sv-btn sv-btn--tonal sv-contact__edit" type="button" data-edit aria-label="' + esc(SV.t("safety.contactEditAria", { phone: phone })) + '">' +
            icon("edit") + esc(SV.t("safety.contactEdit")) + "</button></div></li>";
      }
      html += '<li><button class="sv-list-item" type="button" data-call' + (phone ? "" : " disabled") + ">" +
        '<span class="sv-list-item__lead">' + icon("call") + "</span>" +
        '<span class="sv-list-item__body"><span class="sv-list-item__title">' + esc(SV.t("safety.callTitle")) + "</span>" +
        '<span class="sv-list-item__sub">' + esc(SV.t(phone ? "safety.callSub" : "safety.callNeedPhone")) + "</span></span>" +
        '<span class="sv-list-item__trail sv-list-item__trail--action">' + icon("call", "sv-icon--fill") + "</span></button></li>";
      this.innerHTML = html + "</ul>";

      var form = this.querySelector("form");
      if (form) {
        var input = form.querySelector("input");
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          var digits = input.value.replace(/[\s.\-]/g, "");
          if (!digits) return self.fail(SV.t("safety.contactEmptyError"), input.value);
          if (!PHONE_RE.test(digits)) return self.fail(SV.t("safety.contactInvalidError"), input.value);
          SV.state.set("emergencyPhone", SV.formatPhone(digits));
          self.editing = false;
          self.render();
          self.querySelector("[data-edit]").focus();
          SV.snackbar(SV.t("safety.contactSaved"));
        });
        var cancel = form.querySelector("[data-cancel]");
        if (cancel) cancel.addEventListener("click", function () {
          self.editing = false;
          self.render();
          self.querySelector("[data-edit]").focus();
        });
      }
      var edit = this.querySelector("[data-edit]");
      if (edit) edit.addEventListener("click", function () {
        self.editing = true;
        self.render();
        self.querySelector("input").focus();
      });
      this.querySelector("[data-call]").addEventListener("click", function () {
        SV.snackbar(SV.t("safety.callToast", { phone: SV.state.get("emergencyPhone") }));
      });
    }
    fail(message, typed) {
      this.render(message, typed);
      var input = this.querySelector("input");
      input.focus();
    }
  });

  /* ---------- Thanh trên đổi nền khi nội dung cuộn ---------- */
  document.addEventListener("scroll", function (event) {
    var screen = event.target;
    if (!screen.classList || !screen.classList.contains("sv-device__screen")) return;
    var device = screen.closest(".sv-device");
    var head = device.querySelector(".sv-dusk-head");
    /* Trang chủ: đổi khi vùng Dusk đã cuộn khỏi thanh trạng thái */
    var limit = head ? head.offsetHeight - 40 : 24;
    device.classList.toggle("is-scrolled", screen.scrollTop > limit);
  }, true);

  /* ---------- Hành vi chung: switch, segmented, chip lọc ---------- */
  document.addEventListener("click", function (event) {
    var sw = event.target.closest(".sv-switch[role=switch]");
    if (sw) {
      var on = sw.getAttribute("aria-checked") !== "true";
      sw.setAttribute("aria-checked", String(on));
      sw.dispatchEvent(new CustomEvent("sv:change", { bubbles: true, detail: { checked: on } }));
      return;
    }
    var seg = event.target.closest(".sv-segmented__item[role=radio]");
    if (seg) {
      var group = seg.closest(".sv-segmented");
      group.querySelectorAll("[role=radio]").forEach(function (b) {
        var picked = b === seg;
        b.setAttribute("aria-checked", String(picked));
        b.tabIndex = picked ? 0 : -1;
      });
      group.dispatchEvent(new CustomEvent("sv:change", { bubbles: true, detail: { value: seg.value } }));
      return;
    }
    var chip = event.target.closest("button.sv-chip[aria-pressed]:not([data-filter])");
    if (chip) chip.setAttribute("aria-pressed", String(chip.getAttribute("aria-pressed") !== "true"));
  });

  /* Phím mũi tên trong segmented (radiogroup) */
  document.addEventListener("keydown", function (event) {
    var seg = event.target.closest && event.target.closest(".sv-segmented__item[role=radio]");
    if (!seg || (event.key !== "ArrowRight" && event.key !== "ArrowLeft")) return;
    var items = Array.prototype.slice.call(seg.closest(".sv-segmented").querySelectorAll("[role=radio]"));
    var next = items[(items.indexOf(seg) + (event.key === "ArrowRight" ? 1 : items.length - 1)) % items.length];
    next.focus();
    next.click();
    event.preventDefault();
  });

  /* ---------- Snackbar ---------- */
  SV.snackbar = function (text, action) {
    var host = document.querySelector(".sv-device") || document.body;
    var bar = host.querySelector(":scope > .sv-snackbar");
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "sv-snackbar";
      bar.setAttribute("role", "status");
      bar.setAttribute("aria-live", "polite");
      host.appendChild(bar);
    }
    bar.innerHTML = '<span class="sv-snackbar__text">' + esc(text) + "</span>" +
      (action ? '<button class="sv-btn sv-btn--text" type="button">' + esc(action.label) + "</button>" : "");
    if (action) bar.querySelector("button").addEventListener("click", function () { action.onClick(); bar.classList.remove("is-visible"); });
    void bar.offsetWidth; /* buộc tính lại bố cục để hiệu ứng hiện ra chạy, không phụ thuộc khung hình */
    bar.classList.add("is-visible");
    clearTimeout(bar._timer);
    /* Có nút hành động (Hoàn tác…): giữ 10 giây để người dùng trình đọc màn hình kịp tới */
    bar._timer = setTimeout(function () { bar.classList.remove("is-visible"); }, action ? 10000 : 4000);
  };

  /* ---------- Bottom sheet (nội dung tự do) ---------- */
  SV.openSheet = function (innerHtml, opts) {
    opts = opts || {};
    var host = document.querySelector(".sv-device") || document.body;
    var dialog = document.createElement("dialog");
    dialog.className = "sv-sheet";
    if (opts.labelledBy) dialog.setAttribute("aria-labelledby", opts.labelledBy);
    if (opts.describedBy) dialog.setAttribute("aria-describedby", opts.describedBy);
    dialog.innerHTML = '<div class="sv-sheet__handle" aria-hidden="true"></div>' + innerHtml;
    document.body.appendChild(dialog);
    /* Trong khung điện thoại: đặt sheet sát đáy khung */
    if (host !== document.body) {
      /* Sheet thu nhỏ cùng khung (scale neo góc dưới trái): vị trí theo pixel màn hình, bề rộng theo đơn vị chưa thu nhỏ */
      var rect = host.getBoundingClientRect();
      var z = window.innerWidth > 480 ? SV.deviceZoom() : 1;
      dialog.classList.add("sv-sheet--in-device");
      dialog.style.left = rect.left + "px";
      dialog.style.right = "auto";
      dialog.style.width = rect.width / z + "px";
      dialog.style.maxHeight = (rect.height * 0.85) / z + "px";
      dialog.style.bottom = Math.max(0, window.innerHeight - rect.bottom) + "px";
    }
    var opener = document.activeElement;
    var done = false;
    /* Đóng và xử lý ngay, không chờ sự kiện "close" (có trình duyệt hoãn sự kiện này) */
    function finish(value) {
      if (done) return;
      done = true;
      if (dialog.open) dialog.close(value);
      dialog.remove();
      if (opener && opener.isConnected && opener.focus) opener.focus();
      if (opts.onClose) opts.onClose(value);
    }
    dialog.addEventListener("click", function (event) {
      var btn = event.target.closest("button[value]");
      if (btn) { finish(btn.value); return; }
      if (event.target === dialog) {
        var r = dialog.getBoundingClientRect();
        if (event.clientY < r.top) finish("cancel");
      }
    });
    dialog.addEventListener("cancel", function (event) { event.preventDefault(); finish("cancel"); });
    dialog.addEventListener("close", function () { finish(dialog.returnValue || "cancel"); });
    dialog.showModal();
    var first = opts.focus ? dialog.querySelector(opts.focus) : dialog.querySelector("[autofocus], button[value='cancel'], button");
    if (first) {
      if (!first.matches("button, a, input, textarea")) first.setAttribute("tabindex", "-1");
      first.focus();
    }
    return dialog;
  };

  /* ---------- Bottom sheet xác nhận ---------- */
  SV.confirmSheet = function (opts) {
    SV.openSheet(
      '<h2 class="sv-sheet__title t-headline-s" id="sv-sheet-title">' + esc(opts.title) + "</h2>" +
      '<p class="sv-sheet__body t-body-m">' + esc(opts.body) + "</p>" +
      '<div class="sv-sheet__actions">' +
        '<button class="sv-btn ' + (opts.danger ? "sv-btn--danger" : "sv-btn--filled") + ' sv-btn--block" value="confirm">' + esc(opts.confirm) + "</button>" +
        '<button class="sv-btn sv-btn--text sv-btn--block" value="cancel">' + esc(opts.cancel) + "</button>" +
      "</div>",
      { labelledBy: "sv-sheet-title", onClose: function (value) { if (value === "confirm" && opts.onConfirm) opts.onConfirm(); } }
    );
  };

  SV.esc = esc;
})();
