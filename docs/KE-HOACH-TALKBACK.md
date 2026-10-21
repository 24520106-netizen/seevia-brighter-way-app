# Kế hoạch hoàn thiện giọng đọc và TalkBack cho app SeeVia

Ngày: 21/10/2026. Phạm vi đã xác nhận: toàn bộ app SeeVia hiện tại, gồm giọng đọc nội dung và khả năng dùng với TalkBack Android.

Trạng thái sau triển khai: mã và các bài kiểm thử tự động đã hoàn thành; kết quả cụ thể và phần nghiệm thu Android còn chờ nằm trong [biên bản kiểm tra](KIEM-THU-TALKBACK.md). Mục 2 ghi hiện trạng ban đầu để đối chiếu.

Đây là kế hoạch dựa trên rà soát mã nguồn; chưa có kết quả nghe thử hoặc kiểm thử TalkBack trên thiết bị. App hiện là bản mô phỏng HTML/CSS/JS, không phải ứng dụng Android native. Giọng đọc phát trên thiết bị mở app; kết nối kính, micro, AI và SOS vẫn là mô phỏng theo PRODUCT.md.

## 1. Kết quả cần đạt

- Mọi nút mang tên “Nghe…” phát đúng nội dung hoặc báo rõ lý do không phát được và cách khắc phục; không còn chỉ hiện câu “kính sẽ đọc…”.
- Người bật TalkBack có thể hoàn thành mọi luồng chính bằng vuốt, khám phá bằng chạm và chạm hai lần, với tên điều khiển, trạng thái và thứ tự đọc rõ ràng.
- Người không bật TalkBack vẫn nghe được nội dung qua nút Nghe. Phản hồi ngắn bằng giọng nói là lựa chọn bật thêm; không tự đọc toàn bộ giao diện khi mở app.
- Có Dừng đọc, trạng thái phát chính xác, xử lý thiếu giọng, lỗi phát và chuyển màn; không có hai bài đọc của app chạy đồng thời.
- Tiếp tục nói rõ dữ liệu mẫu và hành động mô phỏng. Phát được âm thanh trên điện thoại không có nghĩa là đã phát ra loa kính thật.

## 2. Hiện trạng đã xác nhận trong mã

| Vị trí | Hiện trạng | Công việc |
|---|---|---|
| `components/flows.js:72` | Nghe câu lệnh mẫu chỉ gọi snackbar | Phát `it.say` bằng giọng Việt, giữ sheet để người dùng dừng/nghe lại |
| `components/flows.js:295` | Nghe mô tả ảnh chỉ gọi snackbar | Phát mô tả của đúng ảnh đang mở |
| `components/flows.js:371` | Nghe bản dịch chỉ gọi snackbar | Phát dữ liệu dịch mẫu hợp lệ theo đúng ngôn ngữ đích |
| `components/flows.js:457` | `bindStatusSpeech` đã dùng SpeechSynthesis cho trạng thái kính | Tách thành dịch vụ dùng chung; bổ sung tải giọng bất đồng bộ, xử lý lỗi và vòng đời |
| `core/app.js:146` | `SV.announce` dùng ARIA live region | Duy trì kênh cho trình đọc màn hình; không coi đây là máy phát TTS |
| `components/elements.js:600` | Snackbar có `role=status`, `aria-live=polite` | Quy định mỗi phản hồi chỉ được app thông báo một lần; kiểm tra cả khi đang mở dialog |
| `components/elements.js:621` | Sheet tự đóng với mọi `button[value]` | Cho phép nút Nghe/Dừng hoạt động trong sheet, không kích hoạt đóng |
| `core/app.js:207` | Router thay khung app và chuyển focus tới h1 | Bổ sung dừng bài đọc theo phạm vi; kiểm tra Back, chuyển tab và mở file trực tiếp |
| `content/vi.js`, nhóm `translation` | Kết quả dịch là câu mô phỏng chứa nguyên đầu vào | Không đọc câu này rồi gọi đó là bản dịch; dùng cặp Anh–Việt được biên soạn cho demo |
| `screens/display.html` | Có cỡ chữ và tương phản, chưa có thiết lập giọng đọc chung | Thêm một nơi duy nhất để cấu hình giọng và phản hồi bằng giọng nói |

