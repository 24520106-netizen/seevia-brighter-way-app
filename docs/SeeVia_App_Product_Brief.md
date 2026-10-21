# Định hướng sản phẩm SeeVia App

Tài liệu dành cho nhóm thiết kế và phát triển

Ngày rà soát 21 tháng 10 năm 2026 · Phiên bản 0.1 · Bản đề xuất để nhóm review

## 1 App phục vụ ai và giải quyết vấn đề gì

**SeeVia App là ứng dụng đồng hành giúp người khiếm thị và người nhìn kém tại Việt Nam thiết lập, kiểm soát và sử dụng kính SeeVia bằng cách tiếp cận được với họ.** Giá trị của hệ thống kính là giúp người dùng tự lấy thông tin từ chữ in, đồ vật và hình ảnh qua âm thanh tiếng Việt. Giá trị riêng của app là giúp họ đưa kính vào trạng thái sẵn sàng, biết hệ thống có hoạt động hay không và chủ động xử lý khi cần hỗ trợ. [S1, S2, S3, S6]

Vấn đề sản phẩm cần giải quyết là việc tiếp cận thông tin thị giác thường đòi hỏi người dùng nhờ người khác hoặc cầm và căn camera điện thoại. Điều đó có thể làm chậm công việc, giảm riêng tư và tăng số thao tác. Với app, một rào cản bổ sung là chính các bước đăng nhập, ghép kính, nhập mạng và xử lý lỗi cũng có thể đòi hỏi khả năng nhìn. Vì vậy, khả năng dùng app khi không nhìn được màn hình phải nằm trong luồng chính. [S1 mục S2 và S3; S2 mục 8]

**Định hướng đề xuất:** ưu tiên app Android tương thích TalkBack, tập trung vào thiết lập kính, trạng thái sẵn sàng, khôi phục kết nối, hướng dẫn và trợ năng. Xem xét SOS như một nhánh có điều kiện triển khai. VoiceOver là yêu cầu tương ứng khi mở rộng sang iOS; tính năng SeeVia tự đọc kết quả cần được thiết kế riêng và phối hợp với trình đọc màn hình. Đây là đề xuất trong tài liệu này, chưa phải quyết định phạm vi đã được nhóm phê duyệt.

### Cách đọc mức độ chắc chắn

- **Nguồn hiện có** mô tả định hướng, đặc tả hoặc mã mock; không mặc nhiên chứng minh chức năng đã chạy trên kính.
- **Đề xuất** là phương án thiết kế và ưu tiên đưa ra sau khi đối chiếu nguồn.
- **Cần kiểm chứng** là giả thuyết về người dùng, kỹ thuật hoặc chất lượng chưa có kết quả thử nghiệm trong bộ tài liệu.

User Flow v1.0 ngày 11 tháng 10 năm 2026 tự ghi là bản nháp chờ review và có 48 giả định. App trong thư mục hiện tại là mock HTML/CSS/JS cho Android, dùng dữ liệu giả. Không dùng số màn demo, nhãn “nghe” hoặc trạng thái “đã kết nối” trong mock để kết luận năng lực thực tế. [S2 mục 1 và 16; S7]

## 2 Người dùng và vai trò liên quan

### Người sử dụng trực tiếp

Đối tượng sản phẩm gồm người mù và người nhìn kém có nhu cầu tiếp cận chữ in, thông tin đồ vật và môi trường. Mức thị lực, kỹ năng công nghệ, thói quen dùng trình đọc màn hình và khả năng căn camera phải được xem xét riêng. Không suy ra rằng còn thị lực thì tự thiết lập được, hoặc mù hoàn toàn thì luôn cần người sáng mắt làm thay.

Nguồn nghiên cứu đề xuất **G1 là nhóm tiếp cận ban đầu**: người trẻ nhìn kém, học tập hoặc làm việc ở đô thị, có nhu cầu đọc thông tin thường xuyên. **G5 là nhóm thử nghiệm bổ sung**: học sinh, sinh viên khiếm thị ở trường hoặc cơ sở hỗ trợ. Đây là giả thuyết lựa chọn nhóm ban đầu, chưa phải kết luận từ nghiên cứu người dùng SeeVia. G5 cũng là người dùng trực tiếp. [S1 mục S2 và phần MBH dòng 783 đến 797]

Điều kiện prototype trong nguồn hiện nghiêng về điện thoại Android, mạng Wi-Fi hoặc hotspot và kết nối Internet. Khả năng sở hữu máy, chi phí dữ liệu, pin điện thoại và khả năng tự bật hotspot đều cần xác minh khi tuyển người thử. Chưa có căn cứ khẳng định người chỉ dùng iPhone có thể dùng prototype hiện tại. [S1 phần Go-to-Market dòng 1925; S2 mục 8]

