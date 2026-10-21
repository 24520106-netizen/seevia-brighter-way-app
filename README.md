# SeeVia · app mock (Android, 390×844)

Bản mô phỏng giao diện app đồng hành của kính SeeVia. HTML/CSS/JS thuần: mở thẳng file `.html` bằng trình duyệt, không cần cài hay build gì. Cần có mạng để tải font Be Vietnam Pro, Playfair Display và bộ icon Material Symbols từ Google Fonts.

- **Bắt đầu:** mở `index.html` (tự chuyển tới `screens/start.html`)
- Trang mẫu hệ thống thiết kế: `design-system.html`
- Báo cáo phân tích bản tham khảo: `docs/01-phan-tich-ban-goc.html`
- Bối cảnh sản phẩm: `PRODUCT.md` · hệ thống thiết kế: `DESIGN.md`

## Điều chỉnh theo Product Brief · 21/10/2026

- Điều hướng chính: **Trang chủ · Hướng dẫn · An toàn · Khám phá · Hồ sơ**. Trang chủ ưu tiên trạng thái và việc tiếp theo, hướng dẫn, trợ năng, hỗ trợ; các demo mở rộng được thu gọn. Cộng đồng vẫn mở được trong Khám phá.
- **Trợ năng và âm thanh** mở trực tiếp ở màn bắt đầu, trước đăng nhập. Cài đặt được giữ khi bắt đầu phiên mô phỏng mới. Chữ nội dung/nhãn dùng rem với sàn 1rem và tab được xuống dòng.
- Sau kết nối, chọn **Thử đọc một đoạn chữ**: đọc/nghe mẫu, dừng/nghe lại, thử ảnh mờ và tự xác nhận hoàn thành. Màn mới: `screens/read-practice.html`, không dùng camera/micro.
- **Kính của bạn → Thử tình huống mô phỏng → Trạng thái mẫu** có online+sẵn sàng, mất mạng, dịch vụ chưa phản hồi, dịch vụ chưa rõ, chưa cập nhật và dữ liệu cũ. Dữ liệu quá 5 phút được ẩn pin và yêu cầu kiểm tra lại; đây chỉ là mốc của mock. Liên kết đã lưu từ phiên bản cũ sẽ yêu cầu kiểm tra lại, không tự được coi là đang online.
- **An toàn → Thử tình huống gửi SOS** có thành công mẫu, mất mạng, thiếu quyền và lỗi dịch vụ. Thay người nhận/tình huống khi đang đếm ngược sẽ hủy. Nút bắt đầu SOS truy cập trực tiếp luôn hiện.
- Tính năng có nhãn mức triển khai ngay trong danh sách và sheet. Không có lệnh đặt xe, điều hướng hoặc SOS thật được gửi.

### Kiểm thử thay đổi

```text
npm.cmd install --prefix tmp/dom-test --no-save --package-lock=false --ignore-scripts jsdom
node --test tests/product-flows.test.cjs tests/speech.test.cjs
```

Kiểm thử DOM chạy trực tiếp mã app với DOM và engine giọng giả; không mở trình duyệt hoặc gọi mạng. Bao phủ thiết lập → đọc thử, trợ năng trước đăng nhập, dữ liệu cũ, lỗi dịch vụ, SOS lỗi/hủy/thử lại, đích điều hướng và khóa nội dung. Kết quả không thay thế kiểm tra bố cục, chất lượng âm thanh và TalkBack trên Android thật. Xem `docs/KIEM-THU-PRODUCT-BRIEF.md`.

## Xem trên máy tính

- Khung điện thoại **tự thu nhỏ vừa chiều cao cửa sổ**, không cần dùng `Ctrl + −`.
- Nếu trước đó đã lỡ `Ctrl + −`/`Ctrl + +`: Chrome nhớ mức thu phóng **riêng cho từng file** khi mở từ ổ đĩa, nên mỗi màn to nhỏ khác nhau. Nhấn `Ctrl + 0` một lần ở mỗi màn bị lệch để về 100%.
- **Chuyển màn mượt, không tải lại trang:** chỉ có khi mở qua server (xem dòng dưới). Mở thẳng file `.html` thì mỗi lần chuyển màn vẫn tải lại cả trang, vì trình duyệt chặn đọc file khác từ ổ đĩa.
- Muốn mọi màn dùng chung một mức thu phóng: mở qua server nhỏ (`python -m http.server 5510 --directory app` ở thư mục `ui`, rồi vào `http://localhost:5510`).

## Thử luồng đăng nhập và kết nối kính

Không cần backend, tài khoản, kính hay Bluetooth thật. Nên mở qua một server tĩnh (Live Server hoặc lệnh ở trên) để các màn dùng chung origin và dữ liệu trình duyệt. Server tĩnh chỉ phục vụ file HTML/CSS/JS, không thực hiện xác thực hoặc kết nối thiết bị.

