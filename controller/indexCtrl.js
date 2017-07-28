module.exports = {
  showIndexPage(req, res) { // 渲染首页页面
    res.render('index', {
      islogin:req.session.islogin, // 从 session 中获取用户是否登录
      user: req.session.user // 从 session 中获取用户信息
    });
  }
}