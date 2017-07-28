// 向外暴露有个公共的数据库连接实例
var mysql = require('mysql');

var connection = mysql.createConnection({
  host:'127.0.0.1',
  user:'root',
  password:'123456',
  database:'heima_blog_0728'
});

module.exports = connection;