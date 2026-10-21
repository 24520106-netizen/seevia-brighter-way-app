# Kiểm tra vòng chỉnh UI theo Product Brief

Ngày 21/10/2026. Phạm vi: 5 điểm yếu được người dùng đồng ý chỉnh sau báo cáo `.impeccable/critique/2026-10-21T08-52-39Z__screens.md`.

## Kết quả đã kiểm tra

Lệnh: `node --test tests/product-flows.test.cjs tests/speech.test.cjs`.

**16/16 nhóm kiểm thử qua:** 8 nhóm DOM và 8 nhóm logic giọng đọc. DOM dùng jsdom; giọng đọc dùng engine giả. Không gọi dịch vụ, camera, micro hoặc gửi SOS thật.

| Phạm vi | Kết quả |
| --- | --- |
| Tất cả 18 màn sản phẩm | Render DOM không lỗi JavaScript/khóa chữ thiếu; một h1/màn; tham chiếu ARIA và đích liên kết nội bộ hợp lệ |
| Điều hướng | Trang chủ → Hướng dẫn → An toàn → Khám phá → Hồ sơ; Cộng đồng còn truy cập được ở Khám phá/phần mở rộng |
| Trợ năng ban đầu | Mở trước đăng nhập, đổi chữ/tương phản, giữ cài đặt khi bắt đầu setup |
| Setup | Đăng nhập → tìm kính → lỗi/điền mạng → sẵn sàng → bước 4 đọc thử |
| Trạng thái | Dữ liệu linked cũ không tự thành ready; mất mạng, lỗi/chưa rõ dịch vụ, unknown và stale khác nhau; null/invalid battery không thành 0% |
| Độ mới dữ liệu | Quá 5 phút: không hiện pin cũ, trạng thái Home đổi sang cần cập nhật; mốc này chỉ dành cho mock |
| Đọc thử | Ảnh mờ → thử lại; Nghe/Dừng/nghe lại; rời kết quả dừng giọng; chỉ hoàn thành khi người dùng tự xác nhận |
| SOS | Mất mạng/thiếu quyền/lỗi dịch vụ không phát sự kiện gửi; thay tình huống khi đếm ngược sẽ hủy; có quay lại và kết quả thành công mẫu |
| Mức triển khai | Mọi mục Tính năng có nhãn mức triển khai trong danh sách/sheet; giới hạn trước các bước minh họa |

## Giới hạn của lần kiểm tra

- Không có kiểm tra render bằng trình duyệt trong vòng này. Công cụ CUA đã từ chối mở file:// ở lượt rà trước; không dùng đường vòng để mở URL bị chặn. DOM test không đo kích thước, tương phản thực tế, hit target hoặc bố cục.
- Chưa nghiệm thu TalkBack/Android thật, cỡ chữ hệ thống, chất lượng giọng/loa, ứng dụng nền hoặc khóa máy. Bộ kiểm thử không chứng minh các điều này.
- `tests/browser.test.cjs` đã cập nhật dữ liệu đầu vào theo mô hình trạng thái mới, nhưng chưa chạy lại trong vòng này. Ảnh trong `previews/` và `tmp/talkback-*.png` là ảnh trước vòng chỉnh, không đại diện bản mới.

## Cách thử bằng tay

1. Mở `index.html`, chọn Trợ năng và âm thanh trước đăng nhập; thử cỡ To/tương phản cao rồi quay lại.
2. Đi trọn setup mẫu, mở bài Đọc thử, thử ảnh mờ, đọc mẫu, Nghe/Dừng và xác nhận hoàn thành.
3. Vào Kính của bạn → Thử tình huống mô phỏng, chọn từng trạng thái. Về Trang chủ kiểm tra lời mô tả, mức pin và hành động tiếp theo. Thử khôi phục với kết quả dịch vụ chưa phản hồi rồi thành công.
4. Vào An toàn, chọn các tình huống gửi lỗi; kiểm tra bắt đầu, hủy, thử lại, đổi người nhận/tình huống khi đếm ngược. Tất cả chỉ là mẫu.
5. Trên Android, bật TalkBack trước khi mở app và làm lại các bước; ghi phiên bản Android/Chrome/TalkBack, thứ tự focus, câu đọc, chữ hệ thống và lỗi bố cục. Chỉ xác nhận đạt sau kiểm thử thiết bị thật.