### Người hỗ trợ và người chi trả

Người thân, bạn bè hoặc giáo viên có thể hỗ trợ lần đầu nếu người dùng muốn, hoặc làm liên hệ nhận SOS. Tổ chức, trường học và người chi trả có thể hỗ trợ tiếp cận thiết bị. Những vai trò này không tự động có quyền xem ảnh, nghe nội dung đọc, theo dõi vị trí hoặc quản lý tài khoản. Quyền hỗ trợ cần rõ ràng, do người dùng đồng ý và có thể thu hồi. Đây là yêu cầu đề xuất; bộ nguồn chưa đặc tả đầy đủ phân quyền. [S1 dòng 799 đến 809; S2 F0 và F7]

Ban giám khảo và khách xem demo là đối tượng của bản mock, không phải nhóm để đánh giá app có đáp ứng nhu cầu người khiếm thị hay không. [S7 PRODUCT.md phần Users]

### Thông tin cần có khi nghiên cứu người dùng

Ghi nhận mức thị lực chức năng, công cụ trợ năng đang dùng, mức quen smartphone, điện thoại và mạng thực tế, tác vụ cần làm, mức hỗ trợ mong muốn và cách họ đang giải quyết tác vụ đó. S18 dùng nhóm 15 đến 29 tuổi để ước tính thị trường lõi và theo dõi học sinh G5 từ 12 tuổi riêng; persona G5 từ 15 tuổi trong User Flow vẫn là giả định. Những mốc này chưa phải tiêu chí tuyển người dùng đã chốt. Nghiên cứu với người chưa thành niên cần kế hoạch đồng thuận phù hợp trước khi tuyển. [S1 mục S18; S2 mục 2 và GĐ-02]

## 3 Những việc người dùng cần hoàn thành

| Hoàn cảnh | Kết quả người dùng cần | Vai trò của app |
| --- | --- | --- |
| Muốn đọc thông báo, hóa đơn, nhãn hoặc tài liệu | Lấy được thông tin cần thiết và nghe lại được khi cần | Hướng dẫn dùng kính; cho biết điều kiện kết nối; hỗ trợ đọc lại nếu cơ chế lưu đã được chốt |
| Cần phân biệt vật dụng hoặc tiền | Có thông tin để kiểm tra, biết khi kết quả không chắc chắn | Hướng dẫn câu lệnh, giải thích giới hạn, cung cấp cách thử lại |
| Lần đầu dùng hoặc đổi mạng | Tự đưa kính vào trạng thái hoạt động | Đăng nhập, tìm kính, cấp mạng, xác nhận liên kết và thử tác vụ đầu |
| Kính im lặng hoặc tác vụ thất bại | Biết lỗi gì và bước tiếp theo | Phân biệt mất mạng, server chậm, pin yếu, lỗi liên kết; đưa hành động khôi phục |
| Cần trợ giúp khẩn cấp | Biết đang báo cho ai và việc gửi đã thành công hay chưa | Quản lý liên hệ, kiểm tra điều kiện gửi, xác nhận và hủy SOS nếu nhánh này được triển khai |

Các tác vụ đọc chữ và phân biệt vật dụng/tiền phù hợp với P1 và P3 trong bảng MVP. Mô tả cảnh chỉ hỗ trợ nhận biết thông tin; chưa đủ căn cứ dùng làm bảo đảm tránh vật cản hoặc di chuyển an toàn. Ví dụ thử nghiệm nên dùng giấy tờ mẫu, nhãn hàng thông thường và tiền mẫu; không dùng kết quả AI làm căn cứ duy nhất để uống thuốc, băng đường hoặc quyết định an toàn. [S3; S2 F1 đến F5]

Thước đo giá trị cần là người dùng làm được việc với ít trợ giúp hơn, ít thao tác hơn hoặc thuận tiện hơn so với cách họ đang dùng. Chưa có bằng chứng để tuyên bố SeeVia nhanh hơn, chính xác hơn hay thay thế được các giải pháp hiện có. Bảng đối thủ là đầu vào để xây bài so sánh, cần kiểm chứng lại các tuyên bố về sản phẩm khác. [S1 phần MBH; S5]

## 4 Phân vai giữa app kính và dịch vụ xử lý

