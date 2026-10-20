---
name: SeeVia
description: App đồng hành của kính trợ lý thị giác SeeVia (Android, Material 3). See a brighter way.
colors:
  sapphire: "#405FFA"
  sapphire-600: "#2E48E0"
  strong-cyan: "#09BBC8"
  iris: "#8B6CFF"
  lilac: "#E7E0FF"
  frozen-water: "#D9FCED"
  ink-900: "#1B1838"
  ink-800: "#2A2650"
  twilight-indigo: "#3B3664"
  indigo-soft: "#524D78"
  pearl: "#F6F8FF"
  sunken: "#F4F5FC"
  tint: "#EEF2FF"
  line: "#E9EAF5"
  on-dark-soft: "#D6D6E8"
  evergreen: "#07240F"
  white: "#FFFFFF"
  signal-red: "#B3172F"
  signal-red-container: "#FDE6EA"
  amber-ink: "#7A4A00"
  amber-container: "#FFF0D2"
typography:
  display:
    fontFamily: "Playfair Display, Lora, Georgia, serif"
    fontSize: "36px"
    fontWeight: 600
    lineHeight: 1.2
  headline-l:
    fontFamily: "Playfair Display, Lora, Georgia, serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.25
  headline-s:
    fontFamily: "Playfair Display, Lora, Georgia, serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.32
  title-l:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.4
  title-s:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.45
  body-l:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.55
  body-m:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  label-l:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "0.01em"
  label-m:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.35
  icon:
    fontFamily: "Material Symbols Rounded"
    fontSize: "24px"
    fontWeight: 450
rounded:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "28px"
  full: "999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
  "12": "48px"
components:
  button-filled:
    backgroundColor: "{colors.sapphire}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    height: "48px"
    padding: "0 24px"
  button-tonal:
    backgroundColor: "#E3ECFF"
    textColor: "#303E9D"
    rounded: "{rounded.full}"
    height: "48px"
    padding: "0 24px"
  button-danger:
    backgroundColor: "{colors.signal-red}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    height: "48px"
  card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.twilight-indigo}"
    rounded: "{rounded.lg}"
    padding: "16px"
  glasses-card:
    backgroundColor: "{colors.ink-800}"
    textColor: "{colors.white}"
    rounded: "{rounded.xl}"
    padding: "20px"
  list-item:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink-800}"
    height: "72px"
    padding: "12px 16px"
  text-field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink-800}"
    rounded: "{rounded.md}"
    height: "56px"
    padding: "12px 16px"
  nav-bar:
    backgroundColor: "{colors.tint}"
    textColor: "{colors.indigo-soft}"
    height: "80px"
  nav-indicator-active:
    backgroundColor: "{colors.lilac}"
    textColor: "{colors.ink-800}"
    rounded: "{rounded.full}"
    size: "64px 32px"
  chip:
    textColor: "{colors.ink-800}"
    rounded: "{rounded.sm}"
    height: "40px"
    padding: "0 16px"
  sos-button:
    backgroundColor: "{colors.signal-red}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    size: "184px"
---

# Design System: SeeVia

<!-- Viết ở bước 2, cập nhật ở bước 3 sau khi dựng đủ 16 màn hình. Nguồn giá trị: tokens.css là chuẩn; file này mô tả cách dùng. -->

## Overview

**Creative North Star: "Ánh sáng dẫn đường trong giờ chạng vạng"**

SeeVia là app Android (Material 3) mặc bộ nhận diện của kính: Sapphire làm màu hành động, Ink 800 làm vỏ tối, Pearl làm nền đọc. Cấu trúc, điều hướng và control là của Material, người dùng Android đã thuộc; thương hiệu đi vào qua màu theo vai trò, thang chữ, bo góc mềm và một điểm nhận diện duy nhất: vùng **Dusk** trên Trang chủ, nơi thẻ trạng thái kính phát sáng bằng dải thủy tinh cyan → sapphire → iris, như nét chữ SV của logo.

Người dùng là người khiếm thị và người nhìn kém. Vì vậy hệ thống ưu tiên đọc được trước đẹp: chữ đọc tối thiểu 16px, mọi cặp chữ/nền đạt WCAG AA ở cả ba chế độ (sáng, tối, tương phản cao), vùng chạm 48, trạng thái luôn có chữ đi kèm chứ không chỉ màu. Mật độ thoáng, mỗi màn một việc chính.