1. Mở `index.html`, chọn **Bắt đầu mô phỏng**. Thao tác này đặt lại tài khoản và liên kết mẫu của luồng, giữ nguyên cài đặt hiển thị và các dữ liệu mô phỏng khác.
2. Chọn **Điền thông tin mẫu**, rồi **Đăng nhập**. Không dùng số điện thoại hoặc mật khẩu thật.
3. Chọn **Tìm kính mẫu** → **Kết nối kính này** → **Điền mạng mẫu** → **Kết nối kính**.
4. Ở trạng thái sẵn sàng, chọn **Nghe trạng thái** hoặc đọc trực tiếp bằng TalkBack. Nút Nghe dùng Web Speech API của trình duyệt theo yêu cầu; không tự phát tiếng khi mở màn. Có nút dừng và thông báo khi trình duyệt chưa phát được tiếng. Giọng tiếng Việt phụ thuộc thiết bị/trình duyệt.
5. Mở **Thử tình huống mô phỏng** → **Thử mất kết nối** → **Thử kết nối lại**. Liên kết và phiên đăng nhập được giữ. Trang chủ cũng phản ánh mất kết nối và có lối khôi phục.

Mục **Thử tình huống mô phỏng** ở bước tìm/cấp mạng cho phép chọn không tìm thấy kính, mật khẩu sai hoặc dịch vụ chưa phản hồi. Tình huống giữ nguyên đến khi đổi lựa chọn, nên hãy chọn **Kết nối thành công** trước khi thử khôi phục thành công. Tìm/kết nối đang chạy có thể dừng; rời màn sẽ hủy tác vụ đang chờ. Không lưu mật khẩu; chỉ lưu trạng thái, tài khoản mẫu và tên mạng mẫu vào `seevia.demo` trong localStorage. Nếu trình duyệt không cho lưu dữ liệu, phiên chỉ tồn tại trong trang đang mở.

Các màn dùng ngữ nghĩa HTML, nhãn trường nhập, thứ tự bước và focus tới tiêu đề trạng thái kèm mô tả khi chuyển bước. Kiểm tra DOM/bàn phím hoặc phát tiếng trình duyệt không thay thế nghiệm thu TalkBack trên điện thoại Android.

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
| **Luồng bắt đầu, tìm/cấp mạng và khôi phục kính** | `screens/start.html`, `components/flows.js`, `components/onboarding.css` | Chữ ở `content/vi.js` → `setup`; trạng thái kính có `connection: unlinked / ready / lost`. |
| **Bố cục một màn hình** | `screens/<tên-màn>.html` | Chỉ ghép component; không chứa mã màu. |
| **Lưu cài đặt, nạp chữ, logo** | `core/app.js` | |

## Màn hình

