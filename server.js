const path = require('path');
const koa = require('koa'); // koa
const router = require('koa-router')(); // 路由
const static = require('koa-static');   // 处理静态资源
const render = require('koa-art-template');   // 处理客户端数据
const favicon = require('koa-favicon');  // 处理 favicon.ico 404
const formidable = require('koa-formidable'); // 处理上传的图片文件
const compress = require('koa-compress');   // 数据压缩
const session = require('koa-session');  // 处理session
const IO = require( 'koa-socket' );
const db = require('./models/db');

let app = new koa();
// 通信
const io = new IO()
io.attach(app);

// 链接触发
io.on('connection', async ( context ) => {
    console.log('链接上了一个');
    // 链接后服务端返回给客户端index的内容是  我是服务器来的
    io.broadcast('index','服务器:链接成功');
});

// 处理登陆同步信息
io.on('login', async context => {
    console.log('login');
    // 同步传过来的当前自己id
    let { id } = context.data;
    // socketid
    let socketid = context.socket.socket.id;
    // 修改数据表的socketid 和上线状态
    await db.q('update users set socketid = ?,online = ? where id = ?',[socketid,'是', id]);
    // 查询个人聊天有谁上线
    let chatData = await db.q(' select * from users where online = ?',['是']);
    // 查询群组列表
    let groupData = await db.q(' select * from groups ');
    // 查询每个群的群成员
    if (groupData.length != 0) {
        for (let i = 0; i < groupData.length; i++) {
            let groupPeople = await db.q( 'select * from grouppeople where uid = ?',[groupData[i].id] );
            groupData[i].groupPeople = groupPeople;
        }
    }
    // console.log(groupData);
    // 操作入群
    let stampid = await db.q('select stampid from users where socketid = ?',[socketid]);
    let groupid = await db.q('select groupid from grouppeople where stampid = ?',[stampid[0].stampid]);
    // console.log(stampid,groupid);
    for (let w = 0; w < groupid.length; w++) {
        context.socket.socket.join(groupid[w].groupid);
    }
    // context.socket.socket.join('1594004891145');
    // 登录同步个人在线列表和群列表
    io.broadcast('online',{
        // 个人聊天列表
        chatData,
        // 群组列表
        groupData,
        socketid
    });
});

