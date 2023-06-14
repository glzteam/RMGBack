const joi = require("joi");

// 用户名的验证规则
const username = joi.string().alphanum().min(1).max(10).required();
// 用户名的验证规则
const credit = joi.string().alphanum().min(1).max(10).required();

// 获取积分规则定义
module.exports.get_schema = {
  query: {
    username,
  },
};
// 增加积分规则定义
module.exports.add_schema = {
  body: {
    username,
    credit,
  },
};
