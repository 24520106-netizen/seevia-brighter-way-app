/*
 * Toàn bộ chữ giao diện tiếng Việt. Viết theo cú pháp JSON bên trong file .js để mở trực tiếp được.
 * {appName}, {slogan}, {deviceName} được thay bằng giá trị trong brand/brand.js.
 * Thêm tiếng Anh sau này: tạo content/en.js cùng cấu trúc khoá, rồi đổi thẻ <script> nạp file.
 */
window.SV = window.SV || {};
SV.content = {
  "common": {
    "back": "Quay lại",
    "close": "Đóng",
    "cancel": "Hủy",
    "confirm": "Xác nhận",
    "save": "Lưu",
    "edit": "Sửa",
    "more": "Xem thêm",
    "on": "Bật",
    "off": "Tắt",
    "required": "Bắt buộc",
    "demoBadge": "Bản mô phỏng",
    "demoNote": "Bản mô phỏng giao diện. Không kết nối kính, camera, micro hay cuộc gọi thật.",
    "loading": "Đang tải…",
    "undo": "Hoàn tác"
  },
  "nav": {
    "label": "Điều hướng chính",
    "home": "Trang chủ",
    "features": "Tính năng",
    "safety": "An toàn",
    "community": "Cộng đồng",
    "profile": "Hồ sơ"
  },
  "status": {
    "connected": "Đã kết nối",
    "disconnected": "Chưa kết nối",
    "done": "Hoàn tất",
    "failed": "Thất bại",
    "linked": "Đang liên kết",
    "signedIn": "Đã đăng nhập"
  },
  "glasses": {
    "title": "Kính của bạn",
    "name": "Kính {appName}",
    "serialLabel": "Mã serial",
    "serial": "SV-DEMO-2026",
    "battery": "Pin {value}%",
    "batteryLabel": "Mức pin",
    "version": "Phần mềm {value} (mô phỏng)",
    "connectedSummary": "Đã kết nối · Pin {battery}%",
    "notLinkedHint": "Chưa có kính nào được liên kết. Chạm để nhập mã serial.",
    "notLinkedHere": "Chưa có kính nào được liên kết. Nhập mã serial ở mục bên dưới.",
    "openHint": "Chạm để xem chi tiết kính"
  },
  "home": {
    "title": "Trang chủ",
    "greeting": "Chào bạn",
    "intro": "Trợ lý AI đồng hành, điều khiển bằng giọng nói.",
    "sosReady": "SOS sẽ báo tới {phone}",
    "sosReadySub": "Nhấn SOS 3 lần khi cần giúp",
    "sosMissing": "Chưa có số người thân cho SOS",
    "sosMissingSub": "Chạm để thêm số ở tab An toàn",
    "account": "Tài khoản",
    "recentTitle": "Gần đây",
    "recentAll": "Xem tất cả",
    "recentAllAria": "Xem toàn bộ lịch sử hoạt động",
    "useTitle": "Dùng kính",
    "album": "Ảnh và video",
    "albumSub": "Ảnh chụp qua kính kèm mô tả của SeeVia",
    "translation": "Dịch thuật",
    "translationSub": "Bản trình diễn dịch giọng nói Anh ⇄ Việt",
    "meeting": "Biên bản họp",
    "meetingSub": "Bản trình diễn ghi âm và phiên âm cuộc họp",
    "glasses": "Kính của bạn",
    "glassesSub": "Trạng thái liên kết, pin và mã serial",
    "guide": "Hướng dẫn sử dụng",
    "guideSub": "Cách dùng từng tính năng, từng bước"
  },
  "activity": {
    "title": "Lịch sử hoạt động",
    "items": [
      { "icon": "near_me", "title": "Bắt đầu điều hướng", "status": "done", "day": "today", "time": "Hôm nay, 09:42", "detail": "Đi bộ tới Bưu điện Trung tâm Thành phố" },
      { "icon": "music_note", "title": "Phát nhạc", "status": "done", "day": "today", "time": "Hôm nay, 08:15", "detail": "Danh sách Nhạc thư giãn buổi sáng" },
      { "icon": "photo_camera", "title": "Chụp ảnh", "status": "done", "day": "today", "time": "Hôm nay, 07:58", "detail": "Lối vào tòa nhà, đã thêm mô tả" },
      { "icon": "local_taxi", "title": "Đặt xe", "status": "failed", "day": "earlier", "time": "Hôm qua, 17:30", "detail": "Điểm đón: 12 Nguyễn Huệ. Không tìm được tài xế." },
      { "icon": "document_scanner", "title": "Đọc chữ", "status": "done", "day": "earlier", "time": "Hôm qua, 15:46", "detail": "Bảng chỉ dẫn tầng một" }
    ]
  },
  "safety": {
    "title": "An toàn và SOS",
    "intro": "Khi cần giúp, nhấn nút SOS 3 lần liên tiếp. SeeVia sẽ báo cho người thân của bạn.",
    "recipient": "Người nhận: {phone}",
    "countdownStart": "SOS sẽ gửi sau 5 giây. Chạm nút một lần nữa để hủy.",
    "countdownAria": "Hủy SOS. Gửi sau {n} giây",
    "countdownHint": "Đang chuẩn bị gửi cảnh báo. Chạm nút để hủy nếu bạn chạm nhầm.",
    "countdownLabel": "Chạm để hủy",
    "cancelled": "Đã hủy SOS. Không có cảnh báo nào được gửi.",
    "sentLabel": "Đã gửi",
    "sentAria": "Đã gửi SOS mô phỏng lúc {time}",
    "sentTitle": "Đã gửi cảnh báo SOS (mô phỏng)",
    "sentMeta": "Lúc {time} · tới {phone}",
    "sentBody": "Trong bản thật, SeeVia sẽ gọi người thân và gửi vị trí của bạn. Bản mô phỏng không gọi ai cả.",
    "safe": "Tôi an toàn",
    "noPhoneLabel": "Thêm số trước",
    "noPhoneAria": "SOS chưa dùng được vì chưa có số người thân. Chạm để thêm số.",
    "noPhoneHint": "Thêm số người thân ở mục bên dưới để bật SOS.",
    "noPhoneAlert": "Chưa có số người thân nên SOS chưa thể gửi. Hãy thêm số ở ô bên dưới.",
    "directSos": "Gửi SOS ngay, vẫn có 5 giây để hủy",
    "callNeedPhone": "Thêm số người thân trước để gọi thử",
    "safeDone": "Đã báo người thân rằng bạn an toàn (mô phỏng).",
    "contactTitle": "Người thân khẩn cấp",
    "contactLabel": "Số điện thoại người thân",
    "contactHelp": "Số di động Việt Nam, 10 chữ số, bắt đầu bằng 0.",
    "contactEmptyError": "Nhập số điện thoại người thân để SeeVia biết gọi ai.",
    "contactInvalidError": "Số chưa đúng. Nhập 10 chữ số, bắt đầu bằng 0, ví dụ 0901 234 567.",
    "contactSaved": "Đã lưu số khẩn cấp.",
    "contactEdit": "Sửa",
    "contactShort": "Số người thân",
    "contactEditAria": "Sửa số người thân, hiện là {phone}",
    "contactSave": "Lưu số",
    "callTitle": "Gọi thử người thân",
    "callSub": "Bản mô phỏng: không thực hiện cuộc gọi thật",
    "callAction": "Gọi {phone}",
    "callToast": "Bản mô phỏng: không có cuộc gọi thật nào tới {phone}.",
    "tipsTitle": "Lưu ý an toàn",
    "tipTripleTitle": "Nhấn 3 lần, có 5 giây để hủy",
    "tipTripleBody": "Nhấn nhanh nút SOS ba lần, mỗi lần cách nhau dưới 2 giây. Ba chấm dưới nút cho biết bạn đã nhấn mấy lần. Sau đó SeeVia đếm ngược 5 giây để bạn kịp hủy nếu chạm nhầm.",
    "tipCaneTitle": "Kính không thay gậy trắng",
    "tipCaneBody": "Kính hỗ trợ thêm thông tin, không thay gậy trắng hay kỹ năng định hướng của bạn.",
    "tipDemoTitle": "Không kết nối thiết bị thật",
    "tipDemoBody": "Mọi thao tác trên màn này chỉ thay đổi dữ liệu trong trình duyệt."
  },
  "features": {
    "title": "Tính năng của kính",
    "intro": "Mọi tính năng chạy rảnh tay trên kính bằng giọng nói tiếng Việt. Bạn ra lệnh, SeeVia trả lời qua loa của kính.",
    "sayLabel": "Thử nói",
    "groups": [
      {
        "title": "Nhìn và đọc",
        "items": [
          { "icon": "document_scanner", "title": "Đọc chữ và sách báo", "body": "Quét và đọc thành tiếng văn bản, tài liệu, sách báo, bảng hiệu.", "say": "“Đọc giúp mình trang này”", "steps": ["Hướng mặt về phía trang giấy hoặc bảng hiệu.", "Nói câu lệnh. Kính phát tiếng tách khi đã chụp.", "Kính đọc to nội dung. Nói “Dừng” để ngừng đọc."] },
          { "icon": "landscape", "title": "Mô tả cảnh xung quanh", "body": "Nhận ra không gian, vật cản và kể lại bằng lời.", "say": "“Phía trước có gì?”", "steps": ["Đứng yên và nhìn về hướng muốn hỏi.", "Nói câu lệnh.", "Kính mô tả vật cản, lối đi và người xung quanh theo thứ tự gần trước, xa sau."] }
        ]
      },
      {
        "title": "Tìm và hiểu",
        "items": [
          { "icon": "key", "title": "Tìm đồ thất lạc", "body": "Hướng dẫn tìm chìa khóa, ví tiền và đồ dùng cá nhân.", "say": "“Chìa khóa của mình ở đâu?”", "steps": ["Nói tên đồ vật bạn cần tìm.", "Quay đầu chậm sang hai bên.", "Kính phát tiếng bíp nhanh dần khi đồ vật ở gần."] },
          { "icon": "forum", "title": "Trợ lý hỏi đáp", "body": "Hỏi đáp, lập kế hoạch và nhận gợi ý cho việc hằng ngày.", "say": "“Hôm nay trời có mưa không?”", "steps": ["Nói câu hỏi tự nhiên bằng tiếng Việt.", "Chờ tín hiệu âm thanh rồi nghe câu trả lời.", "Nói “Nói lại” nếu muốn nghe lần nữa."] }
        ]
      },
      {
        "title": "Di chuyển",
        "items": [
          { "icon": "local_taxi", "title": "Đặt xe", "body": "Gọi xe công nghệ tới điểm bạn muốn, không cần cầm điện thoại.", "say": "“Đặt xe tới Bưu điện Trung tâm”", "steps": ["Nói điểm đến.", "Kính đọc lại điểm đón, điểm đến và giá ước tính để bạn xác nhận.", "Nói “Đồng ý” để đặt. Kính báo khi xe sắp tới."] },
          { "icon": "near_me", "title": "Chỉ đường bằng âm thanh", "body": "Hướng dẫn từng bước qua loa của kính.", "say": "“Chỉ đường tới nhà thuốc gần nhất”", "steps": ["Nói nơi bạn muốn tới.", "Kính hướng dẫn từng bước qua loa, kèm khoảng cách.", "Nói “Còn bao xa?” bất cứ lúc nào."] }
        ]
      },
      {
        "title": "Giải trí",
        "items": [
          { "icon": "music_note", "title": "Nhạc và sách nói", "body": "Nghe bài hát, radio, podcast ngay trên kính.", "say": "“Mở nhạc thư giãn”", "steps": ["Nói tên bài, ca sĩ, đài hoặc sách nói.", "Nói “To lên”, “Nhỏ xuống” để chỉnh âm lượng.", "Nói “Tạm dừng” khi cần nghe xung quanh."] }
        ]
      }
    ],
    "note": "Đây là định hướng tính năng. Dự án chưa có mô hình kính để thử nghiệm.",
    "openAria": "{title}. Xem cách dùng",
    "stepsTitle": "Cách dùng",
    "listen": "Nghe câu lệnh mẫu",
    "listenToast": "Bản mô phỏng: kính sẽ đọc câu lệnh “{say}”.",
    "guide": "Xem hướng dẫn chi tiết"
  },
  "community": {
    "title": "Cộng đồng",
    "intro": "Kết nối, chia sẻ kinh nghiệm và địa điểm thân thiện cho người khiếm thị Việt Nam.",
    "placesTitle": "Địa điểm thân thiện và hoạt động",
    "items": [
      { "icon": "route", "title": "Bản đồ tuyến đường rảnh tay", "body": "Vỉa hè, tuyến xe buýt và công viên do thành viên góp ý." },
      { "icon": "lightbulb", "title": "Chia sẻ kinh nghiệm dùng kính", "body": "Mẹo dùng lệnh đọc sách, nhận diện vật thể và đặt xe nhanh." },
      { "icon": "headphones", "title": "Câu lạc bộ âm nhạc và sách nói", "body": "Danh sách phát và tủ sách nói trợ năng do thành viên góp." },
      { "icon": "event", "title": "Gặp mặt hằng tháng", "body": "Buổi trải nghiệm công nghệ hỗ trợ người khiếm thị." }
    ],
    "note": "Nội dung minh họa. Các hoạt động cộng đồng chưa được tổ chức chính thức.",
    "notifyTitle": "Báo tôi khi có buổi gặp",
    "suggest": "Góp ý địa điểm thân thiện",
    "suggestSub": "Gửi cho nhóm SeeVia qua mục Hỗ trợ và góp ý",
    "notifySub": "Chưa có lịch. SeeVia sẽ báo bạn khi nhóm công bố buổi gặp đầu tiên.",
    "notifyOn": "Đã bật: SeeVia sẽ báo bạn khi có buổi gặp.",
    "notifyOff": "Đã tắt thông báo buổi gặp."
  },
  "profile": {
    "title": "Hồ sơ",
    "name": "Người dùng {appName}",
    "ids": "Mã serial kính {serial}",
    "guest": "Khách",
    "guestSub": "Chưa đăng nhập · Mở Tài khoản để đăng nhập",
    "versionTitle": "Phiên bản",
    "versionValue": "1.0.0 (mô phỏng)",
    "settingsTitle": "Cài đặt",
    "display": "Hiển thị",
    "glasses": "Kính của bạn",
    "emergency": "Người thân khẩn cấp",
    "emergencyNone": "Chưa có",
    "account": "Tài khoản",
    "accountIn": "Đã đăng nhập",
    "accountOut": "Chưa đăng nhập",
    "support": "Hỗ trợ và góp ý",
    "guide": "Hướng dẫn sử dụng",
    "fontValue": { "sm": "Chữ nhỏ", "md": "Chữ vừa", "lg": "Chữ to" },
    "contrastValue": "Tương phản cao",
    "glassesLinked": "Đang liên kết",
    "glassesUnlinked": "Chưa liên kết",
    "aboutTitle": "Về ứng dụng",
    "version": "Phiên bản mô phỏng 1.0.0",
    "versionAria": "Phiên bản mô phỏng 1.0.0",
    "versionHint": "Chạm thêm {count} lần để mở công cụ nội bộ",
    "devUnlocked": "Đã mở công cụ nội bộ.",
    "hotline": "Hotline 1900 1234 chỉ hiển thị, không gọi thật."
  },
  "activityPage": {
    "title": "Lịch sử hoạt động",
    "intro": "Các lệnh kính đã gửi tới điện thoại, mới nhất ở trên.",
    "today": "Hôm nay",
    "earlier": "Trước đó",
    "filterAll": "Tất cả",
    "filterDone": "Hoàn tất",
    "filterFailed": "Thất bại",
    "filterLabel": "Lọc theo kết quả",
    "emptyTitle": "Không có lệnh nào",
    "emptyBody": "Không có lệnh nào khớp bộ lọc này.",
    "failedNote": "Kính đã báo lỗi cho bạn bằng giọng nói. Bạn có thể ra lệnh lại khi sẵn sàng."
  },
  "album": {
    "title": "Ảnh và video",
    "intro": "Ảnh chụp qua kính khi bạn nói “Chụp ảnh”, kèm mô tả của SeeVia.",
    "illustration": "Ảnh minh họa",
    "items": [
      { "icon": "door_front", "title": "Lối vào tòa nhà", "desc": "Cửa kính ở giữa, lối đi thông thoáng, có bậc thềm thấp bên trái.", "time": "Hôm nay, 10:12" },
      { "icon": "signpost", "title": "Bảng chỉ dẫn", "desc": "Quầy hỗ trợ nằm bên phải hành lang, cách khoảng mười bước.", "time": "Hôm qua, 15:46" },
      { "icon": "payments", "title": "Tờ tiền", "desc": "Tờ tiền Việt Nam mệnh giá năm mươi nghìn đồng trên mặt bàn gỗ.", "time": "Hôm qua, 11:03" },
      { "icon": "medication", "title": "Hộp thuốc", "desc": "Hộp thuốc hạ sốt, chữ trên hộp ghi uống sau khi ăn.", "time": "12/10, 08:20" }
    ],
    "openAria": "Xem ảnh {title}",
    "listen": "Nghe mô tả",
    "listenToast": "Bản mô phỏng: kính sẽ đọc mô tả này thành tiếng.",
    "delete": "Xóa ảnh",
    "deleteTitle": "Xóa ảnh này?",
    "deleteBody": "Ảnh và mô tả sẽ bị xóa khỏi điện thoại. Bạn có vài giây để hoàn tác.",
    "deleteConfirm": "Xóa ảnh",
    "deleteCancel": "Giữ lại",
    "deleted": "Đã xóa ảnh.",
    "openAriaFull": "{title}. {desc} {time}",
    "verifyNote": "Mô tả do AI tạo. Hãy kiểm tra lại với người bên cạnh khi cần chắc chắn, nhất là với tiền và thuốc.",
    "emptyTitle": "Chưa có ảnh nào",
    "emptyBody": "Khi bạn nói “Chụp ảnh” với kính, ảnh và mô tả sẽ hiện ở đây.",
    "emptyAction": "Xem cách ra lệnh",
    "restore": "Khôi phục ảnh mẫu"
  },
  "translation": {
    "title": "Dịch thuật",
    "demoNote": "Bản trình diễn giao diện. Chưa kết nối nhận dạng giọng nói hay AI.",
    "from": "Ngôn ngữ nguồn",
    "to": "Ngôn ngữ đích",
    "en": "Tiếng Anh",
    "vi": "Tiếng Việt",
    "enInline": "tiếng Anh",
    "viInline": "tiếng Việt",
    "swap": "Đổi chiều dịch",
    "swapped": "Đã đổi: dịch từ {from} sang {to}.",
    "inputLabel": "Nội dung cần dịch",
    "inputPlaceholder": "Nhập hoặc nói nội dung…",
    "speak": "Nói để dịch",
    "speakToast": "Bản mô phỏng: chưa bật micro.",
    "translate": "Dịch",
    "emptyError": "Nhập nội dung trước khi dịch.",
    "resultTitle": "Bản dịch mô phỏng",
    "resultBody": "Trong bản thật, SeeVia sẽ dịch sang {to}: “{text}”",
    "listen": "Nghe bản dịch",
    "listenToast": "Bản mô phỏng: kính sẽ đọc bản dịch thành tiếng."
  },
  "meeting": {
    "title": "Biên bản họp",
    "demoNote": "Ghi âm và phiên âm là mô phỏng. Trang không mở micro.",
    "ready": "Sẵn sàng ghi âm",
    "recording": "Đang ghi âm mô phỏng",
    "hint": "Nội dung nói sẽ hiện ở đây khi tích hợp dịch vụ thật.",
    "start": "Bắt đầu ghi âm",
    "stop": "Dừng và lưu",
    "timerLabel": "Thời lượng",
    "savedTitle": "Biên bản đã lưu",
    "saved": "Đã lưu biên bản.",
    "newTitle": "Biên bản vừa ghi",
    "newSummary": "Biên bản mô phỏng, chưa có nội dung phiên âm.",
    "newTime": "Vừa xong · {duration}",
    "openAria": "{title}, {time}. Xem biên bản",
    "summaryTitle": "Tóm tắt",
    "items": [
      { "title": "Họp nhóm sản phẩm", "time": "22/08/2026 · 14:00 – 18:24", "summary": "Nhóm thống nhất ưu tiên kiểm thử với người dùng và chế độ tương phản cao." }
    ]
  },
  "glassesPage": {
    "title": "Kính của bạn",
    "detailsTitle": "Liên kết",
    "unlink": "Hủy liên kết kính",
    "unlinkTitle": "Hủy liên kết kính?",
    "unlinkBody": "Kính sẽ ngừng gửi lịch sử và ảnh về điện thoại này. Bạn có thể liên kết lại bằng mã serial.",
    "unlinkConfirm": "Hủy liên kết",
    "unlinkCancel": "Giữ liên kết",
    "unlinked": "Đã hủy liên kết kính.",
    "linkTitle": "Liên kết kính",
    "linkIntro": "Nhập mã serial in ở mặt trong gọng kính. Bản mô phỏng không quét camera và không gọi thiết bị thật.",
    "serialLabel": "Mã serial kính",
    "serialPlaceholder": "Ví dụ: SV-DEMO-2026",
    "serialHelp": "Mã gồm chữ, số và dấu gạch ngang.",
    "serialEmpty": "Nhập mã serial in ở mặt trong gọng kính.",
    "serialInvalid": "Mã chưa đúng dạng. Mã có dạng SV-XXXX-XXXX, ví dụ SV-DEMO-2026.",
    "link": "Liên kết kính",
    "linked": "Đã liên kết kính.",
    "noteStorage": "Mã serial chỉ lưu trong trình duyệt này.",
    "noteDemo": "Không thay đổi liên kết của kính thật."
  },
  "guide": {
    "title": "Hướng dẫn sử dụng",
    "intro": "Chạm vào từng mục để xem cách làm.",
    "items": [
      { "icon": "login", "id": "login", "q": "Đăng ký và đăng nhập", "a": "Mở Hồ sơ, chọn Tài khoản, rồi làm theo các ô được hướng dẫn. Bản mô phỏng dùng mã OTP 123456." },
      { "icon": "link", "id": "link", "q": "Liên kết kính", "a": "Mở Hồ sơ, chọn Kính của bạn, nhập mã serial in ở mặt trong gọng kính rồi chọn Liên kết kính." },
      { "icon": "record_voice_over", "id": "voice", "q": "Ra lệnh bằng giọng nói", "a": "Nói rõ yêu cầu sau tín hiệu âm thanh và chờ kính xác nhận. Xem câu lệnh mẫu ở tab Tính năng." },
      { "icon": "emergency_home", "id": "sos", "q": "An toàn khẩn cấp (SOS)", "a": "Thêm số người thân ở tab An toàn. Khi cần giúp, nhấn nút SOS ba lần liên tiếp. Bạn có 5 giây để hủy nếu chạm nhầm." },
      { "icon": "history", "id": "history", "q": "Lịch sử hoạt động", "a": "Ở Trang chủ, chọn Xem tất cả trong mục Gần đây để xem các lệnh kính đã gửi." },
      { "icon": "photo_library", "id": "album", "q": "Ảnh và video", "a": "Nói “Chụp ảnh” với kính. Ảnh và mô tả hiện trong mục Ảnh và video ở Trang chủ." },
      { "icon": "format_size", "id": "display", "q": "Cỡ chữ và tương phản", "a": "Mở Hồ sơ, chọn Hiển thị để đổi cỡ chữ hoặc bật tương phản cao. Thay đổi áp dụng ngay." },
      { "icon": "support_agent", "id": "support", "q": "Hỗ trợ và góp ý", "a": "Mở Hồ sơ, chọn Hỗ trợ và góp ý để gửi phản hồi cho nhóm SeeVia." }
    ]
  },
  "account": {
    "title": "Tài khoản",
    "signedIn": "Đã đăng nhập",
    "name": "Người dùng {appName}",
    "phone": "SĐT {phone}",
    "signOut": "Đăng xuất",
    "signOutTitle": "Đăng xuất khỏi {appName}?",
    "signOutBody": "Bạn sẽ cần đăng nhập lại để xem lịch sử và ảnh từ kính.",
    "signOutConfirm": "Đăng xuất",
    "signOutCancel": "Ở lại",
    "signedOut": "Đã đăng xuất.",
    "modeLabel": "Chọn cách vào tài khoản",
    "signIn": "Đăng nhập",
    "register": "Đăng ký",
    "nameLabel": "Tên hiển thị",
    "phoneLabel": "Số điện thoại",
    "passwordLabel": "Mật khẩu",
    "passwordHelp": "Ít nhất 6 ký tự.",
    "submitSignIn": "Đăng nhập",
    "submitRegister": "Tạo tài khoản",
    "errPhone": "Số điện thoại cần 10 chữ số, bắt đầu bằng 0.",
    "errPassword": "Mật khẩu cần ít nhất 6 ký tự.",
    "errName": "Nhập tên bạn muốn SeeVia gọi.",
    "otpTitle": "Xác nhận số điện thoại",
    "otpBody": "Nhập mã 6 chữ số gửi tới {phone}. Trong bản mô phỏng, mã là 123456.",
    "otpLabel": "Mã OTP",
    "otpSubmit": "Xác nhận",
    "otpBack": "Đổi số điện thoại",
    "otpError": "Mã OTP chưa đúng. Kiểm tra lại 6 chữ số và thử lần nữa.",
    "welcome": "Chào {name}, bạn đã đăng nhập.",
    "demoNote": "Không có tài khoản thật nào được tạo. Dữ liệu chỉ lưu trong trình duyệt."
  },
  "support": {
    "title": "Hỗ trợ và góp ý",
    "hotlineTitle": "Tổng đài hỗ trợ (mô phỏng)",
    "hotlineBody": "Số tổng đài sẽ được công bố khi dự án ra mắt.",
    "hotlineToast": "Bản mô phỏng: chưa có số tổng đài thật.",
    "guide": "Hướng dẫn sử dụng",
    "guideSub": "Cách dùng từng tính năng, từng bước",
    "faqTitle": "Câu hỏi thường gặp",
    "faq": [
      { "q": "Kính SeeVia đã bán chưa?", "a": "Chưa. SeeVia đang trong giai đoạn phát triển, chưa có mô hình kính để thử nghiệm. Ứng dụng này là bản mô phỏng giao diện." },
      { "q": "Kính có thay được gậy trắng không?", "a": "Không. Kính hỗ trợ thêm thông tin, không thay gậy trắng hay kỹ năng định hướng." },
      { "q": "Dữ liệu của tôi lưu ở đâu?", "a": "Trong bản mô phỏng, mọi thay đổi chỉ lưu trong trình duyệt trên máy này." }
    ],
    "formTitle": "Gửi góp ý",
    "formLabel": "Nội dung góp ý",
    "formPlaceholder": "Bạn muốn SeeVia cải thiện điều gì?",
    "formHelp": "Nhóm SeeVia đọc mọi góp ý.",
    "submit": "Gửi góp ý",
    "emptyError": "Nhập nội dung trước khi gửi.",
    "sentTitle": "Đã ghi nhận góp ý",
    "sentBody": "Mã tiếp nhận: {code}. Bản mô phỏng không gửi đi thật."
  },
  "display": {
    "title": "Hiển thị",
    "intro": "Thay đổi áp dụng ngay cho toàn bộ ứng dụng và được lưu trên máy này.",
    "previewTitle": "Xem thử",
    "previewHeading": "Kính SeeVia sẵn sàng",
    "previewBody": "Đây là cỡ chữ và màu sắc bạn sẽ thấy trên mọi màn hình.",
    "fontTitle": "Cỡ chữ",
    "fontLabel": "Chọn cỡ chữ",
    "fontSm": "Nhỏ",
    "fontMd": "Vừa",
    "fontLg": "To",
    "fontHint": { "sm": "Chữ nhỏ, thấy được nhiều nội dung hơn.", "md": "Cỡ mặc định.", "lg": "Chữ lớn, dễ đọc nhất." },
    "colorTitle": "Màu sắc",
    "contrastTitle": "Tương phản cao",
    "contrastSub": "Nền tối, chữ trắng, điểm nhấn cyan, viền rõ.",
    "darkNote": "Chế độ tối tự bật theo cài đặt của điện thoại.",
    "changedFont": "Đã đổi cỡ chữ: {value}.",
    "changedContrast": "Tương phản cao: {value}."
  },
  "devtest": {
    "title": "Kiểm thử lệnh kính",
    "intro": "Công cụ nội bộ. Chín handler dưới đây chỉ đổi nhãn trạng thái trong trình duyệt.",
    "run": "Chạy",
    "runAria": "Chạy mô phỏng {name}",
    "idle": "Chưa chạy",
    "ok": "Đã chạy mô phỏng lúc {time}",
    "items": [
      { "name": "Đặt xe", "code": "ride_book" },
      { "name": "Phát nhạc", "code": "media_play" },
      { "name": "Âm lượng nhạc", "code": "music_volume" },
      { "name": "Bắt đầu điều hướng", "code": "navigation_start" },
      { "name": "Kích hoạt khẩn cấp", "code": "emergency_trigger" },
      { "name": "Gọi liên hệ", "code": "contact_call" },
      { "name": "Chụp ảnh", "code": "camera_capture" },
      { "name": "Lấy vị trí", "code": "location_get" },
      { "name": "Kiểm tra khả năng thiết bị", "code": "capabilities_get" }
    ]
  },
  "notFound": {
    "title": "Không tìm thấy màn này",
    "body": "Đường dẫn có thể đã đổi. Quay về Trang chủ để tiếp tục.",
    "back": "Về Trang chủ"
  },
  "demo": {
    "buttons": {
      "primary": "Lưu số khẩn cấp",
      "tonal": "Liên kết kính",
      "outlined": "Xem hướng dẫn",
      "text": "Để sau",
      "danger": "Hủy liên kết kính",
      "fab": "Bắt đầu ghi âm",
      "disabled": "Đang gửi…"
    },
    "list": {
      "activity": "Lịch sử hoạt động",
      "activitySub": "Các lệnh kính đã gửi tới điện thoại",
      "album": "Ảnh và video",
      "albumSub": "Ảnh chụp qua kính kèm mô tả",
      "fontSize": "Cỡ chữ",
      "fontSizeValue": "Vừa",
      "contrast": "Tương phản cao",
      "contrastSub": "Nền tối, chữ trắng, điểm nhấn cyan"
    },
    "chips": {
      "voice": "Hỗ trợ giọng nói",
      "handsFree": "Rảnh tay",
      "filterToday": "Hôm nay",
      "filterWeek": "Tuần này"
    },
    "field": {
      "phoneLabel": "Số điện thoại người thân",
      "phoneValue": "0901 234 567",
      "phoneHelp": "SeeVia gọi số này khi bạn kích hoạt SOS.",
      "serialLabel": "Mã serial kính",
      "serialPlaceholder": "Ví dụ: SV-DEMO-2026",
      "serialError": "Nhập mã serial in ở mặt trong gọng kính.",
      "messageLabel": "Nội dung góp ý",
      "messagePlaceholder": "Nhập phản hồi hoặc yêu cầu…"
    },
    "segmented": {
      "label": "Cỡ chữ",
      "small": "Nhỏ",
      "medium": "Vừa",
      "large": "To"
    },
    "banners": {
      "info": "Đây là bản mô phỏng: SeeVia chưa kết nối nhận dạng giọng nói.",
      "success": "Đã lưu số khẩn cấp.",
      "warning": "Pin kính còn 15%. Bạn nên sạc kính sớm.",
      "error": "Mã OTP chưa đúng. Kiểm tra lại 6 chữ số và thử lần nữa."
    },
    "snackbar": "Đã lưu số khẩn cấp.",
    "sheet": {
      "title": "Hủy liên kết kính?",
      "body": "Kính sẽ ngừng gửi lịch sử và ảnh về điện thoại này. Bạn có thể liên kết lại bằng mã serial.",
      "confirm": "Hủy liên kết",
      "cancel": "Giữ liên kết"
    },
    "sos": {
      "label": "SOS",
      "hint": "Nhấn 3 lần liên tiếp để kích hoạt",
      "aria": "Nút SOS mô phỏng. Nhấn 3 lần liên tiếp, sau đó có 5 giây để hủy.",
      "progress": "Đã nhấn {count} trên 3 lần"
    },
    "empty": {
      "title": "Chưa có ảnh nào",
      "body": "Khi bạn nói “Chụp ảnh” với kính, ảnh và mô tả sẽ hiện ở đây.",
      "action": "Xem cách ra lệnh"
    },
    "accordion": {
      "q1": "Liên kết kính với điện thoại",
      "a1": "Mở Hồ sơ, chọn Kính của bạn, rồi nhập mã serial in ở mặt trong gọng kính.",
      "q2": "Ra lệnh bằng giọng nói",
      "a2": "Nói rõ yêu cầu sau tín hiệu âm thanh và chờ kính xác nhận."
    },
    "section": {
      "shortcuts": "Dùng kính",
      "settings": "Thiết lập"
    },
    "topBar": {
      "homeGreeting": "Chào bạn",
      "screenTitle": "Ảnh và video"
    }
  }
};
