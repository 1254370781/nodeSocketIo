// 引入数据库
var mysql = require('mysql');
// 操作路径
const path = require('path');
// 创建连接池,使用的时候,getConnection  施放连接回池子的时候release
var pool  = mysql.createPool({
    // uploadDir:path.join(__dirname,'public/upload'),   //文件上传或图片上传的绝对路径   配置koa-formidable的上传路径的
    //   // mysql默认端口3306
    //   // oracle默认端口1521
    //   // sqlserver 1433
    connectionLimit : 10,           // 连接限制
    host            : 'localhost',  // 数据库地址
    user            : 'root',       // 数据库用户
    password        : 'root',       // 数据库密码
    database        : 'nodeSocketIo',  // 数据库名称
    timezone        : "08:00"       // 配置数据库时间
});

let db = {};
// 封装了mysql查询的功能
db.q = (sql,params) =>{
    return new Promise((resolve,reject)=>{
          pool.getConnection(function(err, connection) {
          // 使用连接  params参数是数组
          connection.query(sql,params, (error, results) => {
            // 释放连接
            connection.release();
            // console.log(sql,params,results);
            if (error) return reject(err);
            // 成功传递数据
            resolve(results);
          });
        });
    });
}

// 导出db对象
module.exports = db; 