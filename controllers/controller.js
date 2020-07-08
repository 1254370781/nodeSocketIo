// 页面控制器
let db = require('../models/db');

let page = {
    // use路由中间件
    use : async (ctx,next)=> {
        await next();
    },
    // 首页
    index : async ctx=> {
        await ctx.render('index',{
            user: ctx.session.user,
            // online
        })
    },
}

module.exports = page;