// 私聊
// 1、点击聊天 获取历史聊天记录
io.on('getChatRecord',async context=> {
    // 客户端传过来被私聊者的Socketid
    let { privateChatSocketid } = context.data;  
    // 我的socketid 
    let meSocketid = context.socket.socket.id;

    // 私聊人的stampid
    let mename = await db.q( 'select username,stampid from users where socketid = ?',[meSocketid] );
    // 被私聊人的stampid
    let youname = await db.q( 'select stampid from users where socketid = ?',[privateChatSocketid] );
    // 查询是否有聊天记录
    let chatname = await db.q( 'select * from chat where title in(?,?)',[`${mename[0].stampid}-${youname[0].stampid}`,`${youname[0].stampid}-${mename[0].stampid}`] );
    // 返回当前客户端的内容
    let meChatData;
    if (chatname.length == 0) {
        // 广播回我的客户端
        app._io.to(meSocketid).emit('returnGetChatRecord',{
            msg:'没有聊天记录',
            code: '002',
            meChatData:[]
        });
    }else {
        // 查询属于当前的uid 利用uid查询聊天记录
        let uid = await db.q( 'select id from chat where title = ?',[`${chatname[0].title}`] );
        // 再查询所有聊天内容
        let data = await db.q('select * from chatdata where uid = ?',[uid[0].id]);
        // 复制一份聊天记录
        meChatData = JSON.parse(JSON.stringify(data));
        // 修改  私聊者的返回内容
        for (let j = 0; j < meChatData.length; j++) {
            if (meChatData[j].title == mename[0].stampid) {
                meChatData[j].chat = 1;
            }else {
                meChatData[j].chat = 0;
            }
        }
        // 广播回我的客户端
        app._io.to(meSocketid).emit('returnGetChatRecord',{
            msg:'成功！',
            code: '001',
            meChatData
        });
    }
});
//2、接受客户端privateChat传过来的内容
io.on('privateChat',async context => {
    //  客户端传过来的私聊内容和被私聊者的Socketid
    let { value, privateChatSocketid } = context.data;
    // 我的socketid
    let meSocketid = context.socket.socket.id;
    //时间和日期
    let updatetime = new Date().toLocaleString('chinese',{hour12:false});
    // 查询各自私有的stampid
    // 私聊人的stampid
    let mename = await db.q( 'select username,stampid from users where socketid = ?',[meSocketid] );
    // 被私聊人的stampid
    let youname = await db.q( 'select username,stampid from users where socketid = ?',[privateChatSocketid] );
    // 查询是否有这个title
    let chatname;
    chatname = await db.q( 'select * from chat where title in(?,?)',[`${mename[0].stampid}-${youname[0].stampid}`,`${youname[0].stampid}-${mename[0].stampid}`] );
    if(chatname.length == 0) {
        // 如果没有 则添加储存到数据库
        await db.q('insert into chat (title,updatetime) values (?,?)',[`${mename[0].stampid}-${youname[0].stampid}`,updatetime]);
        // 重新查询
        chatname = await db.q( 'select * from chat where title in(?,?)',[`${mename[0].stampid}-${youname[0].stampid}`,`${youname[0].stampid}-${mename[0].stampid}`] );
    }
    // console.log(chatname)
    // 查询属于当前的uid 利用uid查询聊天记录
    let uid = await db.q( 'select id from chat where title = ?',[`${chatname[0].title}`] );
    // 储存信息  利用私聊人的stampid分辨
    await db.q('insert into chatdata (name,title,uid,content,updatetime) values (?,?,?,?,?)',[mename[0].username,mename[0].stampid,uid[0].id,value,updatetime]);
    // 再查询所有聊天内容
    let data = await db.q('select * from chatdata where uid = ?',[uid[0].id]);
    // 复制一份聊天记录,返回被私聊者内容
    let privateChatData;
    privateChatData = JSON.parse(JSON.stringify(data));
    //复制一份聊天记录,返回私聊者的内容
    let meChatData;
    meChatData = JSON.parse(JSON.stringify(data));
    // 如果是自己发的聊天内容  则chat是1  对方发的chat则是0
    // 修改被私聊者的返回内容
    for (let i = 0; i < privateChatData.length; i++) {
        if (privateChatData[i].title == mename[0].stampid) {
            privateChatData[i].chat = 0;
        }else {
            privateChatData[i].chat = 1;
        }
    }
    // 修改  私聊者的返回内容
    for (let j = 0; j < meChatData.length; j++) {
        if (meChatData[j].title == mename[0].stampid) {
            meChatData[j].chat = 1;
        }else {
            meChatData[j].chat = 0;
        }
    }
    // 广播回被私聊人的客户端
    app._io.to(privateChatSocketid).emit('returnPrivateChat',{
        msg:'成功！',
        chatName: mename[0].username,
        code: '001',
        privateChatData
    });
    // 广播回我的客户端
    app._io.to(meSocketid).emit('returnPrivateChat',{
        msg:'成功！',
        chatName: youname[0].username,
        code: '001',
        meChatData
    });
    // console.log(meChatData,privateChatData,data);
});


