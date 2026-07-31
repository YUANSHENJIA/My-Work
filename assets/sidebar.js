/* ===================================================================
   Sidebar Component — 单一组件，所有页面共享
   通过 injectSidebar() 自动注入到 .app-sidebar 占位符
   =================================================================== */

// 翻译字典：zh / en（覆盖侧边栏 + 主要页面所有功能性文字）
window.I18N = {
  zh: {
    signIn: '打卡签到',
    streak: '连续坚持',
    days: '天',
    nav: {
      'index.html': '工作台',
      'calendar.html': '日历',
      'news.html': '今日热点资讯',
      'todos.html': '今日待办',
      'favorites.html': '收藏夹',
      'excerpts.html': '内容摘录',
      'bookshelf.html': '我的书架',
      'hydration.html': '喝水时间',
      'review.html': '今日复盘',
      'strategy.html': '搞钱方法',
      'mbti.html': 'MBTI人格测试',
      'games.html': '摸鱼小游戏',
    },
    tip: '打赏作者',
    chooseAmount: '选择金额',
    scanTip: '扫码打赏',
    thanksText: '支付宝扫码，感谢支持 🙏',
    // ===== index.html 工作台 =====
    workspace: '工作台',
    home: '主页',
    streakEncourage: '你已连续坚持',
    streakDays2: '天',
    streakHint: '完成今天的待办可以让连续记录继续增长。',
    todayDate: (m, d, w) => `今天是 ${m} 年 ${d} 日，星期${w}`,
    morning: '早安',
    goodMorning: '早上好',
    noon: '中午好',
    afternoon: '下午好',
    goodEvening: '晚上好',
    goodNight: '晚安',
    // ===== todos.html 今日待办 =====
    todosTitle: '今日待办',
    todosDesc: '管理你的一天，从记录每一件小事开始。保持专注，稳步前行。',
    add: '添加',
    priority: '优先级',
    complete: '完成',
    search_placeholder: '搜索待办...',
    todo_placeholder: '新建待办 (按 Enter 添加)',
    noTodos: '今天没有待办，点击"添加"按钮开始你的安排',
    priorityLabels: { 'priority-high': 'P1', 'planning': 'P2', 'routine': 'P3', 'communication': 'P4' },
    optHigh: 'P1', optPlanning: 'P2', optRoutine: 'P3', optCommunication: 'P4',
    currentStack: '当前任务',
    // ===== calendar.html 日历 =====
    calendarTitle: '日历',
    addTodo: '添加待办',
    reminder: '提醒',
    manageAll: '管理全部',
    backToday: '回到今天',
    newReminder: '新建提醒',
    setReminder: '设置提醒',
    reminderContent: '提醒内容',
    reminderTime: '提醒时间',
    cancel: '取消',
    noTasks: '这一天还没有待办。',
    reminderSet: '提醒已设置',
    reminderFuture: '提醒时间需在未来',
    // ===== favorites.html 收藏夹 =====
    favoritesTitle: '收藏夹',
    favHint: '点击右上角添加第一个收藏',
    url: '链接',
    folder: '文件夹',
    // ===== excerpts.html 内容摘录 =====
    excerptsTitle: '内容摘录',
    searchNotes: '搜索笔记或标签...',
    newExcerpt: '新建内容摘录',
    title: '标题',
    content: '内容',
    tags: '标签',
    noExcerpts: '还没有摘录，点击下方按钮添加',
    noMatch: '没有匹配的笔记，换个关键词或标签试试',
    excerptHint: '摘录内容...',
    tagHint: '#标签1, #标签2',
    // ===== news.html 今日热点资讯 =====
    newsTitle: '今日热点资讯',
    newsDesc: '实时追踪全球人工智能领域最具影响力的技术突破与商业变革。',
    newsCatAll: '全部',
    newsCatAI: 'AI',
    newsCatBiz: '商业',
    newsCatTech: '技术',
    // ===== favorites.html 收藏夹 =====
    favoritesTitle: '我的收藏夹',
    addFav: '添加收藏',
    favBtn: '收藏',
    favEmpty: '这里还没有任何收藏内容。点击下方的按钮，开启你的灵感收集之旅。',
    // ===== bookshelf.html 我的书架 =====
    bookshelfTitle: '我的书架',
    bookshelfDesc: '构建个人知识体系的基石。从每日一学导入，收藏过的书会保留完整内容。',
    bookCountText: '书架共有',
    bookCountUnit: '本书籍笔记',
    browseFull: '浏览每日一学完整书单',
    browseHint: '点击 + 号可从书单导入，导入后点击书籍卡片进入详情页阅读。',
    externalLink: '外部链接',
    readSaved: '阅读收藏',
    importFrom: '从每日一学导入',
    addBookNote: '添加书籍笔记',
    importHint: '点击「添加书籍笔记」按钮导入你喜欢的书 📚',
    importing: '导入中',
    importFail: '导入失败：',
    importFailHint: '可能受网络或 CORS 限制',
    noTodos: '暂无待办',
    noTodosHint: '在上面输入框添加第一项，开启你的一天。',
    // ===== calendar.html =====
    newsLoadFail: '资讯加载失败，请稍后再试。',
    refresh: '刷新',
    refreshing: '刷新中...',
    refreshFail: '刷新失败',
    // ===== hydration.html =====
    hydrationDesc: '持续补水，保持专注。健康的小习惯带来巨大的复利。',
    resetWater: '重置今日饮水',
    reminderSettings: '提醒设置',
    scheduledReminder: '定时喝水提醒',
    reminderInterval: '提醒间隔',
    intervalLabel: (n) => `${n} 分钟`,
    smartReminder: '智能振动提醒',
    smartReminderHint: '仅在佩戴手表时提醒',
    // ===== review.html =====
    reviewTitle: '今日复盘',
    reviewDesc: '回顾今日所做的事、所学的知识、所犯的错误。把每天的复盘变成成长的杠杆。',
    completionRate: '完成度',
    todosPending: '待办',
    waterLabel: '饮水量',
    waterTarget: '目标 2.0L',
    readingTime: '阅读时长',
    focusTime: '专注时长',
    autoCounting: '自动统计中',
    threeQuestions: '三个问题',
    threeQuestionsDesc: '每天回答这三个问题，是建立自我反馈循环的简单方式。',
    q1: '今天做了什么？',
    q1Placeholder: '记录你今天完成的具体事情...',
    q2: '今天学到了什么？',
    q2Placeholder: '今天的新认知、新技能、新视角...',
    q3: '明天要改进什么？',
    q3Placeholder: '明天希望改变的一件事...',
    saveReview: '保存今日复盘',
    savedReview: '已保存 ✓',
    historyReview: '历史复盘',
    viewAll: '查看全部',
    noHistory: '还没有历史复盘。完成今天的复盘后会出现在这里。',
    // ===== strategy.html =====
    strategyTitle: '搞钱方法',
    strategyDesc: '捕捉灵感，拆解逻辑，将构想转化为可持续的复利增长。',
    addMethod: '新增策略',
    emptyTitle: '虚位以待',
    emptyDesc: '目前还没有记录任何商业灵感。点击右上角按钮，开始记录你的第一个"搞钱"计划。',
    catchSpark: '捕捉灵感',
    logicSplit: '逻辑拆解',
    execute: '落地执行',
    stratCount: '库中策略',
    stratUnit: '个项目',
    lastUpdated: '最近更新',
    // ===== games.html =====
    gamesTitle: '摸鱼小游戏',
    mbtiBreadcrumb: 'MBTI PERSONALITY TEST',
    gamesBreadcrumb: 'SLACKING MINI GAME',
    gamesSubtitle: '适度放松，效率更高 😄',
    // ===== mbti.html =====
    mbtiTitle: 'MBTI 人格测试',
    mbtiDesc: '从四个维度评估你的性格倾向：外倾/内倾、实感/直觉、思考/情感、判断/感知。',
    mbtiSubtitle: '共 16 道选择题，约需 5 分钟',
    startTest: '开始测试',
    // ===== common =====
    dayUnit: '天',
    scoreUnit: '分',
    minUnit: '分钟',
    waterUnit: 'L',
    meterUnit: 'm',
    completed: '完成',
    // ===== index.html 工作台卡片 =====
    cardTodos: '今日待办',
    cardWater: '今日饮水',
    cardReading: '正在阅读',
    cardArchive: '策略归档',
    bookUnit: '本',
    itemUnit: '条',
    aiPulseSubtitle: '今日热点',
    aiPulseHeading: '实时追踪 AI 前沿',
    quickStart: '快速开始',
    qaTodo: '新建待办',
    qaNote: '写笔记',
    qaWater: '记录饮水',
    qaIdea: '记录灵感',
    qaFav: '添加收藏',
    newsLoading: '今日热点加载中...',
    // ===== favorites.html placeholder =====
    favUrlPlaceholder: '粘贴链接 — 文章 / 推文 / 视频 / 任何想法...',
  },
  en: {
    signIn: 'Sign In',
    streak: 'Streak',
    days: 'days',
    nav: {
      'index.html': 'Dashboard',
      'calendar.html': 'Calendar',
      'news.html': "Today's News",
      'todos.html': "Today's Todos",
      'favorites.html': 'Favorites',
      'excerpts.html': 'Excerpts',
      'bookshelf.html': 'My Bookshelf',
      'hydration.html': 'Hydration',
      'review.html': 'Daily Review',
      'strategy.html': 'Side Hustles',
      'mbti.html': 'MBTI PERSONALITY TEST',
      'games.html': 'SLACKING MINI GAME',
    },
    tip: 'Tip Author',
    chooseAmount: 'Choose Amount',
    scanTip: 'Scan to Tip',
    thanksText: 'Scan with Alipay, thanks for the support 🙏',
    // ===== News =====
    newsTitle: "Today's News",
    newsDesc: 'Real-time tracking of the most impactful AI breakthroughs and business changes worldwide.',
    newsCatAll: 'All',
    newsCatAI: 'AI',
    newsCatBiz: 'Business',
    newsCatTech: 'Tech',
    // ===== Favorites =====
    favoritesTitle: 'My Favorites',
    addFav: 'Add Favorite',
    favBtn: 'Save',
    favEmpty: 'No favorites yet. Tap the button below to start collecting inspiration.',
    // ===== Bookshelf =====
    bookshelfTitle: 'My Bookshelf',
    bookshelfDesc: 'The foundation of a personal knowledge system. Import from "Daily Learn" and your saved books keep their full content.',
    bookCountText: 'books in your shelf',
    bookCountUnit: 'book notes',
    browseFull: 'Browse Daily Learn',
    browseHint: 'Tap the + to import from the list. After import, tap a book card to start reading.',
    externalLink: 'External Link',
    readSaved: 'Read Saved',
    importFrom: 'Import from Daily Learn',
    addBookNote: 'Add Book Note',
    importHint: 'Tap "Add Book Note" to import your favorite books 📚',
    importing: 'Importing',
    importFail: 'Import failed: ',
    importFailHint: 'Possible network or CORS restriction',
    // ===== Dashboard =====
    workspace: 'Workspace',
    home: 'Home',
    streakEncourage: 'You\'ve stayed on track for',
    streakDays2: ' days',
    streakHint: 'Complete today\'s todos to keep your streak going.',
    todayDate: (m, d, w) => `Today is ${m}/${d}, ${w}`,
    morning: 'Morning',
    goodMorning: 'Good morning',
    noon: 'Noon',
    afternoon: 'Afternoon',
    goodEvening: 'Good evening',
    goodNight: 'Good night',
    // ===== Todos =====
    todosTitle: "Today's Todos",
    todosDesc: 'Manage your day by capturing every little task. Stay focused, move forward.',
    add: 'Add',
    priority: 'Priority',
    complete: 'Done',
    search_placeholder: 'Search todos...',
    todo_placeholder: 'New todo (press Enter)',
    noTodos: 'No todos yet, tap "Add" to start your day',
    priorityLabels: { 'priority-high': 'P1', 'planning': 'P2', 'routine': 'P3', 'communication': 'P4' },
    optHigh: 'P1', optPlanning: 'P2', optRoutine: 'P3', optCommunication: 'P4',
    currentStack: 'CURRENT STACK',
    // ===== Calendar =====
    calendarTitle: 'Calendar',
    addTodo: 'Add Todo',
    reminder: 'Reminder',
    manageAll: 'Manage All',
    backToday: 'Today',
    newReminder: 'New Reminder',
    setReminder: 'Set Reminder',
    reminderContent: 'Reminder',
    reminderTime: 'When',
    cancel: 'Cancel',
    noTasks: 'No tasks for this day.',
    reminderSet: 'Reminder set',
    reminderFuture: 'Reminder time must be in the future',
    // ===== Favorites =====
    favoritesTitle: 'Favorites',
    favHint: 'Tap the top right to add your first favorite',
    url: 'URL',
    folder: 'Folder',
    // ===== Excerpts =====
    excerptsTitle: 'Excerpts',
    searchNotes: 'Search notes or tags...',
    newExcerpt: 'New Excerpt',
    title: 'Title',
    content: 'Content',
    tags: 'Tags',
    noExcerpts: 'No excerpts yet, tap the button below to add one',
    noMatch: 'No matches. Try a different keyword or tag',
    excerptHint: 'Excerpt content...',
    tagHint: '#tag1, #tag2',
    // ===== Bookshelf =====
    bookshelfTitle: 'My Bookshelf',
    bookshelfDesc: 'The foundation of a personal knowledge system. Import from "Daily Learn" and your saved books keep their full content.',
    bookCountText: 'books in your shelf',
    bookCountUnit: 'book notes',
    browseFull: 'Browse Daily Learn',
    browseHint: 'Tap the + to import from the list. After import, tap a book card to start reading.',
    externalLink: 'External Link',
    readSaved: 'Read Saved',
    importFrom: 'Import from Daily Learn',
    addBookNote: 'Add Book Note',
    importHint: 'Tap "Add Book Note" to import your favorite books 📚',
    importing: 'Importing',
    importFail: 'Import failed: ',
    importFailHint: 'Possible network or CORS restriction',
    networkFail: 'Load failed',
    delete: 'Delete',
    confirmDeleteBook: 'Delete this book?',
    addFromExternal: 'Import from 「Daily Learn」',
    meiriyixue: 'Daily Learn',
    // ===== Hydration =====
    hydrationTitle: 'Hydration',
    currentIntake: 'Current Intake',
    goalIntake: 'Goal',
    needDrink: 'Still to Drink',
    editGoal: 'Edit Goal',
    newGoalPrompt: 'Set daily hydration goal (ml):',
    amount: 'Amount',
    highest: 'Best',
    resetGoal: 'Reset Goal',
    resetConfirm: 'Reset today\'s water record?',
    // ===== Review =====
    reviewTitle: 'Daily Review',
    newReview: 'New Review',
    achievements: 'Today\'s Wins',
    learnings: 'Today\'s Lessons',
    nextFocus: 'Tomorrow\'s Focus',
    rating: 'Today\'s Satisfaction',
    noReview: 'No review yet',
    reviewHint: 'Review helps you see today\'s growth',
    // ===== Strategy =====
    strategyTitle: 'Side Hustles',
    addMethod: 'Add Method',
    difficulty: 'Difficulty',
    income: 'Expected Income',
    noMethod: 'No methods yet',
    // ===== MBTI =====
    mbtiTitle: 'MBTI Personality Test',
    mbtiDesc: 'Evaluate your personality across four dimensions: Extraversion/Introversion, Sensing/Intuition, Thinking/Feeling, Judging/Perceiving.',
    mbtiSubtitle: '16 questions, ~5 minutes',
    startTest: 'Start Test',
    restartTest: 'Retake',
    knowResult: 'See Result',
    prevQ: 'Previous',
    nextQ: 'Next',
    scoreProgress: (cur, total) => `${cur}/${total}`,
    pleaseChoose: 'Please choose an option',
    chooseOption: 'Previous',
    dimensionEI: 'E/I · Extrovert/Introvert',
    dimensionSN: 'S/N · Sensing/Intuition',
    dimensionTF: 'T/F · Thinking/Feeling',
    dimensionJP: 'J/P · Judging/Perceiving',
    yourMBTI: 'Your MBTI Type',
    // ===== Games =====
    gamesTitle: 'Slacking Mini Game',
    mbtiBreadcrumb: 'MBTI PERSONALITY TEST',
    gamesBreadcrumb: 'SLACKING MINI GAME',
    gamesSubtitle: 'Take a break, you deserve it 😄',
    tabSnake: 'Snake',
    tabMine: 'Minesweeper',
    tabGomoku: 'Gomoku',
    tabFish: 'Wooden Fish',
    snake: 'Snake',
    score: 'Score',
    highest: 'Best',
    minesweeper: 'Minesweeper',
    flagged: '🚩',
    mine: '💣',
    gomoku: 'Gomoku',
    currentBlack: '⚫ Your turn',
    mode: 'AI',
    woodenFish: 'Wooden Fish',
    todayDeed: 'Today\'s merit',
    totalDeed: 'Total merit',
    resetDeed: 'Reset merit',
    knockHint: 'Tap the fish to knock',
    restart: 'Restart',
    victory: '🎉 You win!',
    youWin: '🎉 You win',
    gameOver: '💀 Game over! Score: ',
    mineSet: '💥 Mine!',
    // ===== common =====
    addBtn: 'Add',
    cancelBtn: 'Cancel',
    confirmBtn: 'Confirm',
    saveBtn: 'Save',
    deleteBtn: 'Delete',
    editBtn: 'Edit',
    completed: 'Done',
    // ===== index.html Dashboard cards =====
    cardTodos: "Today's Todos",
    cardWater: "Today's Water",
    cardReading: 'Currently Reading',
    cardArchive: 'Strategy Archive',
    bookUnit: 'books',
    itemUnit: 'items',
    aiPulseSubtitle: "Today's Pulse",
    aiPulseHeading: 'Real-time AI Pulse',
    quickStart: 'Quick Start',
    qaTodo: 'New Todo',
    qaNote: 'Take a Note',
    qaWater: 'Log Water',
    qaIdea: 'Log Idea',
    qaFav: 'Add Favorite',
    newsLoading: 'Loading today\'s pulse...',
    favUrlPlaceholder: 'Paste a link — article / tweet / video / anything...',
    // ===== New keys added 2026-07-30 =====
    titlePlaceholder: 'Title...',
    excerpt_search: 'Search notes or tags...',
    filterAll: 'All',
    filterOpen: 'Open only',
    noTodosHint: 'Add your first item in the input above to start your day.',
    newsLoadFail: 'Failed to load news. Please try again later.',
    refresh: 'Refresh',
    refreshing: 'Refreshing...',
    refreshFail: 'Refresh failed',
    hydrationDesc: 'Stay hydrated, stay focused. Healthy habits compound into massive returns.',
    resetWater: "Reset today's intake",
    reminderSettings: 'Reminder Settings',
    scheduledReminder: 'Drink Reminder',
    reminderInterval: 'Interval',
    intervalLabel: (n) => `${n} min`,
    smartReminder: 'Smart Vibration',
    smartReminderHint: 'Only when wearing watch',
    reviewDesc: 'Reflect on what you did, learned, and mistakes you made. Make every review a lever for growth.',
    completionRate: 'Completion',
    todosPending: 'todos',
    waterLabel: 'Water',
    waterTarget: 'Goal 2.0L',
    readingTime: 'Reading',
    focusTime: 'Focus',
    autoCounting: 'Auto-counting',
    threeQuestions: 'Three Questions',
    threeQuestionsDesc: 'Answer these three questions every day to build a simple self-feedback loop.',
    q1: 'What did you do today?',
    q1Placeholder: 'Record specific things you completed today...',
    q2: 'What did you learn today?',
    q2Placeholder: "Today's new insights, skills, perspectives...",
    q3: 'What to improve tomorrow?',
    q3Placeholder: 'One thing you want to change tomorrow...',
    saveReview: 'Save Today\'s Review',
    savedReview: 'Saved ✓',
    historyReview: 'Past Reviews',
    viewAll: 'View All',
    noHistory: 'No past reviews yet. Complete today\'s to see it here.',
    strategyDesc: 'Capture ideas, break down logic, transform concepts into sustainable compounding growth.',
    emptyTitle: 'Awaiting Your Ideas',
    emptyDesc: 'No business ideas recorded yet. Click the top-right button to record your first "side hustle" plan.',
    catchSpark: 'Capture Spark',
    logicSplit: 'Logic Split',
    execute: 'Execute',
    stratCount: 'Strategies Saved',
    stratUnit: 'items',
    lastUpdated: 'Last Updated',
    dayUnit: 'days',
    scoreUnit: 'pts',
    minUnit: 'min',
    waterUnit: 'L',
    meterUnit: 'm',
  },
};

