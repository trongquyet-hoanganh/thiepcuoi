// Form xác nhận tham dự dùng chung cho mọi thiệp (thay cho form riêng của từng mẫu).
// Tự hiện khi khách đã xem thiệp đủ 15 giây hoặc kéo gần hết thiệp (còn khoảng một màn hình nữa là tới cuối), điều kiện nào đến trước.
// Bấm Có/Không là gửi luôn lên Google Sheet với tên khách trong link (?tenkhach=).
// Link chung (không có tên) thì hiện ô điền tên và mở bàn phím ngay.
// Lời chúc gửi ở mục Sổ lưu bút cuối mỗi thiệp, không hỏi trong form này.
// Dùng (sau config.js): <script src="../rsvp-prompt.js" data-accent="#C79A4E"
//   data-bg="#10261C" data-ink="#E5E4D0"></script>
// Nút nào có thuộc tính data-rsvp-open sẽ mở form này bất cứ lúc nào (kể cả khi khách đã đóng hoặc đã trả lời).
(function () {
  var script = document.currentScript;
  function attr(name, fallback) { return (script && script.getAttribute('data-' + name)) || fallback; }
  var API = (window.WEDDING_CONFIG && window.WEDDING_CONFIG.apiUrl) || '';
  var inv = window.weddingInvite ? window.weddingInvite() : { guest: '', side: 'trai', party: {} };
  var accent = attr('accent', '#8a6a3a'), bg = attr('bg', '#fffdf8'), ink = attr('ink', '#2b2621');
  var font = attr('font', '"Times New Roman", Times, serif');
  // Nhớ theo từng tên khách trong link: mỗi link ?tenkhach= tự hỏi riêng một lần (link chung là một khách)
  var guestKey = ':' + inv.guest.toLowerCase().replace(/\s+/g, ' ');
  var DONE_KEY = 'wedding-rsvp-sent' + guestKey, LATER_KEY = 'wedding-rsvp-later' + guestKey;
  var card = (location.pathname.match(/thiep-\d+/) || [''])[0];
  var ATTEND = { yes: 'Sẽ đến', no: 'Không đến được' };
  var dialog, ui, choice = null, shown = false, timer = null, ticker = null, closeTimer = null, observer = null;

  function stored(storage, key) { try { return storage.getItem(key); } catch (e) { return null; } }
  function store(storage, key, value) { try { storage.setItem(key, value); } catch (e) {} }

  // Gửi lên Sheet chạy ngầm (keepalive: đóng trang vẫn gửi), lỗi thì bỏ qua
  function send(data) {
    if (!API) return;
    data.invitee = inv.guest; data.card = card; data.ben = inv.side;
    fetch(API, { method: 'POST', mode: 'no-cors', keepalive: true, body: new URLSearchParams(data) }).catch(function () {});
  }

  var css = '' +
    '.rp{position:fixed;inset:0;margin:auto;width:min(360px,calc(100vw - 32px));height:fit-content;max-height:calc(100dvh - 32px);overflow:auto;' +
      'box-sizing:border-box;padding:26px 22px 22px;border:1px solid ' + accent + '66;border-radius:18px;background:' + bg + ';color:' + ink + ';' +
      'box-shadow:0 24px 60px -12px rgba(0,0,0,.45);font:16px/1.5 ' + font + ';text-align:center}' +
    '.rp[open]{animation:rp-in .35s cubic-bezier(.22,1,.36,1)}' +
    '.rp::backdrop{background:rgba(0,0,0,.5)}' +
    '@keyframes rp-in{from{opacity:0;transform:translateY(14px) scale(.97)}}' +
    '.rp *{box-sizing:border-box}' +
    '.rp [hidden]{display:none !important}' +
    '.rp-x{position:absolute;top:8px;right:8px;width:36px;height:36px;border:0;border-radius:50%;background:transparent;color:inherit;opacity:.6;font-size:24px;line-height:1;cursor:pointer}' +
    '.rp-icon{font-size:30px;line-height:1}' +
    '.rp-title{margin:8px 0 4px;font-family:' + font + ';text-transform:none;font-size:21px;font-weight:700;color:' + accent + ';letter-spacing:.02em}' +
    '.rp-guest{margin:0 0 6px;font-size:16px}' +
    '.rp-guest b{font-size:19px;color:' + accent + '}' +
    '.rp-q{margin:0 0 6px;font-size:17px}' +
    '.rp-when{margin:0 0 18px;font-size:15px;opacity:.8}' +
    '.rp-actions{display:grid;gap:10px}' +
    '.rp-btn{width:100%;padding:13px 16px;border-radius:999px;border:1.5px solid ' + accent + ';font:700 16px/1.2 ' + font + ';cursor:pointer;' +
      'background:transparent;color:inherit;transition:transform .15s,opacity .2s}' +
    '.rp-btn:active{transform:scale(.98)}' +
    '.rp-btn.rp-main{background:' + accent + ';color:#fff}' +
    '.rp-btn[aria-pressed=true]{box-shadow:0 0 0 3px ' + accent + '55}' +
    '.rp-btn:focus-visible,.rp-x:focus-visible{outline:2px solid ' + accent + ';outline-offset:2px}' +
    '.rp-field{display:grid;gap:10px;margin-top:16px;text-align:left}' +
    '.rp-field label{font-size:16px;font-weight:700}' +
    '.rp-field input{width:100%;padding:12px 14px;border:1.5px solid ' + accent + '99;border-radius:12px;background:rgba(255,255,255,.08);color:inherit;font:16px/1.4 ' + font + '}' +
    '.rp-field input:focus{outline:2px solid ' + accent + ';outline-offset:1px}' +
    '.rp-err{margin:0;color:#d9534f;font-size:15px;text-align:center}' +
    '.rp-done p{margin:6px 0 0;font-size:17px}' +
    '.rp-done .rp-title{font-size:23px}' +
    '@media (prefers-reduced-motion: reduce){.rp[open]{animation:none}}';

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function whenText() {
    var p = inv.party || {};
    if (!p.date) return '';
    var d = p.date.split('-');
    return 'Tiệc cưới ' + p.time + ' · ' + p.weekday + ' ' + d[2] + '/' + d[1] + '/' + d[0] + (p.venueShort ? ' · ' + p.venueShort : '');
  }

  function build() {
    var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
    dialog = el('dialog', 'rp'); dialog.setAttribute('aria-labelledby', 'rp-title');
    var close = el('button', 'rp-x', '×'); close.type = 'button'; close.setAttribute('aria-label', 'Đóng');
    close.addEventListener('click', later);
    dialog.addEventListener('cancel', function (e) { e.preventDefault(); later(); });

    var ask = el('div', 'rp-ask');
    var title = el('h2', 'rp-title', 'Xác nhận tham dự'); title.id = 'rp-title';
    ask.append(el('div', 'rp-icon', '💌'), title);
    if (inv.guest) {
      var g = el('p', 'rp-guest', 'Kính gửi '); g.appendChild(el('b', '', inv.guest)); ask.appendChild(g);
    }
    ask.appendChild(el('p', 'rp-q', 'Quý khách sẽ đến chung vui cùng gia đình chúng tôi chứ?'));
    if (whenText()) ask.appendChild(el('p', 'rp-when', whenText()));

    var actions = el('div', 'rp-actions');
    var yes = el('button', 'rp-btn rp-main', 'Có, tôi sẽ đến'); yes.type = 'button';
    var no = el('button', 'rp-btn', 'Rất tiếc, không đến được'); no.type = 'button';
    actions.append(yes, no);

    var form = el('form', 'rp-field'); form.noValidate = true;
    var label = el('label', '', 'Quý khách vui lòng cho biết tên'); label.htmlFor = 'rp-input';
    var input = el('input'); input.id = 'rp-input'; input.name = 'name'; input.type = 'text'; input.maxLength = 80;
    input.autocomplete = 'name'; input.placeholder = 'Ví dụ: Anh Nam, Gia đình chú Hải'; input.setAttribute('enterkeyhint', 'send');
    var send1 = el('button', 'rp-btn rp-main', 'Gửi xác nhận'); send1.type = 'submit';
    var err = el('p', 'rp-err'); err.setAttribute('role', 'alert');
    form.append(label, input, send1, err);

    var thanks = el('div', 'rp-done'); thanks.setAttribute('role', 'status');
    var thanksIcon = el('div', 'rp-icon'), thanksTitle = el('h2', 'rp-title'), thanksText = el('p');
    thanks.append(thanksIcon, thanksTitle, thanksText);

    [yes, no].forEach(function (b) {
      b.addEventListener('click', function () {
        choice = b === yes ? 'yes' : 'no';
        yes.setAttribute('aria-pressed', choice === 'yes'); no.setAttribute('aria-pressed', choice === 'no');
        if (inv.guest) { submit(inv.guest); return; }
        // Link chung: hiện ô tên và focus ngay trong lúc bấm để điện thoại mở bàn phím
        form.hidden = false;
        input.focus();
        input.scrollIntoView({ block: 'center' });
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = input.value.trim();
      err.hidden = !!name;
      err.textContent = name ? '' : 'Quý khách vui lòng điền tên.';
      if (!name) { input.focus(); return; }
      submit(name);
    });

    // Cảm ơn ngay, không chờ API, rồi tự đóng
    function submit(name) {
      send({ type: 'rsvp', name: name, attend: ATTEND[choice], guests: '', message: '' });
      done();
      ask.hidden = true; actions.hidden = true; form.hidden = true;
      thanksIcon.textContent = choice === 'yes' ? '💐' : '💌';
      thanksTitle.textContent = 'Cảm ơn ' + name + '!';
      thanksText.textContent = choice === 'yes' ? 'Hẹn gặp quý khách trong ngày vui của chúng tôi.' : 'Cảm ơn quý khách đã báo cho chúng tôi. Mong sớm gặp lại!';
      thanks.hidden = false;
      if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
      closeTimer = setTimeout(function () { if (dialog.open) dialog.close(); }, 3200);
    }

    dialog.append(close, ask, actions, form, thanks);
    document.body.appendChild(dialog);
    ui = { ask: ask, actions: actions, form: form, input: input, err: err, yes: yes, no: no, thanks: thanks };
  }

  // Mỗi lần mở là bắt đầu lại từ câu hỏi
  function reset() {
    choice = null;
    clearTimeout(closeTimer);
    ui.ask.hidden = false; ui.actions.hidden = false; ui.form.hidden = true; ui.err.hidden = true;
    ui.yes.removeAttribute('aria-pressed'); ui.no.removeAttribute('aria-pressed');
    ui.thanks.hidden = true;
  }

  function open() {
    shown = true;
    stop();
    if (!dialog) build();
    reset();
    if (!dialog.open) dialog.showModal();
    // Không tự focus nút nào để bàn phím/viền focus không bật lên khi khách chưa chạm
    if (document.activeElement && dialog.contains(document.activeElement)) document.activeElement.blur();
  }

  function done() {
    store(localStorage, DONE_KEY, '1');
    stop();
  }

  // Đóng: không tự hỏi lại trong lần xem này (nút data-rsvp-open vẫn mở được)
  function later() {
    store(sessionStorage, LATER_KEY, '1');
    if (dialog && dialog.open) dialog.close();
  }

  function stop() {
    clearTimeout(timer); clearInterval(ticker);
    if (observer) { observer.disconnect(); observer = null; }
  }

  window.RsvpPrompt = { open: open, done: done };
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-rsvp-open]');
    if (b) { e.preventDefault(); open(); }
  });
  // Nút dạng div (thiệp 1) bấm bằng bàn phím
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('div[data-rsvp-open]')) { e.preventDefault(); open(); }
  });

  // ---------- Tự hỏi sau 15 giây xem thiệp hoặc khi kéo gần hết thiệp ----------
  if (!API || stored(localStorage, DONE_KEY) || stored(sessionStorage, LATER_KEY)) return;

  // Không chen vào lúc khách đang mở hộp thoại khác hoặc còn ở màn mở thiệp
  function busy() {
    if (document.querySelector('dialog[open], .tc-open')) return true;
    var intro = document.getElementById('intro');
    return !!(intro && getComputedStyle(intro).display !== 'none' && intro.offsetParent !== null);
  }

  function autoShow() {
    if (shown || stored(localStorage, DONE_KEY)) return;
    if (busy() || document.hidden) { clearTimeout(timer); timer = setTimeout(autoShow, 1500); return; }
    open();
  }

  // Mốc 1px ở cuối trang: lọt vào vùng nhìn (nới thêm 80% chiều cao màn hình) là khách đã kéo gần hết thiệp
  var end = document.createElement('div');
  end.setAttribute('aria-hidden', 'true'); end.style.height = '1px';
  document.body.appendChild(end);
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) autoShow();
    }, { rootMargin: '0px 0px 80% 0px' });
    observer.observe(end);
  }

  // Chỉ đếm giây khách thật sự đang xem thiệp (đã qua màn mở thiệp, không mở hộp thoại khác, tab đang hiện)
  var seen = 0;
  ticker = setInterval(function () {
    if (!busy() && !document.hidden && ++seen >= 15) { clearInterval(ticker); autoShow(); }
  }, 1000);
})();