// 群聊
// 1、创建群
io.on('buildGroup', async context => {
    // 群的名称
    let { value } = context.data;
    // 自己的socketid
    let socketid = context.socket.socket.id;
    // 时间戳
    let sjc = new Date().getTime();
    //时间和日期
    let updatetime = new Date().toLocaleString('chinese',{hour12:false});
    // 利用socketid，查询自己的信息
    let user = await db.q( 'select * from users where socketid = ?',[socketid] );
    // console.log(user);
    // 储存
    await db.q('insert into groups (name, groupleader, groupstampid, joins, groupid, updatetime) values (?,?,?,?,?,?)',[value, user[0].username, user[0].stampid, '是', sjc, updatetime]);
    // 查询刚才储存的群，拿id，作为uid
    let groupUser = await db.q( 'select groupid,id from groups where name = ?',[value] )
    // 因为自己是群主，自动把自己存入到群人员表中
    await db.q('insert into grouppeople (name, stampid, groupid, uid, updatetime) values (?,?,?,?,?)',[user[0].username, user[0].stampid, groupUser[0].groupid, groupUser[0].id, updatetime]);
    // 使用当前groupshat加入群组
    context.socket.socket.join(groupUser[0].groupid);
    // 查询所有群列表，返回客户端更新
    let groupData = await db.q( 'select * from groups');
    // 查询每个群的群成员
    if (groupData.length != 0) {
        for (let i = 0; i < groupData.length; i++) {
            let groupPeople = await db.q( 'select * from grouppeople where uid = ?',[groupData[i].id] );
            groupData[i].groupPeople = groupPeople;
        }
    }
    io.broadcast('groupList',{
        msg:'成功！',
        code: '001',
        groupData
    });
    // console.log(value,socketid);
});
// 2、加入群聊
io.on('groupJoin',async context => {
    // 群的私有id
    let { groupid } = context.data;
    // 本人的socketid
    let socketid = context.socket.socket.id;
    //时间和日期
    let updatetime = new Date().toLocaleString('chinese',{hour12:false});
    // 使用当前groupshat加入群组
    context.socket.socket.join(groupid);
    // 查询群的信息
    let user = await db.q( 'select * from groups where groupid = ?', [groupid]);
    // 查询自己的信息
    let meuser = await db.q( 'select * from users where socketid = ?', [socketid]);
    // 储存
    await db.q('insert into grouppeople (name, stampid, groupid, uid, updatetime) values (?,?,?,?,?)',[meuser[0].username, meuser[0].stampid, user[0].groupid, user[0].id, updatetime]);
    // 查询所有群列表，返回客户端更新
    let groupData = await db.q( 'select * from groups');
    // 查询每个群的群成员
    if (groupData.length != 0) {
        for (let i = 0; i < groupData.length; i++) {
            groupData[i].groupPeople = await db.q( 'select * from grouppeople where uid = ?',[groupData[i].id] );
        }
    }
    io.broadcast('groupJoinList',{
        msg:'成功！',
        code: '001',
        groupData
    });
    // console.log(user,meuser);
});
// 退出群
io.on('groupSign',async context => {
    // 群的私有id
    let { groupid,inner } = context.data;
    // 本人的socketid
    let socketid = context.socket.socket.id;
    //时间和日期
    let updatetime = new Date().toLocaleString('chinese',{hour12:false});
    // 查询群的信息
    let user = await db.q( 'select id from groups where groupid = ?', [groupid]);
    // 查询自己的信息
    let meuser = await db.q( 'select * from users where socketid = ?', [socketid]);
    if(inner == '退群') {
        // 如果是退群,则删除群列表自己的信息
        await db.q('delete from grouppeople where uid = ? and stampid = ?',[user[0].id,meuser[0].stampid]);
        // 删除群自己的聊天记录
        await db.q('delete from groupdata where uid = ? and title = ?',[user[0].id,meuser[0].stampid]);
    }else {
        // 如果是解散群,则删除群成员和群信息
        await db.q('delete from grouppeople where uid = ?',[user[0].id]);
        await db.q('delete from groups where id = ?',[user[0].id]);
        // 删除群的所有聊天记录
        await db.q('delete from groupdata where uid = ?',[user[0].id]);
    }
    // 查询所有群列表，返回客户端更新
    let groupData = await db.q( 'select * from groups');
    // 查询每个群的群成员
    if (groupData.length != 0) {
        for (let i = 0; i < groupData.length; i++) {
            groupData[i].groupPeople = await db.q( 'select * from grouppeople where uid = ?',[groupData[i].id] );
        }
    }
    io.broadcast('groupSignList',{
        msg:'成功！',
        code: '001',
        groupData
    });
});
// 选择群聊天，返回群的人员列表
io.on('groupChat',async context=>{
    // 接收客户端传过来的群唯一标识
    let { groupshat } = context.data;
    // 本人的socketid
    let socketid = context.socket.socket.id;
    // 查询群里面的群人员
    let groupList = await db.q( 'select name,uid from grouppeople where groupid = ?',[groupshat] );
    // 查询群的聊天记录
    let data = await db.q( 'select * from groupdata where uid = ?',[groupList[0].uid] );
    app._io.to(socketid).emit('getGroupChat',{
        msg:'成功！',
        code: '001',
        groupList,
        data
    });
});
// 提交群聊天
io.on('proupChat', async context=> {
    // 客户端传过来的value:内容、groupshat：哪个群
    let { value, groupshat } = context.data;
    console.log(value, groupshat);
    // 获取发信息的唯一标识socketid
    let socketid = context.socket.socket.id;
    //时间和日期
    let updatetime = new Date().toLocaleString('chinese',{hour12:false});
    // 根据socketid查询自己的信息
    let user = await db.q( 'select * from users where socketid = ?',[socketid] );
    // 查询群的信息
    let groups = await db.q( 'select * from groups where groupid = ?',[groupshat] );
    // 储存信息
    await db.q('insert into groupdata (name,title,uid,content,updatetime) values (?,?,?,?,?)',[user[0].username,user[0].stampid,groups[0].id,value,updatetime]);
    // 再查询群所有聊天内容
    let data = await db.q('select * from groupdata where uid = ?',[groups[0].id]);
    // 广播回客户端,同群的都会收到
    app._io.to(groupshat).emit('getProupChat',{
        msg:'成功！',
        groupName: groups[0].name,
        code: '001',
        data
    });
});
// 公屏聊天
io.on('sendChat', async context=> {
    // 客户端传过来的聊天内容
    let { value } = context.data;
    // 获取发信息的唯一标识socketid
    let socketid = context.socket.socket.id;
    //时间和日期
    let updatetime = new Date().toLocaleString('chinese',{hour12:false});
    // 查询退出的socketid信息
    let user = await db.q(' select * from users where socketid = ?',[socketid]);
    // 储存信息
    await db.q('insert into senddata (name,title,uid,content,updatetime) values (?,?,?,?,?)',[user[0].username,user[0].stampid,user[0].id,value,updatetime]);
    // 再查询群所有聊天内容
    let data = await db.q('select * from senddata');
    // 广播给所有人
    io.broadcast('allSendChat',{
        msg:'成功！',
        code: '001',
        data
    });
});

