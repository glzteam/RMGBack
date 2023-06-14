const express = require("express");

const router = express.Router(); // 创建路由对象

// 模块导入
const difficultyHandler = require("../router_handler/difficulty.js"); // 路由函数处理
const expressJoi = require("@escook/express-joi"); // 表单验证
const schema = require("../schema/difficulty.js"); // 表单验证的数据定义

// 获取自己的难度
router.get("/get", expressJoi(schema.get_schema), difficultyHandler.get);
// 增加自己的难度
router.post("/add", expressJoi(schema.add_schema), difficultyHandler.add);
// 清空自己的难度
router.post("/clear", expressJoi(schema.clear_schema), difficultyHandler.clear);

// 将路由对象共享出去
module.exports = router;