| Thành phần | Vai trò theo nguồn | Hệ quả cho thiết kế app |
| --- | --- | --- |
| Kính | Nhận thao tác nút và lời nói, lấy hình/âm thanh, phát phản hồi | Tác vụ thường ngày cần ít yêu cầu mở hoặc cầm điện thoại |
| App | Thiết lập mạng, liên kết tài khoản và thiết bị; hỗ trợ Phone Action khi được xây dựng | Ưu tiên trạng thái, thiết lập, trợ năng và phục hồi lỗi |
| Backend và AI | Nhận yêu cầu, xử lý ảnh/giọng nói, trả nội dung và âm thanh theo kiến trúc | Trạng thái “đã ghép” không đồng nghĩa tác vụ AI đã sẵn sàng |
| Điện thoại | Chạy app; có thể cấp hotspot và phục vụ nhánh SOS/Phone Action | Phải giải thích phụ thuộc mạng, quyền và trạng thái điện thoại |

Kiến trúc mô tả BLE hoặc SoftAP phục vụ cấp cấu hình ban đầu. Sau khi kính online, giao tiếp chính đi qua backend; tác vụ kính không mặc nhiên chuyển toàn bộ qua app. Đây là thiết kế được mô tả, cần xác nhận bằng firmware và backend thật. [S6 trang 2 đến 5; S2 mục 7 và 16.2]

**Yêu cầu trạng thái đề xuất:** app cần phân biệt ít nhất “chưa thiết lập”, “đã liên kết tài khoản”, “kính đang online”, “dịch vụ xử lý sẵn sàng” và “chưa cập nhật được trạng thái”. Hiển thị thời điểm cập nhật gần nhất nếu trạng thái không trực tiếp. Pin hoặc kết nối không có dữ liệu phải được ghi là chưa xác định; không giữ một giá trị cũ như thể còn đúng.

Xem lại ảnh, lịch sử lệnh và biên bản là phần đã có trong mock. Việc đưa chúng vào sản phẩm thật cần thêm quyết định về dữ liệu nào được tạo, nơi lưu, thời hạn lưu, đồng bộ và quyền xóa. Các mốc giữ nội dung 5 phút hoặc giữ ảnh 30 giây trong User Flow vẫn là giả định phục vụ tác vụ, không phải chính sách lưu trữ đã được chốt. [S2 F1 và F5; S7]

## 5 Phạm vi app nên ưu tiên

Các mức sau là đề xuất cho nhóm thiết kế và phát triển, không tự thay đổi phạm vi đã có trong tài liệu nguồn.

### P0 Luồng tối thiểu để sử dụng được hệ thống

1. Trợ năng hoạt động ngay từ màn đầu, bao gồm đăng nhập, lỗi và hộp thoại.
2. Thêm kính bằng một cách không buộc phải nhìn serial hoặc quét mã bằng camera. Tìm thiết bị gần và xác nhận bằng tín hiệu trên kính là phương án cần đánh giá kỹ thuật.
3. Cấu hình Wi-Fi/hotspot và liên kết tài khoản; báo rõ bước đang thực hiện, lý do thất bại và cách thử lại.
4. Kiểm tra trạng thái sẵn sàng, kết nối, thời điểm cập nhật và pin khi có dữ liệu thực.
5. Hướng dẫn thử một tác vụ đọc chữ; giải thích cách dừng, nghe lại và xử lý ảnh không rõ.
6. Cài đặt hiển thị, hướng dẫn trợ năng, hỗ trợ khôi phục lỗi và kiểm soát dữ liệu thiết yếu.

Không bắt buộc người dùng phải thêm liên hệ SOS hoặc cấp mọi quyền ngay khi mở app. Xin quyền ở bước cần dùng và giải thích tác động của việc từ chối. Khi hỗ trợ đăng nhập bằng OTP, cho phép dán hoặc tự điền mã theo khả năng nền tảng; tránh bắt ghi nhớ rồi nhập lại từng số. [S2 F0; W5]

### P0 có điều kiện cho SOS

Nếu nhóm giữ SOS trong MVP, phải hoàn tất luồng liên hệ, quyền cần thiết, đếm ngược/hủy, trạng thái gửi và lỗi gửi, kể cả khi app ở nền hoặc điện thoại khóa. Chỉ nghiệm thu khi đường truyền thực và hành vi nền tảng đã được kiểm tra. Nếu chưa đạt, trình bày rõ là mô phỏng hoặc tạm hoãn; không đưa lời hứa cứu hộ vào sản phẩm. [S2 F7]

### P1 sau khi luồng chính đã dùng được

Xem lại văn bản và hoạt động có giá trị, nghe mô tả theo yêu cầu, điều chỉnh mức chi tiết phản hồi, hỗ trợ thiết lập có đồng thuận. Mỗi mục cần bằng chứng nhu cầu và thiết kế dữ liệu tương ứng. Album ảnh/video đầy đủ chưa phải điều kiện để chứng minh giá trị đọc chữ.

