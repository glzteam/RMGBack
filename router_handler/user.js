/**
 * 定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */
const db = require("../db/index"); // 数据库操作模块
const bcrypt = require("bcryptjs"); // 密码加密模块
const jwt = require("jsonwebtoken"); // 生成 Token 字符串
const { jwtSecretKey } = require("../config.js"); // Token 秘钥

// 注册用户的处理函数
exports.register = (req, res) => {
  let userinfo = req.body; // 接收表单数据
  let sql = "select * from `users` where `username`=?"; // 定义查询语句
  db.query(sql, [userinfo.username], function (err, results) {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err);
    }
    // 用户名被占用
    if (results.length > 0) {
      return res.cc("用户名被占用，请更换其他用户名！");
    }

    // 密码加密
    userinfo.password = bcrypt.hashSync(userinfo.password, 10);

    // 查询参数
    let data = [userinfo.username, userinfo.nickname, userinfo.password];

    // 查询语句
    let sql =
      "INSERT INTO `users` (`username`, `nickname`, `password`) VALUES (?, ?, ?)";

    db.query(sql, data, function (err, results) {
      // 执行 SQL 语句失败
      if (err) return res.cc(err);

      // SQL 语句执行成功，但影响行数不为 1
      if (results.affectedRows !== 1) {
        return res.cc("注册用户失败，请稍后再试！");
      }

      let user = { username: userinfo.username };
      // JWT字符串
      let tokenStr = jwt.sign(user, jwtSecretKey, {
        expiresIn: "10h", // token 有效期
      });

      // 注册成功
      res.send({
        status: 0,
        message: "注册成功！",
        token: "Bearer " + tokenStr, // JWT字符串
      });
    });
  });
};

// 登录的处理函数
exports.login = (req, res) => {
  // 接受表单数据
  let userinfo = req.body;
  // 查询数据
  let sql = "select * from `users` where `username`=?";
  db.query(sql, userinfo.username, function (err, results) {
    // 执行 SQL 语句失败
    if (err) return res.cc(err);
    // 执行 SQL 语句成功，但是查询到数据条数不等于 1
    if (results.length === 0) return res.cc("用户不存在，请先注册！");

    // 判断密码是否正确
    let compareResult = bcrypt.compareSync(
      userinfo.password,
      results[0].password
    );

    // 如果对比的结果等于 false, 则证明用户输入的密码错误
    if (!compareResult) {
      return res.cc("密码错误！");
    }

    // 生成 Token 字符串
    let user = { ...results[0], password: "", nickname: "" };

    let tokenStr = jwt.sign(user, jwtSecretKey, {
      expiresIn: "10h", // token 有效期
    });

    res.send({
      status: 0,
      message: "登录成功！",
      token: "Bearer " + tokenStr, // JWT字符串
    });
  });
};
