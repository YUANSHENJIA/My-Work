/* ===================================================================
   Monolith Intelligence — Shared App Logic v2
   =================================================================== */

(function () {
  'use strict';

  // =================================================================
  // HELPER
  // =================================================================
  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

// =================================================================
// 0. LOGIN GUARD
// =================================================================
function loginGuard() {
  // Skip guard on login page itself
  const path = location.pathname.split('/').pop() || 'index.html';
  if (path === 'login.html') return;

  try {
    const name = localStorage.getItem('monolith.userName');
    if (!name || !name.trim()) {
      location.replace('login.html');
    }
  } catch (e) {
    location.replace('login.html');
  }
}

// =================================================================
// 1. THEME
// =================================================================
  const THEME_KEY = 'monolith.theme';
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.querySelector('[data-theme-toggle] .material-symbols-outlined');
    if (icon) icon.textContent = theme === 'dark' ? 'dark_mode' : 'light_mode';
  }
  function initTheme() {
    let saved;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (!saved) saved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    applyTheme(saved);
    const btn = document.querySelector('[data-theme-toggle]');
    if (btn) btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || 'light';
      const next = cur === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  // =================================================================
  // 2. NAV
  // =================================================================
  function initNav() {
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('[data-nav]').forEach(el => {
      const target = el.getAttribute('data-nav');
      if (target === path || (target === 'index.html' && path === '')) el.classList.add('active');
    });
  }

  // =================================================================
  // 3. SIDEBAR TOGGLE (desktop + mobile)
  // =================================================================
  const SIDEBAR_KEY = 'monolith.sidebarClosed';
  function initSidebar() {
    const toggle = document.querySelector('[data-nav-toggle]');
    const sidebar = document.querySelector('.app-sidebar');
    if (!toggle || !sidebar) return;

    // Restore state
    let closed = false;
    try { closed = localStorage.getItem(SIDEBAR_KEY) === 'true'; } catch (e) {}
    if (closed) document.body.classList.add('sidebar-closed');

    toggle.addEventListener('click', () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        sidebar.classList.toggle('open');
      } else {
        document.body.classList.toggle('sidebar-closed');
        try { localStorage.setItem(SIDEBAR_KEY, document.body.classList.contains('sidebar-closed')); } catch (e) {}
      }
    });

    // On window resize, handle mobile sidebar opening
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        document.body.classList.remove('sidebar-closed');
      }
    });
  }

  // =================================================================
  // 4. SIGN-IN (打卡签到)
  // =================================================================
  const STREAK_KEY = 'monolith.streak';
  const SIGNED_TODAY_KEY = 'monolith.signedToday';

  function initSignIn() {
    let streak = 0, signedToday = '';
    try {
      streak = parseInt(localStorage.getItem(STREAK_KEY) || '0', 10);
      signedToday = localStorage.getItem(SIGNED_TODAY_KEY) || '';
    } catch (e) {}

    const today = todayKey();
    const btn = document.getElementById('sign-in-btn');
    const streakEl = document.getElementById('streak-count');
    if (streakEl) streakEl.textContent = streak;
    if (!btn) return;

    if (signedToday === today) {
      btn.textContent = '已签到 ✓';
      btn.style.opacity = '0.6';
      btn.style.pointerEvents = 'none';
    }

    // Save signed days for calendar
    btn.addEventListener('click', () => {
      try {
        let lastSigned = localStorage.getItem('monolith.lastSignedDate');
        const yd = new Date(Date.now() - 86400000);
        const yKey = `${yd.getFullYear()}-${String(yd.getMonth()+1).padStart(2,'0')}-${String(yd.getDate()).padStart(2,'0')}`;
        let newStreak;
        if (lastSigned === yKey) newStreak = streak + 1;
        else if (lastSigned === today) newStreak = streak;
        else newStreak = 1;

        localStorage.setItem(STREAK_KEY, String(newStreak));
        localStorage.setItem(SIGNED_TODAY_KEY, today);
        localStorage.setItem('monolith.lastSignedDate', today);

        // Save to signed days set
        let signedDays;
        try { signedDays = JSON.parse(localStorage.getItem('monolith.signedDays') || '{}'); } catch(e){ signedDays = {}; }
        signedDays[today] = true;
        try { localStorage.setItem('monolith.signedDays', JSON.stringify(signedDays)); } catch(e) {}

        if (streakEl) streakEl.textContent = newStreak;
        btn.textContent = '已签到 ✓';
        btn.style.opacity = '0.6';
        btn.style.pointerEvents = 'none';
        btn.animate([{transform:'scale(1)'},{transform:'scale(0.95)'},{transform:'scale(1)'}], {duration:280,easing:'ease-out'});
      } catch (e) {}
    });
  }

  // =================================================================
  // 5. DATE
  // =================================================================
  function initDate() {
    const el = document.getElementById('live-date');
    if (!el) return;
    const update = () => {
      const d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth()+1).padStart(2,'0');
      const day = String(d.getDate()).padStart(2,'0');
      el.textContent = `${y}-${m}-${day}`;
    };
    update();
    setInterval(update, 60000);
  }

  // =================================================================
  // 6. HEADER TICKER (quote + weather, alternating 5s)
  // 完全防御性写法：inline style 不依赖 CSS 类，try-catch 包裹所有
  // =================================================================
  var TICKER_SLOT_QUOTE = null;
  var TICKER_SLOT_WEATHER = null;
  var TICKER_SHOWING_QUOTE = true;

  function initHeaderTicker() {
    try {
      var c = document.getElementById('header-ticker');
      if (!c) return;
      // 清空
      c.innerHTML = '';
      // inline style — 保证哪怕所有 CSS 都不加载也能工作
      c.style.cssText = 'position:relative;overflow:hidden;height:32px;min-height:32px;width:100%;';

      // 诗句槽
      var q = document.createElement('div');
      q.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;transition:opacity 0.5s;opacity:1;font-size:16px;line-height:32px;';
      // 从「今日对应的句子」开始，之后每 5s 切到下一句
      var _qd = new Date();
      var _qs = new Date(_qd.getFullYear(), 0, 0);
      var _quoteIdx = Math.floor((_qd - _qs) / 86400000) % QUOTES.length;
      q.textContent = getDailyQuote(_quoteIdx);
      c.appendChild(q);

      // 天气槽
      var w = document.createElement('div');
      w.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;transition:opacity 0.5s;opacity:0;font-size:16px;line-height:32px;';
      w.textContent = '☁️ 获取天气中...';
      c.appendChild(w);

      TICKER_SLOT_QUOTE = q;
      TICKER_SLOT_WEATHER = w;

      // 短句文案每 10 分钟才换一次；短句/天气仍每 5s 交替滚动
      var _quoteChangeMs = Date.now();
      var QUOTE_REFRESH_MS = 10 * 60 * 1000; // 10 分钟

      // 每 5 秒交替：短句 → 天气 → 短句 → 天气 → …，每个保持 5s
      setInterval(function() {
        TICKER_SHOWING_QUOTE = !TICKER_SHOWING_QUOTE;
        if (TICKER_SHOWING_QUOTE) {
          // 仅在距上次换句满 10 分钟时才推进到下一句
          if (Date.now() - _quoteChangeMs >= QUOTE_REFRESH_MS) {
            _quoteIdx = (_quoteIdx + 1) % QUOTES.length;
            q.textContent = getDailyQuote(_quoteIdx);
            _quoteChangeMs = Date.now();
          }
        }
        q.style.opacity = TICKER_SHOWING_QUOTE ? '1' : '0';
        w.style.opacity = TICKER_SHOWING_QUOTE ? '0' : '1';
      }, 5000);

      // 异步获取天气 — 用 XMLHttpRequest（完全跳过 fetch/Promise，兼容性最好）
      fetchWeatherInline(w);
    } catch(e) {
      // 绝对不能抛异常
    }
  }

  function fetchWeatherInline(wElem) {
    try {
      var x = new XMLHttpRequest();
      x.open('GET', 'https://wttr.in/?format=%C+%t&lang=zh', true);
      x.setRequestHeader('Accept', 'text/plain');
      x.timeout = 6000;
      x.onload = function() {
        if (x.status === 200) {
          var t = (x.responseText || '').trim();
          if (t && t.length < 80 && t.indexOf('<') === -1) {
            wElem.textContent = '☁️ ' + t;
            return;
          }
        }
        wttrFallbackMeta(wElem);
      };
      x.onerror = function() { wttrFallbackMeta(wElem); };
      x.ontimeout = function() { wttrFallbackMeta(wElem); };
      x.send();
    } catch(e) { wttrFallbackMeta(wElem); }
  }

  function wttrFallbackMeta(wElem) {
    try {
      var x = new XMLHttpRequest();
      x.open('GET', 'https://api.open-meteo.com/v1/forecast?latitude=22.5&longitude=114.0&current_weather=true&timezone=Asia%2FShanghai', true);
      x.timeout = 6000;
      x.onload = function() {
        if (x.status === 200) {
          try {
            var d = JSON.parse(x.responseText);
            if (d && d.current_weather) {
              wElem.textContent = '☁️ ' + d.current_weather.temperature + '°C';
              return;
            }
          } catch(e) {}
        }
        wElem.textContent = '☀️ 暂无天气数据';
      };
      x.onerror = function() { wElem.textContent = '☀️ 暂无天气数据'; };
      x.send();
    } catch(e) { wElem.textContent = '☀️ 暂无天气数据'; }
  }

  // 短句库：每天从 dayOfYear 对应的句子开始，之后每 5s 轮换到下一句
  var QUOTES = [
    '悟已往之不谏，知来者之可追。',
    '博观而约取，厚积而薄发。',
    '不积跬步，无以至千里。',
    '学而不思则罔，思而不学则殆。',
    '业精于勤，荒于嬉。',
    '路漫漫其修远兮，吾将上下而求索。',
    '长风破浪会有时，直挂云帆济沧海。',
    '千淘万漉虽辛苦，吹尽狂沙始到金。',
    '千里之行，始于足下。',
    '天行健，君子以自强不息。',
    '纸上得来终觉浅，绝知此事要躬行。',
    '宝剑锋从磨砺出，梅花香自苦寒来。',
    '苟日新，日日新，又日新。',
    '博学之，审问之，慎思之，明辨之，笃行之。',
    '知之为知之，不知为不知，是知也。',
    '见贤思齐焉，见不贤而内自省也。',
    '三人行，必有我师焉。',
    '山重水复疑无路，柳暗花明又一村。',
    '沉舟侧畔千帆过，病树前头万木春。',
    '不畏浮云遮望眼，自缘身在最高层。',
    '问渠那得清如许？为有源头活水来。',
    '莫愁前路无知己，天下谁人不识君。',
    '春风得意马蹄疾，一日看尽长安花。',
    '大鹏一日同风起，扶摇直上九万里。',
    '会当凌绝顶，一览众山小。',
    '欲穷千里目，更上一层楼。',
    '竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。',
    '海内存知己，天涯若比邻。',
    '心之所向，素履以往。',
    '生如逆旅，一苇以航。',
    '念念不忘，必有回响。',
    'Stay hungry, stay foolish.',
    'The secret of your future is hidden in your daily routine.'
  ];
  function getDailyQuote(idx) {
    try {
      if (idx === undefined) {
        var d = new Date();
        var start = new Date(d.getFullYear(), 0, 0);
        idx = Math.floor((d - start) / 86400000);
      }
      return QUOTES[idx % QUOTES.length];
    } catch(e) { return '悟已往之不谏，知来者之可追。'; }
  }

  // =================================================================
  // 7. MODAL
  // =================================================================
  window.openModal = function(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  };
  window.closeModal = function(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  };

