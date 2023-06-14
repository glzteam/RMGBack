// 导入 mysql 模块
const mysql = require("mysql");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "rmg",
});

// 向外共享 db 数据库连接对象
module.exports = db;
