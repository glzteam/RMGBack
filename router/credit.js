const express = require("express");

const router = express.Router(); // 创建路由对象

// 模块导入
const creditHandler = require("../router_handler/credit.js"); // 路由函数处理
const expressJoi = require("@escook/express-joi"); // 表单验证
const { get_schema, add_schema } = require("../schema/credit.js"); // 表单验证的数据定义

// 获取所有的积分
router.get("/getall", creditHandler.getall);
// 获取自己的积分
router.get("/getown", expressJoi(get_schema), creditHandler.getown);
// 增加自己的积分
router.post("/add", expressJoi(add_schema), creditHandler.add);

// 将路由对象共享出去
module.exports = router;
