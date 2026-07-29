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

    <div class="sidebar-footer">
      <p>v1.2.0 · <span class="font-mono">MONOLITH</span></p>
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
  return true;
};

// DOM ready 时立即注入（保证无闪烁）
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.injectSidebar);
} else {
  // 脚本在 DOM 解析后才执行时立即注入
  window.injectSidebar();
}