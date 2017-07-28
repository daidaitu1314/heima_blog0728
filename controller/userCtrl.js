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
    UserModel.login(loginUser, (err, results) => {
      /* if(err) return res.json({err_code:1, msg:'登录失败，请稍后再试！'});
      if(results.length!==1) return res.json({err_code:1, msg:'登录失败，请稍后再试！'}); */

      // 登录失败的情况
      if (err || results.length !== 1) return res.json({ err_code: 1, msg: '登录失败，请稍后再试！' });

      // 登录Ok的情况
      res.json({ err_code: 0 });
    });
  }
}