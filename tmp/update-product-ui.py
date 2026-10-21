from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
p = root / 'content/vi.js'
s = p.read_text(encoding='utf-8')
def replace(old, new):
    global s
    if old not in s:
        raise RuntimeError('Missing source: ' + old[:80])
    s = s.replace(old, new, 1)

def add_object(name, value):
    global s
    data = json.dumps(value, ensure_ascii=False, indent=2)
    s = s.replace('SV.content = {', 'SV.content = {\n  ' + json.dumps(name) + ': ' + data.replace('\n', '\n  ') + ',', 1)

add_object('deviceStatus', {
    'unlinked': 'Chưa thiết lập kính',
    'unlinkedHelp': 'Kết nối kính mẫu để bắt đầu thiết lập.',
    'ready': 'Sẵn sàng · mô phỏng',
    'readyHelp': 'Kính mẫu đang online và dịch vụ xử lý mẫu đã sẵn sàng. Bạn có thể thử đọc một đoạn chữ.',
    'lost': 'Kính mất kết nối',
    'lostHelp': 'Liên kết tài khoản vẫn được giữ. Kiểm tra mạng của kính rồi thử kết nối lại.',
    'unknown': 'Chưa rõ trạng thái kính',
    'unknownHelp': 'Đã có liên kết tài khoản, nhưng chưa có thông tin mới về kính. Kiểm tra lại trước khi sử dụng.',
    'stale': 'Trạng thái cần cập nhật',
    'staleHelp': 'Thông tin đã quá 5 phút. SeeVia chưa xác nhận kính còn online; mức pin cũ được ẩn.',
    'serviceUnavailable': 'Dịch vụ xử lý chưa phản hồi',
    'serviceUnavailableHelp': 'Kính mẫu online nhưng dịch vụ chưa phản hồi. Thử kiểm tra lại; không cần liên kết lại tài khoản.',
    'serviceUnknown': 'Chưa rõ trạng thái dịch vụ',
    'serviceUnknownHelp': 'Kính mẫu online, nhưng chưa xác nhận được dịch vụ xử lý. Kiểm tra lại trước khi dùng.',
    'unknownSpeech': 'Bản mô phỏng. Đã liên kết tài khoản nhưng chưa rõ trạng thái kính. Mở Kính của bạn để kiểm tra lại.',
    'staleSpeech': 'Bản mô phỏng. Thông tin kính đã cũ. Chưa xác nhận được trạng thái sẵn sàng hoặc mức pin hiện tại. Mở Kính của bạn để kiểm tra lại.',
    'serviceUnavailableSpeech': 'Bản mô phỏng. Kính online nhưng dịch vụ xử lý chưa phản hồi. Mở Kính của bạn để thử lại.',
    'serviceUnknownSpeech': 'Bản mô phỏng. Kính online nhưng chưa rõ dịch vụ xử lý có sẵn sàng. Mở Kính của bạn để kiểm tra lại.',
    'readyNoBatterySpeech': 'Bản mô phỏng. Kính online và dịch vụ xử lý sẵn sàng. Chưa xác định được mức pin.',
    'noUpdate': 'Chưa có thời điểm cập nhật.',
    'updatedAt': 'Cập nhật mẫu lúc {time}.',
    'batteryUnknown': 'Mức pin: chưa xác định',
    'accountLinked': 'Tài khoản: đã liên kết',
    'online': 'Kính: online',
    'serviceReady': 'Dịch vụ: sẵn sàng',
    'scenarioTitle': 'Thử trạng thái kính (mô phỏng)',
    'scenarioLabel': 'Trạng thái mẫu',
    'refresh': 'Kiểm tra lại trạng thái mẫu'
})
add_object('readPractice', {
    'title': 'Thử đọc một đoạn chữ',
    'intro': 'Làm quen với việc đọc, dừng và nghe lại bằng một đoạn chữ mẫu.',
    'note': 'Bài tập mô phỏng. Không dùng camera, micro hay kính thật. Giọng đọc phát trên thiết bị đang mở app.',
    'prepareTitle': '1. Chuẩn bị đoạn chữ',
    'prepareBody': 'Trong trải nghiệm với kính, giữ trang giấy ổn định, đủ sáng và hướng camera về vùng cần đọc. Ở đây, chọn mẫu bên dưới để thử.',
    'sampleLabel': 'Đoạn chữ mẫu',
    'sample': 'Thư viện mở cửa từ 8 giờ đến 17 giờ, từ thứ Hai đến thứ Sáu. Phòng đọc ở tầng một.',
    'read': 'Đọc đoạn mẫu',
    'blur': 'Thử tình huống ảnh mờ',
    'resultTitle': '2. Đọc hoặc nghe nội dung',
    'resultHelp': 'Bấm Nghe đoạn chữ mẫu; khi đang đọc, nút đổi thành Dừng đọc. Sau khi dừng hoặc đọc xong, bấm lại để nghe từ đầu. TalkBack cũng có thể đọc đoạn chữ trên màn hình.',
    'listen': 'Nghe đoạn chữ mẫu',
    'retry': 'Thử lại từ đầu',
    'confirm': 'Tôi đã đọc hoặc nghe được nội dung',
    'doneTitle': 'Bạn đã hoàn thành bài đọc mẫu',
    'doneBody': 'Bạn có thể mở lại bài này ở Hướng dẫn. Đây là kết quả tự xác nhận trong bài tập; chưa kiểm chứng việc đọc qua kính thật.',
    'home': 'Về Trang chủ',
    'blurTitle': 'Chưa đọc rõ nội dung',
    'blurBody': 'Ảnh mờ là tình huống mẫu. Khi dùng kính thật, thử giữ yên trang giấy, tăng ánh sáng và căn lại vùng chữ; nếu vẫn chưa rõ, tìm cách đọc khác hoặc nhờ hỗ trợ.',
    'retryClear': 'Thử lại với mẫu rõ',
    'help': 'Mở trợ năng và âm thanh',
    'skip': 'Để sau, về Trang chủ',
    'progress': 'Tiến trình bài đọc mẫu'
})
replace('"features": "Tính năng",', '"features": "Khám phá",\n    "guide": "Hướng dẫn",')
replace('"intro": "Trợ lý AI đồng hành, điều khiển bằng giọng nói."', '"intro": "Kiểm tra kính, thử đọc và tìm trợ giúp khi cần."')
replace('"sosReady": "SOS sẽ báo tới {phone}"', '"sosReady": "SOS mẫu tới {phone}"')
replace('"sosReadySub": "Nhấn SOS 3 lần khi cần giúp"', '"sosReadySub": "Thử xác nhận và hủy · không gửi thật"')
replace('"useTitle": "Dùng kính"', '"useTitle": "Bắt đầu dùng kính",\n    "practice": "Thử đọc một đoạn chữ",\n    "practiceSub": "Đọc, dừng, nghe lại và xử lý ảnh mờ",\n    "access": "Trợ năng và âm thanh",\n    "accessSub": "Cỡ chữ, tương phản, TalkBack và giọng đọc",\n    "support": "Cần trợ giúp",\n    "supportSub": "Hướng dẫn khôi phục và hỗ trợ",\n    "explore": "Khám phá thêm",\n    "exploreSub": "Các phần mở rộng đang được mô phỏng",\n    "community": "Cộng đồng",\n    "communitySub": "Ý tưởng kết nối cộng đồng · chưa triển khai"')
replace('"intro": "Khi cần giúp, nhấn nút SOS 3 lần liên tiếp. SeeVia sẽ báo cho người thân của bạn."', '"intro": "Thử bắt đầu và hủy SOS với người nhận mẫu. Màn này không gửi tin, gọi điện hoặc chia sẻ vị trí thật."')
replace('"sentBody": "Trong bản thật, SeeVia sẽ gọi người thân và gửi vị trí của bạn. Bản mô phỏng không gọi ai cả."', '"sentBody": "Đây là kết quả gửi mẫu. Chưa có tin nhắn hoặc cuộc gọi thật, và không xác nhận người nhận đã nhận hay đang tới hỗ trợ."')
replace('"directSos": "Gửi SOS ngay, vẫn có 5 giây để hủy"', '"directSos": "Bắt đầu SOS mẫu, có 5 giây để hủy"')
replace('"tipDemoBody": "Mọi thao tác trên màn này chỉ thay đổi dữ liệu trong trình duyệt."', '"tipDemoBody": "SOS thật chỉ được triển khai sau khi kiểm tra quyền, đường gửi và hoạt động khi điện thoại khóa. Mọi thao tác ở đây chỉ thay đổi dữ liệu mẫu.",\n    "scenarioTitle": "Thử tình huống gửi SOS (mô phỏng)",\n    "scenarioLabel": "Kết quả gửi mẫu",\n    "scenarioSuccess": "Gửi mẫu thành công",\n    "scenarioOffline": "Điện thoại mất mạng",\n    "scenarioPermission": "Chưa có quyền cần thiết",\n    "scenarioFailed": "Dịch vụ gửi không phản hồi",\n    "failedTitle": "Chưa gửi được SOS mẫu",\n    "offlineBody": "Tình huống mẫu: điện thoại mất mạng. Chưa gửi cảnh báo. Kiểm tra kết nối rồi thử lại; hãy dùng cách liên lạc khác nếu cần trợ giúp ngay.",\n    "permissionBody": "Tình huống mẫu: chưa có quyền cần thiết để gửi. Chưa gửi cảnh báo. Bản thật cần hướng dẫn cấp quyền ở bước này; bản mô phỏng không xin quyền thiết bị.",\n    "failedBody": "Tình huống mẫu: dịch vụ gửi chưa phản hồi. Chưa xác nhận được việc gửi; không suy ra người thân đã nhận. Thử lại hoặc dùng cách liên lạc khác.",\n    "retry": "Thử lại SOS mẫu",\n    "reset": "Quay lại phần SOS",\n    "failedLabel": "Chưa gửi",\n    "scenarioChanged": "Đã hủy đếm ngược vì tình huống gửi đã thay đổi."')
replace('"intro": "Mọi tính năng chạy rảnh tay trên kính bằng giọng nói tiếng Việt. Bạn ra lệnh, SeeVia trả lời qua loa của kính."', '"intro": "Khám phá các kịch bản dự kiến của SeeVia. Chỉ nút Nghe phát âm thanh trên thiết bị này; các thao tác kính và dịch vụ bên dưới chưa chạy thật."')
replace('"stepsTitle": "Cách dùng"', '"stepsTitle": "Kịch bản minh họa",\n    "coreLabel": "Ưu tiên prototype · mô phỏng",\n    "conceptLabel": "Định hướng · chưa triển khai",\n    "limit": "Chưa có kính thật để kiểm chứng kịch bản này. Không dùng mô tả cảnh để bảo đảm di chuyển an toàn.",\n    "moreTitle": "Các bản demo khác"')
replace('"title": "Đọc chữ và sách báo",', '"title": "Đọc chữ và sách báo", "phase": "core",')
replace('"title": "Mô tả cảnh xung quanh",', '"title": "Mô tả cảnh xung quanh", "phase": "core",')
replace('"Nhận ra không gian, vật cản và kể lại bằng lời."', '"Dự kiến mô tả chi tiết trong ảnh. Không bảo đảm phát hiện vật cản hoặc lối đi an toàn."')
replace('"Kính mô tả vật cản, lối đi và người xung quanh theo thứ tự gần trước, xa sau."', '"Nghe mô tả dự kiến về chi tiết trong ảnh; kiểm tra lại khi không chắc chắn. Không dùng để quyết định băng đường hoặc tránh vật cản."')
replace('"Kính phát tiếng bíp nhanh dần khi đồ vật ở gần."', '"Cách phản hồi khi tìm thấy đồ vật chưa được chốt; tình huống này chỉ minh họa nhu cầu tìm đồ."')
replace('"Kính đọc lại điểm đón, điểm đến và giá ước tính để bạn xác nhận."', '"Luồng dự kiến cần đọc lại điểm đón, điểm đến và giá trước khi người dùng xác nhận; chưa tích hợp dịch vụ đặt xe."')
replace('"Nói “Đồng ý” để đặt. Kính báo khi xe sắp tới."', '"Bản mô phỏng không đặt xe hay tạo giao dịch. Thao tác xác nhận thật cần được kiểm chứng riêng."')
replace('"Kính hướng dẫn từng bước qua loa, kèm khoảng cách."', '"Hướng dẫn từng bước và khoảng cách là định hướng chưa được kiểm chứng; không dùng bản demo để di chuyển."')
replace('"display": "Hiển thị và giọng đọc"', '"display": "Trợ năng và âm thanh"')
replace('"title": "Hiển thị và giọng đọc"', '"title": "Trợ năng và âm thanh"')
replace('"welcomeDetail": "Thử đăng nhập, kết nối kính và khôi phục khi mất kết nối, từng bước một."', '"welcomeDetail": "Thiết lập kính mẫu, kiểm tra trạng thái rồi thử đọc một đoạn chữ, từng bước một."')
replace('"accessTitle": "Dùng app bằng TalkBack"', '"accessTitle": "Chọn cách sử dụng phù hợp",\n    "accessSettings": "Trợ năng và âm thanh"')
replace('"stepReady": "3. Sẵn sàng"', '"stepReady": "3. Sẵn sàng",\n    "stepFirstRead": "4. Đọc thử",\n    "firstRead": "Thử đọc một đoạn chữ"')
replace('"readyBody": "Kính SeeVia đã kết nối với mạng mẫu. Bạn có thể thử nghe trạng thái hoặc quay về Trang chủ."', '"readyBody": "Liên kết tài khoản, kính online và dịch vụ xử lý đều đã sẵn sàng trong mô phỏng. Tiếp theo, thử đọc một đoạn chữ."')
replace('"recoverTitle": "Khôi phục kết nối"', '"recoverTitle": "Thiết lập hoặc kiểm tra kính"')
replace('"a": "Nói rõ yêu cầu sau tín hiệu âm thanh và chờ kính xác nhận. Xem câu lệnh mẫu ở tab Tính năng."', '"a": "Trong kịch bản dự kiến, người dùng nói yêu cầu sau tín hiệu âm thanh. Xem và nghe câu lệnh mẫu ở tab Khám phá. Bản demo chưa nhận lệnh qua micro hoặc điều khiển kính."')
replace('"a": "Thêm số người thân ở tab An toàn. Khi cần giúp, nhấn nút SOS ba lần liên tiếp. Bạn có 5 giây để hủy nếu chạm nhầm."', '"a": "Mở An toàn để thử SOS mẫu. Có nút Bắt đầu SOS mẫu dùng được với TalkBack và 5 giây để hủy. Không có tin nhắn, cuộc gọi hoặc vị trí thật được gửi."')
replace('"a": "Nói “Chụp ảnh” với kính. Ảnh và mô tả hiện trong mục Ảnh và video ở Trang chủ."', '"a": "Mở Khám phá, chọn Ảnh và video để xem ảnh minh họa và nghe mô tả mẫu. Bản demo chưa chụp ảnh qua kính."')
replace('"a": "Mở Hồ sơ, chọn Hiển thị để đổi cỡ chữ hoặc bật tương phản cao. Thay đổi áp dụng ngay."', '"a": "Mở Trợ năng và âm thanh ở màn bắt đầu, Trang chủ hoặc Hồ sơ. Bạn có thể đổi cỡ chữ, bật tương phản cao và thử giọng đọc trước khi đăng nhập."')
p.write_text(s, encoding='utf-8')