### Phần mở rộng cần quyết định riêng

Cộng đồng, mạng xã hội, biên bản họp, dịch thuật thành module riêng, phát nhạc, đặt xe, dashboard người chăm sóc và điều hướng thời gian thực chưa có đủ căn cứ để trở thành yêu cầu bắt buộc của app MVP trong lần rà soát này. Tìm đồ cũng có mức ưu tiên khác nhau giữa các nguồn. Nhóm cần chọn sau khi kiểm tra nhu cầu và tính khả thi, thay vì suy từ sự hiện diện của tính năng trong mock. [S1, S2, S3, S7]

Năm tab của mock có thể phục vụ trình diễn. Trước khi chốt cấu trúc app thật, cần kiểm tra xem người dùng tìm được các việc chính nhanh đến đâu. Các nhóm nội dung tối thiểu có thể là trạng thái kính, thiết lập, hướng dẫn và trợ năng; tài liệu này chưa chốt số tab hoặc bố cục thay thế.

## 6 Cân nhắc VoiceOver và trải nghiệm bằng âm thanh

### Khuyến nghị về tên gọi và phạm vi

**Nên hỗ trợ trình đọc màn hình như một yêu cầu nền tảng của app.** VoiceOver là trình đọc màn hình trên nền tảng Apple; Android dùng TalkBack. Chúng cho phép người dùng khám phá và kích hoạt thành phần giao diện bằng các thao tác của hệ điều hành. [W1, W2]

Vì định hướng hiện tại là Android, yêu cầu trước mắt là tương thích TalkBack. Khi nhóm quyết định hỗ trợ iOS, thêm VoiceOver vào phạm vi triển khai và kiểm thử. Không đặt một công tắc “VoiceOver” trong app Android hoặc mô tả app như có thể tự bật/tắt trình đọc màn hình của hệ điều hành.

| Khả năng | Mục đích | Quyết định đề xuất |
| --- | --- | --- |
| TalkBack hoặc VoiceOver | Đọc và thao tác giao diện app | Hỗ trợ xuyên suốt, không cần bật một chế độ riêng trong SeeVia |
| SeeVia đọc nội dung | Đọc kết quả OCR, mô tả ảnh hoặc hướng dẫn | Theo yêu cầu người dùng; có dừng, đọc lại và kiểm soát âm thanh |
| Nhận lệnh giọng nói | Hiểu yêu cầu người dùng nói | Ưu tiên luồng trên kính theo đặc tả; app chỉ bổ sung khi có nhu cầu đã kiểm chứng |

Nếu cần một khu vực dễ tìm trong cài đặt, dùng tên **“Trợ năng và âm thanh”**. Nội dung gồm hướng dẫn TalkBack hoặc VoiceOver đúng nền tảng, cỡ chữ, tương phản, phản hồi bằng giọng nói và mức chi tiết. Cài đặt này phải tự tiếp cận được khi người dùng vừa cài app.

### Yêu cầu giao diện

Mỗi thành phần cần có tên, vai trò, giá trị hoặc trạng thái và hành động rõ nghĩa. Ví dụ, thẻ kính có thể được đọc là “Kính SeeVia, đang online, pin 65 phần trăm, cập nhật lúc 9 giờ 30”; đây là câu mẫu, không phải dữ liệu thực. Công tắc phải có trạng thái bật/tắt; tab phải báo đang chọn; icon trang trí không chen vào thứ tự đọc. [W7]

Thứ tự đọc phải theo công việc. Khi mở màn mới, đưa focus tới tiêu đề hoặc vị trí có ý nghĩa; khi đóng hộp thoại, trả focus về hành động đã mở nó. Thông báo kết nối, lỗi và hoàn tất phải được trình đọc màn hình nhận biết mà không bắt người dùng tìm quanh màn hình. Chỉ chuyển focus khi thực sự đổi ngữ cảnh; không tự kéo focus đi cho mọi cập nhật pin. [W3, W4]

Mọi thao tác quan trọng cần có cách kích hoạt phù hợp với trình đọc màn hình. Với SOS, bổ sung một hành động truy cập được để bắt đầu luồng xác nhận và hủy; không bắt người dùng thực hiện ba lần chạm thật nhanh khi đang dùng cử chỉ của hệ điều hành. Thời gian hủy cần được thử với người dùng; 5 giây trong nguồn là điểm xuất phát, chưa phải bằng chứng đủ dùng.