| File | Màn hình | Vào từ |
|---|---|---|
| `screens/start.html` | Bắt đầu luồng mô phỏng, tiếp tục phiên trước, hướng dẫn TalkBack | `index.html` |
| `screens/home.html` | Trang chủ: vùng Dusk, thẻ kính, hoạt động gần đây, lối tắt | Tab 1 |
| `screens/features.html` | Tính năng của kính, kèm câu lệnh mẫu | Tab 2 |
| `screens/safety.html` | An toàn và SOS, người thân khẩn cấp, gọi thử | Tab 3 |
| `screens/community.html` | Cộng đồng | Tab 4 |
| `screens/profile.html` | Hồ sơ, cài đặt, phiên bản (chạm 7 lần mở công cụ nội bộ) | Tab 5 |
| `screens/activity.html` | Lịch sử hoạt động, lọc theo kết quả | Trang chủ → Xem tất cả |
| `screens/album.html` | Ảnh và video, xem chi tiết, xóa, trạng thái rỗng | Trang chủ |
| `screens/translation.html` | Dịch thuật (trình diễn) | Trang chủ |
| `screens/meeting.html` | Biên bản họp, ghi âm mô phỏng | Trang chủ |
| `screens/glasses.html` | Tìm kính mẫu, cấp mạng, nghe trạng thái, thử mất kết nối và khôi phục, hủy liên kết | Sau đăng nhập, Trang chủ, Hồ sơ |
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
├── core/app.js         # Chữ, cài đặt, dữ liệu mô phỏng, router, focus và thông báo cho trình đọc màn hình
├── core/speech.js      # Một phiên giọng đọc chung: chọn giọng, chia đoạn, dừng, ưu tiên SOS, xử lý lỗi
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
<script src="../core/speech.js"></script>
…
<script src="../components/elements.js"></script>  <!-- cuối <body> -->
<script src="../components/speech.js"></script>
<script src="../components/flows.js"></script>
```

## Giọng đọc và TalkBack

- **Nghe thật trên thiết bị mở app:** câu lệnh mẫu, mô tả ảnh, trạng thái kính, bản dịch mẫu, tóm tắt họp, chi tiết hoạt động, hướng dẫn và FAQ. Bấm **Dừng đọc** để dừng; đóng sheet, thu gọn hướng dẫn, đổi màn hoặc đưa app xuống nền cũng dừng bài đọc tương ứng.
- **Thiết lập:** Hồ sơ → **Hiển thị và giọng đọc** → Giọng đọc và trợ năng. Có chọn giọng Việt, tốc độ và Nghe thử. Mặc định thông báo dùng trình đọc màn hình; muốn SeeVia tự đọc các thông báo ngắn, chọn **SeeVia tự đọc**.
- **TalkBack:** bật trong cài đặt trợ năng Android. App không tự bật, phát hiện hay điều khiển TalkBack. Khi dùng TalkBack, giữ lựa chọn **Trình đọc màn hình** để tránh thêm một giọng tự động. Nút Nghe vẫn hoạt động theo yêu cầu.
- **Thiếu giọng hoặc phát lỗi:** thông báo còn trên màn và có thể đọc bằng TalkBack. Thêm giọng Việt trong phần chuyển văn bản thành giọng nói của thiết bị, quay lại bấm **Tải lại danh sách giọng**, rồi Nghe thử. Một số giọng cần mạng; không đảm bảo ngoại tuyến trên mọi thiết bị.
- **Dịch thuật:** chọn một trong bốn cặp câu Anh–Việt mẫu, rồi bấm Dịch → Nghe bản dịch mẫu. Nội dung ngoài mẫu có báo giới hạn; chưa dùng dịch AI hoặc micro.
- **SOS:** ngắt bài đọc thường, có lối kích hoạt bằng bàn phím/trình đọc màn hình và 5 giây để hủy. Thay đổi người nhận trong lúc đếm ngược sẽ hủy. Kết quả vẫn là mô phỏng, không gửi/gọi thật.
- **Thông báo:** giữ trên màn tới khi đóng hoặc thay bằng thông báo mới để có thời gian đọc và chọn Hoàn tác. Lỗi nhập liệu ở ngay trường tương ứng; mật khẩu, OTP và giá trị trường không được tự phát bằng TTS.
- **Giới hạn:** giọng phát trên điện thoại/máy tính, chưa có đầu ra loa kính thật. Trình duyệt cung cấp danh sách giọng và tín hiệu bắt đầu/kết thúc; cần nghe trực tiếp để xác nhận chất lượng và âm lượng.

| Muốn đổi… | Sửa file… |
|---|---|
| Nhãn, lời đọc, câu dịch mẫu và hướng dẫn lỗi | `content/vi.js` → `speech`, `translation.samples` |
| Chọn giọng, timeout, chia đoạn, ưu tiên và vòng đời | `core/speech.js` |
| Bộ Nghe/Dừng, thiết lập và chẩn đoán giọng | `components/speech.js` |
| Kênh thông báo, chuyển màn và focus lỗi | `core/app.js`, `components/elements.js` |
| Nối nội dung từng luồng vào giọng đọc | `components/flows.js` |

Màn nội bộ `screens/dev-test.html` có danh sách giọng, trạng thái engine và nút Nghe thử; phần kiểm thử lệnh kính ở trên vẫn là mô phỏng riêng.

## Kiểm thử phần giọng đọc

Không cần bước build hay thư viện chạy app mới. Các bài kiểm thử dành cho phát triển:

```text
node --test tests/speech.test.cjs
node tests/browser.test.cjs
```

Bài đầu dùng Node.js và engine giả để kiểm tra các tình huống tranh chấp, tải giọng muộn, hủy, lỗi và ưu tiên. Bài trình duyệt cần module `playwright` truy cập được qua `node_modules` hoặc `NODE_PATH` và Chrome đã cài; tự mở server localhost tạm thời rồi đóng khi xong. Không dùng hồ sơ Chrome cá nhân. Ảnh kiểm tra được ghi vào `tmp/talkback-*.png`.

Bộ trình duyệt dùng engine giả cho các luồng, sau đó chạy một phép thử engine thật riêng. Đặt `SEEVIA_VERIFY_REAL_SPEECH=1` để bắt buộc phép thử giọng Việt thật phải hoàn tất khi thiết bị có giọng Việt. Sandbox Windows có thể liệt kê giọng nhưng chặn phát (`synthesis-failed`); kiểm thử thật cần môi trường cho phép truy cập Windows Speech. Các bài tự động không chứng minh chất lượng âm thanh hoặc khả năng dùng TalkBack Android.

Xem [biên bản kiểm tra và checklist Android](docs/KIEM-THU-TALKBACK.md), [kế hoạch](docs/KE-HOACH-TALKBACK.md).
# seevia-brighter-way-app