Các điểm cần kiểm thử thêm, chưa kết luận là lỗi: thông báo khi live region vừa được tạo; focus sau khi xóa ảnh; thứ tự đọc nội dung sheet dài; trạng thái ghi âm khi render lại; mức độ đọc lặp khi focus và thông báo trạng thái cùng thay đổi.

## 3. Quy tắc tương tác và âm thanh

### Hai chức năng bổ trợ nhau

- **TalkBack:** đọc giao diện qua cấu trúc HTML, tên truy cập, trạng thái, focus và live region. Người dùng bật trong cài đặt Android.
- **Giọng đọc của SeeVia:** đọc nội dung khi người dùng bấm Nghe; có thể phát phản hồi ngắn nếu người dùng chủ động bật lựa chọn đó.
- Không giả định trình duyệt biết TalkBack có đang bật. Không hứa app có thể tắt hay điều khiển giọng của TalkBack.
- Chế độ mặc định: nút Nghe hoạt động theo yêu cầu; phản hồi tự động của app bằng TTS tắt. Lựa chọn “Dùng trình đọc màn hình cho thông báo” giữ ARIA và tắt phần TTS tự động.
- Khi người dùng chủ động bấm Nghe trong lúc dùng TalkBack, không đồng thời đẩy toàn bộ nội dung đó vào live region. Việc hai công cụ dùng chung đầu ra âm thanh vẫn phải được nghe thử trên thiết bị.

### Hành vi thống nhất

- Nghe → đang chuẩn bị → đang đọc → đã đọc xong; nhánh lỗi và dừng là trạng thái riêng. Chỉ báo đang đọc sau sự kiện bắt đầu phát.
- Nghe đổi thành Dừng đọc khi đang chuẩn bị/phát; giữ focus ở điều khiển. Khi xong hoặc dừng, có thể nghe lại.
- Bấm nghe nội dung mới hủy bài cũ; bấm nhanh nhiều lần không tích hàng đợi. Callback cũ không được thay đổi trạng thái phiên mới.
- Đóng sheet dừng nội dung thuộc sheet; đổi màn, Back hoặc rời trang dừng bài đọc thuộc màn cũ. Quay lại không tự đọc tiếp.
- Đề xuất dừng khi app bị đưa xuống nền để tránh đọc thông tin ngoài ý muốn; không tự phát lại khi quay về.
- Lỗi phát, thiếu giọng và chưa hỗ trợ phải có nội dung chữ còn truy cập được bằng TalkBack. Không hiển thị “đã đọc xong” khi bị hủy hoặc phát lỗi.
- Lời báo lỗi ngắn, có hướng xử lý: thử lại, chọn giọng phù hợp, hoặc dùng trình đọc màn hình. Không tự lặp vô hạn.
- TTS tự động chỉ đọc trạng thái ngắn đã chọn; không tự đọc OTP, mật khẩu, toàn bộ số điện thoại hay nội dung riêng tư. Nút nghe trạng thái kính phải lấy trạng thái hiện tại, không cố định pin 82%.

### SOS

