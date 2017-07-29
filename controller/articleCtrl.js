var ArticleModel = require('../model/articleModel.js');
var mditor = require('mditor');

module.exports = {
  showArticleAddPage(req, res) { // 展示文章添加页
    // 业务逻辑分析：
    // 1. 在展示添加页面前，先判断当前用户有没有登录，如果没有登录则跳转到登录页；（为什么要判断有没有登录：因为每一篇文章都对应唯一的作者，如果没有登录，就无法获取作者Id）
    if (!req.session.islogin) return res.redirect('/login');
    // 2. 如果检查之后，发现登录了，那么就直接渲染 文章添加页面
    res.render('./article/add', {
      islogin: req.session.islogin,
      user: req.session.user
    });
  },
  addNewArticle(req, res) { // 发表文章
    // 业务逻辑分析：
    //  1. 获取到提交过来的数据   req.body
    var article = req.body;
    article.ctime = new Date();
    //  2. 调用 ArticleModel 中相关的方法，将文章数据保存到数据中
    ArticleModel.addNewArticle(article, (err, results) => {
      if (err || results.affectedRows !== 1) return res.json({ err_code: 1, msg: '发表文章失败！请稍后再试！' });
      // 发表Ok了
      res.json({ err_code: 0, id: results.insertId });
    });
  },
  showInfoPage(req, res) { // 展示详情页
    // 获取提交过来的文章Id
    var id = req.query.id;
    ArticleModel.getArticleById(id, (err, results) => {
      if (err) return res.redirect('/');
      if (results.length !== 1) return res.redirect('/');

      // 创建一个 把 MarkDown 格式解析为 HTML 格式的对象
      var parser = new mditor.Parser();
      // 调用 parse 方法解析
      // var html = parser.parse("** Hello mditor! **");
      results[0].content = parser.parse(results[0].content);
      res.render('./article/info', {
        article: results[0],
        islogin: req.session.islogin,
        user: req.session.user
      });
    });
  },
  showEditPage(req, res) { // 展示文章编辑页面
    // 先判断用户是否登录，如果没有，则直接 跳转到 登录页面
    if (!req.session.islogin) return res.redirect('/login');
    // 业务逻辑分析：
    //  1. 获取到要编辑的这篇文章的id
    ArticleModel.getArticleById(req.query.id, (err, results) => {
      // 如果获取文章数据失败，则直接跳转到项目首页
      if (err) return res.redirect('/');
      if (results.length !== 1) return res.redirect('/');

      // 在展示编辑页面之前，先要确保 登录人的Id 和 当前文章作者id 相同才能渲染页面
      if (req.session.user.id !== results[0].authorId) return res.redirect('/');

      // 展示编辑页面
      res.render('./article/edit', {
        islogin: req.session.islogin,
        user: req.session.user,
        article: results[0]
      });
    });
    //  2. 调用 model 中相关的方法，获取到 这篇文章
    //  3. 展示 编辑页面，并渲染原始的文章数据到页面中
  },
  editArticle(req, res) { // 编辑文章信息
    // 获取提交上来的文章信息
    var article = req.body;
    ArticleModel.editArticle(article, (err, results) => {
      if (err || results.affectedRows !== 1) return res.json({ err_code: 1, msg: '编辑文章失败，请稍后再试！' });
      // 文章编辑成功了：
      res.json({ err_code: 0 });
    });
  }
}