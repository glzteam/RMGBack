// 模块导入
const db = require("../db/index"); // 数据库操作模块

// 获取自己的难度
exports.get = (req, res) => {
  const sql = "select `curdif` from `users` where `username`=?";
  db.query(sql, req.query.username, (err, results) => {
    if (err) return res.cc(err);

    if (results.length === 0) return res.cc("该用户不存在！");

    res.send({
      status: 0,
      data: results[0],
    });
  });
};

// 增加自己的难度
exports.add = (req, res) => {
  const sql = "select `curdif` from `users` where `username`=?";
  db.query(sql, req.body.username, (err, results) => {
    if (err) return res.cc(err);

    if (results.length === 0) return res.cc("该用户未注册！");

    const difficultyBase = results[0].curdif;
    const difficulty = Number(difficultyBase) + 1;
    const sql = "update `users` set `curdif`=? where `username`=?";

    db.query(sql, [String(difficulty), req.body.username], (err, results) => {
      if (err) return res.cc(err);

      if (Number(results.affectedRows)) {
        res.cc(`难度 + 1`, 0); // 表示增加成功
      } else {
        res.cc("难度增加失败！"); // 表示增加失败
      }
    });
  });
};

// 清空自己的难度
exports.clear = (req, res) => {
  const sql = "select `curdif` from `users` where `username`=?";
  db.query(sql, req.body.username, (err, results) => {
    if (err) return res.cc(err);

    if (results.length === 0) return res.cc("该用户未注册！");

    const sql = "update `users` set `curdif`=? where `username`=?";

    db.query(sql, ["1", req.body.username], (err, results) => {
      if (err) return res.cc(err);

      if (Number(results.affectedRows)) {
        res.cc(`难度重置`, 0); // 表示清空成功
      } else {
        res.cc("难度重置失败！"); // 表示清空失败
      }
    });
  });
};
