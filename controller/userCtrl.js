// 导入 MD5 第三方加密模块
var md5 = require('blueimp-md5');
// 导入项目的配置文件
var config = require('../config.js');
// 导入操作用户数据的 Model 模块
var UserModel = require('../model/userModel.js');

module.exports = {
  showRegisterPage(req, res) { // 展示注册页面
    res.render('./user/register', {});
  },
  registerNewUser(req, res) { // 注册新用户
    // 1. 获取到提交过来的用户信息   req.body   注册 中间件  叫做 body-parser
    // console.log(req.body);
    var user = req.body;
    // 2. 根据提交过来的用户名，调用相关的 Model 模块，查询此用户名有没有 被注册
    UserModel.getUserByName(user.username, (err, results) => {
      // console.log(err);
      if (err) return res.json({ err_code: 1, msg: '注册失败！' });
      // 判断查询出来的结果，length 如果 等于 0 ，表示 此用户名可用
      if (results.length !== 0) return res.json({ err_code: 1, msg: '此用户名已存在，请更换其他用户名！' });

      // 为了提高密码的安全性，我们需要在 注册新用户之前，先把 用户的密码进行 MD5 加密
      // 在调用 md5() 方法加密的时候，使用两个参数：第一个是用户输的密码；第二个参数是：程序执行的提高安全性的盐
      user.password = md5(user.password, config.pwdSalt);
      UserModel.registerNewUser(user, (err, results) => {
        if (err) return res.json({ err_code: 1, msg: '注册失败！' });
        // 如果影响行数 不为 1，表示注册失败
        if (results.affectedRows !== 1) return res.json({ err_code: 1, msg: '注册失败！' });
        // 注册成功
        res.json({ err_code: 0 });

        /* if (err) {
  
        } else {
          UserModel.registerNewUser(user, (err, results) => {
            if (err) {
  
            } else {
              if (results.affectedRows === 1) {
  
              } else {
  
              }
            }
          });
        } */
      });
    })
    // 3. 如果此用户名被占用了，则提示更换用户名，重新注册
    // 4. 如果数据库中没有这个用户名，可以走后面的注册流程
    // 5. 调用 Model 模块中，注册相关的方法，将提交过来的用户信息，保存到数据库，并提示用户注册OK
  },
  showLoginPage(req, res) { // 展示登录页面
    res.render('./user/login', {});
  },
  login(req, res) { // 用户登录
    // 1. 获取提交过来的登录信息
    var loginUser = req.body;
    // 2. 根据登录信息，调用 Model 模块，查询此用户是否存在
    // 3. 如果存在，返回登录成功，否则返回登录失败
    // 在登录之前，先对用户数的 明文密码 进行加盐处理，然后再去数据库中匹配密码
    loginUser.password = md5(loginUser.password, config.pwdSalt);
    UserModel.login(loginUser, (err, results) => {
      /* if(err) return res.json({err_code:1, msg:'登录失败，请稍后再试！'});
      if(results.length!==1) return res.json({err_code:1, msg:'登录失败，请稍后再试！'}); */

      // 登录失败的情况
      if (err || results.length !== 1) return res.json({ err_code: 1, msg: '登录失败，请稍后再试！' });

      // 在返回登录成功之前，先把登录的状态 和 登录用户的数据，保存到 Session 中
      console.log(req.session);
      // 当注册 Session 中间件 OK之后，只要你能访问到 req 这个对象，那么就能访问到 req.session
      req.session.islogin = true; // 将登录成功的状态，保存到 req.session 中
      req.session.user = results[0]; // 将登录人的 信息对象，保存到 req.session 中

      console.log(req.session);

      // 登录Ok的情况
      res.json({ err_code: 0 });
    });
  },
  logout(req, res) { // 注销登录
    // 分析：登录状态的保持，是通过 Session 技术实现的； 是直接 调用 req.session.*** 来保存的
    /* req.session.islogin = null;
    req.session.user = null; */
    req.session.destroy((err) => {
      if(err) { // 注销失败
        console.log('注销失败！');
        res.redirect('/');
        return;
      }
      console.log('注销成功！');
      res.redirect('/');
    });
  }
}