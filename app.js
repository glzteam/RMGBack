const express = require("express");
const cors = require("cors");
const { expressjwt: jwt } = require("express-jwt"); // JWT验证模块
const { jwtSecretKey } = require("./config.js");

const app = express(); // 实例化

app.use(cors()); // 跨域
app.use(express.urlencoded({ extended: false })); // 解析表单数据
app.use(
  jwt({ secret: jwtSecretKey, algorithms: ["HS256"] }).unless({
    path: [/^\/user\//],
  })
); // JWT身份认证

// 中间件：发送响应数据
app.use(function (req, res, next) {
  /**
   * 发送响应数据
   * @param {*} err 错误对象或错误消息
   * @param {*} status 0 为成功; 1 为失败
   */
  res.cc = function (err, status = 1) {
    res.send({
      // 状态
      status,
      // 状态描述，判断 err 是 错误对象 还是 字符串
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

// 管理路由模块
const userRouter = require("./router/user.js");
const creditRouter = require("./router/credit.js");
const difficultyRouter = require("./router/difficulty.js");
app.use("/user", userRouter);
app.use("/credit", creditRouter);
app.use("/difficulty", difficultyRouter);

// 验证失败处理函数
const joi = require("joi");

// 失败处理中间件
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.send({ status: 401, message: "无效的 token" });
  }
  if (err instanceof joi.ValidationError) {
    return res.cc(err);
  }
  res.cc(err); // 未知错误
});

// 启动服务器
app.listen(85, () => {
  console.log("server running at http://127.0.0.1:85");
});
