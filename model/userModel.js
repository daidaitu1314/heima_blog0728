var connection = require('./baseDb.js');

module.exports = {
  getUserByName(name, callback) { // 根据用户名，查找指定的用户是否存在
    var sqlStr = 'select * from users where username=?';
    connection.query(sqlStr, name, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },
  registerNewUser(user, callback) { // 注册新用户
    var sqlStr = 'insert into users set ?';
    connection.query(sqlStr, user, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },
  login(user, callback) { // 登录
    var sqlStr = 'select * from users where username=? and password=?';
    connection.query(sqlStr, [user.username, user.password], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }
}