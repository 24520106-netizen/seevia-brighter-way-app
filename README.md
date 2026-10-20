# SeeVia · app mock (Android, 390×844)

Bản mô phỏng giao diện app đồng hành của kính SeeVia. HTML/CSS/JS thuần: mở thẳng file `.html` bằng trình duyệt, không cần cài hay build gì. Cần có mạng để tải font Be Vietnam Pro, Playfair Display và bộ icon Material Symbols từ Google Fonts.

- **Bắt đầu:** mở `index.html` (tự chuyển tới `screens/home.html`)
- Trang mẫu hệ thống thiết kế: `design-system.html`
- Báo cáo phân tích bản tham khảo: `docs/01-phan-tich-ban-goc.html`
- Bối cảnh sản phẩm: `PRODUCT.md` · hệ thống thiết kế: `DESIGN.md`

## Xem trên máy tính

- Khung điện thoại **tự thu nhỏ vừa chiều cao cửa sổ**, không cần dùng `Ctrl + −`.
- Nếu trước đó đã lỡ `Ctrl + −`/`Ctrl + +`: Chrome nhớ mức thu phóng **riêng cho từng file** khi mở từ ổ đĩa, nên mỗi màn to nhỏ khác nhau. Nhấn `Ctrl + 0` một lần ở mỗi màn bị lệch để về 100%.
- Muốn mọi màn dùng chung một mức thu phóng: mở qua server nhỏ (`python -m http.server 5510 --directory app` ở thư mục `ui`, rồi vào `http://localhost:5510`).

## Muốn đổi… → sửa file…

| Muốn đổi… | Sửa file… | Ghi chú |
|---|---|---|
| **Logo** | Thay file trong `brand/` (giữ nguyên tên, ví dụ `logo-full.svg`) | Hoặc trỏ tên file mới trong `brand/brand.js` → `logos`. Mọi `<sv-logo>` đổi theo. |
| **Tên app, slogan, tên thiết bị** | `brand/brand.js` → `name`, `slogan`, `deviceName` | Chữ trong app dùng `{appName}`, `{slogan}` nên tự đổi theo. |
| **Giọng văn** (quy tắc viết) | `brand/brand.js` → `voice` | Tài liệu cho người viết chữ; app không đọc mục này. |
| **Màu chủ đạo** | `tokens.css` → dòng `--color-primary` (mục 2.1) | Một dòng. Nút, liên kết, nền nhạt, focus, chế độ tối tự suy ra. |
| **Bảng màu gốc** | `tokens.css` → mục 1.1 (`--brand-*`) | Tầng 1. Màn hình không dùng trực tiếp tầng này. |
| **Màu theo vai trò** (nền, chữ, viền, trạng thái) | `tokens.css` → mục 2.2–2.8 | Chủ đề tối và tương phản cao ở cuối file. |
| **Font** | `tokens.css` → dòng `@import` đầu file + `--font-display`, `--font-sans` (mục 1.3) | |
| **Cỡ chữ** | `tokens.css` → mục 3 (`--type-*`) | Hệ số người dùng chọn: `html[data-font]`. |
| **Khoảng cách, lề, lưới** | `tokens.css` → mục 4 (`--space-*`, `--layout-*`, `--size-*`) | Mọi màn dùng chung các biến này. |
| **Bo góc** | `tokens.css` → mục 5 (`--radius-*`) | |
| **Đổ bóng** | `tokens.css` → mục 6 (`--elevation-*`) | |
| **Chữ trong app** (nhãn, thông báo, nội dung mẫu) | `content/vi.js` | Thêm tiếng Anh: tạo `content/en.js` cùng khoá rồi đổi thẻ `<script>`. |
| **Dữ liệu mẫu** (lịch sử, ảnh, tính năng, câu hỏi thường gặp) | `content/vi.js` → `activity.items`, `album.items`, `features.groups`, `support.faq`… | |
| **Dữ liệu ban đầu của bản mô phỏng** (kính, số người thân, tài khoản) | `core/app.js` → `stateDefaults` | Muốn về trạng thái đầu: xóa dữ liệu trang trong trình duyệt. |
| **Hình dạng một component** (nút, thẻ, ô nhập…) | `components/<tên>.css` | Ví dụ nút: `components/button.css`. |
| **Component dùng chung** (thanh điều hướng, thẻ kính, SOS, danh sách…) | `components/elements.js` | Đích của thanh điều hướng: `DESTINATIONS`. |
| **Component riêng từng luồng** (ghi âm, dịch, tài khoản, kính…) | `components/flows.js` + `components/flows.css` | |
| **Bố cục một màn hình** | `screens/<tên-màn>.html` | Chỉ ghép component; không chứa mã màu. |
| **Lưu cài đặt, nạp chữ, logo** | `core/app.js` | |

