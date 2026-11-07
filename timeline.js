// Lịch trình nhiều mốc cho các thiệp có sẵn 2 mục mẫu [data-w="t1-time|t1-label"] và [data-w="t2-time|t2-label"].
// Nhân bản mục mẫu cho từng mốc trong weddingInvite().timeline (config.js): ngày 1 dùng mẫu t1, ngày sau dùng mẫu t2,
// mỗi ngày có một dòng tiêu đề ngày. Thiệp gọi window.renderTimeline() trước khi gắn hiệu ứng hiện dần.
// Dùng (sau config.js): <script src="../timeline.js" data-date-color="#C79A4E"></script>
(function () {
  var script = document.currentScript;
  var dateColor = (script && script.getAttribute('data-date-color')) || 'inherit';

  // Mục mẫu: tổ tiên của ô giờ nằm ngay dưới phần tử chứa cả hai mục
  function itemOf(key, other) {
    var el = document.querySelector('[data-w="' + key + '"]');
    if (!el) return null;
    while (el.parentElement && !el.parentElement.contains(other)) el = el.parentElement;
    return el;
  }

  function fill(item, time, label) {
    var t = item.querySelector('[data-w$="-time"]'), l = item.querySelector('[data-w$="-label"]');
    if (t) { t.textContent = time; t.removeAttribute('data-w'); }
    if (l) { l.textContent = label; l.removeAttribute('data-w'); }
    return item;
  }

  window.renderTimeline = function () {
    var inv = window.weddingInvite && window.weddingInvite();
    var t2 = document.querySelector('[data-w="t2-time"]');
    if (!inv || !inv.timeline || !t2) return;
    var first = itemOf('t1-time', t2), second = itemOf('t2-time', document.querySelector('[data-w="t1-time"]'));
    if (!first || !second || first.parentElement !== second.parentElement) return;
    var parent = first.parentElement, frag = document.createDocumentFragment();
    var grid = getComputedStyle(parent).display === 'grid';
    // Đường nối xuống mốc sau (mẫu lưới 3 cột): mục mẫu cuối không có, chép từ mục mẫu đầu
    var link = first.querySelector('[class*="w-px"]');
    var col = link;
    while (col && col.parentElement !== first) col = col.parentElement;
    var linkCol = col ? [].indexOf.call(first.children, col) : -1;
    var total = inv.timeline.reduce(function (n, d) { return n + d.items.length; }, 0), k = 0;
    inv.timeline.forEach(function (day, i) {
      var head = document.createElement(first.tagName === 'LI' ? 'li' : 'div');
      head.className = 'tl-date';
      head.textContent = day.date;
      head.style.cssText = 'list-style:none;margin:' + (i ? '14px' : '0') + ' 0 2px;font-weight:700;font-size:15px;letter-spacing:.08em;text-transform:uppercase;color:' + dateColor +
        (grid ? ';grid-column:1/-1;text-align:center' : '');
      frag.appendChild(head);
      day.items.forEach(function (ev) {
        var item = fill((i ? second : first).cloneNode(true), ev.time, ev.label);
        var last = ++k === total, own = item.querySelector('[class*="w-px"]');
        if (last && own) own.remove();
        else if (!last && !own && link && item.children[linkCol]) item.children[linkCol].prepend(link.cloneNode(true));
        frag.appendChild(item);
      });
    });
    parent.insertBefore(frag, first);
    parent.removeChild(first); parent.removeChild(second);
  };
})();