Giữ giao diện chữ lớn và tương phản tốt cho người nhìn kém. Không dùng màu làm tín hiệu duy nhất. Thiết kế phải theo cỡ chữ hệ thống trên ứng dụng thật; ba mức chữ của mock không đủ chứng minh điều này. Vùng chạm Android hướng tới tối thiểu 48 dp. Phạm vi web/mock đối chiếu WCAG 2.2 AA; ứng dụng native cần thêm hướng dẫn và kiểm thử nền tảng. [S7; W2, W6, W8]

### Phối hợp tiếng nói của app và kính

Đề xuất chỉ có một luồng lời nói chính tại một thời điểm. Khi trình đọc màn hình đang đọc nút hoặc thông báo giao diện, app không tự phát lại cùng câu bằng TTS của SeeVia. Đọc nội dung dài phải có điều khiển dừng và đọc lại; thao tác chuyển màn hoặc kết thúc tác vụ phải có hành vi âm thanh xác định.

Đề xuất thứ tự ưu tiên là cảnh báo khẩn cấp hoặc mất điều kiện hoạt động, phản hồi thao tác, rồi nội dung dài. Đây là quy tắc thiết kế cần kiểm chứng, không phải cơ chế đã có trong mã. Không ngắt tùy tiện lời nói của trình đọc màn hình; nhóm cần triển khai cơ chế audio focus và hàng đợi sự kiện phù hợp từng nền tảng, đồng thời thử trường hợp kính và điện thoại cùng phát tiếng.

Trong web/mock, dùng HTML có ngữ nghĩa, tên truy cập được, focus và live region phù hợp. Không dựa vào việc phát hiện chắc chắn TalkBack/VoiceOver trong trình duyệt để quyết định giao diện có dùng được hay không. Trợ năng phải hoạt động mặc định. Không ghi âm liên tục trên app để mô phỏng “voice-first” khi chưa có nhu cầu, quyền và thiết kế dữ liệu rõ ràng.

## 7 Những hành trình cần thiết kế đầy đủ

### Lần sử dụng đầu

Mở app và chọn hỗ trợ cần thiết → đăng nhập theo cách tiếp cận được → tìm và xác nhận đúng kính → cấp mạng → xác nhận liên kết tài khoản → nghe trạng thái sẵn sàng → thử đọc một văn bản ngắn. Người dùng có thể chọn nhận trợ giúp; phần thử SOS chỉ xuất hiện khi nhánh SOS đã sẵn sàng.

Mỗi bước phải có nhánh quay lại, thử lại, bỏ qua khi phù hợp và giải thích lỗi. Đặc biệt cần xử lý không tìm thấy kính, mạng không hỗ trợ, sai mật khẩu, server không tới được và yêu cầu liên kết hết hạn. Các mốc timeout cụ thể trong User Flow cần xác nhận khi triển khai. [S2 F0]

### Sử dụng hằng ngày

Người dùng ra lệnh trên kính → nhận tín hiệu đã tiếp nhận → nghe tiến trình hoặc kết quả → có thể dừng, đọc lại hoặc hỏi tiếp. App chỉ cần mở khi kiểm tra, cấu hình hoặc phục hồi vấn đề. Không yêu cầu người dùng mở app trước mọi lần đọc nếu kiến trúc thực tế không cần bước đó. [S2 mục 7; S6 trang 4 đến 6]

### Khi hệ thống không làm được việc

Người dùng nhận thông báo có thể hiểu → biết chức năng nào đang không sẵn sàng → chọn hành động sửa hoặc kết thúc. Phân biệt lỗi mạng với kết quả AI không chắc chắn. Ví dụ “Chưa kết nối được dịch vụ xử lý. Kiểm tra mạng của kính rồi thử lại” có ích hơn một dòng “Có lỗi”. App và kính cần thống nhất cách mô tả cùng một trạng thái.

### Khi gửi SOS nếu có triển khai

Người dùng biết liên hệ nhận cảnh báo → chủ động bắt đầu → được thông báo đang đếm ngược và cách hủy → nhận kết quả gửi hoặc lỗi. Phân biệt “đã gửi yêu cầu”, “đã gửi tin” và “người nhận đã nhận” theo đúng dữ liệu hệ thống có. Không suy diễn việc gửi thành công thành có người đang đến hỗ trợ.

## 8 Yêu cầu nghiệm thu cho nhóm phát triển

Các tiêu chí dưới đây là yêu cầu đề xuất, chưa được chạy kiểm thử trong lần nghiên cứu này. P0 áp dụng cho mọi luồng MVP được chọn; tiêu chí SOS chỉ áp dụng khi triển khai SOS.

