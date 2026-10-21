# Biên bản kiểm tra giọng đọc và TalkBack

Ngày ghi nhận: 21/10/2026. Bản mock HTML/JS của SeeVia. Đây là biên bản kỹ thuật và danh sách nghiệm thu còn lại, không phải chứng nhận đã dùng được với TalkBack Android.

## Kết quả đã có

| Phép thử | Kết quả | Bằng chứng/giới hạn |
|---|---|---|
| Môi trường trình duyệt | Chrome 155.0.8059.85 trên Windows | Trình duyệt trong phép thử; chưa là cấu hình Android mục tiêu |
| Logic giọng đọc bằng engine giả | 8/8 bài qua | `node --test tests/speech.test.cjs`: thay bài, callback cũ, tải giọng muộn, thiếu giọng, timeout, dừng, nội dung dài, ưu tiên SOS |
| Luồng trình duyệt | 15/15 nhóm qua | `tests/browser.test.cjs`: 17 màn sản phẩm, cây trợ năng có tên điều khiển và ID ARIA hợp lệ, mở/đóng sheet, router/Back/file, nút Nghe/Dừng, đăng ký/OTP, kính, ảnh, dịch mẫu, biên bản, hướng dẫn, góp ý, SOS, lỗi và focus |
| Giọng Việt trong Windows Speech | Có một giọng `vi-VN` | Chrome liệt kê Microsoft An; danh sách giọng chỉ chứng minh có lựa chọn, không chứng minh âm thanh |
| Web Speech API thật ngoài sandbox | Bắt đầu → hoàn tất | Chrome phát câu mẫu tiếng Việt bằng Microsoft An và câu tiếng Anh bằng Microsoft David; cả chế độ headless và có giao diện đều trả sự kiện `playing` rồi `completed` khi chạy ngoài sandbox. Không có phép đo âm lượng/chất lượng nghe |
| Web Speech API trong sandbox | Báo `synthesis-failed` cho cả Việt và Anh | App hiện lỗi và giữ nội dung chữ. Đây là giới hạn của môi trường kiểm thử; cùng phép thử ngoài sandbox đã hoàn tất |
| Bố cục | Đã xem ở 390×844, 1100×1000, chữ To và tương phản cao | Ảnh kiểm tra được tạo trong `tmp/talkback-*.png` khi chạy trình duyệt; không đại diện cho emulator Android |

Các lần chạy trình duyệt dùng Chrome cài trên Windows và server localhost tự tạo. Bộ kiểm thử engine giả thay các giọng bằng đối tượng test, chỉ xác nhận logic. Thử engine thật chạy ngoài sandbox theo `SEEVIA_VERIFY_REAL_SPEECH=1` và bắt buộc trạng thái `completed` cho giọng Việt. Tín hiệu từ API không xác nhận người dùng nghe được qua loa/tai nghe.

## Chạm là đọc, Nghe là nghe lại

Chạm bất kỳ chỗ nào trên màn hình lần đầu thì SeeVia chuyển sang **SeeVia tự đọc** (trừ khi người dùng đã tự chọn chế độ trong Hiển thị) và đọc nội dung Nghe của màn đó. Mở một mục có nút Nghe (câu lệnh mẫu, ảnh, hướng dẫn, tóm tắt họp, kết quả dịch) cũng tự đọc. Mỗi lần chạm chỉ đọc một nội dung. Sau khi đã đọc, nút Nghe đổi nhãn thành **Nghe lại** và phát lại từ đầu; đang đọc thì nút là **Dừng đọc**. Nút "Nghe thử giọng" không tự đọc. Bộ kiểm thử `tests/browser.test.cjs` có thêm một nhóm cho hành vi này (chưa chạy được ở máy này vì thiếu Playwright cho Node; đã kiểm bằng Chromium headless qua Python).

## Đối chiếu các mục trong kế hoạch

