/**
 * 前端 API 配置
 *
 * 把下面 FC_BASE_URL 改成你部署完成后 FC 给的基地址。
 * 格式：https://<service>-<hash>.<region>.fc.aliyuncs.com/2016-08-15/proxy/<service>/
 *
 * 例如：
 *   https://mywork-api.123456789.cn-hongkong.fc.aliyuncs.com/2016-08-15/proxy/mywork-api/
 *
 * ⚠️ 末尾必须有斜杠 /，fetch 拼接时不会重复加。
 */
(function () {
  'use strict';

  // ★ 部署 FC 后，把这个常量改成实际的 FC 默认域名
  // 临时本地调试时可填 'http://localhost:3000' 之类
  const FC_BASE_URL = 'https://mywork-api.REPLACE_ME.fc.cn-hongkong.aliyuncs.com/2016-08-15/proxy/mywork-api/';

  // 各个函数的路径
  const ENDPOINTS = {
    register: 'register/',
    login: 'login/',
    profileGet: 'profile-get/',
    profileUpdate: 'profile-update/',
    changePassword: 'change-password/',
  };

  function url(name) {
    return FC_BASE_URL + ENDPOINTS[name];
  }

  window.API_CONFIG = { FC_BASE_URL, ENDPOINTS, url };
})();