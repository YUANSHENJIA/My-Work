/**
 * 前端鉴权模块
 * - JWT 存 localStorage
 * - fetch 包装自动带 Authorization 头
 * - 统一错误处理
 *
 * 依赖：window.API_CONFIG（由 api-config.js 注入）
 */

(function () {
  'use strict';

  const TOKEN_KEY = 'monolith.authToken';
  const USER_KEY = 'monolith.userInfo';
  const SHOW_PROFILE_FLAG = 'monolith.showProfileOnLoad';

  // ====== Token / 用户信息 ======

  function getToken() {
    try { return localStorage.getItem(TOKEN_KEY); } catch (e) { return null; }
  }
  function setToken(token) {
    try { localStorage.setItem(TOKEN_KEY, token); } catch (e) {}
  }
  function clearToken() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {}
  }
  function getUser() {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function setUser(user) {
    try { localStorage.setItem(USER_KEY, JSON.stringify(user)); } catch (e) {}
  }

  function isLoggedIn() {
    return !!getToken();
  }

  function logout() {
    clearToken();
    // 跳回登录页
    location.replace('login.html');
  }

  // 登录/注册成功后设置「下次进首页要弹资料窗」的标志
  function markShowProfileOnLoad() {
    try { localStorage.setItem(SHOW_PROFILE_FLAG, '1'); } catch (e) {}
  }
  function consumeShowProfileFlag() {
    let v = false;
    try { v = localStorage.getItem(SHOW_PROFILE_FLAG) === '1'; } catch (e) {}
    try { localStorage.removeItem(SHOW_PROFILE_FLAG); } catch (e) {}
    return v;
  }

  // ====== fetch 包装 ======

  /**
   * 通用 fetch：自动处理 JSON、CORS、错误、JWT 注入
   * @param {string} endpointName  api-config.js 里的 key（register/login/...）
   * @param {object} options  { method, body, auth }
   *   - method: GET/POST/PUT/DELETE（默认 GET）
   *   - body:   自动 JSON.stringify
   *   - auth:   true（默认）会自动加 Authorization: Bearer <token>；false 则不带
   */
  async function request(endpointName, options) {
    options = options || {};
    const method = (options.method || 'GET').toUpperCase();
    const headers = Object.assign(
      { 'Content-Type': 'application/json' },
      options.headers || {}
    );

    if (options.auth !== false) {
      const tok = getToken();
      if (tok) headers['Authorization'] = 'Bearer ' + tok;
    }

    const init = { method, headers };
    if (options.body !== undefined && method !== 'GET' && method !== 'HEAD') {
      init.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
    }

    let res;
    try {
      res = await fetch(window.API_CONFIG.url(endpointName), init);
    } catch (e) {
      // 网络层错误（CORS、断网、DNS 等）
      const err = new Error('网络异常，请检查网络后重试');
      err.cause = e;
      throw err;
    }

    let data;
    try {
      data = await res.json();
    } catch (e) {
      throw new Error('服务器响应不是合法 JSON');
    }

    // 业务错误
    if (!res.ok || data.success === false) {
      const msg = (data && data.error) || ('请求失败 (' + res.status + ')');
      const err = new Error(msg);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  }

  // ====== 具体业务封装 ======

  // 同步后端用户资料到 localStorage（让 index.html/profile 等页面能直接读）
  function syncLocalProfile(user) {
    if (!user) return;
    try {
      if (typeof user.name === 'string' && user.name) {
        localStorage.setItem('monolith.userName', user.name);
      }
      if (typeof user.avatar === 'string' && user.avatar) {
        try { localStorage.setItem('monolith.userAvatar', user.avatar); } catch (e) {}
      }
    } catch (e) {}
  }

  async function register(email, password, name) {
    const body = { email, password };
    if (name) body.name = name;
    const data = await request('register', { method: 'POST', body, auth: false });
    setToken(data.token);
    setUser(data.user);
    syncLocalProfile(data.user);
    return data;
  }

  async function login(email, password) {
    const data = await request('login', { method: 'POST', body: { email, password }, auth: false });
    setToken(data.token);
    setUser(data.user);
    syncLocalProfile(data.user);
    return data;
  }

  async function fetchProfile() {
    const data = await request('profileGet', { method: 'GET' });
    if (data && data.user) {
      setUser(data.user);
      syncLocalProfile(data.user);
    }
    return data.user;
  }

  async function updateProfile(payload) {
    const data = await request('profileUpdate', { method: 'PUT', body: payload });
    if (data && data.user) {
      setUser(data.user);
      syncLocalProfile(data.user);
    }
    return data.user;
  }

  async function changePassword(oldPassword, newPassword) {
    return request('changePassword', {
      method: 'POST',
      body: { oldPassword, newPassword },
    });
  }

  // ====== 暴露到全局 ======
  window.Auth = {
    // token / user
    getToken, setToken, clearToken,
    getUser, setUser,
    isLoggedIn, logout,
    // 登录后弹窗标志
    markShowProfileOnLoad, consumeShowProfileFlag,
    // 业务
    register, login, fetchProfile, updateProfile, changePassword,
    // 底层
    request,
  };
})();