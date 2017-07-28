var express = require('express');

// 创建用户路由模块
var router = express.Router();
// 导入用户 controller
var userCtrl = require('../controller/userCtrl.js');

router
  .get('/register', userCtrl.showRegisterPage) // 访问注册页面
  .post('/register', userCtrl.registerNewUser) // 注册新用户
  .get('/login', userCtrl.showLoginPage) // 展示登录页面
  .post('/login', userCtrl.login) // 登录
  .get('/logout', userCtrl.logout) // 用户注销登录

module.exports = router;