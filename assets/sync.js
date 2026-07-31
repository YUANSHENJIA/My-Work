/**
 * 多端数据同步模块 v2
 *
 * - 页面加载时自动从后端拉取最新数据合并到 localStorage
 * - CRUD 后调用 save() 把变更推送到后端
 * - 监听 localStorage 变化，实现同一浏览器多标签实时同步
 * - 页面重新可见时自动拉取（从后台切回时）
 * - 暴露状态与事件，方便页面做视觉反馈
 *
 * 依赖：
 *   - window.API_CONFIG（api-config.js，提供 dataLoad/dataSave URL）
 *   - window.localStorage
 *   - window.fetch
 */
(function () {
  'use strict';

  const NS = 'monolith.';

  // ===== 配置 =====
  const SYNC_INTERVAL_MS = 30 * 1000;          // 标签常驻时定期拉取间隔
  const VISIBILITY_DEBOUNCE_MS = 800;          // 切回页面后防抖拉取

  // ===== 状态（页面可读取） =====
  const status = {
    lastLoadAt: 0,          // 最近一次成功拉取时间戳
    lastSaveAt: 0,          // 最近一次成功推送时间戳
    loading: false,         // 是否正在拉取
    saving: false,          // 是否正在推送
    error: null,            // 最近一次错误信息
    hasToken: false,        // 当前是否有 token
    enabled: false,         // 是否启用（有 token 且 API 配置正常）
  };

  // ===== 本地数据收集 / 写入 =====

  function collectLocalData() {
    const data = {};
    try { data.todos = JSON.parse(localStorage.getItem(NS + 'todos') || '[]'); } catch (e) { data.todos = []; }
    try { data.excerpts = JSON.parse(localStorage.getItem(NS + 'excerpts') || '[]'); } catch (e) { data.excerpts = []; }
    try { data.favorites = JSON.parse(localStorage.getItem(NS + 'favorites') || '[]'); } catch (e) { data.favorites = []; }
    try { data.waterLog = JSON.parse(localStorage.getItem(NS + 'waterLog') || '[]'); } catch (e) { data.waterLog = []; }
    try { data.waterGoal = parseInt(localStorage.getItem(NS + 'waterGoal') || '2000', 10); } catch (e) { data.waterGoal = 2000; }
    try { data.waterInterval = parseInt(localStorage.getItem(NS + 'waterInterval') || '30', 10); } catch (e) { data.waterInterval = 30; }
    try { data.books = JSON.parse(localStorage.getItem(NS + 'books') || '[]'); } catch (e) { data.books = []; }
    try { data.reviews = JSON.parse(localStorage.getItem(NS + 'reviews') || '[]'); } catch (e) { data.reviews = []; }
    return data;
  }

  function mergeToLocal(data) {
    if (!data) return { changed: false };
    const map = {
      todos: 'todos',
      excerpts: 'excerpts',
      favorites: 'favorites',
      waterLog: 'waterLog',
      waterGoal: 'waterGoal',
      waterInterval: 'waterInterval',
      books: 'books',
      reviews: 'reviews',
    };
    let changed = false;
    for (const [k, storeKey] of Object.entries(map)) {
      if (data[k] !== undefined) {
        try {
          const value = typeof data[k] === 'string' ? data[k] : JSON.stringify(data[k]);
          const old = localStorage.getItem(NS + storeKey);
          if (old !== value) {
            localStorage.setItem(NS + storeKey, value);
            changed = true;
          }
        } catch (e) { /* quota exceeded */ }
      }
    }
    return { changed };
  }

  // ===== 认证 / API =====

  function getToken() {
    try { return localStorage.getItem(NS + 'authToken') || ''; } catch (e) { return ''; }
  }

  function updateStatus() {
    const token = getToken();
    status.hasToken = !!token;
    status.enabled = status.hasToken && !!getAPI('dataLoad') && !!getAPI('dataSave');
  }

  function getAPI(name) {
    const cfg = window.API_CONFIG;
    if (!cfg || typeof cfg.url !== 'function') return null;
    return cfg.url(name);
  }

  // ===== 事件通知 =====

  function dispatch(name, detail) {
    try {
      window.dispatchEvent(new CustomEvent(name, { detail: detail || {} }));
    } catch (e) {}
  }

  // ===== 公共方法 =====

  /**
   * 从后端拉取数据，合并到 localStorage。
   * 返回 { ok:true, data:{...}, changed:true|false } 或 { ok:false, error:'...' }
   */
  async function load() {
    updateStatus();
    if (!status.enabled) {
      const reason = !status.hasToken ? '未登录' : 'API 未配置';
      return { ok: false, error: reason };
    }

    const url = getAPI('dataLoad');
    status.loading = true;
    status.error = null;
    dispatch('sync:loading');

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + getToken(),
          'Accept': 'application/json',
        },
      });
      const body = await res.json();

      if (body && body.success === true && body.data) {
        const { changed } = mergeToLocal(body.data);
        status.lastLoadAt = Date.now();
        status.error = null;
        const result = { ok: true, data: body.data, changed };
        dispatch('sync:loaded', result);
        return result;
      } else if (body && body.success === true && body.data === null) {
        status.lastLoadAt = Date.now();
        status.error = null;
        const result = { ok: true, data: null, changed: false };
        dispatch('sync:loaded', result);
        return result;
      }

      const err = body && body.error ? body.error : '未知响应格式';
      status.error = err;
      console.warn('[sync] load unexpected response:', body);
      return { ok: false, error: err };
    } catch (e) {
      status.error = e.message || '网络错误';
      console.warn('[sync] load error:', e);
      return { ok: false, error: status.error };
    } finally {
      status.loading = false;
      dispatch('sync:status', status);
    }
  }

  /**
   * 将前端数据推送到后端。
   * @param {object} [fields] 可选：只推送指定字段，如 { todos: [...] }
   *   不传则自动收集所有业务字段全量推送。
   */
  async function save(fields) {
    updateStatus();
    if (!status.enabled) {
      const reason = !status.hasToken ? '未登录' : 'API 未配置';
      return { ok: false, error: reason };
    }

    const url = getAPI('dataSave');
    const data = fields || collectLocalData();
    status.saving = true;
    status.error = null;
    dispatch('sync:saving');

    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + getToken(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const body = await res.json();

      if (body && body.success === true) {
        status.lastSaveAt = Date.now();
        status.error = null;
        const result = { ok: true };
        dispatch('sync:saved', result);
        return result;
      }

      const err = body && body.error ? body.error : '保存失败';
      status.error = err;
      console.warn('[sync] save failed:', body);
      return { ok: false, error: err };
    } catch (e) {
      status.error = e.message || '网络错误';
      console.warn('[sync] save error:', e);
      return { ok: false, error: status.error };
    } finally {
      status.saving = false;
      dispatch('sync:status', status);
    }
  }

  // ===== 自动同步策略 =====

  let visibilityTimer = null;
  let syncTimer = null;

  function startAutoSync() {
    if (syncTimer) return;
    syncTimer = window.setInterval(() => {
      // 仅在页面可见且没有正在进行的操作时才拉取
      if (document.visibilityState === 'visible' && !status.loading && !status.saving) {
        load();
      }
    }, SYNC_INTERVAL_MS);
  }

  function stopAutoSync() {
    if (syncTimer) {
      window.clearInterval(syncTimer);
      syncTimer = null;
    }
  }

  function onVisibilityChange() {
    if (document.visibilityState !== 'visible') return;
    updateStatus();
    if (!status.enabled) return;
    if (visibilityTimer) window.clearTimeout(visibilityTimer);
    visibilityTimer = window.setTimeout(() => {
      load();
    }, VISIBILITY_DEBOUNCE_MS);
  }

  function onStorageChange(e) {
    // 只关心 monolith. 业务数据键的变化
    if (!e.key || !e.key.startsWith(NS)) return;
    // 忽略 token/主题/语言等非业务键
    const businessKeys = [
      NS + 'todos', NS + 'excerpts', NS + 'favorites',
      NS + 'waterLog', NS + 'waterGoal', NS + 'waterInterval',
      NS + 'books', NS + 'reviews'
    ];
    if (!businessKeys.includes(e.key)) return;
    dispatch('sync:localchange', { key: e.key, newValue: e.newValue, oldValue: e.oldValue });
  }

  // ===== 初始化 =====

  function init() {
    updateStatus();
    if (status.enabled) {
      startAutoSync();
      document.addEventListener('visibilitychange', onVisibilityChange);
    }
    window.addEventListener('storage', onStorageChange);
  }

  // 页面加载时如果已登录，自动拉取一次
  init();
  if (status.enabled) {
    load();
  }

  // 暴露全局
  window.MyWorkSync = {
    load,
    save,
    collectLocalData,
    mergeToLocal,
    status,
    hasToken: () => !!getToken(),
    isEnabled: () => status.enabled,
  };
})();
