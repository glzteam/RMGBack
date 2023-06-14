// 模块导入
const db = require("../db/index"); // 数据库操作模块

// 获取所有积分
exports.getall = (req, res) => {
  let sql = "select `nickname`,`credit` from `users`";
  db.query(sql, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err);
    res.send({
      status: 0,
      data: results,
    });
  });
};

// 获取自己积分
exports.getown = (req, res) => {
  let sql = "select `credit` from `users` where `username`=?";
  db.query(sql, req.query.username, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err);

    // 用户未注册
    if (results.length === 0) return res.cc("该用户未注册！");

    // 查询成功
    res.send({
      status: 0,
      data: results[0],
    });
  });
};

// 增加自己的积分
exports.add = (req, res) => {
  let sql = "select `credit` from `users` where `username`=?";
  db.query(sql, req.body.username, (err, results) => {
    if (err) return res.cc(err);

    if (results.length === 0) return res.cc("该用户未注册！");

    let creditBase = results[0].credit; // 获取原积分
    let credit = Number(creditBase) + Number(req.body.credit); // 增加积分

    let sql = "update `users` set `credit`=? where `username`=?"; // 更新数据
    db.query(sql, [String(credit), req.body.username], (err, results) => {
      if (err) return res.cc(err);

      if (Number(results.affectedRows)) {
        res.cc(`积分 + ${req.body.credit}`, 0); // 表示增加成功
      } else {
        res.cc("积分增加失败！"); // 表示增加失败
      }
    });
  });
};