| Mã | Tình huống kiểm tra | Điều kiện chấp nhận |
| --- | --- | --- |
| A01 | Bật TalkBack trước khi mở app lần đầu | Đến được đăng nhập, thiết lập và trợ năng; không có bước bắt buộc nhìn màn hình |
| A02 | Duyệt nút, tab, trường nhập và công tắc | Mỗi phần tử có tên và trạng thái đúng; không đọc lặp icon; thứ tự có nghĩa |
| A03 | Tự thêm kính | Có cách xác định đúng thiết bị mà không phải đọc serial in nhỏ hoặc dùng camera nhìn mã |
| A04 | Sai mạng, sai mật khẩu hoặc hết hạn liên kết | Lỗi được đọc; nói rõ cách sửa; thử lại được và không làm mất dữ liệu nhập còn phù hợp |
| A05 | Kính mất mạng hoặc backend không phản hồi | Trạng thái phân biệt được; không báo sẵn sàng từ dữ liệu cũ; có bước khôi phục |
| A06 | Mở và đóng màn hoặc hộp thoại | Focus đi tới vị trí có nghĩa và quay lại đúng nơi; không lọt vào nội dung phía sau hộp thoại |
| A07 | Đọc OCR trong khi duyệt giao diện | Có dừng và nghe lại; không có hai giọng đọc đồng thời cùng một thông tin |
| A08 | Tăng chữ hệ thống và bật tương phản cao | Nội dung, lỗi và nút vẫn đọc/thao tác được; không bị cắt hoặc chồng lên nhau |
| A09 | Nhập OTP và thông tin liên hệ | Dán/tự điền không bị chặn; lỗi gắn với đúng ô và được thông báo |
| A10 | Bắt đầu và hủy SOS bằng TalkBack | Hoàn tất bằng hành động truy cập được; nghe người nhận, trạng thái và cách hủy; không phụ thuộc chạm nhanh |
| A11 | SOS thiếu quyền, thiếu mạng hoặc app ở nền | Không báo gửi thành công khi chưa gửi; lỗi và bước tiếp theo rõ ràng |
| A12 | Từ chối quyền hoặc yêu cầu xóa nội dung lưu | Phần không cần quyền vẫn dùng được; biết nội dung nào bị lưu/xóa và kết quả xử lý |

Khi phát triển iOS, chạy lại các tình huống tương ứng với VoiceOver trên iPhone; kiểm tra thêm các khác biệt quyền và hành vi nền của iOS. Với bản mock, kiểm thử trên Android/Chrome và TalkBack chỉ cho biết hành vi của web mock, không thay thế kiểm thử ứng dụng native. Có ARIA hoặc vượt qua công cụ tự động chưa đủ chứng minh người dùng hoàn tất được luồng. [W6]

## 9 Giới hạn và các quyết định còn mở

### An toàn và quyền riêng tư

Kính hỗ trợ tiếp cận thông tin; người dùng vẫn cần công cụ và kỹ năng định hướng phù hợp. Mô tả từ ảnh tĩnh không bảo đảm phát hiện vật cản, khoảng cách hoặc tình huống giao thông theo thời gian thực. Kết quả không chắc chắn phải được nói rõ và có cách thử lại, thay vì tự tạo câu trả lời chắc chắn. [S2 F2 đến F4]

Nhóm cần chốt thời điểm camera/micro hoạt động, tín hiệu để người dùng biết, dữ liệu gửi tới đâu, lưu bao lâu, cách xóa và việc có chia sẻ với bên hỗ trợ hay không. OCR căn trang có thể sử dụng chuỗi khung hình trong thiết kế nguồn; không hứa “không bao giờ truyền hình ảnh liên tục” nếu chưa xác nhận kiến trúc. Vị trí và ảnh SOS cần quyết định riêng, không tự mặc định mọi người thân được xem.

Khi offline, tối thiểu phải có phản hồi về trạng thái và hướng xử lý theo năng lực thiết bị. Chưa có bằng chứng để hứa OCR hoặc AI đầy đủ hoạt động offline. Chỉ đưa số liệu độ chính xác, độ trễ, thời lượng pin và khối lượng vào lời hứa sản phẩm sau khi đo với điều kiện rõ ràng. [S4; S2 F6]

### Các khác biệt nguồn cần nhóm chốt