window.SIDEBAR_HTML = `
  <div class="sidebar-inner">
    <div class="sidebar-header">
      <div class="sidebar-date" id="live-date">2026-07-25</div>
      <button id="sign-in-btn" class="btn-primary w-full" data-i18n="signIn">打卡签到</button>
      <div class="sidebar-streak">
        <p><span data-i18n="streak">连续坚持</span>：<span id="streak-count" class="text-primary font-bold">12</span> <span data-i18n="days">天</span></p>
      </div>
    </div>

    <nav class="sidebar-nav">
      <a class="nav-item" data-nav="index.html" href="index.html"><span class="material-symbols-outlined">dashboard</span><span data-i18n-nav="index.html">工作台</span></a>
      <a class="nav-item" data-nav="calendar.html" href="calendar.html"><span class="material-symbols-outlined">calendar_today</span><span data-i18n-nav="calendar.html">日历</span></a>
      <a class="nav-item" data-nav="news.html" href="news.html"><span class="material-symbols-outlined">bolt</span><span data-i18n-nav="news.html">今日热点资讯</span></a>
      <a class="nav-item" data-nav="todos.html" href="todos.html"><span class="material-symbols-outlined">check_circle</span><span data-i18n-nav="todos.html">今日待办</span></a>
      <a class="nav-item" data-nav="favorites.html" href="favorites.html"><span class="material-symbols-outlined">bookmark</span><span data-i18n-nav="favorites.html">收藏夹</span></a>
      <a class="nav-item" data-nav="excerpts.html" href="excerpts.html"><span class="material-symbols-outlined">edit_note</span><span data-i18n-nav="excerpts.html">内容摘录</span></a>
      <a class="nav-item" data-nav="bookshelf.html" href="bookshelf.html"><span class="material-symbols-outlined">menu_book</span><span data-i18n-nav="bookshelf.html">我的书架</span></a>
      <a class="nav-item" data-nav="hydration.html" href="hydration.html"><span class="material-symbols-outlined">water_drop</span><span data-i18n-nav="hydration.html">喝水时间</span></a>
      <a class="nav-item" data-nav="review.html" href="review.html"><span class="material-symbols-outlined">event_available</span><span data-i18n-nav="review.html">今日复盘</span></a>
      <a class="nav-item" data-nav="strategy.html" href="strategy.html"><span class="material-symbols-outlined">payments</span><span data-i18n-nav="strategy.html">搞钱方法</span></a>
      <a class="nav-item" data-nav="mbti.html" href="mbti.html"><span class="material-symbols-outlined">psychology</span><span data-i18n-nav="mbti.html">MBTI人格测试</span></a>
      <a class="nav-item" data-nav="games.html" href="games.html"><span class="material-symbols-outlined">sports_esports</span><span data-i18n-nav="games.html">摸鱼小游戏</span></a>
    </nav>

    <!-- 中英文切换：胶囊形状，active 状态是一小段胶囊，宽度为侧边栏一半 -->
    <div id="lang-toggle" style="position:relative;margin:6px auto 0;padding:2px;width:40%;background:var(--surface-container);border-radius:9999px;display:flex;align-items:center;">
      <div id="lang-slider" style="position:absolute;top:2px;bottom:2px;left:2px;width:calc(50% - 2px);background:var(--primary);border-radius:9999px;transition:transform .25s cubic-bezier(.4,0,.2,1);"></div>
      <button class="lang-btn" data-lang="zh" style="position:relative;z-index:1;flex:1;padding:3px 0;border:none;background:transparent;cursor:pointer;font-size:10px;font-weight:600;color:var(--on-surface-variant);">中</button>
      <button class="lang-btn" data-lang="en" style="position:relative;z-index:1;flex:1;padding:3px 0;border:none;background:transparent;cursor:pointer;font-size:10px;font-weight:600;color:var(--on-surface-variant);">EN</button>
    </div>

    <div class="sidebar-footer" style="position:relative;">
      <p>v1.2.0 · <span class="font-mono">MY WORK</span> · <button id="tip-trigger" style="background:transparent;border:none;padding:0;cursor:pointer;color:var(--on-surface-variant);font:inherit;text-decoration:underline dotted;text-underline-offset:3px;" data-i18n="tip">打赏作者</button></p>
      <!-- 打赏金额选择浮层 -->
      <div id="tip-amount-pop" style="display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:var(--surface);border-radius:var(--r-lg);padding:12px 16px;box-shadow:0 8px 24px rgba(0,0,0,.18);white-space:nowrap;z-index:100;">
        <div style="font-size:11px;color:var(--on-surface-variant);margin-bottom:8px;text-align:center;" data-i18n="chooseAmount">选择金额</div>
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
            <h3 style="font-size:16px;font-weight:600;margin:0;"><span data-i18n="scanTip">扫码打赏</span> <span id="tip-qr-amt"></span></h3>
            <button id="tip-close" style="background:transparent;border:none;cursor:pointer;color:var(--on-surface-variant);padding:4px;"><span class="material-symbols-outlined" style="font-size:20px;">close</span></button>
          </div>
          <img id="tip-qr-img" src="" alt="收款码" style="width:100%;max-width:280px;border-radius:var(--r-md);display:block;margin:0 auto;">
          <p style="font-size:13px;color:var(--on-surface-variant);margin-top:12px;" data-i18n="thanksText">支付宝扫码，感谢支持 🙏</p>
        </div>
      </div>
    </div>
  </div>
`;

