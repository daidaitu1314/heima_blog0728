var moment = require('moment');
var connection = require('./baseDb.js');

module.exports = {
  addNewArticle(article, callback) { // 添加新文章数据
    var sqlStr = 'insert into articles set ?';
    connection.query(sqlStr, article, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },
  getArticleById(id, callback) { // 根据文章Id获取文章的内容
    var sqlStr = 'select articles.*, users.nickname from articles LEFT JOIN users on articles.authorId=users.id where articles.id=?'
    connection.query(sqlStr, id, (err, results) => {
      if (err) return callback(err);
      results.forEach(article => {
        article.ctime = moment(article.ctime).format('YYYY-MM-DD HH:mm:ss');
      });
      callback(null, results);
    });
  },
  editArticle(article, callback) { // 编辑文章信息
    var sqlStr = 'update articles set ? where id=?';
    connection.query(sqlStr, [article, article.id], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }
}