var express = require('express');

// 创建用户路由模块
var router = express.Router();

router
  .get('/register', (req, res) => { // 访问注册页面
    res.render('./user/register', {});
  })

module.exports = router;