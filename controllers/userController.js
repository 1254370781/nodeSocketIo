let md5 = require('md5-node');  // 编码加密
let db = require('../models/db');

// 后台控制器
let userPage = {
    // 登录
    login : async ctx=> {
        await ctx.render('login');
    },
    // 处理登录请求
    doLogin : async ctx=> {
        let { username,password } = ctx.request.body;
        // 验证账号是否存在
        let user = await db.q('select * from users where username = ?',[username]);
        if (user.length == 0) {
            return ctx.body = {
                code: '002',
                msg: '账号错误!'
            }
        }
        // 验证密码是否正确
        if(user[0].password != md5(password)) {
            return ctx.body = {
                code: '002',
                msg: '密码错误!'
            }
        }
        // 判断是否已经登录
        if(user[0].online == '是') {
            return ctx.body = {
                code: '002',
                msg: '已登录!'
            }
        }
        // 如果上面的验证都正确,则可以登录  登录缓存登录信息
        ctx.session.user = user[0];  // session 缓存
        ctx.body = {
            code: '001',
            msg: '登录成功!',
        }
    },
    // 注册
    register : async ctx=> {
        await ctx.render('register');
    },
    // 处理注册请求
    doRegister : async ctx=> {
        let { username,password } = ctx.request.body;
        // 验证账号是否存在
        let user = await db.q('select * from users where username = ?',[username]);
        if (user.length != 0) {
            return ctx.body = {
                code: '002',
                msg: '账号已注册!'
            }
        }
        //时间和日期
        let dateTime = new Date().toLocaleString('chinese',{hour12:false});
        // 利用时间戳写作stampid
        let sjc = new Date().getTime();
        // 写入数据库
        await db.q('insert into users (username,password,stampid,socketid,online,time) values (?,?,?,?,?,?)',[username,md5(password),sjc,'','否',dateTime]);
        ctx.body = {
            code: '001',
            msg: '登录成功!',
        }
    },
}

module.exports = userPage;