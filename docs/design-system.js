/* Trang mẫu: vẽ bảng màu từ biến CSS đang áp dụng, đo tương phản, điều khiển chủ đề và cỡ chữ. */
(function () {
  var SV = window.SV;

  var ROLES = [
    ["--color-primary", "Primary", "Màu chủ đạo (núm duy nhất)"],
    ["--color-primary-fill", "Primary fill", "Nền nút chính"],
    ["--color-primary-strong", "Primary strong", "Chữ liên kết, icon nhấn"],
    ["--color-primary-container", "Primary container", "Nền nút tonal, ô icon"],
    ["--color-secondary-container", "Secondary container", "Chỉ báo tab, chip đã chọn"],
    ["--color-accent-on-dark", "Accent on dark", "Điểm sáng trên nền tối"],
    ["--color-background", "Background", "Nền màn hình"],
    ["--color-surface", "Surface", "Thẻ, danh sách"],
    ["--color-surface-container", "Surface container", "Thanh điều hướng, nền nhóm"],
    ["--color-on-surface", "On surface", "Tiêu đề, chữ mạnh"],
    ["--color-text", "Text", "Chữ nội dung"],
    ["--color-text-muted", "Text muted", "Chữ phụ, mô tả"],
    ["--color-outline", "Outline", "Viền ô nhập, nút viền"],
    ["--color-outline-variant", "Outline variant", "Đường chia, viền thẻ"],
    ["--color-success-container", "Success container", "Nền trạng thái thành công"],
    ["--color-warning-container", "Warning container", "Nền cảnh báo"],
    ["--color-error", "Error", "Lỗi, nút nguy hiểm"],
    ["--color-sos", "SOS", "Nút SOS"]
  ];

  var BRAND = [
    ["--brand-sapphire", "Electric Sapphire", "Chủ đạo, nút"],
    ["--brand-sapphire-600", "Sapphire 600", "Liên kết trên nền sáng"],
    ["--brand-cyan", "Strong Cyan", "Chỉ dùng trên nền tối"],
    ["--brand-iris", "Iris", "Đuôi dải SV, trang trí"],
    ["--brand-lilac", "Lilac", "Nền nhấn tím"],
    ["--brand-frozen", "Frozen Water", "Nền nhấn nhẹ, thành công"],
    ["--brand-ink-900", "Ink 900", "Nền tối sâu"],
    ["--brand-ink-800", "Ink 800", "Tiêu đề, nền Dusk"],
    ["--brand-indigo", "Twilight Indigo", "Chữ nội dung"],
    ["--brand-indigo-soft", "Indigo soft", "Chữ phụ"],
    ["--brand-pearl", "Pearl", "Nền trang"],
    ["--brand-tint", "Tint", "Nền ánh sapphire"],
    ["--brand-evergreen", "Evergreen", "Chữ thành công"],
    ["--fn-red-700", "Đỏ chức năng", "Lỗi, SOS (bổ sung)"],
    ["--fn-amber-800", "Hổ phách chức năng", "Cảnh báo (bổ sung)"]
  ];

  var PAIRS = [
    ["--color-on-surface", "--color-background", "Tiêu đề trên nền"],
    ["--color-text", "--color-background", "Chữ nội dung trên nền"],
    ["--color-text-muted", "--color-surface", "Chữ phụ trên thẻ"],
    ["--color-text-link", "--color-surface", "Liên kết trên thẻ"],
    ["--color-on-primary", "--color-primary-fill", "Chữ trên nút chính"],
    ["--color-on-primary-container", "--color-primary-container", "Chữ trên nút tonal"],
    ["--color-on-secondary-container", "--color-secondary-container", "Tab đang chọn"],
    ["--color-on-dusk", "--brand-ink-800", "Chữ trên vùng Dusk"],
    ["--color-on-dusk-muted", "--brand-ink-800", "Chữ phụ trên vùng Dusk"],
    ["--color-accent-on-dark", "--brand-ink-800", "Cyan trên vùng Dusk"],
    ["--color-on-success-container", "--color-success-container", "Nhãn thành công"],
    ["--color-on-warning-container", "--color-warning-container", "Cảnh báo"],
    ["--color-on-error-container", "--color-error-container", "Lỗi"],
    ["--color-on-error", "--color-error", "Chữ trên nút nguy hiểm"],
    ["--color-on-sos", "--color-sos", "Chữ trên nút SOS"],
    ["--color-outline", "--color-surface", "Viền ô nhập (cần ≥ 3:1)"]
  ];

  /* Đổi bất kỳ màu CSS (kể cả color-mix, oklab) sang RGB bằng canvas */
  var probe = document.createElement("span");
  probe.style.display = "none";
  document.body.appendChild(probe);
  var ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  ctx.canvas.width = ctx.canvas.height = 1;

  function rgbOf(varName) {
    probe.style.color = "var(" + varName + ")";
    var css = getComputedStyle(probe).color;
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#000";
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    var d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  }
  function hex(rgb) {
    return "#" + rgb.map(function (v) { return v.toString(16).padStart(2, "0"); }).join("").toUpperCase();
  }
  function lum(rgb) {
    var c = rgb.map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function ratio(a, b) {
    var la = lum(a), lb = lum(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  }

  function swatches(list, target) {
    var html = "";
    list.forEach(function (row) {
      html += '<div class="ds-swatch"><div class="ds-swatch__chip" style="background:var(' + row[0] + ')"></div>' +
        '<div class="ds-swatch__text"><span class="ds-swatch__name">' + row[1] + "</span>" +
        '<span class="ds-swatch__var">' + row[0] + "</span>" +
        '<span class="ds-swatch__hex" data-var="' + row[0] + '"></span>' +
        '<span class="ds-swatch__use">' + row[2] + "</span></div></div>";
    });
    document.getElementById(target).innerHTML = html;
  }

  function contrastRows() {
    var html = "";
    PAIRS.forEach(function (p) {
      var r = ratio(rgbOf(p[0]), rgbOf(p[1]));
      var need = p[0] === "--color-outline" ? 3 : 4.5;
      var pass = r >= need;
      html += "<tr><td><span class=\"ds-pair\" style=\"color:var(" + p[0] + ");background:var(" + p[1] + ")\">Aa " + SV.brand.name + "</span></td>" +
        "<td><code>" + p[0] + "</code></td><td><code>" + p[1] + "</code></td>" +
        '<td class="ds-ratio">' + r.toFixed(2).replace(".", ",") + ":1</td>" +
        "<td>" + (pass
          ? '<span class="sv-badge sv-badge--success"><span class="sv-icon" aria-hidden="true">check</span>Đạt ' + (need === 3 ? "3:1" : "AA") + "</span>"
          : '<span class="sv-badge sv-badge--error"><span class="sv-icon" aria-hidden="true">close</span>Chưa đạt</span>') +
        " <span class=\"t-body-s t-muted\">" + p[2] + "</span></td></tr>";
    });
    document.getElementById("contrast-rows").innerHTML = html;
  }

  function refreshValues() {
    document.querySelectorAll(".ds-swatch__hex").forEach(function (el) {
      el.textContent = hex(rgbOf(el.getAttribute("data-var")));
    });
    document.querySelectorAll("[data-spec]").forEach(function (el) {
      var target = el.nextElementSibling;
      var cs = getComputedStyle(target);
      var base = el.textContent.split(" — ")[0];
      el.textContent = base + " — " + Math.round(parseFloat(cs.fontSize)) + "/" + Math.round(parseFloat(cs.lineHeight)) + "px";
    });
    contrastRows();
  }

  swatches(ROLES, "role-swatches");
  swatches(BRAND, "brand-swatches");

  /* Dấu sao bốn cánh trong trạng thái rỗng */
  ["empty-mark", "empty-mark-2"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = SV.sparkSvg();
  });

  /* Điều khiển chủ đề và cỡ chữ */
  function syncControls() {
    var scheme = SV.settings.get("contrast") === "on" ? "contrast" : SV.activeScheme();
    document.querySelectorAll("#ctl-scheme [role=radio]").forEach(function (b) {
      var on = b.value === scheme;
      b.setAttribute("aria-checked", String(on));
      b.tabIndex = on ? 0 : -1;
    });
    var font = SV.settings.get("font");
    document.querySelectorAll("#ctl-font [role=radio]").forEach(function (b) {
      var on = b.value === font;
      b.setAttribute("aria-checked", String(on));
      b.tabIndex = on ? 0 : -1;
    });
  }
  document.getElementById("ctl-scheme").addEventListener("sv:change", function (e) {
    var v = e.detail.value;
    if (v === "contrast") { SV.settings.set("contrast", "on"); }
    else { SV.settings.set("contrast", "off"); SV.settings.set("theme", v); }
  });
  document.getElementById("ctl-font").addEventListener("sv:change", function (e) {
    SV.settings.set("font", e.detail.value);
  });
  document.addEventListener("sv:settings", function () {
    syncControls();
    requestAnimationFrame(refreshValues);
  });

  document.getElementById("demo-snack").addEventListener("click", function () {
    SV.snackbar(SV.t("demo.snackbar"), { label: SV.t("common.undo"), onClick: function () {} });
  });
  document.getElementById("demo-sheet").addEventListener("click", function () {
    SV.confirmSheet({
      title: SV.t("demo.sheet.title"),
      body: SV.t("demo.sheet.body"),
      confirm: SV.t("demo.sheet.confirm"),
      cancel: SV.t("demo.sheet.cancel"),
      danger: true
    });
  });

  syncControls();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refreshValues);
  refreshValues();
})();
