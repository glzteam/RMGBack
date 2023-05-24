const express = require("express");
const mysql = require("mysql");
const md5 = require("./md5.js");
const api = express.Router();

// 建立数据库
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "rmg",
});

// 登录接口
api.get("/login", (req, res) => {
  const queryLogin = "select `password` from `users` where `username`=?";
  const username = req.query.username;
  db.query(queryLogin, [username], (err, results) => {
    if (err) {
      console.log("登录接口出错！", err.message);
      res.send("数据库出错了！");
    }
    if (results[0]) {
      const passwordMD5 = results[0].password;
      const passwordNow = md5(req.query.password);

      if (passwordMD5 === passwordNow) {
        res.send({ err: 2 }); //表示登录成功
      } else {
        res.send({ err: 1 }); // 表示登录失败
      }
    } else {
      res.send({ err: 0 }); // 用户不存在
    }
  });
});

// 注册接口
api.get("/register", (req, res) => {
  const queryExisted = "select count(*) from `users` where `username`=?";
  const username = req.query.username;
  db.query(queryExisted, [username], (err, results) => {
    if (err) {
      console.log("登录接口出错！", err.message);
      res.send("数据库出错了！");
    }
    const isExsited = results[0]["count(*)"]; // 1表示用户存在，0表示不存在
    if (isExsited) {
      res.send({ err: 0 }); // 表示用户已存在，请直接登录
    } else {
      const passwordNow = md5(req.query.password); // md5加密后的密码
      const queryRegister =
        "INSERT INTO `users` (`username`, `nickname`, `password`) VALUES (?, ?, ?)";
      const data = [req.query.username, req.query.nickname, passwordNow];

      db.query(queryRegister, data, (err, results) => {
        if (err) {
          console.log("登录接口出错！", err.message);
          res.send("数据库出错了！");
        } else {
          if (results["affectedRows"]) {
            res.send({ err: 1 }); // 表示注册成功
          } else {
            res.send({ err: 2 }); // 表示注册失败
          }
        }
      });
    }
  });
});

// 获取所有积分接口
api.get("/credits", (req, res) => {
  const querycredits = "select `username`,`nickname`,`credit` from `users`";
  db.query(querycredits, (err, results) => {
    if (err) {
      console.log("登录接口出错！", err.message);
      res.send("数据库出错了！");
    }
    res.send(results);
  });
});

// 获取自己积分接口
api.get("/credit", (req, res) => {
  const querycredit = "select `credit` from `users` where `username`=?";
  db.query(querycredit, req.query.username, (err, results) => {
    if (err) {
      console.log("登录接口出错！", err.message);
      res.send("数据库出错了！");
    }
    res.send(results[0]);
  });
});

// 增加自己积分接口
api.get("/addcredit", (req, res) => {
  const querycredit = "select `credit` from `users` where `username`=?";
  db.query(querycredit, req.query.username, (err, results) => {
    if (err) {
      console.log("登录接口出错！", err.message);
      res.send("数据库出错了！");
    }
    const creditBase = results[0].credit;
    const credit = Number(creditBase) + Number(req.query.credit);
    const queryAddCredit = "update `users` set `credit`=? where `username`=?";
    db.query(
      queryAddCredit,
      [String(credit), req.query.username],
      (err, results) => {
        if (err) {
          console.log("登录接口出错！", err.message);
          res.send("数据库出错了！");
        } else {
          if (Number(results.affectedRows)) {
            res.send({ err: 0 }); // 表示增加成功
          } else {
            res.send({ err: 1 }); // 表示增加失败
          }
        }
      }
    );
  });
});

// 获取自己难度接口
api.get("/difficulty", (req, res) => {
  const queryDifficulty = "select `curdif` from `users` where `username`=?";
  db.query(queryDifficulty, req.query.username, (err, results) => {
    if (err) {
      console.log("登录接口出错！", err.message);
      res.send("数据库出错了！");
    }
    res.send(results[0]);
  });
});

// 增加自己难度接口
api.get("/adddifficulty", (req, res) => {
  const queryDifficulty = "select `curdif` from `users` where `username`=?";
  db.query(queryDifficulty, req.query.username, (err, results) => {
    if (err) {
      console.log("登录接口出错！", err.message);
      res.send("数据库出错了！");
    }
    const difficultyBase = results[0].curdif;
    const difficulty = Number(difficultyBase) + 1;
    const queryAddCredit = "update `users` set `curdif`=? where `username`=?";
    db.query(
      queryAddCredit,
      [String(difficulty), req.query.username],
      (err, results) => {
        if (err) {
          console.log("登录接口出错！", err.message);
          res.send("数据库出错了！");
        } else {
          if (Number(results.affectedRows)) {
            res.send({ err: 0 }); // 表示增加成功
          } else {
            res.send({ err: 1 }); // 表示增加失败
          }
        }
      }
    );
  });
});

// 清空自己难度接口
api.get("/cleardifficulty", (req, res) => {
  const queryClear = "update `users` set `curdif`=? where `username`=?";
  db.query(queryClear, ["1", req.query.username], (err, results) => {
    if (err) {
      console.log("登录接口出错！", err.message);
      res.send("数据库出错了！");
    }
    if (Number(results.affectedRows)) {
      res.send({ err: 0 }); // 表示清空成功
    } else {
      res.send({ err: 1 }); // 表示清空失败
    }
  });
});

module.exports = api;
