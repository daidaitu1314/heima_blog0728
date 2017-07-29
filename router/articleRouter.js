const express = require('express');

var router = express.Router();
// 导入文章 controller
var articleCtrl = require('../controller/articleCtrl.js');

router
  .get('/article/add', articleCtrl.showArticleAddPage) // 展示文章添加页面
  .post('/article/add', articleCtrl.addNewArticle) // 发表新文章
  .get('/article/info', articleCtrl.showInfoPage) // 展示文章详情页面
  .get('/article/edit', articleCtrl.showEditPage) // 展示编辑页面
  .post('/article/edit', articleCtrl.editArticle) // 编辑文章

module.exports = router;