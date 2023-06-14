const joi = require("joi");

// 用户名的验证规则
const username = joi.string().alphanum().min(1).max(10).required();

// 获取自己难度规则定义
module.exports.get_schema = {
  query: {
    username,
  },
};

// 增加自己难度规则定义
module.exports.add_schema = {
  body: {
    username,
  },
};

// 清空自己难度规则定义
module.exports.clear_schema = {
  body: {
    username,
  },
};