- Sự kiện SOS có ưu tiên cao hơn bài đọc nội dung; khi bắt đầu, hủy bài đọc thường. Nếu bật phản hồi TTS tự động, chỉ phát thông báo khẩn ngắn tương ứng.
- Với TalkBack, giữ thông báo khẩn qua một kênh ARIA phù hợp; không phát thêm một bản TTS của cùng thông báo trong chế độ dùng trình đọc màn hình.
- Đọc rõ bắt đầu đếm ngược, cách hủy, đã hủy và kết quả mô phỏng. Tránh hàng đợi đọc từng giây khiến lời báo đến sau thời điểm gửi.
- Kiểm tra riêng thao tác chạm hai lần của TalkBack với cơ chế nhấn SOS ba lần. Giữ và kiểm tra lối kích hoạt trực tiếp dành cho trình đọc màn hình, vẫn có 5 giây để hủy.
- Hoàn thành mà không cần nhìn: thêm người nhận → kích hoạt → hủy; kích hoạt lại → xem kết quả → Tôi an toàn. Không có cuộc gọi hay tin nhắn thật.

## 4. Danh mục bao phủ toàn app

| Màn/nhóm | Giọng đọc nội dung và phản hồi | TalkBack cần nghiệm thu |
|---|---|---|
| Bắt đầu | Hướng dẫn ngắn có thể nghe theo yêu cầu | Bắt đầu, tiếp tục phiên, hướng dẫn bật TalkBack đều truy cập được |
| Trang chủ | Nghe trạng thái kính hiện tại | Thẻ kính, pin, trạng thái kết nối, SOS và lối tắt có tên rõ |
| Tính năng | Mọi câu lệnh mẫu có Nghe/Dừng | Sheet không tự đóng khi nghe; truy cập được mô tả, các bước, Đóng |
| Kính của bạn | Nghe trạng thái chưa liên kết/đã kết nối/mất kết nối/khôi phục | Tìm, cấu hình Wi-Fi mẫu, lỗi, thử lại, hủy liên kết có focus đúng |
| Ảnh và video | Nghe mô tả đúng ảnh | Mở/đóng, xóa, hoàn tác, rỗng, khôi phục; xóa xong focus tới mục kế tiếp hoặc trạng thái rỗng |
| Dịch thuật | Nghe cặp dịch mẫu theo ngôn ngữ đích; dừng trước khi đổi chiều | Ô nhập, lỗi rỗng, đổi chiều, kết quả và nút nghe có trạng thái rõ |
| Biên bản họp | Thêm Nghe/Dừng phần tóm tắt | Bắt đầu/dừng ghi âm mô phỏng và lưu có phản hồi; không đọc đồng hồ mỗi giây |
| Lịch sử hoạt động | Chi tiết đọc được bằng TalkBack; dùng chung điều khiển nếu bổ sung Nghe chi tiết | Bộ lọc, trạng thái thành công/thất bại, rỗng và sheet chi tiết |
| An toàn | Phản hồi SOS theo quy tắc ưu tiên ở mục 3 | Người nhận, lỗi số, lối SOS trợ năng, hủy đếm ngược, kết quả và Tôi an toàn |
| Cộng đồng | Thông báo bật/tắt đúng trạng thái; TTS ngắn khi được bật | Công tắc có tên và trạng thái; nội dung chỉ đọc không giả làm nút |
| Hồ sơ | Lối tới thiết lập giọng đọc | Danh sách thiết lập, trạng thái tài khoản/kính, quay lại đúng vị trí |
| Hiển thị và thiết lập giọng | Nghe thử, chọn giọng khả dụng, tốc độ; bật/tắt phản hồi TTS tự động | Nhãn, giá trị, đã chọn, lỗi và lưu thiết lập; cỡ chữ lớn vẫn dùng được |
| Tài khoản | Phản hồi ngắn nếu bật; không tự đọc dữ liệu nhạy cảm | Đăng nhập/đăng ký/OTP mẫu, lỗi gắn đúng trường, đăng xuất có xác nhận |
| Hướng dẫn | Có thể nghe từng mục, dùng chung dịch vụ | Mở/thu gọn, liên kết tới mục giọng nói, tiêu đề và thứ tự đọc |
| Hỗ trợ | Thông báo gửi góp ý và giới hạn cuộc gọi mô phỏng | FAQ, lỗi biểu mẫu, kết quả gửi và quay lại; không bịa hotline |
| 404 | Không cần tự phát giọng khi vào | Đọc tên màn và có lối về Trang chủ |
| Kiểm thử nội bộ | Chẩn đoán engine, ngôn ngữ, trạng thái phát và lỗi | Không đánh dấu đạt chỉ vì gọi được hàm speak; kết quả kiểm thử đọc được |

