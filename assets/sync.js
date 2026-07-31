/**
 * 多端数据同步模块
 *
 * 每次 CRUD 后自动调 save() 推送到后端，页面加载时自动调 load() 拉取最新数据。
 * - 加载时：后端数据有则覆盖 localStorage（比本地旧的才覆盖）
 * - 保存时：把前端所有业务数据打包推送到后端
 *
 * 依赖：
 *   - window.API_CONFIG（api-config.js，提供 dataLoad/dataSave URL）
 *   - window.localStorage
 *   - window.fetch
 */
(function () {
  'use strict';

  const NS = 'monolith.';

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
    if (!data) return;
    // key -> localStorage key 映射
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
    for (const [k, storeKey] of Object.entries(map)) {
      if (data[k] !== undefined) {
        try {
          localStorage.setItem(NS + storeKey,
            typeof data[k] === 'string' ? data[k] : JSON.stringify(data[k]));
        } catch (e) { /* quota exceeded */ }
      }
    }
  }

  // ===== 可以单独保存子段（保存不改动的字段时不传） =====
  // 用法：MyWorkSync.savePartial({ todos: [...] })

  // ===== 认证 =====

  function getToken() {
    try { return localStorage.getItem(NS + 'authToken') || ''; } catch (e) { return ''; }
  }

  function getAPI(name) {
    const cfg = window.API_CONFIG;
    if (!cfg || !cfg.url) return null;
    return cfg.url(name);
  }

  // ===== 公共方法 =====

  /**
   * 从后端拉取数据，合并到 localStorage。
   * 返回后端数据对象，或 null（失败 / 无数据）。
   */
  async function load() {
    const url = getAPI('dataLoad');
    if (!url) { console.warn('[sync] dataLoad URL not configured'); return null; }
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + getToken(),
          'Accept': 'application/json',
        },
      });
      const body = await res.json();
      // 后端返回格式：{ success:true, data: {...}, message: "..." }
      if (body && body.success === true && body.data) {
        mergeToLocal(body.data);
        return body.data;
      } else if (body && body.success === true && body.data === null) {
        // 无同步数据，不覆盖本地
        return null;
      }
      console.warn('[sync] load unexpected response:', body);
      return null;
    } catch (e) {
      console.warn('[sync] load error:', e);
      return null;
    }
  }

  /**
   * 将前端数据推送到后端。
   * @param {object} [fields] 可选：只推送指定字段，如 { todos: [...] }
   *   不传则自动收集所有业务字段全量推送。
   *   后端是部分更新（$set 传入字段），不会覆盖其他设备保存的字段。
   */
  async function save(fields) {
    const url = getAPI('dataSave');
    if (!url) { console.warn('[sync] dataSave URL not configured'); return; }
    const data = fields || collectLocalData();
    try {
      await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + getToken(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      // 后端成功返回 { success:true, message: "..." }
    } catch (e) {
      console.warn('[sync] save error:', e);
    }
  }

  // 暴露全局
  window.MyWorkSync = { load, save, collectLocalData, mergeToLocal };
})();