// =================================================================
// 8. BOOT
// =================================================================
loginGuard(); // 必须最先执行

document.addEventListener('DOMContentLoaded', () => {
    // Sidebar 已在 sidebar.js 中立即注入，这里再确认一次
    if (window.injectSidebar) window.injectSidebar();
    initTheme();
    initNav();
    initSidebar();
    initSignIn();
    initDate();
    initHeaderTicker();

    // 应用用户名到顶部
    try {
      const name = localStorage.getItem('monolith.userName');
      const titleEl = document.querySelector('.app-header .font-semibold');
      if (titleEl && name) {
        titleEl.textContent = `My Work`;
      }
    } catch (e) {}

    // 应用用户头像（优先使用上传的，缺省回退到 assets/images/avatar.jpg）
    try {
      const saved = localStorage.getItem('monolith.userAvatar');
      if (saved) {
        document.querySelectorAll('img[src="assets/images/avatar.jpg"]').forEach(img => {
          img.src = saved;
        });
      }
    } catch (e) {}

    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.remove('open');
      });
    });
  });

  // ===== 自动时长统计（专注 / 阅读） =====
  // 专注时长：任意页面处于「可见 + 2 分钟内有过操作」状态时自动累计
  // 阅读时长：仅在阅读类页面（书架/书籍详情/内容摘录/热点资讯）时额外累计
  (function autoTimeTracker() {
    // 登录页不计时
    const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (page === 'login.html') return;

    const READING_PAGES = ['bookshelf.html', 'book-detail.html', 'excerpts.html', 'news.html'];
    const isReadingPage = READING_PAGES.includes(page);
    const IDLE_LIMIT = 2 * 60 * 1000;   // 2 分钟无操作 = 离开
    const TICK_MS = 15 * 1000;          // 每 15 秒累计一次

    const dayKey = () => new Date().toISOString().slice(0, 10);
    // 秒级累计存 monolith.seconds.*，满 60 秒进位到 monolith.minutes.*（review 页读取的键）
    function addSeconds(type, sec) {
      try {
        const d = dayKey();
        const sKey = 'monolith.seconds.' + type + '.' + d;
        const mKey = 'monolith.minutes.' + type + '.' + d;
        let s = (parseInt(localStorage.getItem(sKey), 10) || 0) + sec;
        if (s >= 60) {
          const inc = Math.floor(s / 60);
          s = s % 60;
          const m = (parseInt(localStorage.getItem(mKey), 10) || 0) + inc;
          localStorage.setItem(mKey, String(m));
        }
        localStorage.setItem(sKey, String(s));
      } catch (e) {}
    }

    let lastActivity = Date.now();
    ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click', 'wheel'].forEach(ev => {
      window.addEventListener(ev, () => { lastActivity = Date.now(); }, { passive: true });
    });

    let lastTick = Date.now();
    setInterval(() => {
      const now = Date.now();
      const elapsedSec = Math.round((now - lastTick) / 1000);
      lastTick = now;
      if (document.visibilityState !== 'visible') return;      // 页面在后台不计
      if (now - lastActivity > IDLE_LIMIT) return;             // 挂机不计
      if (elapsedSec <= 0 || elapsedSec > 120) return;         // 异常间隔丢弃（如休眠唤醒）
      addSeconds('focus', elapsedSec);
      if (isReadingPage) addSeconds('reading', elapsedSec);
    }, TICK_MS);

    // 页面隐藏/关闭前把剩余时间也结算进去
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        const now = Date.now();
        const elapsedSec = Math.round((now - lastTick) / 1000);
        lastTick = now;
        if (now - lastActivity <= IDLE_LIMIT && elapsedSec > 0 && elapsedSec <= 120) {
          addSeconds('focus', elapsedSec);
          if (isReadingPage) addSeconds('reading', elapsedSec);
        }
      }
    });
  })();
})();
