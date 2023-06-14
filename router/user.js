const express = require("express");

const router = express.Router(); // 创建路由对象

// 模块导入
const userHandler = require("../router_handler/user.js"); // 路由函数处理
const expressJoi = require("@escook/express-joi"); // 表单验证
const { register_schema, login_schema } = require("../schema/user.js"); // 表单验证的数据定义

// 注册新用户
router.post("/register", expressJoi(register_schema), userHandler.register);
// 登录
router.post("/login", expressJoi(login_schema), userHandler.login);

// 将路由对象共享出去
module.exports = router;
