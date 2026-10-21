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

- **Phạm vi mock sau vòng chỉnh 21/10/2026:** theo yêu cầu sửa 5 điểm yếu khi đối chiếu Product Brief, điều hướng ưu tiên Trang chủ · Hướng dẫn · An toàn · Khám phá · Hồ sơ. Các màn demo trước đây vẫn có; Cộng đồng, Ảnh và video, Dịch thuật, Biên bản họp nằm trong Khám phá và phần mở rộng thu gọn ở Trang chủ. Nội dung tham khảo gốc được lưu ở `docs/01-phan-tich-ban-goc.html`.
- **Luồng chính:** trợ năng từ màn đầu → đăng nhập mẫu → tìm/cấp mạng → xác nhận trạng thái → thử đọc một đoạn chữ. Bài đọc có nhánh ảnh mờ, thử lại, Nghe/Dừng và tự xác nhận hoàn thành; không dùng camera hoặc kính thật.
- **Trạng thái mẫu:** tách liên kết tài khoản, kính online và dịch vụ sẵn sàng; hiển thị thời điểm cập nhật. Dữ liệu thiếu hoặc quá 5 phút không được coi là sẵn sàng và không hiện pin cũ. Mốc 5 phút là quy tắc của mock, chưa phải yêu cầu firmware/backend.
- **SOS:** vẫn là mô phỏng có điều kiện triển khai; có đếm ngược/hủy, kết quả mẫu và lỗi thiếu mạng, thiếu quyền, dịch vụ không phản hồi. Không xác nhận người thân đã nhận hoặc có người tới hỗ trợ.
- Chức năng kính: đặt xe, điều hướng âm thanh, phát nhạc, đọc chữ, mô tả cảnh, tìm đồ thất lạc, chatbot AI, SOS. Web SeeVia gom thành các nhóm: See & Read, Find & Understand, Connect, Go, Community & Ecosystem.
- Mọi dữ liệu là dữ liệu giả; không có cuộc gọi, ghi âm, camera hay kết nối kính thật.
- Nút Nghe phát giọng thực trên thiết bị mở app qua Web Speech API. Có giọng đọc câu mẫu, nội dung mẫu và trạng thái kính; giọng phù hợp phải có trên thiết bị, có thể cần mạng. Chưa phát ra loa kính thật. Dịch thuật dùng các cặp câu Anh–Việt mẫu đã biên soạn, chưa dịch đầu vào tự do bằng AI.
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
- Chữ nội dung/nhãn có sàn 1rem (16px ở cỡ mặc định trình duyệt); thang chữ dùng rem. 3 mức cỡ chữ (×0,88 · ×1 · ×1,28) giữ sàn này cho body/label/title nhỏ; tương phản cao áp dụng toàn app. Nhãn tab và tiêu đề được xuống dòng. Cỡ chữ hệ thống và TalkBack vẫn cần nghiệm thu Android thật.
- Vùng chạm tối thiểu 48dp (Android).
- Thay đổi trạng thái (lỗi, thành công, SOS kích hoạt) được báo qua vùng aria-live.
- Thông báo mặc định đi qua trình đọc màn hình; người dùng có thể chọn TTS tự động cho phản hồi ngắn tại Hiển thị và giọng đọc. Không tự đọc giá trị mật khẩu/OTP. Khả năng phối hợp với TalkBack phải nghiệm thu trên Android thật, không suy ra chỉ từ kiểm thử trình duyệt.
- Tôn trọng prefers-reduced-motion.