Các file `home-preview*.html`, ảnh preview, trang design system và tài liệu không tính là luồng người dùng của bản phát hành. Mọi biến thể sản phẩm thực sự được đưa vào điều hướng phải thêm vào danh mục nghiệm thu.

## 5. Thiết kế kỹ thuật đề xuất

1. **Dịch vụ giọng đọc dùng chung** trong `core/speech.js`, nạp sau `core/app.js` và trước component trên mọi màn sản phẩm. API dự kiến: `SV.speech.speak(text, options)`, `stop(owner)`, `getState()`, `getVoices()`; mỗi yêu cầu có mã phiên, chủ sở hữu và ngôn ngữ. Đây là đề xuất API, chưa triển khai.
2. **Bộ điều khiển Nghe/Dừng dùng lại** cho sheet và nội dung trên màn; không sao chép logic `SpeechSynthesisUtterance` ở từng tính năng. Quản lý tháo listener, timer và component bị gỡ.
3. **Chọn giọng đúng ngôn ngữ:** lấy danh sách ban đầu và cập nhật qua `voiceschanged`; ưu tiên `vi-VN`/`vi` cho tiếng Việt và giọng Anh cho nội dung Anh. Chờ có giới hạn nếu danh sách ban đầu rỗng, cho phép thử lại. Không âm thầm coi giọng sai ngôn ngữ là đạt.
4. **Độ tin cậy:** xử lý start/end/error, phân biệt hủy và lỗi, timeout bắt đầu phát, giới hạn/chia đoạn nội dung dài tại ranh giới câu. Dừng phải hủy cả các đoạn còn chờ. Tốc độ mặc định dễ nghe và có nút nghe thử.
5. **Thông báo và focus:** xác định một chủ thể thông báo cho mỗi sự kiện (live region, snackbar hoặc focus chuyển tới nội dung). Khi bật TTS phản hồi tự động, không nhân đôi cùng câu qua nhiều kênh của app. Live region cần tồn tại trước khi cập nhật; vị trí phải được TalkBack đọc được ngay cả khi dialog mở.
6. **Thiết lập:** mở rộng `SV.settings` với mặc định an toàn và tương thích dữ liệu cũ; lưu lựa chọn giọng bằng định danh có thể tìm lại, fallback khi thiết bị đổi. Không lưu trạng thái đang phát qua phiên.
7. **Nội dung:** mọi nhãn, lỗi và lời đọc nằm trong `content/vi.js`. Tách nội dung đọc khỏi nhãn UI khi cần phát âm phần trăm, thời gian, số hoặc đoạn song ngữ. Bản dịch demo dùng dữ liệu `{ sourceText, translatedText, sourceLang, targetLang }`; đầu vào ngoài mẫu cần thông báo giới hạn rõ ràng.
8. **Tài liệu:** cập nhật README về cách nghe thử, cài giọng và nền tảng đã kiểm thử; cập nhật DESIGN.md nếu thay đổi quy tắc snackbar/sheet; bổ sung checklist nghiệm thu và kết quả thực tế theo thiết bị.

### Giới hạn và lựa chọn engine

Ưu tiên kiểm chứng Web Speech API đang có để giữ app HTML/JS thuần, không cần plugin hoặc backend mới. Danh sách giọng phụ thuộc thiết bị. Không cam kết tiếng Việt hoặc hoạt động ngoại tuyến trên mọi máy chỉ vì trình duyệt có SpeechSynthesis.

