const joi = require("joi");

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

// 用户名的验证规则
const username = joi.string().alphanum().min(1).max(10).required();
// 昵称的验证规则
const nickname = joi.string().min(1).max(10).required();
// 密码的验证规则
const password = joi
  .string()
  .alphanum()
  .pattern(/^[\S]{6,12}$/) // 注意和前端匹配
  .required();

// 注册表单的验证规则对象
module.exports.register_schema = {
  body: {
    username,
    nickname,
    password,
  },
};

// 登录表单的验证规则对象
module.exports.login_schema = {
  body: {
    username,
    password,
  },
};