| Quyết định | Nguồn đang khác nhau | Cách xử lý đề xuất |
| --- | --- | --- |
| Phạm vi điều hướng | Kiến trúc trang 7 có realtime; User Flow F2 dùng ảnh tĩnh và loại Navigation khỏi MVP | Giữ mô tả cảnh tĩnh trong phạm vi làm việc; realtime là quyết định và kiểm chứng riêng |
| Vai trò app | Mock có nhiều module; S4 giao app gọi điện/media nhưng S3 hoãn chúng sau MVP; kiến trúc ưu tiên setup và Phone Action | Chốt các việc người dùng cần trước khi chọn số màn/tab MVP |
| Tìm vật | S1 phần MVP và MBH ghi ưu tiên khác nhau; S2 gộp vào nhánh AI | Đánh giá riêng nhu cầu và chất lượng; chưa mặc định là P0 |
| SOS và Phone Action | S2 loại gọi điện/thông báo ngược khỏi MVP nhưng F7 cần hành động điện thoại | Khoanh SOS thành nhánh độc lập có điều kiện kỹ thuật |
| Tự thiết lập | Một số persona mặc định người mù cần trợ giúp; nguồn khác giả định tự setup dễ dàng | Thiết kế theo năng lực, cho phép trợ giúp tự nguyện; thử riêng người mù và người nhìn kém |
| iOS và VoiceOver | Nghiên cứu nhắc VoiceOver; prototype và spec tập trung Android | TalkBack trước mắt; VoiceOver khi có quyết định phát triển iOS |
| Lịch sử và ảnh | Mock có sẵn; nguồn kỹ thuật chưa chốt đầy đủ cơ chế lưu/đồng bộ | Chọn dữ liệu có ích, mục đích và thời hạn lưu trước khi xây |
| Tuổi và kết quả chất lượng | Nguồn ghi tuổi khác nhau; nhiều ngưỡng và tỷ lệ là ước tính/mục tiêu | Chốt tiêu chí tuyển; công bố kết quả sau đo, không dùng ước tính như thành tích |

## 10 Kế hoạch kiểm chứng và cách sử dụng tài liệu

Trước hết, nhóm sản phẩm và kỹ thuật chốt phân vai app/kính/backend, nền tảng Android và danh sách luồng P0. Sau đó làm prototype cho lần đầu sử dụng, khôi phục kết nối và trợ năng; giữ các phần mở rộng ở backlog cho tới khi có căn cứ.

Thử với cả người mù và người nhìn kém, có mức quen công nghệ khác nhau. Kế hoạch 10 người trong nguồn là pilot khám phá, không đại diện thống kê; có thể dùng làm điểm bắt đầu để tuyển và điều chỉnh. So sánh cùng tác vụ với cách người tham gia đang dùng. Ghi tỷ lệ hoàn thành không cần người điều phối can thiệp, loại và số lần cần giúp, thời gian, số bước, lỗi chưa phục hồi và mức tin tưởng đúng với khả năng hệ thống. Báo cáo riêng theo mức thị lực và kinh nghiệm trợ năng. [S1 phần MBH]

Các mục tiêu như setup dưới 30 phút, tiếng đầu dưới 3 hoặc 5 giây, đọc đúng 8/10 hay nhận tiền 19/20 trong nguồn là ngưỡng nội bộ dự kiến. Nhóm cần định nghĩa bài đo, mẫu, điều kiện mạng và tiêu chí lỗi trước khi dùng; tài liệu này không xác nhận các ngưỡng đã đạt.

Sau mỗi vòng thử, cập nhật yêu cầu, nguyên nhân thất bại và quyết định phạm vi. Khi nhóm duyệt định hướng, mới đồng bộ phần liên quan vào PRODUCT.md và User Flow. Tài liệu này chưa thay thế đặc tả giao thức, kiến trúc đã xác nhận hoặc báo cáo kiểm thử.

## 11 Nguồn và khả năng truy vết

### Tài liệu dự án

