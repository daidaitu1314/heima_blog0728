var moment = require('moment');
moment.locale('zh-cn');
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
  },
  getArticlesByPage(nowPage, pageSize, callback) { // 先获取所有的文章列表，然后在改造成 获取分页
    // var sqlStr = 'select articles.*, users.nickname from articles left join users on articles.authorId=users.id order by ctime desc';
    // 偏移量的算法：  (当前页码值 - 1) * 每页显示几条数据
    var offset = (nowPage - 1) * pageSize;

    var sqlStr = 'select articles.*, users.nickname from articles left join users on articles.authorId=users.id order by ctime desc LIMIT ?, ?; select count(*) AS totalCount from articles;';
    connection.query(sqlStr, [offset, pageSize], (err, results) => {
      if (err) return callback(err);
      console.log(results);
      // 循环文章列表处理时间
      results[0].forEach(item => {
        item.ctime = moment(item.ctime).fromNow();
      });
      callback(null, results);
    });
  }
}