Ngay đợt đầu phải nghe thử trên máy trình diễn và Android mục tiêu. Nếu không có giọng Việt dùng được: với câu mẫu cố định, cân nhắc audio đã chuẩn bị làm dự phòng; nội dung động cần engine hỗ trợ tiếng Việt phù hợp hoặc dịch vụ TTS. TTS qua mạng là hạng mục bổ sung có chi phí, backend và xử lý dữ liệu; chưa nằm trong phương án mặc định. Không đổi sang một giọng sai ngôn ngữ rồi báo thành công.

Việc phát âm thanh phải bắt đầu từ thao tác người dùng trong bản mặc định. Khả năng ngoại tuyến và nghe trên tai nghe/loa của thiết bị cần ghi nhận bằng kiểm thử, không suy ra từ mã.

## 6. Thứ tự triển khai

| Đợt | Nội dung | Điều kiện hoàn thành |
|---|---|---|
| 0 — Xác minh nền tảng | Lập danh mục mọi nút Nghe và mọi sự kiện thông báo; nghe thử giọng Việt/Anh trên desktop và Android; chốt thiết bị hỗ trợ | Có bảng sự kiện → nội dung → ngôn ngữ → kênh → ưu tiên → cách dừng → ca thử; chọn được phương án giọng Việt thực tế |
| 1 — Nền tảng + sửa điểm thiếu chính | Dịch vụ chung, Nghe/Dừng, vòng đời, thiếu giọng/lỗi; chuyển Tính năng, Ảnh, trạng thái kính; sửa dữ liệu dịch mẫu và nối nút Nghe | Các nhóm nút Nghe hiện có phát đúng nội dung trên thiết bị mục tiêu; dừng/đổi màn không sót bài đọc |
| 2 — Phủ toàn bộ app và TalkBack | Thiết lập giọng, tóm tắt họp/hướng dẫn; rà nhãn, focus, live region, biểu mẫu, danh sách, snackbar; hoàn thiện SOS | Toàn bộ dòng trong mục 4 có ca kiểm thử; các luồng chính dùng được với TalkBack và không cần nhìn |
| 3 — Nghiệm thu và bàn giao | Kiểm thử lỗi và hồi quy, nghe thử thực tế, sửa phát âm, tài liệu và giới hạn hỗ trợ | Đạt mục 7; lưu kết quả máy thật, không còn lỗi chặn sử dụng hoặc nút Nghe chỉ báo lời hứa |

Ước lượng sơ bộ cho một người triển khai: **6–9 ngày làm việc**, gồm 0,5–1 ngày xác minh, 2–3 ngày dịch vụ/tích hợp, 2–3 ngày phủ toàn app và 1–2 ngày nghiệm thu. Các đợt có thể chồng một phần. Đây là ước lượng lập kế hoạch, cần hiệu chỉnh sau đợt 0; chưa gồm tích hợp kính thật, backend AI/TTS hoặc thời gian chờ người dùng kiểm thử.

Ưu tiên khi cần chia nhỏ: nền tảng giọng + ba nhóm nút giả + trạng thái kính trước; tiếp theo là SOS và các lỗi TalkBack chặn thao tác; sau đó phủ hết màn và thiết lập. Không coi bản sửa ba nhóm nút là hoàn thiện toàn sản phẩm.

## 7. Kiểm thử và tiêu chí nghiệm thu

### Kiểm thử tự động phù hợp

- Mock engine để kiểm tra mã phiên, bấm liên tục, thay bài đọc, dừng, hủy, callback đến trễ, giọng tải muộn, không có giọng đúng ngôn ngữ và lỗi/timeout. Các ca này kiểm tra logic, không chứng minh đã có âm thanh nghe được.
- Kiểm thử trình duyệt cho mọi nhóm nút Nghe; sheet còn mở khi nghe, focus không thất lạc, đổi màn dừng đọc, Dừng dùng được bằng bàn phím.
- Quét accessibility trên mọi màn sản phẩm và trạng thái quan trọng; kiểm tra tên truy cập, ID tham chiếu, vai trò/trạng thái và nội dung ẩn. Kiểm tra không còn handler chỉ hiện `listenToast` cho hành động Nghe.
- Kiểm tra các màn đều nạp dịch vụ, thiết lập cũ được giữ và hoạt động cả qua server lẫn mở file trực tiếp trong phạm vi nền tảng công bố.

