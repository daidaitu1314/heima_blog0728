// 向外暴露有个公共的数据库连接实例
var mysql = require('mysql');

// 注意： 第三方的 mysql 模块。默认没有开启执行多条 Sql 语句的功能，所以，我们执行多条语句时候会报错；
// 如果要开启多条语句的功能，需要设置一下 配置对象
var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'heima_blog_0728',
  multipleStatements: true // 开启执行多条Sql语句的功能
});

module.exports = connection;