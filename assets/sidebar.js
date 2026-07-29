/* ===================================================================
   Sidebar Component — 单一组件，所有页面共享
   通过 injectSidebar() 自动注入到 .app-sidebar 占位符
   =================================================================== */

window.SIDEBAR_HTML = `
  <div class="sidebar-inner">
    <div class="sidebar-header">
      <div class="sidebar-date" id="live-date">2026-07-25</div>
      <button id="sign-in-btn" class="btn-primary w-full">打卡签到</button>
      <div class="sidebar-streak">
        <p>连续坚持：<span id="streak-count" class="text-primary font-bold">12</span> 天</p>
      </div>
    </div>

    <nav class="sidebar-nav">
      <a class="nav-item" data-nav="index.html" href="index.html"><span class="material-symbols-outlined">dashboard</span><span>工作台</span></a>
      <a class="nav-item" data-nav="calendar.html" href="calendar.html"><span class="material-symbols-outlined">calendar_today</span><span>日历</span></a>
      <a class="nav-item" data-nav="news.html" href="news.html"><span class="material-symbols-outlined">bolt</span><span>今日热点资讯</span></a>
      <a class="nav-item" data-nav="todos.html" href="todos.html"><span class="material-symbols-outlined">check_circle</span><span>今日待办</span></a>
      <a class="nav-item" data-nav="favorites.html" href="favorites.html"><span class="material-symbols-outlined">bookmark</span><span>收藏夹</span></a>
      <a class="nav-item" data-nav="excerpts.html" href="excerpts.html"><span class="material-symbols-outlined">edit_note</span><span>内容摘录</span></a>
      <a class="nav-item" data-nav="bookshelf.html" href="bookshelf.html"><span class="material-symbols-outlined">menu_book</span><span>我的书架</span></a>
      <a class="nav-item" data-nav="hydration.html" href="hydration.html"><span class="material-symbols-outlined">water_drop</span><span>喝水时间</span></a>
      <a class="nav-item" data-nav="review.html" href="review.html"><span class="material-symbols-outlined">event_available</span><span>今日复盘</span></a>
      <a class="nav-item" data-nav="strategy.html" href="strategy.html"><span class="material-symbols-outlined">payments</span><span>搞钱方法</span></a>
      <a class="nav-item" data-nav="mbti.html" href="mbti.html"><span class="material-symbols-outlined">psychology</span><span>MBTI人格测试</span></a>
      <a class="nav-item" data-nav="games.html" href="games.html"><span class="material-symbols-outlined">sports_esports</span><span>摸鱼小游戏</span></a>
    </nav>

    <div class="sidebar-footer" style="position:relative;">
      <p>v1.2.0 · <span class="font-mono">MONOLITH</span> · <button id="tip-trigger" style="background:transparent;border:none;padding:0;cursor:pointer;color:var(--on-surface-variant);font:inherit;text-decoration:underline dotted;text-underline-offset:3px;">打赏作者</button></p>
      <!-- 打赏金额选择浮层 -->
      <div id="tip-amount-pop" style="display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:var(--surface-container);border-radius:var(--r-lg);padding:12px 16px;box-shadow:0 8px 24px rgba(0,0,0,.18);white-space:nowrap;z-index:100;">
        <div style="font-size:11px;color:var(--on-surface-variant);margin-bottom:8px;text-align:center;">选择金额</div>
        <div style="display:flex;gap:8px;">
          <button class="tip-amount-btn" data-amt="2" style="padding:8px 16px;border-radius:var(--r-md);border:1px solid var(--outline-variant);background:var(--surface);color:var(--on-surface);cursor:pointer;font-size:14px;font-weight:600;">2元</button>
          <button class="tip-amount-btn" data-amt="3" style="padding:8px 16px;border-radius:var(--r-md);border:1px solid var(--outline-variant);background:var(--surface);color:var(--on-surface);cursor:pointer;font-size:14px;font-weight:600;">3元</button>
          <button class="tip-amount-btn" data-amt="5" style="padding:8px 16px;border-radius:var(--r-md);border:1px solid var(--primary);background:var(--primary);color:var(--on-primary);cursor:pointer;font-size:14px;font-weight:600;">5元</button>
        </div>
      </div>
      <!-- 收款码弹窗 -->
      <div id="tip-qr-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;align-items:center;justify-content:center;">
        <div style="background:var(--surface);border-radius:var(--r-xl);padding:24px;max-width:340px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.35);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
            <div></div>
            <h3 style="font-size:16px;font-weight:600;margin:0;">扫码打赏 <span id="tip-qr-amt"></span></h3>
            <button id="tip-close" style="background:transparent;border:none;cursor:pointer;color:var(--on-surface-variant);padding:4px;"><span class="material-symbols-outlined" style="font-size:20px;">close</span></button>
          </div>
          <img id="tip-qr-img" src="" alt="收款码" style="width:100%;max-width:280px;border-radius:var(--r-md);display:block;margin:0 auto;">
          <p style="font-size:13px;color:var(--on-surface-variant);margin-top:12px;">支付宝扫码，感谢支持 🙏</p>
        </div>
      </div>
    </div>
  </div>
`;

