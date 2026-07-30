/**
 * 前端 API 配置 — FC 3.0 格式
 *
 * 每个函数一个独立子域名，不再走统一 proxy。
 * 格式：https://<func-name>-<hash>.cn-hongkong.fcapp.run
 *
 * ⚠️ 末尾不带斜杠，fetch 拼接时按需加。
 */
(function () {
  'use strict';

  // ★ 5 个 FC 3.0 函数 URL（已部署）
  const ENDPOINTS = {
    register:        'https://register-uhtlnhvmjo.cn-hongkong.fcapp.run',
    login:           'https://login-edkontclwd.cn-hongkong.fcapp.run',
    profileGet:      'https://profile-get-valitdmdpe.cn-hongkong.fcapp.run',
    profileUpdate:   'https://profile-update-yrdtgrqbjn.cn-hongkong.fcapp.run',
    changePassword:  'https://change-password-lithxolwfi.cn-hongkong.fcapp.run',
  };

  function url(name) {
    return ENDPOINTS[name];
  }

  window.API_CONFIG = { ENDPOINTS, url };
})();