// 断开链接触发
io.on('disconnect', async (context) => {
    console.log('断开了一个');
    // 获取到退出的socketid  更改online
    let socketid = context.socket.socket.id;
    // 查询退出的socketid信息
    let overId = await db.q(' select * from users where socketid = ?',[socketid]);
    // console.log(overId);
    if(overId.length !=0) {
        // 更改在线状态
        await db.q('update users set online = ?,socketid = ? where socketid = ?',['否','',socketid]);
    }
    // 再次查询在线人数  返回客户端
    let chatData = await db.q( 'select * from users where online = ?',['是']);
    // console.log(data);
    io.broadcast('online',{
        chatData
    });
});


// 处理客户端数据
render(app,{
    // 配置目录,后缀名,是否是调试模式(我们的机器一般都是true)
    // 调试模式: 不压缩代码,实时更新html的静态内容(每次都读文件)
    root: path.join(__dirname, 'view'),  // 匹配views文件夹
    extname: '.html',  // .匹配html结尾的
    debug: process.env.NODE_ENV !== 'production' // 是否开启调试模式
});
// 处理静态资源 可以配置多个目录
app.use(static(
    path.join( __dirname,  'public')
))
 //  处理favicon.ico 404问题
 app.use(favicon(__dirname + '/public/favicon.ico'));
 // 处理上传的图片文件
app.use(formidable({
    uploadDir:path.join(__dirname,'public/upload'),   //文件上传或图片上传的绝对路径
    // uploadDir:config.uploadDir, //上传目录   config是导入进来的绝对路径
    keepExtensions:true // 保持原有后缀名
}));
// 数据压缩
app.use(compress({
    filter (content_type) {
        return /text/i.test(content_type)
    },
    threshold: 2048,
    gzip: {
      flush: require('zlib').Z_SYNC_FLUSH
    },
    deflate: {
      flush: require('zlib').Z_SYNC_FLUSH,
    },
    br: false // disable brotli
}))
// 处理session
app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:session',   // cookie密钥 (默认为koa:sess)  session的名
    maxAge: 86400000,  // cookie的过期时间  最大值（ms 一秒等于1000ms）（默认值为1天）
    overwrite: true,  //是否可以覆盖    (默认default true)
    httpOnly: true, //cookie是否只有服务器端可以访问  是否httpOnly（默认为true）
   // {"user":{"username":"abac"},"_expire":1532529416883,"_maxAge":86400000}
    signed: true,   //签名默认true 数字签名，保证数据不被串改
    rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
    renew: false,  //（布尔值）会话快过期时续订会话,  过期后是否创建新的
 };
 app.use(session(CONFIG, app));

router.use(require('./routes/Router'));  // web 路由
// 启动路由
app.use(router.routes());
// 状态码增强, 404 => 405 + 501  
// 405:url存在请求方式错误
// 501:copy之类的不常见的请求方式,服务器没有实现对其处理的
app.use(router.allowedMethods());

// 开启服务器
app.listen(7300,'127.0.0.1',()=> {
    console.log('端口启动在7300!');
})