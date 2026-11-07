// Cấu hình dùng chung cho tất cả các thiệp.
window.WEDDING_CONFIG = {
  // URL web app của Google Apps Script (file google-apps-script/Code.gs), kết thúc bằng /exec.
  // Để trống thì form xác nhận và sổ lời chúc chưa gửi/nhận được dữ liệu.
  apiUrl: 'https://script.google.com/macros/s/AKfycbxoDlqoRym75jWCf_jD5zZhfLhcMJB47_gm4PoVwZMg-7Sn_YQ6ZC3BhNu7r7zYdJhYEw/exec',
};

// Hộp mừng cưới (gift.js). qr: ảnh mã QR, đường dẫn tính từ thư mục gốc. Chưa có account thì hiện "đang cập nhật".
window.WEDDING_GIFTS = {
  trai: { who: 'Chú rể', name: 'Nguyễn Trọng Quyết', bank: 'Techcombank', account: '8330 0520 01', holder: 'NGUYEN TRONG QUYET', qr: 'qr/chu-re.webp' },
  gai: { who: 'Cô dâu', name: 'Hà Hoàng Anh', bank: 'Techcombank', account: '3005 2003 83', holder: 'HA HOANG ANH', qr: 'qr/co-dau.webp' },
};

// Danh sách thiệp (đường dẫn tính từ thư mục gốc). Thêm thiệp mới: thêm một dòng vào đây.
// hidden: true = tạm ẩn khỏi trang chọn thiệp, nút Đổi thiệp và trang tạo link (link trực tiếp vẫn mở được).
window.WEDDING_CARDS = [
  { path: 'thiep-1/', name: 'Kem & tulip', desc: 'Tông kem, tulip vẽ tay', cover: 'covers/thiep-1.webp' },
  { path: 'thiep-2/', name: 'Báo cưới', desc: 'Báo vintage đỏ đô', cover: 'covers/thiep-2.webp', hidden: true },
  { path: 'thiep-3/', name: 'Hoàng kim', desc: 'Xanh lục, hoa vàng kim', cover: 'covers/thiep-3.webp' },
  { path: 'thiep-4/', name: 'Liên hoa', desc: 'Sen hồng, áo dài', cover: 'covers/thiep-4.webp' },
  { path: 'thiep-5/', name: 'Thước phim', desc: 'Phim mở đầu, đủ cả 4 bộ ảnh', cover: 'covers/thiep-5.webp', hidden: true },
  { path: 'thiep-6/', name: 'Chuyến bay', desc: 'Bay qua mây, vé lên máy bay', cover: 'covers/thiep-6.webp', hidden: true },
  { path: 'thiep-7/', name: 'Phố lên đèn', desc: 'Phố cổ đèn lồng, thả hoa đăng', cover: 'covers/thiep-7.webp', hidden: true },
  { path: 'thiep-8/', name: 'Song hỷ', desc: 'Đỏ song hỷ, ảnh studio', cover: 'covers/thiep-8.webp' },
];

// Thông tin theo thiệp in của từng bên. Link có ?ben=gai thì dùng thông tin nhà gái, mặc định nhà trai.
window.WEDDING_SIDES = {
  trai: {
    first: 'Trọng Quyết', second: 'Hoàng Anh',
    fullFirst: 'Nguyễn Trọng Quyết', fullSecond: 'Hà Hoàng Anh',
    parents: [
      { label: 'Nhà trai', father: 'Nguyễn Trọng Đồng', mother: 'Vũ Thị Hiền', address: 'Số 106, Đường Thôn Trung 2, Xã Ô Diên, TP Hà Nội' },
      { label: 'Nhà gái', father: 'Hà Văn Hùng', mother: 'Phạm Thị Xuyến', address: 'Số 03, Xóm Đoàn Kết, Cụm 2, Xã Ô Diên, TP Hà Nội' },
    ],
    party: {
      time: '15:30', weekday: 'Thứ Sáu', date: '2026-11-27', lunar: '19 tháng 10 năm Bính Ngọ',
      venueShort: 'Công viên Đan Hoài', venue: 'Công viên Đường Mương Đan Hoài', address: 'Xã Ô Diên, TP Hà Nội',
      maps: 'https://www.google.com/maps/search/C%C3%B4ng+vi%C3%AAn+%C4%90%C6%B0%E1%BB%9Dng+M%C6%B0%C6%A1ng+%C4%90an+Ho%C3%A0i+%C3%94+Di%C3%AAn+H%C3%A0+N%E1%BB%99i',
      mapsQuery: 'Công viên Đường Mương Đan Hoài Ô Diên Hà Nội',
    },
    ceremony: {
      name: 'Lễ thành hôn', time: '14:45', weekday: 'Thứ Bảy', date: '2026-11-28', lunar: '20 tháng 10 năm Bính Ngọ', place: 'tư gia nhà trai',
      address: 'Số 106, Đường Thôn Trung 2, Xã Ô Diên, TP Hà Nội',
      maps: 'https://www.google.com/maps/search/S%E1%BB%91+106+%C4%90%C6%B0%E1%BB%9Dng+Th%C3%B4n+Trung+2+%C3%94+Di%C3%AAn+H%C3%A0+N%E1%BB%99i',
    },
  },
  // Thiệp nhà gái vẫn để chú rể và bố mẹ chú rể trước (bên trái / bên trên), cô dâu sau
  gai: {
    first: 'Trọng Quyết', second: 'Hoàng Anh',
    fullFirst: 'Nguyễn Trọng Quyết', fullSecond: 'Hà Hoàng Anh',
    parents: [
      { label: 'Nhà trai', father: 'Nguyễn Trọng Đồng', mother: 'Vũ Thị Hiền', address: 'Số 106, Đường Thôn Trung 2, Xã Ô Diên, TP Hà Nội' },
      { label: 'Nhà gái', father: 'Hà Văn Hùng', mother: 'Phạm Thị Xuyến', address: 'Số 03, Xóm Đoàn Kết, Cụm 2, Xã Ô Diên, TP Hà Nội' },
    ],
    party: {
      time: '15:30', weekday: 'Thứ Sáu', date: '2026-11-27', lunar: '19 tháng 10 năm Bính Ngọ',
      venueShort: 'Hồ Quý', venue: 'Hồ Quý, Thôn Đoài', address: 'Xã Ô Diên, TP Hà Nội',
      maps: 'https://www.google.com/maps/search/H%E1%BB%93+Qu%C3%BD+Th%C3%B4n+%C4%90o%C3%A0i+%C3%94+Di%C3%AAn+H%C3%A0+N%E1%BB%99i',
      mapsQuery: 'Hồ Quý Thôn Đoài Ô Diên Hà Nội',
    },
    ceremony: {
      name: 'Lễ vu quy', time: '12:00', weekday: 'Thứ Bảy', date: '2026-11-28', lunar: '20 tháng 10 năm Bính Ngọ', place: '', // không ghi nơi cử hành
      address: 'Số 03, Xóm Đoàn Kết, Cụm 2, Xã Ô Diên, TP Hà Nội',
      maps: 'https://www.google.com/maps/search/X%C3%B3m+%C4%90o%C3%A0n+K%E1%BA%BFt+C%E1%BB%A5m+2+%C3%94+Di%C3%AAn+H%C3%A0+N%E1%BB%99i',
    },
  },
};