window.getCurrentLang = function(){
  try { return localStorage.getItem('monolith.lang') || 'zh'; } catch(e) { return 'zh'; }
};
window.setCurrentLang = function(lang){
  try { localStorage.setItem('monolith.lang', lang); } catch(e) {}
};

window.applyI18N = function(lang){
  lang = lang || window.getCurrentLang();
  const dict = (window.I18N && window.I18N[lang]) || (window.I18N && window.I18N.zh);
  // 普通 key
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    if (dict[k] !== undefined) el.textContent = dict[k];
  });
  // 导航 key（按 data-i18n-nav="xxx.html" 取 nav[key]）
  document.querySelectorAll('[data-i18n-nav]').forEach(el => {
    const key = el.dataset.i18nNav;
    if (dict.nav && dict.nav[key] !== undefined) el.textContent = dict.nav[key];
  });
  // 属性翻译（placeholder / title / aria-label / 等）
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    const spec = el.dataset.i18nAttr; // "placeholder:search|aria-label:search"
    spec.split('|').forEach(pair => {
      const [attr, key] = pair.split(':');
      if (dict[key] !== undefined) el.setAttribute(attr, dict[key]);
    });
  });
  // 语言切换胶囊：高亮选中颜色 + 滑块位置
  document.querySelectorAll('.lang-btn').forEach(b => {
    const isActive = b.dataset.lang === lang;
    b.style.color = isActive ? 'var(--on-primary)' : 'var(--on-surface-variant)';
  });
  const slider = document.getElementById('lang-slider');
  if (slider) slider.style.transform = lang === 'en' ? 'translateX(100%)' : 'translateX(0%)';
  // 通知页面重新渲染（依赖当前语言动态计算的内容，如 tag 标签）
  window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
};

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
  // 绑定打赏 + 语言切换（每次注入都重新绑定）
  bindTipEvents();
  bindLangEvents();
  // 应用当前语言（页面加载时会保留之前的选择）
  window.applyI18N(window.getCurrentLang());
  return true;
};

