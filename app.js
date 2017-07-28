// 入口文件
var express = require('express');
var fs = require('fs');
var path = require('path');
var app = express();

// 配置默认模板引擎
app.set('view engine', 'ejs');
// 设置默认模板页面的存放路径
app.set('views', './views');

// 托管静态资源
app.use('/node_modules', express.static('node_modules'));

// 注册 body-parser 中间件
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// 注册 Session 中间件
var session = require('express-session');
// 使用 app.use 把 Session 中间件注册到 当前的 Web 服务器中去使用
app.use(session({
  secret: '这是加密字符串，随便写！', // 用来生成加密的内容
  resave: false,
  saveUninitialized: false
}));

// 导入首页路由
/* var indexRouter = require('./router/indexRouter.js');
app.use(indexRouter);
// 导入用户路由
var userRouter = require('./router/userRouter.js');
app.use(userRouter); */

/* app.use(require('./router/indexRouter.js'));
app.use(require('./router/userRouter.js')); */

// 需求：实现自动注册路由模块
//  实现思路：
//   1. 使用 fs.readdir 读取 router 文件夹下的所有 路由模块的 名称
//   2. 读取完毕之后，拼接每个路由模块的完整路径
//   3. 拼接出完整的路径之后，forEach 循环，通过 app.use 来注册每一个路由模块
fs.readdir(path.join(__dirname, './router'), (err, filenames) => {
  if (err) throw err;
  filenames.forEach(filename => {
    // 通过 path.join 方法，拼接每一个 路由模块的 绝对路径
    var filePath = path.join(__dirname, './router', filename);
    // 使用 app.use() 注册每一个路由模块
    app.use(require(filePath));
  });
});

app.listen(3003, function () {
  console.log('http://127.0.0.1:3003');
});