// Lịch trình hai ngày. Giờ đón khách theo giờ tiệc của link, nhập tiệc sau 30 phút; Dance & DJ nhà trai 18:00, nhà gái 19:00.
function weddingTimeline(partyTime, side) {
  var t = partyTime.split(':'), m = +t[0] * 60 + +t[1] + 30;
  var seat = ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  return [
    { date: 'Thứ Sáu 27.11', items: [
      { time: partyTime, label: 'Đón khách', icon: 'guests' },
      { time: seat, label: 'Nhập tiệc', icon: 'dinner' },
      { time: side === 'gai' ? '19:00' : '18:00', label: 'Dance & DJ', icon: 'music' },
    ] },
    { date: 'Thứ Bảy 28.11', items: [
      { time: '12:00', label: 'Lễ Vu Quy nhà gái', icon: 'home' },
      { time: '14:45', label: 'Lễ Thành Hôn nhà trai', icon: 'rings' },
    ] },
  ];
}

// Biểu tượng nét mảnh cho từng mốc lịch trình (màu theo currentColor):
// đón khách = nhóm người, nhập tiệc = dao dĩa, Dance & DJ = nốt nhạc, lễ vu quy = ngôi nhà có trái tim, lễ thành hôn = đôi nhẫn
var WEDDING_ICONS = {
  guests: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  dinner: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  home: '<path d="M3 10a2 2 0 0 1 .7-1.53l7-6a2 2 0 0 1 2.6 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M8.6 13.8A2.25 2.25 0 1 1 12 10.84a2.25 2.25 0 1 1 3.4 2.96l-2.63 2.86a1 1 0 0 1-1.5 0z"/>',
  rings: '<circle cx="8.5" cy="14.5" r="5.5"/><circle cx="15.5" cy="14.5" r="5.5"/><path d="M10 6.5 12 4l2 2.5-2 3z"/>',
};
window.weddingIcon = function (name, cls) {
  var p = WEDDING_ICONS[name];
  return p ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' +
    (cls ? ' class="' + cls + '"' : '') + '>' + p + '</svg>' : '';
};

// Đọc bên mời (?ben=gai) và giờ tiệc riêng (?gio=HH:MM) từ link.
window.weddingInvite = function () {
  var params = new URLSearchParams(location.search);
  var side = params.get('ben') === 'gai' ? 'gai' : 'trai';
  var info = JSON.parse(JSON.stringify(window.WEDDING_SIDES[side]));
  var gio = (params.get('gio') || '').trim();
  var m = gio.match(/^([01]?\d|2[0-3])[:hH.]?([0-5]\d)?$/);
  if (m) info.party.time = ('0' + m[1]).slice(-2) + ':' + (m[2] || '00');
  info.side = side;
  info.guest = (params.get('tenkhach') || params.get('name') || '').trim();
  info.timeline = weddingTimeline(info.party.time, side);
  // Mốc đếm ngược: ngày + giờ tiệc theo giờ Việt Nam
  info.party.endtime = Date.parse(info.party.date + 'T' + info.party.time + ':00+07:00');
  return info;
};
