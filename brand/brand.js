/*
 * Định danh SeeVia: tên, slogan, giọng văn, đường dẫn logo.
 * Viết theo cú pháp JSON bên trong một file .js để mở được trực tiếp bằng trình duyệt (file://).
 * Đổi logo: thay file SVG trong thư mục brand/ (giữ nguyên tên) hoặc sửa đường dẫn ở "logos".
 * Màu và font KHÔNG nằm ở đây: xem tokens.css.
 */
window.SV = window.SV || {};
SV.brand = {
  "name": "SeeVia",
  "slogan": "See a brighter way",
  "deviceName": "kính SeeVia",
  "description": "Kính trợ lý thị giác dùng AI cho người khiếm thị và người suy giảm thị lực tại Việt Nam.",
  "voice": {
    "language": "vi",
    "addressUser": "bạn",
    "selfReference": "SeeVia",
    "tone": "Tự nhiên, ấm áp, chuyên nghiệp. Ý chính trước, ghi chú sau.",
    "rules": [
      "Gọi người dùng là \"bạn\"; khi app tự nói về mình thì xưng \"SeeVia\", không dùng \"tôi\" hay \"mình\".",
      "Viết câu đầy đủ, rõ ràng cho trình đọc màn hình; không dựa vào màu, emoji hay hình để truyền nghĩa.",
      "Nút gọi tên hành động; lỗi nói rõ vấn đề và cách sửa.",
      "Trung thực: đây là bản mô phỏng, dự án chưa có mô hình kính; không hứa tính năng, giá, thông số chưa xác nhận.",
      "Kính không thay gậy trắng hay kỹ năng định hướng."
    ]
  },
  "logos": {
    "full": "logo-full.svg",
    "fullDark": "logo-full-dark.svg",
    "mark": "logo-mark.svg",
    "icon": "logo-icon.svg",
    "wordmark": "logo-wordmark.svg",
    "white": "logo-white.svg",
    "black": "logo-black.svg",
    "favicon": "favicon.svg"
  }
};
