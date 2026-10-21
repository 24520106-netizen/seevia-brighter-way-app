/*
 * SeeVia · core/app.js
 * Nạp trong <head>, sau brand/brand.js và content/vi.js.
 * - SV.t(key, vars): lấy chữ từ content, thay {appName} {slogan} {deviceName}.
 * - SV.applyText(root): điền chữ cho [data-t], [data-t-aria], [data-t-placeholder], [data-t-title],
 *   và tên app / slogan cho [data-brand="name|slogan|deviceName"].
 * - SV.settings: cỡ chữ, tương phản cao, chủ đề; lưu trong trình duyệt và áp dụng trước khi vẽ.
 * - SV.brandAsset(name): đường dẫn tới logo trong brand/.
 * - SV.announce(text): đọc thông báo qua trình đọc màn hình.
 */
(function () {
  var SV = (window.SV = window.SV || {});
  var html = document.documentElement;

  /* ---------- Đường dẫn gốc của app (thư mục chứa core/) ---------- */
  var self = document.currentScript && document.currentScript.src;
  SV.root = self ? self.replace(/core\/app\.js(\?.*)?$/, "") : "./";

  SV.brandAsset = function (name) {
    var file = (SV.brand && SV.brand.logos && SV.brand.logos[name]) || name;
    return SV.root + "brand/" + file;
  };

  /* ---------- Chữ ---------- */
  function lookup(key) {
    return String(key).split(".").reduce(function (node, part) {
      return node && node[part] !== undefined ? node[part] : undefined;
    }, SV.content || {});
  }

  SV.t = function (key, vars) {
    var value = lookup(key);
    if (typeof value !== "string") {
      if (window.console) console.warn("[SeeVia] Thiếu chữ cho khoá:", key);
      return key;
    }
    var brand = SV.brand || {};
    var all = Object.assign(
      { appName: brand.name, slogan: brand.slogan, deviceName: brand.deviceName },
      vars || {}
    );
    return value.replace(/\{(\w+)\}/g, function (match, name) {
      return all[name] !== undefined ? String(all[name]) : match;
    });
  };

  /* Dữ liệu dạng danh sách / đối tượng trong content (ví dụ activity.items) */
  SV.data = function (key) { return lookup(key); };

  /* ---------- Dữ liệu mô phỏng dùng chung giữa các màn (lưu trong trình duyệt) ---------- */
  var STATE_KEY = "seevia.demo";
  var stateDefaults = {
    glasses: { linked: false, connection: "unlinked", online: null, service: "unknown", updatedAt: null, battery: null, version: "2.1.4", serial: "SV-DEMO-2026" },
    emergencyPhone: "0901 234 567",
    account: { signedIn: false, name: "", phone: "" },
    albumRemoved: [],      /* chỉ số ảnh mẫu đã xóa */
    meetings: [],          /* biên bản ghi trong phiên mô phỏng */
    devUnlocked: false,
    firstReadDone: false,
    sosScenario: "success"
  };
  var state;
  try { state = Object.assign({}, stateDefaults, JSON.parse(localStorage.getItem(STATE_KEY) || "{}")); }
  catch (e) { state = Object.assign({}, stateDefaults); }

  SV.state = {
    get: function (name) { return state[name]; },
    set: function (name, value) {
      state[name] = value;
      try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch (e) { /* chế độ riêng tư */ }
      document.dispatchEvent(new CustomEvent("sv:state", { detail: { name: name, value: value } }));
    },
    reset: function () {
      try { localStorage.removeItem(STATE_KEY); } catch (e) { /* bỏ qua */ }
      state = Object.assign({}, stateDefaults);
    }
  };

  /* Một liên kết đã lưu không chứng minh kính và dịch vụ vẫn đang hoạt động.
     Sau 5 phút không có tin mới, mock yêu cầu người dùng kiểm tra lại. */
  SV.glassesStatus = function (glasses, now) {
    var g = glasses || SV.state.get("glasses") || {};
    var time = now === undefined ? Date.now() : now;
    if (!g.linked) return { kind: "unlinked", battery: null, updatedAt: null };
    var updatedAt = Number(g.updatedAt);
    if (!Number.isFinite(updatedAt) || updatedAt <= 0 || updatedAt > time + 60000)
      return { kind: "unknown", battery: null, updatedAt: null };
    if (time - updatedAt > 5 * 60 * 1000)
      return { kind: "stale", battery: null, updatedAt: updatedAt };
    if (g.connection === "lost" || g.online === false)
      return { kind: "lost", battery: null, updatedAt: updatedAt };
    if (g.online !== true)
      return { kind: "unknown", battery: null, updatedAt: updatedAt };
    if (g.service === "unavailable")
      return { kind: "serviceUnavailable", battery: null, updatedAt: updatedAt };
    if (g.service !== "ready")
      return { kind: "serviceUnknown", battery: null, updatedAt: updatedAt };
    var battery = Number(g.battery);
    return { kind: "ready", battery: g.battery !== null && g.battery !== undefined && g.battery !== "" && Number.isFinite(battery) && battery >= 0 && battery <= 100 ? battery : null, updatedAt: updatedAt };
  };
  SV.glassesStatusText = function (status) {
    return SV.t("deviceStatus." + status.kind);
  };
  SV.glassesUpdatedText = function (status) {
    if (!status.updatedAt) return SV.t("deviceStatus.noUpdate");
    return SV.t("deviceStatus.updatedAt", { time: new Date(status.updatedAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) });
  };

  function varsOf(el) {
    var raw = el.getAttribute("data-t-vars");
    if (!raw) return undefined;
    try { return JSON.parse(raw); } catch (e) { return undefined; }
  }

  SV.applyText = function (root) {
    root = root || document;
    root.querySelectorAll("[data-t]").forEach(function (el) {
      el.textContent = SV.t(el.getAttribute("data-t"), varsOf(el));
    });
    root.querySelectorAll("[data-t-aria]").forEach(function (el) {
      el.setAttribute("aria-label", SV.t(el.getAttribute("data-t-aria"), varsOf(el)));
    });
    root.querySelectorAll("[data-t-placeholder]").forEach(function (el) {
      el.setAttribute("placeholder", SV.t(el.getAttribute("data-t-placeholder")));
    });
    root.querySelectorAll("[data-brand]").forEach(function (el) {
      var value = SV.brand && SV.brand[el.getAttribute("data-brand")];
      if (value !== undefined) el.textContent = value;
    });
    root.querySelectorAll("[data-t-title]").forEach(function (el) {
      el.setAttribute("title", SV.t(el.getAttribute("data-t-title")));
    });
  };

  /* ---------- Cài đặt hiển thị ---------- */
  var KEY = "seevia.settings";
  var defaults = { font: "md", contrast: "off", theme: "system", speechFeedback: "screenReader", speechChosen: false, speechVoice: "", speechRate: 1 };

  function read() {
    try { return Object.assign({}, defaults, JSON.parse(localStorage.getItem(KEY) || "{}")); }
    catch (e) { return Object.assign({}, defaults); }
  }
  function write(value) {
    try { localStorage.setItem(KEY, JSON.stringify(value)); } catch (e) { /* chế độ riêng tư */ }
  }
  function apply(value) {
    html.setAttribute("data-font", value.font);
    if (value.contrast === "on") html.setAttribute("data-contrast", "high");
    else html.removeAttribute("data-contrast");
    if (value.theme === "light" || value.theme === "dark") html.setAttribute("data-theme", value.theme);
    else html.removeAttribute("data-theme");
  }

  var current = read();
  apply(current);

  SV.settings = {
    get: function (name) { return current[name]; },
    set: function (name, value) {
      current[name] = value;
      write(current);
      apply(current);
      document.dispatchEvent(new CustomEvent("sv:settings", { detail: Object.assign({}, current) }));
    }
  };

  /* Theme đang hiển thị thực tế: "light" | "dark" | "contrast" */
  SV.activeScheme = function () {
    if (html.getAttribute("data-contrast") === "high") return "contrast";
    var forced = html.getAttribute("data-theme");
    if (forced) return forced;
    return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  /* ---------- Thông báo cho trình đọc màn hình ---------- */
  /* urgent = true: đọc ngay, ngắt lời (dùng cho SOS) */
  var regions = {};
  SV.prepareLiveRegions = function (host) {
    ['polite', 'assertive'].forEach(function (kind) {
      var live = regions[kind];
      if (live && live.isConnected && live.parentNode === host) return;
      if (live) { clearTimeout(live._timer); live.remove(); }
      live = document.createElement('div');
      live.className = 'visually-hidden';
      live.setAttribute('role', kind === 'assertive' ? 'alert' : 'status');
      live.setAttribute('aria-live', kind);
      live.setAttribute('aria-atomic', 'true');
      host.appendChild(live);
      regions[kind] = live;
    });
  };
  SV.clearAnnouncements = function () {
    Object.keys(regions).forEach(function (key) { clearTimeout(regions[key]._timer); regions[key].textContent = ''; });
  };
  SV.announce = function (text, urgent, options) {
    options = options || {};
    if (urgent) SV.clearAnnouncements();
    if (SV.speech && !document.hidden && options.speech !== false && SV.settings.get('speechFeedback') === 'voice') {
      var failed = false;
      var started = SV.speech.speak(options.speechText || text, {
        owner: options.owner || document, priority: urgent ? 'urgent' : 'feedback',
        onError: function (error) { failed = true; SV.announce(text + ' ' + SV.speech.errorText(error), urgent, { speech: false }); }
      });
      if (started || failed) return;
    }
    var kind = urgent ? "assertive" : "polite";
    var host = document.querySelector('dialog[open]') || document.body;
    SV.prepareLiveRegions(host);
    var live = regions[kind];
    clearTimeout(live._timer);
    live.textContent = "";
    live._timer = setTimeout(function () { if (live.isConnected) live.textContent = text; }, 60);
  };

  /* ---------- Khung điện thoại tự vừa cửa sổ (trên máy tính) ----------
     Chrome nhớ mức Ctrl + / Ctrl − riêng cho từng file khi mở từ ổ đĩa, nên mỗi màn
     có thể to nhỏ khác nhau. Khung tự thu nhỏ để không cần dùng Ctrl − nữa. */
  SV.deviceZoom = function () {
    var z = parseFloat(getComputedStyle(html).getPropertyValue("--device-zoom"));
    return z > 0 ? z : 1;
  };
  function fitDevice() {
    var gap = 24 * 2 + 20;                    /* lề trang + viền khung */
    var w = parseFloat(getComputedStyle(html).getPropertyValue("--size-device-w")) || 390;
    var h = parseFloat(getComputedStyle(html).getPropertyValue("--size-device-h")) || 844;
    var z = Math.min(1, (window.innerHeight - gap) / h, (window.innerWidth - gap) / w);
    html.style.setProperty("--device-zoom", Math.max(0.5, z).toFixed(3));
  }
  window.addEventListener("resize", fitDevice);
  /* Tính ngay (CSS trong <head> đã nạp xong trước script này) để khung không vẽ ở 100% rồi mới co lại */
  fitDevice();

  function setTitle() {
    var titleKey = html.getAttribute("data-title-key");
    var name = (SV.brand && SV.brand.name) || "";
    document.title = titleKey ? SV.t(titleKey) + " · " + name : name;
  }

  /* ---------- Chuyển màn không tải lại trang ----------
     Bấm liên kết tới screens/*.html: lấy HTML màn mới, chỉ thay khung .sv-device, giữ nguyên CSS, font, icon, JS.
     Mở thẳng từ ổ đĩa (file://) trình duyệt chặn fetch, nên vẫn chuyển trang như cũ. */
  var pages = {};          /* đường dẫn → Promise<chuỗi HTML> */
  var navToken = 0;
  var routed = false;      /* đã chuyển màn bằng router ít nhất một lần */
  var shown;               /* đường dẫn màn đang hiện */

  function pathOf(url) { return url.split("#")[0]; }
  function isScreen(url) {
    var u = new URL(url, location.href);
    return u.origin === location.origin && /\/screens\/[^\/]+\.html$/.test(u.pathname);
  }
  function load(url) {
    var key = pathOf(url);
    if (!pages[key]) {
      pages[key] = fetch(key).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      });
      pages[key].catch(function () { delete pages[key]; });
    }
    return pages[key];
  }

  function swap(text) {
    var doc = new DOMParser().parseFromString(text, "text/html");
    var next = doc.querySelector(".sv-device");
    var current = document.querySelector(".sv-device");
    if (!next || !current) throw new Error("no device");
    if (SV.speech) SV.speech.reset();
    document.querySelectorAll("body > dialog.sv-sheet").forEach(function (d) { d.remove(); });
    var key = doc.documentElement.getAttribute("data-title-key");
    if (key) html.setAttribute("data-title-key", key);
    else html.removeAttribute("data-title-key");
    setTitle();
    current.replaceWith(next);   /* custom element tự nâng cấp khi gắn vào trang */
    SV.applyText(next);
    prepareAccessibility(next);
    var heading = next.querySelector("h1");
    if (heading) {
      if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
    document.dispatchEvent(new CustomEvent("sv:screen"));
  }

  /* Vị trí cuộn của từng màn: quay lại (Back, mũi tên ←) thì trả về đúng chỗ đã cuộn */
  var scrollAt = {};
  var here = location.href;
  function screenScroller() { return document.querySelector(".sv-device__screen"); }

  function render(url, push) {
    if (SV.speech) SV.speech.reset();
    var left = screenScroller();
    if (left) scrollAt[here] = left.scrollTop;
    var token = ++navToken;
    return load(url).then(function (text) {
      if (token !== navToken) return;
      /* Cập nhật địa chỉ trước khi gắn DOM: component đọc location.hash (guide.html#voice) */
      if (push) history.pushState({ sv: true, from: location.href }, "", url);
      routed = true;
      shown = pathOf(url);
      here = location.href;
      var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
      var show = function () {
        swap(text);
        if (!push && scrollAt[here]) restoreScroll(scrollAt[here]);
      };
      if (document.startViewTransition && !reduce) {
        return document.startViewTransition(show).updateCallbackDone;
      }
      show();
    }).catch(function () {
      if (token === navToken) location.href = url;
    });
  }

  function restoreScroll(top) {
    var apply = function () { var el = screenScroller(); if (el) el.scrollTop = top; };
    apply();
    requestAnimationFrame(apply);  /* component dựng xong rồi mới có đủ chiều cao */
  }

  /* Đi tới một màn (dùng thay cho location.href = "x.html") */
  SV.go = function (url) {
    url = new URL(url, location.href).href;
    if (location.protocol === "file:" || !isScreen(url)) { location.href = url; return; }
    render(url, true);
  };

  /* Nút ← của thanh trên: có màn trước trong app thì quay lại đúng màn đó */
  SV.canGoBack = function () {
    var st = history.state;
    if (st && st.sv) return !!st.from;
    var ref = document.referrer;
    return !!ref && ref.indexOf("/screens/") > -1 && pathOf(ref) !== pathOf(location.href) && history.length > 1;
  };

  if (location.protocol !== "file:") {
    document.addEventListener("click", function (event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      var a = event.target.closest && event.target.closest("a[href]");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download") || !isScreen(a.href)) return;
      /* Liên kết neo trong cùng màn: để trình duyệt tự cuộn */
      if (pathOf(a.href) === pathOf(location.href) && a.href.indexOf("#") > -1) return;
      event.preventDefault();
      if (a.href === location.href) return;
      render(a.href, true);
    });
    /* Nạp trước khi trỏ chuột / chạm vào liên kết */
    ["pointerover", "touchstart", "focusin"].forEach(function (type) {
      document.addEventListener(type, function (event) {
        var a = event.target.closest && event.target.closest("a[href]");
        if (a && isScreen(a.href)) load(a.href);
      }, { passive: true });
    });
    shown = pathOf(location.href);
    window.addEventListener("popstate", function () {
      if (!routed || pathOf(location.href) === shown) return; /* chỉ đổi #neo */
      render(location.href, false);
    });
  }

  /* ---------- Khởi động ---------- */
  document.addEventListener('focusin', function (event) {
    var input = event.target;
    if (input.getAttribute('aria-invalid') !== 'true' || SV.settings.get('speechFeedback') !== 'voice') return;
    var label = input.labels && input.labels[0];
    var help = (input.getAttribute('aria-describedby') || '').split(/\s+/).map(function (id) {
      var node = document.getElementById(id);
      if (!node) return '';
      var copy = node.cloneNode(true);
      copy.querySelectorAll('[aria-hidden="true"]').forEach(function (icon) { icon.remove(); });
      return copy.textContent;
    }).join(' ');
    // Read the label and recovery instruction, never the field value (password, OTP, phone).
    if (help) SV.announce((label ? label.textContent + '. ' : '') + help);
  });
  function prepareAccessibility(root) {
    var main = root.querySelector('main');
    if (!main) return;
    main.id = 'sv-main'; main.setAttribute('tabindex', '-1');
    var device = root.matches && root.matches('.sv-device') ? root : root.querySelector('.sv-device');
    if (device && !device.querySelector('.sv-skip')) {
      var skip = document.createElement('a'); skip.className = 'sv-skip visually-hidden-focusable';
      skip.href = '#sv-main'; skip.textContent = SV.t('common.skip');
      skip.addEventListener('click', function (event) { event.preventDefault(); main.focus(); });
      device.prepend(skip);
    }
  }
  document.addEventListener("DOMContentLoaded", function () {
    fitDevice();
    setTitle();
    if (!document.querySelector("link[rel=icon]")) {
      var icon = document.createElement("link");
      icon.rel = "icon";
      icon.type = "image/svg+xml";
      icon.href = SV.brandAsset("favicon");
      document.head.appendChild(icon);
    }
    SV.applyText(document);
    prepareAccessibility(document);
    // Mount empty live regions before the first asynchronous change.
    SV.prepareLiveRegions(document.body);
  });
})();