| Phạm vi | Tình trạng mã | Bước nghiệm thu trên Android |
|---|---|---|
| Bắt đầu | Có Nghe hướng dẫn; TalkBack có tên màn, các nút | Nghe hướng dẫn rồi đi tới tài khoản bằng vuốt/chạm hai lần |
| Trang chủ | Trạng thái kính đọc giá trị pin hiện tại; đổi trạng thái hủy bài cũ | Đọc thẻ kính, pin, SOS và mở lối tắt |
| Tính năng | Mọi câu lệnh mẫu có Nghe/Dừng trong sheet; sheet còn mở | Duyệt từng bước, nghe/dừng và đóng sheet |
| Kính của bạn | Trạng thái chưa liên kết/đã kết nối/mất kết nối; lỗi Wi-Fi, khôi phục, hủy liên kết | Thử tất cả trạng thái và tên lỗi nhập liệu |
| Ảnh và video | Nghe mô tả đúng ảnh; xóa, hoàn tác, rỗng và khôi phục có đích focus | Xóa ảnh bằng TalkBack, tìm Hoàn tác và quay lại mục |
| Dịch thuật | Chỉ dịch bốn cặp câu mẫu hợp lệ; giọng theo ngôn ngữ đích; đầu vào khác có lỗi | Đổi chiều, dịch mẫu, nghe cả Việt và Anh; xem lỗi ngoài mẫu |
| Biên bản họp | Nghe tóm tắt; ghi âm vẫn mô phỏng, không báo từng giây | Bắt đầu/dừng và duyệt biên bản mới |
| Lịch sử | Chi tiết có nút Nghe; bộ lọc báo số kết quả | Lọc, nghe chi tiết, truy cập hoạt động thất bại |
| An toàn | SOS ngắt bài thường, khóa bài khác khi đếm, hủy khi thay số, lối kích hoạt trực tiếp | Thử riêng chạm hai lần, đếm ngược, hủy, gửi mẫu, Tôi an toàn |
| Cộng đồng | Công tắc có phản hồi và trạng thái | Xác định nội dung chỉ đọc, bật/tắt thông báo |
| Hồ sơ và Hiển thị | Có lối thiết lập giọng, chọn giọng/tốc độ, Nghe thử | Đọc tên và giá trị của tất cả select, thay cỡ chữ ở mức To |
| Tài khoản | Lỗi cạnh trường, OTP mẫu, đăng xuất; focus đúng sau render | Thử đăng ký, OTP sai, thành công và đăng xuất |
| Hướng dẫn | Từng mục có nút Nghe; thu gọn dừng bài | Mở/đóng mục và quay lại |
| Hỗ trợ | Lỗi cạnh ô, kết quả được focus, hotline chỉ báo mô phỏng | Gửi mẫu, đọc mã tiếp nhận, truy cập FAQ |
| 404 | Tiêu đề và lối về Trang chủ | Mở đường dẫn sai rồi quay về |
| Kiểm thử nội bộ | Có số giọng, trạng thái engine và Nghe thử | Không dùng chỉ báo hoàn tất như bằng chứng nghe được |

## Chưa nghiệm thu: Android thật với TalkBack

Chưa có thiết bị Android kết nối trong môi trường này (`adb` không có), và không thể nghe âm thanh hay điều khiển TalkBack trên điện thoại từ bộ kiểm thử trình duyệt. Do đó chưa đánh dấu đạt các tiêu chí TalkBack trên thiết bị, chất lượng giọng Việt, mức âm lượng trên loa/tai nghe, ngoại tuyến và phối hợp hai nguồn âm thanh.

Khi có điện thoại Android để thử, ghi phiên bản Android, Chrome, TalkBack, engine/giọng TTS, tình trạng mạng và đầu ra âm thanh. Mở đúng bản mock này trong Chrome của điện thoại; bật TalkBack tại **Cài đặt → Trợ năng → TalkBack**. Thử lần lượt:

1. Giữ mặc định **Trình đọc màn hình**. Vuốt qua mọi điều khiển, khám phá bằng chạm, chạm hai lần để kích hoạt. Đi trọn luồng bắt đầu → tài khoản → kính → Trang chủ → Tính năng → Ảnh → Dịch → Biên bản → SOS/hủy → Hỗ trợ. Đánh dấu từng dòng bảng trên khi thao tác không cần nhìn.
2. Ở từng nút Nghe, xác nhận **có âm thanh nghe được và đúng ngôn ngữ/nội dung**, Dừng đọc có hiệu lực, loa và tai nghe hoạt động. Thử bấm nhanh, đổi màn, Back, đóng sheet, đưa Chrome xuống nền, rút mạng và thiết bị không có giọng Việt. Kiểm tra thông báo lỗi còn đọc được.
3. Bật **SeeVia tự đọc**, thử các phản hồi ngắn và SOS. Nếu đang bật TalkBack, chủ động đánh giá sự chồng tiếng của TalkBack với TTS khi bấm Nghe; app không có API để tắt giọng TalkBack. Trở lại chế độ mặc định nếu nghe trùng gây khó dùng.
4. Thử ở cỡ chữ To, tương phản cao, sáng/tối; kiểm tra vị trí focus khi xóa/hoàn tác ảnh, sửa lỗi Wi-Fi/OTP và đóng dialog. Với SOS, thử cả nút ba lần lẫn lối “Gửi SOS ngay”, hủy trước năm giây, và xác nhận không có liên lạc thật.
5. Ghi lỗi theo màn, thao tác tái hiện, câu đã nghe, câu mong đợi, thiết bị và ảnh/video hoặc nhật ký TalkBack nếu có. Chỉ đánh dấu hoàn thành toàn bộ kế hoạch sau khi các ca chặn sử dụng được sửa và thử lại trên máy thật.

Các hạn chế đã công bố: kính, micro, dịch AI và liên lạc SOS thật chưa được tích hợp; chất lượng/chế độ ngoại tuyến của giọng phụ thuộc engine và thiết bị. Không suy ra một thiết bị Android khác sẽ có đúng giọng Microsoft An của máy Windows đã thử.

Đối chiếu ngữ nghĩa nút Nghe/Dừng theo [W3C WAI: Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/): khi nhãn thay đổi để mô tả hành động kế tiếp, không gắn trạng thái `aria-pressed` kiểu nút bật/tắt.
