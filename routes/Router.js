const router = require('koa-router')();
let controller = require('../controllers/controller');
let user = require('../controllers/userController');

router.use(controller.use)
    .get('/',user.login)    // 默认是登录
    .get('/login',user.login)    // 登录
    .post('/doLogin',user.doLogin)  // 提交登录请求
    .get('/register',user.register)    // 注册
    .post('/doRegister',user.doRegister)  // 提交注册请求
    .get('/index',controller.index)    // 首页

module.exports=router.routes();