## Màn hình

| File | Màn hình | Vào từ |
|---|---|---|
| `screens/home.html` | Trang chủ: vùng Dusk, thẻ kính, hoạt động gần đây, lối tắt | Tab 1 |
| `screens/features.html` | Tính năng của kính, kèm câu lệnh mẫu | Tab 2 |
| `screens/safety.html` | An toàn và SOS, người thân khẩn cấp, gọi thử | Tab 3 |
| `screens/community.html` | Cộng đồng | Tab 4 |
| `screens/profile.html` | Hồ sơ, cài đặt, phiên bản (chạm 7 lần mở công cụ nội bộ) | Tab 5 |
| `screens/activity.html` | Lịch sử hoạt động, lọc theo kết quả | Trang chủ → Xem tất cả |
| `screens/album.html` | Ảnh và video, xem chi tiết, xóa, trạng thái rỗng | Trang chủ |
| `screens/translation.html` | Dịch thuật (trình diễn) | Trang chủ |
| `screens/meeting.html` | Biên bản họp, ghi âm mô phỏng | Trang chủ |
| `screens/glasses.html` | Kính của bạn: liên kết / hủy liên kết | Trang chủ, Hồ sơ |
| `screens/guide.html` | Hướng dẫn sử dụng | Trang chủ, Hồ sơ, Hỗ trợ |
| `screens/account.html` | Tài khoản: đăng nhập, đăng ký, OTP (mã 123456), đăng xuất | Hồ sơ |
| `screens/support.html` | Hỗ trợ và góp ý, câu hỏi thường gặp | Hồ sơ |
| `screens/display.html` | Hiển thị: cỡ chữ, tương phản cao | Hồ sơ |
| `screens/dev-test.html` | Kiểm thử action (nội bộ) | Hồ sơ → chạm 7 lần vào phiên bản |
| `screens/404.html` | Không tìm thấy | Đường dẫn sai |

## Cấu trúc

```text
app/
├── index.html          # Mở bản mô phỏng
├── tokens.css          # Toàn bộ token: màu gốc → vai trò, font, cỡ chữ, khoảng cách, bo góc, bóng
├── base.css            # Nền tảng chung, lớp kiểu chữ .t-*, icon .sv-icon, bố cục .l-*
├── brand/              # Logo SVG (đầy đủ, nền tối, biểu tượng, app icon, wordmark, trắng, đen, favicon) + brand.js
├── content/vi.js       # Toàn bộ chữ tiếng Việt và dữ liệu mẫu
├── core/app.js         # Chữ (SV.t), cài đặt hiển thị, dữ liệu mô phỏng (SV.state), logo, thông báo cho trình đọc màn hình
├── components/         # index.css nạp mọi file .css; elements.js (dùng chung) + flows.js (theo luồng)
├── screens/            # Mỗi màn hình một file
├── docs/               # Báo cáo phân tích, CSS/JS của trang mẫu
├── design-system.html  # Trang mẫu: logo, màu, chữ, component
├── PRODUCT.md · DESIGN.md
```

## Vì sao là `brand.js` chứ không phải `brand.json`

Trình duyệt chặn đọc file `.json` khi mở trang trực tiếp từ ổ đĩa (`file://`). Dữ liệu vẫn viết đúng cú pháp JSON, chỉ đặt trong file `.js` (`SV.brand = { … }`, `SV.content = { … }`) để mở thẳng được.

## Thứ tự nạp trong mỗi màn hình

```html
<link rel="stylesheet" href="../tokens.css">
<link rel="stylesheet" href="../base.css">
<link rel="stylesheet" href="../components/index.css">
<script src="../brand/brand.js"></script>
<script src="../content/vi.js"></script>
<script src="../core/app.js"></script>
…
<script src="../components/elements.js"></script>  <!-- cuối <body> -->
<script src="../components/flows.js"></script>
```