/* ===== 打赏作者：金额选择 → 收款码弹窗 ===== */
function bindTipEvents(){
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

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    amtPop.style.display = amtPop.style.display === 'none' ? 'block' : 'none';
  });
  document.addEventListener('click', (e) => {
    if (!amtPop.contains(e.target) && e.target !== trigger) amtPop.style.display = 'none';
  });
  document.querySelectorAll('.tip-amount-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const amt = btn.dataset.amt;
      qrImg.src = `assets/images/tip-${amt}.png`;
      const dict = (window.I18N && window.I18N[window.getCurrentLang()]) || {};
      qrAmt.textContent = `${amt}${dict.unit || '元'}`;
      amtPop.style.display = 'none';
      qrModal.style.display = 'flex';
    });
  });
  closeBtn.addEventListener('click', () => { qrModal.style.display = 'none'; });
  qrModal.addEventListener('click', (e) => { if (e.target === qrModal) qrModal.style.display = 'none'; });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (qrModal.style.display === 'flex') qrModal.style.display = 'none';
    else if (amtPop.style.display === 'block') amtPop.style.display = 'none';
  });
}

/* ===== 中英文切换 ===== */
function bindLangEvents(){
  if (window._langBound) return;
  window._langBound = true;
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      window.setCurrentLang(lang);
      window.applyI18N(lang);
    });
  });
}

// DOM ready 时立即注入（保证无闪烁）
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.injectSidebar);
} else {
  window.injectSidebar();
}
