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
    glasses: { linked: true, battery: 82, version: "2.1.4", serial: "SV-DEMO-2026" },
    emergencyPhone: "0901 234 567",
    account: { signedIn: true, name: "", phone: "0912 345 678" },
    albumRemoved: [],      /* chỉ số ảnh mẫu đã xóa */
    meetings: [],          /* biên bản ghi trong phiên mô phỏng */
    devUnlocked: false
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
  var defaults = { font: "md", contrast: "off", theme: "system" };

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
  SV.announce = function (text, urgent) {
    var kind = urgent ? "assertive" : "polite";
    var live = regions[kind];
    if (!live) {
      live = regions[kind] = document.createElement("div");
      live.className = "visually-hidden";
      live.setAttribute("aria-live", kind);
      live.setAttribute("role", urgent ? "alert" : "status");
      document.body.appendChild(live);
    }
    live.textContent = "";
    setTimeout(function () { live.textContent = text; }, 60);
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

  /* ---------- Khởi động ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    fitDevice();
    var titleKey = html.getAttribute("data-title-key");
    var name = (SV.brand && SV.brand.name) || "";
    document.title = titleKey ? SV.t(titleKey) + " · " + name : name;
    if (!document.querySelector("link[rel=icon]")) {
      var icon = document.createElement("link");
      icon.rel = "icon";
      icon.type = "image/svg+xml";
      icon.href = SV.brandAsset("favicon");
      document.head.appendChild(icon);
    }
    SV.applyText(document);
  });
})();