- **S1** · [NỘI DUNG TỔNG HỢP.md](../../../NỘI%20DUNG%20TỔNG%20HỢP.md). S2 phân nhóm người dùng; S3 vấn đề; phần MVP; MBH dòng 783 đến 809 và kế hoạch thử; S19; Go-to-Market dòng 1925. Số dòng theo tệp được đọc ngày 21 tháng 10 năm 2026, có thể thay đổi khi biên tập. Các số liệu và nhận xét đối thủ trong nguồn chưa được xác minh độc lập trong lần rà soát này.
- **S2** · [SeeVia User Flow Spec v1.0](../../../SeeVia%20-%20User%20Flow%20Spec%20v1.0.docx). Bản nháp ngày 11 tháng 10 năm 2026; mục 1 và 2, F0 đến F7, mục 16 giả định và 16.2 mâu thuẫn nguồn. Dùng tiêu đề mục và flow để tra cứu, không dùng số trang chưa xác minh.
- **S3** · [SeeVia MVP Scope Tables Academic](../../../SeeVia_MVP_Scope_Tables_Academic.xlsx). Sheet “1. Vấn đề cốt lõi” A2:E5; sheet “2. Chức năng hiện tại”; sheet “3. Tóm tắt MVP” A2:C4. Các mô tả “nhóm khảo sát” và tỷ lệ hoàn thiện không được coi là bằng chứng thử người dùng hay kết quả đo SeeVia đã xác nhận.
- **S4** · [Hardware and Technical Feasibility](../../../%5BS12%20-%20KLu%C3%A2n%5D%20-%20Hardware%20%26%20Technical%20Feasibility.xlsx). Sheet3 C3:H17 về đường xử lý; Sheet4 C3:K17 và Sheet5 đến Sheet7 về bảng benchmark cần điền; Sheet11 A8:D8 về phụ thuộc Android. Phân biệt thông số dự kiến với benchmark đã đo.
- **S5** · [Existing Solutions and Gap](../../../EXISTING%20SOLUTIONS%20%26%20GAP.xlsx). Sheet “REPRESENTATIVE SOLUTION” B4:C10 và E4:J10; sheet “COMPETITOR OVERVIEW & PRODUCT E” I7:Q9. Bảng giải pháp và phân tích khoảng trống nội bộ được dùng để xây giả thuyết về nhu cầu đọc chữ, phân biệt vật và giảm thao tác. Không suy ra lợi thế thị trường hiện tại đã được chứng minh.
- **S6** · [System Architeture](../../../System%20Architeture.pdf). Đã xem đủ 8 trang: trang 2 cấp mạng; trang 3 liên kết; trang 4 đến 6 tác vụ; trang 7 navigation realtime; trang 8 tích hợp smartphone. Hình và mũi tên là thiết kế kiến trúc, không phải bằng chứng hệ thống đã triển khai.
- **S7** · [PRODUCT.md](../PRODUCT.md), [README.md](../README.md), core/app.js, components/elements.js, components/flows.js, content/vi.js và screens trong repo. Đây là bằng chứng định hướng và hành vi mã mock; chưa có kết quả kiểm thử TalkBack/VoiceOver thực tế trong tài liệu được cung cấp.

### Hướng dẫn chính thức cho trợ năng

Các nguồn sau được đối chiếu ngày 21 tháng 10 năm 2026. Các quyết định P0/P1, luồng âm thanh và tiêu chí A01 đến A12 là đề xuất cho SeeVia dựa trên nguyên tắc từ nguồn, không phải trích nguyên tiêu chuẩn.

- **W1** · [Apple VoiceOver](https://developer.apple.com/design/human-interface-guidelines/voiceover) và [hướng dẫn bật VoiceOver trên iPhone](https://support.apple.com/guide/iphone/turn-on-and-practice-voiceover-iph3e2e415f/ios). Xác định VoiceOver là trình đọc màn hình trên nền tảng Apple.
- **W2** · [Android Principles for improving app accessibility](https://developer.android.com/guide/topics/ui/accessibility/principles). TalkBack, nhãn có nghĩa, hành động truy cập được, ngữ nghĩa và tín hiệu ngoài màu.
- **W3** · [W3C WCAG 2.2 Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html). Thứ tự focus có nghĩa cho giao diện web.
- **W4** · [W3C WCAG 2.2 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html). Thông báo trạng thái cho công nghệ hỗ trợ, không tùy tiện chuyển focus.
- **W5** · [W3C WCAG 2.2 Accessible Authentication Minimum](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html). Hỗ trợ dán/tự điền khi xác thực; tránh buộc ghi nhớ và chép lại mã.
- **W6** · [Android Test your app accessibility](https://developer.android.com/guide/topics/ui/accessibility/testing). Phối hợp kiểm tra thủ công bằng TalkBack, công cụ và thử với người dùng; kiểm tra khả năng hoàn tất luồng chính.
- **W7** · [Android Semantics](https://developer.android.com/develop/ui/compose/accessibility/semantics). Vai trò, trạng thái, giá trị và hành động của thành phần giao diện trong ứng dụng Android.
- **W8** · [Android Accessibility API defaults](https://developer.android.com/develop/ui/compose/accessibility/api-defaults). Hành vi trợ năng của thành phần chuẩn và vùng chạm tối thiểu 48 dp.

Bản Markdown là nguồn để biên tập và có cấu trúc tiêu đề, danh sách, bảng. PDF đi kèm phục vụ xem và chia sẻ; chưa được kiểm định PDF/UA hoặc khả năng tiếp cận bằng trình đọc màn hình.
