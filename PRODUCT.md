# Product

<!-- impeccable:product-schema 1 -->

## Platform

android

## Stack

HTML/CSS/JS thuần, mở trực tiếp bằng trình duyệt, không bước build. Mock trình bày trong khung điện thoại 390×844. Cấu trúc bắt buộc do người dùng đặt: `tokens.css` (màu gốc → màu theo vai trò), `brand/` (logo SVG + `brand.json`), `components/`, `screens/` (mỗi màn một file), `README.md` (bảng "Muốn đổi… → sửa file…"). Toàn bộ chữ giao diện nằm trong một file nội dung để sau này thêm tiếng Anh.

## Users

- **Người xem chính của bản mock:** ban giám khảo và người xem buổi trình diễn dự án SeeVia (ví dụ vòng 2 cuộc thi AISC26). Họ bấm thử các luồng để hiểu app đồng hành của kính làm được gì.
- **Người dùng mà app hướng tới:** người khiếm thị và người suy giảm thị lực tại Việt Nam, dùng điện thoại cùng kính SeeVia trong sinh hoạt hằng ngày. Nhiều người dùng trình đọc màn hình (TalkBack) hoặc phóng to chữ.

## Product Purpose

SeeVia là dự án kính trợ lý thị giác dùng AI (thị giác máy tính, OCR, tương tác giọng nói tiếng Việt) trong hệ sinh thái kính – app – web, giúp người khiếm thị tiếp cận thông tin, sống tự lập hơn và kết nối cộng đồng. App con là app đồng hành trên điện thoại: theo dõi kính, xem lại những gì kính đã làm, thiết lập an toàn và trợ năng.

Bản mock này thành công khi người xem bấm qua hết các màn, hiểu được vai trò của app, và không bị dẫn tới tin rằng một tính năng chưa có đã chạy thật.

## Positioning

App đồng hành của một chiếc kính được thiết kế trước hết cho người khiếm thị Việt Nam: giọng nói tiếng Việt, rảnh tay, và chính app cũng phải dùng được bằng trình đọc màn hình, chữ lớn, tương phản cao.

## Operating Context

- Kính nhận lệnh giọng nói; app nhận lại lịch sử lệnh (đặt xe, phát nhạc, điều hướng), ảnh chụp qua kính kèm mô tả AI, biên bản họp.
- Người dùng mở app chủ yếu để: kiểm tra kính đã kết nối và còn pin chưa, cấu hình số người thân cho SOS, chỉnh cỡ chữ / tương phản, xem lại hoạt động.
- Trong buổi trình diễn, mock được mở trên máy tính hoặc điện thoại, bấm qua lại giữa các màn.

## Capabilities and Constraints

- **Giữ nguyên tính năng của bản tham khảo** ("Your Eyes", innostar-demo.vercel.app/main; phân tích trong `docs/01-phan-tich-ban-goc.html`): 5 tab Trang chủ · Tính năng · An toàn · Cộng đồng · Hồ sơ; các màn Lịch sử hoạt động, Ảnh và video, Hướng dẫn, Dịch thuật (demo), Biên bản họp (demo), Quản lý kính, Hiển thị, Tài khoản (đăng nhập / đăng ký / OTP), Hỗ trợ & góp ý, Kiểm thử action (ẩn).
- Chức năng kính: đặt xe, điều hướng âm thanh, phát nhạc, đọc chữ, mô tả cảnh, tìm đồ thất lạc, chatbot AI, SOS. Web SeeVia gom thành các nhóm: See & Read, Find & Understand, Connect, Go, Community & Ecosystem.
- Mọi dữ liệu là dữ liệu giả; không có cuộc gọi, ghi âm, camera hay kết nối kính thật.
- Chỉ tiếng Việt ở bản này; chữ tách ra một file nội dung.
- Tên thiết bị trong app: kính SeeVia (thay "Your Eyes" của bản tham khảo).

## Brand Commitments

- Tên: **SeeVia**. Slogan: **See a brighter way** (giữ tiếng Anh cả trong giao diện tiếng Việt).
- Nguồn định danh hình ảnh duy nhất: thư mục `../logo` (logo SVG, bảng màu, kiểu chữ và quy tắc tương phản trong `brand-showcase.html`). Thư mục `../web` chỉ là nguồn cho tên, đối tượng, giọng văn; màu và font của web không áp dụng.
- Giọng văn (theo trợ lý SeeVia AI trên web): tiếng Việt tự nhiên, ấm áp, chuyên nghiệp; gọi người dùng là "bạn"; khi app tự nói về mình thì xưng "SeeVia", không dùng "tôi"/"mình". Câu rõ, đầy đủ, viết cho trình đọc màn hình: không dựa vào màu, emoji hay hình để truyền nghĩa. Ý chính trước, ghi chú sau.
- Trung thực về trạng thái dự án: SeeVia đang phát triển, chưa có mô hình kính. Không bịa giá, thông số, độ chính xác, ngày ra mắt, đối tác, chứng nhận. Kính không thay gậy trắng hay kỹ năng định hướng.

## Evidence on Hand

- Logo: `../logo/*.svg` (đầy đủ, nền tối, biểu tượng, app icon, wordmark, favicon, trắng, đen) và `../logo/png/`.
- Bộ nhận diện: `../logo/brand-showcase.html`.
- Nội dung, giọng văn, tính năng: `../web/README.md`, `../web/HomePage/homeData.ts`, `../web/contact-backend/assistant-prompt.mjs`.
- Bản tham khảo và ảnh chụp: `docs/01-phan-tich-ban-goc.html`, `docs/assets/ban-goc/`.
- Chưa có: ảnh kính thật, số liệu người dùng, lời chứng thực, đối tác đã xác nhận. Không được bịa.

## Product Principles

1. **Dùng được khi không nhìn rõ.** Mọi màn phải dùng được với chữ ×1,28, tương phản cao và trình đọc màn hình; đẹp là thứ hai.
2. **Trung thực là một tính năng.** Bản mô phỏng nói rõ mình là mô phỏng; không hứa điều dự án chưa xác nhận.
3. **Một việc một chỗ.** Mỗi thiết lập có một nơi duy nhất (số khẩn cấp ở An toàn, cỡ chữ ở Hiển thị); chỗ khác chỉ dẫn tới.
4. **Thứ gì trông bấm được thì phải bấm được.**
5. **An toàn trước tiện lợi.** Hành động khó đảo ngược (hủy liên kết kính, đăng xuất, SOS) phải có xác nhận và phản hồi rõ ràng.

## Accessibility & Inclusion

- Chữ đạt tối thiểu WCAG AA 4,5:1 (theo bảng cặp màu trong bộ nhận diện); cặp dưới 4,5 chỉ cho trang trí hoặc chữ ≥ 24px.
- Chữ đọc tối thiểu 16px; 3 mức cỡ chữ (×0,88 · ×1 · ×1,28) và chế độ tương phản cao áp dụng cho toàn app.
- Vùng chạm tối thiểu 48dp (Android).
- Thay đổi trạng thái (lỗi, thành công, SOS kích hoạt) được báo qua vùng aria-live.
- Tôn trọng prefers-reduced-motion.