/**
 * 注入侧边栏到占位符
 * 每个页面只需包含 <aside class="app-sidebar"></aside>
 */
window.injectSidebar = function () {
  const placeholder = document.querySelector('.app-sidebar');
  if (!placeholder) return false;
  // 仅当占位符为空时才注入（避免重复）
  if (placeholder.children.length === 0 || placeholder.innerHTML.trim() === '') {
    placeholder.innerHTML = window.SIDEBAR_HTML;
  }
  // 绑定打赏相关事件（每次注入都重新绑定，确保不重复）
  bindTipEvents();
  return true;
};

/* ===== 打赏作者：金额选择 → 收款码弹窗 ===== */
function bindTipEvents(){
  // 避免重复绑定（injectSidebar 可能被多次调用）
  if (window._tipBound) return;
  window._tipBound = true;
  const trigger = document.getElementById('tip-trigger');
  if (!trigger) return;
  const amtPop = document.getElementById('tip-amount-pop');
  const qrModal = document.getElementById('tip-qr-modal');
  const qrImg = document.getElementById('tip-qr-img');
  const qrAmt = document.getElementById('tip-qr-amt');
  const closeBtn = document.getElementById('tip-close');
  if (!amtPop || !qrModal || !qrImg || !qrAmt || !closeBtn) return;

  // 主触发：toggle 金额浮层
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    amtPop.style.display = amtPop.style.display === 'none' ? 'block' : 'none';
  });
  // 点页面其他地方关闭浮层
  document.addEventListener('click', (e) => {
    if (!amtPop.contains(e.target) && e.target !== trigger) amtPop.style.display = 'none';
  });
  // 三个金额按钮：显示对应收款码
  document.querySelectorAll('.tip-amount-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const amt = btn.dataset.amt;
      qrImg.src = `assets/images/tip-${amt}.png`;
      qrAmt.textContent = `${amt}元`;
      amtPop.style.display = 'none';
      qrModal.style.display = 'flex';
    });
  });
  // 关闭收款码弹窗
  closeBtn.addEventListener('click', () => { qrModal.style.display = 'none'; });
  qrModal.addEventListener('click', (e) => { if (e.target === qrModal) qrModal.style.display = 'none'; });
  // ESC 关闭两个浮层
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (qrModal.style.display === 'flex') qrModal.style.display = 'none';
    else if (amtPop.style.display === 'block') amtPop.style.display = 'none';
  });
}

// DOM ready 时立即注入（保证无闪烁）
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.injectSidebar);
} else {
  // 脚本在 DOM 解析后才执行时立即注入
  window.injectSidebar();
}