### Kiểm thử nghe và TalkBack bắt buộc

- Chrome trên desktop dùng trình diễn và Chrome trên ít nhất một điện thoại Android thật có TalkBack. Nên thêm máy Android thứ hai với bộ giọng khác để đánh giá thiếu giọng và khác biệt đầu ra.
- Ghi phiên bản Android, Chrome, TalkBack, engine/giọng và ngày thử. Trên Android thử TalkBack bật/tắt, giọng Việt có/không có, online/offline, loa/tai nghe, bật/tắt phản hồi tự động, chuyển nền và quay lại.
- Tất cả màn trong mục 4: vuốt qua từng điều khiển, khám phá bằng chạm, kích hoạt và quay lại; đọc được trạng thái và lỗi; không kẹt hoặc lọt focus ra ngoài sheet.
- Chuỗi điển hình: bắt đầu → tài khoản mẫu → tìm/cấp mạng kính → nghe trạng thái → mở câu lệnh → nghe/dừng → mô tả ảnh → bản dịch mẫu → tóm tắt họp → đổi thiết lập → thử SOS/hủy → góp ý.
- Thử lặp nhanh, nội dung dài, dấu tiếng Việt, số và thời gian, hướng Anh–Việt/Việt–Anh, mất kết nối kính mô phỏng, xóa/hoàn tác ảnh, lỗi nhập liệu và không có dữ liệu.
- Cỡ chữ To, tương phản cao, sáng/tối: các nút Nghe/Dừng và thông báo lỗi vẫn truy cập được, không bị che hoặc cắt.
- Nếu có điều kiện, nhờ người dùng TalkBack thường xuyên thực hiện các tác vụ chính để đánh giá mức dễ dùng; công cụ tự động không thay thế bước nghe và thao tác thực tế.

### Chỉ được đánh dấu hoàn thành khi

1. 100% hành động “Nghe” có âm thanh đúng nội dung/ngôn ngữ trên cấu hình hỗ trợ; có báo lỗi dễ tiếp cận khi không thể phát.
2. Dừng, nghe lại, thay nội dung, đóng sheet, Back và đổi màn hoạt động đúng; không phát bài đọc cũ hoặc báo hoàn tất giả.
3. Không có đường đi nào do app tạo hai bản TTS hoặc vừa TTS vừa live region đọc lặp toàn bộ cùng nội dung; phối hợp với TalkBack đã được nghe thử.
4. Các luồng chính, đặc biệt SOS/hủy và biểu mẫu lỗi, hoàn thành được bằng TalkBack mà không cần nhìn.
5. Mọi thông báo quan trọng có cách đọc lại; thông báo có hành động không biến mất trước khi người dùng thao tác trong ca thử, có phương án giữ/đóng hoặc hành động bền vững khi cần.
6. Có checklist kết quả trên thiết bị thực và danh sách giới hạn hỗ trợ. Không dùng screenshot hay mock API làm bằng chứng duy nhất cho chất lượng âm thanh/TalkBack.

## 8. Nguồn kỹ thuật đối chiếu

- [MDN — SpeechSynthesis.getVoices](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices): giọng khả dụng trên thiết bị hiện tại.
- [MDN — voiceschanged](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/voiceschanged_event): cập nhật danh sách giọng khi thay đổi.
- [MDN — SpeechSynthesisUtterance error](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/error_event): xử lý phát thất bại.
- [W3C APG — Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): focus trong dialog và hoàn trả focus khi đóng.
- [Android Developers — Test accessibility](https://developer.android.com/guide/topics/ui/accessibility/testing): kiểm thử TalkBack bằng thao tác và đánh giá các luồng thực tế.