**Key Characteristics:**
- Material 3 về cấu trúc: navigation bar 5 đích, top app bar, list, segmented button, switch, bottom sheet, snackbar.
- Hai tầng token: màu gốc SeeVia → vai trò. Một núm `--color-primary` đổi toàn bộ.
- Vùng Dusk + thẻ kính là chữ ký thị giác; phần còn lại phẳng, nền Pearl, thẻ trắng.
- Playfair Display chỉ cho tiêu đề lớn; Be Vietnam Pro cho mọi chữ đọc.
- Ba chế độ: sáng (mặc định), tối (theo hệ thống), tương phản cao (tính năng của app).

## Colors

Sapphire dẫn hành động, Ink và Indigo giữ chữ, Pearl và trắng làm nền đọc; cyan chỉ sáng lên trên nền tối.

### Primary
- **Electric Sapphire** (#405FFA): nền nút chính, công tắc bật, gradient thanh pin. Đây là `--color-primary`, núm duy nhất; chữ liên kết, nền tonal, viền focus đều suy ra từ nó.
- **Sapphire 600** (#2E48E0): chữ liên kết và icon nhấn trên nền sáng (suy ra bằng `oklch(from primary l−0.08)`, ra #2E43DE).

### Secondary
- **Lilac** (#E7E0FF): ô chỉ báo tab đang chọn, chip lọc đã chọn, phần đã chọn của segmented.

### Tertiary
- **Strong Cyan** (#09BBC8): điểm sáng trên nền tối (trạng thái "Đã kết nối" trên thẻ kính, ngôi sao bốn cánh) và màu nhấn của chế độ tương phản cao. Không bao giờ dùng làm chữ trên nền sáng (2,35:1).
- **Iris** (#8B6CFF): chỉ là đuôi gradient dải thủy tinh, không làm chữ.

### Neutral
- **Pearl** (#F6F8FF): nền màn hình.
- **Trắng** (#FFFFFF): thẻ, dòng danh sách, ô nhập.
- **Tint** (#EEF2FF): thanh điều hướng dưới, nền nhóm.
- **Ink 800** (#2A2650): tiêu đề, chữ mạnh, nền vùng Dusk.
- **Twilight Indigo** (#3B3664): chữ nội dung (10,43:1 trên Pearl).
- **Indigo soft** (#524D78): chữ phụ, mô tả (7,8:1 trên trắng).
- **Line** (#E9EAF5): đường chia, viền thẻ.

### Trạng thái (bổ sung vì bộ nhận diện không có đỏ/cam)
- **Signal Red** (#B3172F): lỗi, nút nguy hiểm, nút SOS (6,8:1 với chữ trắng).
- **Amber ink** (#7A4A00) trên **Amber container** (#FFF0D2): cảnh báo.
- **Evergreen** (#07240F) trên **Frozen Water** (#D9FCED): thành công (15:1), đúng quy định của bộ nhận diện.

### Named Rules
**The Cyan-After-Dark Rule.** Cyan chỉ xuất hiện trên Ink 800, Ink 900 hoặc nền tương phản cao. Trên nền sáng, điểm nhấn là Sapphire.

**The One Knob Rule.** Màn hình và component không bao giờ ghi mã màu; chỉ dùng biến vai trò. Đổi `--color-primary` là cả app đổi.

**The Words-With-Colour Rule.** Mọi trạng thái (hoàn tất, thất bại, đã kết nối) có chữ hoặc icon đi kèm; màu chỉ là lớp thứ hai.

## Typography

**Display Font:** Playfair Display (với Lora, Georgia, serif)
**Body Font:** Be Vietnam Pro (với system-ui, Roboto, sans-serif)
**Icon Font:** Material Symbols Rounded (nét 450, cỡ 24; tô đặc cho tab đang chọn). Bo tròn khớp nét logo và chuẩn Android.

**Character:** Serif tương phản cao mang chất thư pháp của chữ ký SeeVia, chỉ dùng ở cỡ lớn; Be Vietnam Pro rõ dấu tiếng Việt, mở, dễ đọc ở mọi cỡ.

### Hierarchy
- **Display** (Playfair 600, 36px, 1.2): tiêu đề trang tài liệu; hiếm dùng trong app.
- **Headline** (Playfair 600, 30 / 26 / 22px): lời chào Trang chủ, tiêu đề màn lớn, tiêu đề bottom sheet, tiêu đề trạng thái rỗng.
- **Title** (Be Vietnam Pro 600, 20 / 18 / 16px): tiêu đề thanh trên, tiêu đề mục, tên dòng danh sách.
- **Body** (Be Vietnam Pro 400, 18 / 16 / 15px, line-height 1.5–1.55): nội dung; 15px chỉ cho mô tả phụ và thời gian.
- **Label** (Be Vietnam Pro 600, 16 / 14 / 13px): nút (16), nhãn tab và chip (14), badge (13).

Mọi cỡ nhân với `--font-scale` (×0,88 · ×1 · ×1,28) theo lựa chọn ở màn Hiển thị.

### Named Rules
**The Serif-Only-Large Rule.** Playfair không bao giờ dưới 22px và không bao giờ cho nút, nhãn, nội dung.

**The 16 Floor Rule.** Chữ người dùng cần đọc không nhỏ hơn 16px ở cỡ "Vừa".

## Layout

Một cột trong khung 390×844. Lề màn hình 16px (`--layout-gutter`), khoảng giữa các khối cùng nhóm 12px, trước mỗi mục mới 32px, sau tiêu đề mục 12px. Lưới 4px cho mọi khoảng cách. Vùng chạm tối thiểu 48×48.

Khung app (Android edge-to-edge): thanh trạng thái 32 → top app bar 64 → nội dung cuộn → navigation bar 80 → thanh cử chỉ 20. Trang chủ cho nội dung Dusk tràn lên dưới thanh trạng thái trong suốt. Trên điện thoại thật (≤480px) khung tràn hết màn và bỏ thanh trạng thái giả.

## Elevation & Depth

Phẳng theo kiểu Material tonal: phân lớp bằng màu nền (Pearl → trắng → Tint → Surface container high) và viền mảnh, không đổ bóng khi đứng yên. Bóng chỉ cho thứ thật sự nổi lên trên nội dung.

### Shadow Vocabulary
- **elevation-1** (`0 1px 2px rgb(42 38 80 / .06), 0 2px 6px -2px rgb(42 38 80 / .10)`): nút chính khi rê chuột.
- **elevation-2** (`0 1px 2px rgb(42 38 80 / .06), 0 12px 32px -12px rgb(42 38 80 / .22)`): FAB, nút SOS; đúng bóng mềm của bộ nhận diện.
- **elevation-3** (`0 2px 4px rgb(42 38 80 / .08), 0 24px 48px -16px rgb(42 38 80 / .32)`): bottom sheet, snackbar.

### Named Rules
**The Flat-At-Rest Rule.** Thẻ và danh sách không có bóng. Tương phản cao tắt mọi bóng và dùng viền 2px thay thế. Ở chủ đề tối, vùng Dusk có viền mảnh `--color-dusk-edge` để không hòa vào nền.

## Shapes

Mềm như nét bo tròn hai đầu của logo, không góc nhọn. Nút, chip lọc, badge, công tắc, ô chỉ báo tab bo tròn hẳn; ô nhập và ô icon 12px; thẻ và nhóm danh sách 16px; thẻ kính và bottom sheet 28px. Nút SOS và avatar là hình tròn. Ngôi sao bốn cánh của bộ nhận diện là dấu hình học duy nhất ngoài logo: trạng thái "Đã kết nối" và trạng thái rỗng.

## Components

### Buttons
- **Shape:** bo tròn hẳn (999px), cao 48.
- **Filled:** nền Sapphire, chữ trắng 16/600; một nút filled cho hành động chính của màn.
- **Tonal:** nền primary container, chữ on-primary-container; hành động phụ quan trọng.
- **Outlined / Text:** viền outline hoặc chỉ chữ Sapphire 600; hành động phụ, "Để sau".
- **Danger:** nền Signal Red; chỉ trong bottom sheet xác nhận hoặc hành động xóa/hủy.
- **Hover / Focus / Pressed:** lớp trạng thái Material (currentColor 8% / 12% / 14%); focus thêm viền 3px Sapphire 600 cách 2px.
- **FAB mở rộng:** nền primary container, bo 16, bóng elevation-2; tối đa một FAB mỗi màn.

### Chips
- **Assist:** viền outline, icon Sapphire, chữ 14/600, cao 40 (vùng chạm 48).
- **Filter đã chọn:** nền Lilac, bỏ viền, hiện dấu ✓.
- **Badge trạng thái:** viên thuốc cao 28, nền container của trạng thái + chữ cùng họ màu, luôn có chữ.

### Cards / Containers
- **Corner Style:** 16px (thẻ kính 28px).
- **Background:** trắng trên nền Pearl; filled dùng Tint.
- **Shadow Strategy:** không bóng (xem Elevation).
- **Border:** 1px Line; tương phản cao 2px.
- **Internal Padding:** 16px (thẻ kính 20px).

### Inputs / Fields
- **Style:** nhãn 16/600 luôn hiện phía trên ô; ô cao 56, viền 1px outline (≥3:1), bo 12, chữ 18px.
- **Focus:** viền chuyển Sapphire 600, dày thêm 1px.
- **Error:** viền và chữ hỗ trợ Signal Red, có icon lỗi và câu nói rõ cách sửa; `aria-invalid`.

### Navigation
- **Navigation bar:** 5 đích (Trang chủ, Tính năng, An toàn, Cộng đồng, Hồ sơ), nền Tint, icon 24 + nhãn label-m (tối đa 16px). Ở cỡ chữ To, nhãn được xuống 2 dòng thay vì bị cắt. Đích đang mở: ô chỉ báo Lilac 64×32 sau icon, icon chuyển dạng tô đặc, chữ Ink 800.
- **Đầu mục có liên kết:** tiêu đề mục (h2) và liên kết "Xem tất cả" đứng cạnh nhau nhưng tách rời; liên kết cao 48, không nằm trong tiêu đề.
- **Top app bar:** nút ← 48, tiêu đề 20/600 canh trái, hành động bên phải; biến thể lớn đặt tiêu đề Playfair bên dưới; biến thể Dusk trong suốt trên Trang chủ.

### Thẻ trạng thái kính (chữ ký)
Nền gradient Dusk (Ink 800 với hai quầng Sapphire/Indigo), bo 28. Hàng đầu: ô icon kính tròn, tên "Kính SeeVia", trạng thái cyan có ngôi sao bốn cánh. Giữa: thanh pin cao 10 tô dải thủy tinh cyan → Sapphire → Iris. Cuối: mã serial và phiên bản bằng chữ phụ trên nền tối. Khi có đích đến, cả thẻ là một liên kết (một vùng chạm, một tên đọc đầy đủ cho trình đọc màn hình); mũi tên chỉ để báo hiệu.

### Dòng trạng thái SOS (Trang chủ)
Nằm ngay dưới thẻ kính trong vùng Dusk: tấm nền sáng hơn một bậc, icon SOS trong vòng tròn Signal Red, "SOS sẽ báo tới 0901 234 567" và gợi ý một dòng. Chạm để tới An toàn. Khi chưa có số người thân, đổi sang lời nhắc thêm số.

### Nút SOS
Tròn 184px, nền Signal Red, quầng đỏ 8px, icon và chữ "SOS" trắng 40/700. Ba trạng thái:
- **Nhấn:** 3 lần liên tiếp, mỗi lần cách nhau dưới 2 giây; ba chấm tiến độ cho người nhìn được, thông báo khẩn (assertive) cho trình đọc màn hình ở mỗi lần nhấn.
- **Đếm ngược:** 5 giây, số lớn 64/700 và "Chạm để hủy" ngay trên nút; một vòng đỏ chạy quanh nút hết một vòng trong 5 giây. Chạm lần nữa là hủy.
- **Chưa có số người thân:** không cho gửi. Nút nền trắng viền đỏ với icon thêm số và chữ "Thêm số trước"; chạm (hoặc nhấn 3 lần) sẽ báo khẩn lý do và đưa focus tới ô nhập số.
- **Lối cho trình đọc màn hình:** nút "Gửi SOS ngay, vẫn có 5 giây để hủy" ẩn với mắt, hiện khi được focus.
- **Đã gửi:** nút chuyển nền trắng viền đỏ với dấu ✓; thẻ kết quả nền error container ghi giờ gửi và người nhận, nút "Tôi an toàn". Focus chuyển tới tiêu đề thẻ kết quả.

### Bottom sheet và snackbar
Sheet: nền Surface container high, bo 28 phía trên, tay nắm 32×4, tiêu đề Playfair, nút xác nhận và nút hủy xếp dọc rộng hết. Snackbar: nền Ink 800, chữ Pearl, một hành động chữ; tự ẩn sau 4 giây, hoặc 10 giây khi có hành động (Hoàn tác). Mỗi thông báo chỉ đi một kênh: snackbar đã là vùng đọc tự động thì không gọi thêm `SV.announce`.

### Danh sách chỉ để đọc (cộng đồng)
Nền Tint phẳng, bo 16, không viền, không mũi tên, không hover: khác hẳn dòng danh sách bấm được (nền trắng, mũi tên). Icon trong vòng tròn trắng. Tương phản cao dùng viền nét đứt để vẫn tách khỏi thẻ bấm được.

### Dòng tính năng
Dòng danh sách bấm được (nền trắng, mũi tên) kèm dòng "Thử nói: …" bằng chữ phụ với icon giọng nói. Chạm mở bottom sheet: mô tả, câu lệnh mẫu, các bước đánh số, nút "Nghe câu lệnh mẫu".

### Sheet chi tiết
Dùng chung cho hoạt động, biên bản, ảnh, tính năng: ô icon tròn 56 nền primary container, tiêu đề Playfair (nhận focus khi mở), dòng meta (badge + thời gian), nội dung body-l được gắn `aria-describedby` để trình đọc màn hình đọc ngay.

### Thẻ ảnh
Lưới 2 cột, khung vuông nền primary container chứa icon minh họa và nhãn "Ảnh minh họa" (trung thực: chưa có ảnh thật). Chạm mở bottom sheet chi tiết với mô tả AI cỡ body-l, nút "Nghe mô tả" và "Xóa ảnh" (qua xác nhận).

### Nút ghi âm
Một nút duy nhất gồm vòng tròn 112px (Sapphire; khi ghi chuyển Signal Red và có quầng nhịp) và nhãn hành động bên dưới. Đồng hồ 40/600 số đều.

### Thẻ hotline
Cùng gradient Dusk với Trang chủ, icon cyan, chữ trắng, icon gọi bên phải. Là một nút: bấm hiện snackbar báo bản mô phỏng không gọi được.

## Do's and Don'ts

### Do:
- **Do** dùng biến vai trò (`--color-*`, `--type-*`, `--space-*`, `--radius-*`) trong mọi màn hình và component.
- **Do** đặt cyan chỉ trên nền Ink hoặc tương phản cao; trên nền sáng dùng Sapphire 600 cho chữ nhấn.
- **Do** giữ một nút filled cho hành động chính của mỗi màn; hành động khó đảo ngược đi qua bottom sheet xác nhận.
- **Do** kiểm tra mỗi màn ở cỡ chữ "To" (×1,28) và ở chế độ tương phản cao trước khi xem là xong.
- **Do** lấy logo qua `<sv-logo>` và chữ qua `content/vi.js`; không ghi tên app trong HTML.

### Don't:
- **Don't** dùng Midnight Navy #041466, Royal Blue hay Evergreen làm nền: bộ nhận diện đã ngừng dùng.
- **Don't** dùng Playfair cho nút, nhãn hay nội dung, hoặc dưới 22px.
- **Don't** để thứ gì trông như nút (nền trắng có mũi tên, viền, icon gọi) mà không bấm được; ngược lại, thứ chỉ để đọc dùng nền Tint phẳng.
- **Don't** để số điện thoại hay mã bị ngắt dòng giữa chừng: dùng `SV.keepTogether`.
- **Don't** truyền trạng thái chỉ bằng màu.
- **Don't** dùng control kiểu iOS (công tắc iOS, action sheet iOS); đây là app Android.
- **Don't** dùng gradient cho chữ, hay viền màu dày bên trái thẻ.
