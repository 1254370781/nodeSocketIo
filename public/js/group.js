// 群聊天的groupChatSocketid
let groupChatSocketid;
// 创建群
document.querySelector('#subGroup').addEventListener('click',()=> {
    let value = document.querySelector('#buildGroup').value;
    socket.emit('buildGroup',{
        // 发送的内容
        value
    });
},false)
// 接收群聊列表
socket.on('groupList',function(data) {
    // 判断,群如果自己是群主或者已经加入了群的,就修改joins,不允许再次加入
    for (let a = 0; a < data.groupData.length; a++) {
        if (data.groupData[a].groupstampid == userxStampid) {
            data.groupData[a].joins = '否';
        }
        if (data.groupData[a].groupPeople.length !=0) {
            for (let c = 0; c < data.groupData[a].groupPeople.length; c++) {
                if (data.groupData[a].groupPeople[c].stampid == userxStampid) {
                    data.groupData[a].joins = '否';
                }
            }
        }
    }
    data.stampid = userxStampid;
    // 数据加入到模板
    let gData = template("groupsList",data);
    let gontent = document.getElementById("groupList");
    gontent.innerHTML = gData;
    // 清空输入框
    document.querySelector('#buildGroup').value = '';
})
// 加入群
function groupJoin(e) {
    let groupid = e.dataset.groupid;
    socket.emit('groupJoin',{
        // 发送的内容
        groupid
    });
}
// 接收加入群返回信息
socket.on('groupJoinList',data=> {
    // 判断,群如果自己是群主或者已经加入了群的,就修改joins,不允许再次加入
    for (let a = 0; a < data.groupData.length; a++) {
        if (data.groupData[a].groupstampid == userxStampid) {
            data.groupData[a].joins = '否';
        }
        if (data.groupData[a].groupPeople.length !=0) {
            for (let c = 0; c < data.groupData[a].groupPeople.length; c++) {
                if (data.groupData[a].groupPeople[c].stampid == userxStampid) {
                    data.groupData[a].joins = '否';
                }
            }
        }
    }
    data.stampid = userxStampid;
    // 数据加入到模板
    let gData = template("groupsList",data);
    let gontent = document.getElementById("groupList");
    gontent.innerHTML = gData;
})
// 退群/解散
function groupSign(e) {
    // 获取innerHTML,并去除前后的空白字符
    let inner = e.innerHTML.trim()
    let groupid = e.dataset.groupid;
    if(inner == '解散') {
        if (confirm("确定要解散群吗!")) {
            socket.emit('groupSign',{
                // 发送的内容
                groupid,
                inner
            });
        }
    }else {
        socket.emit('groupSign',{
            // 发送的内容
            groupid,
            inner
        });
    }
    // 目前的群聊清空
    groupChatSocketid = '';
    // 隐藏群人员列表的块
    document.querySelector('.grouplb').style.display = 'none';
    // 退群的群人员列表清空
    document.querySelector('#grouplb').innerHTML = '';
    // 清空群聊天内容
    document.querySelector('#groupChatList').innerHTML = '';
    // 清空目前聊的群注册
    document.querySelector('#groupPeople').innerHTML = '';
}
// 接收退群返回信息
socket.on('groupSignList',data=> {
    // 判断,群如果自己是群主或者已经加入了群的,就修改joins,不允许再次加入
    for (let a = 0; a < data.groupData.length; a++) {
        if (data.groupData[a].groupstampid == userxStampid) {
            data.groupData[a].joins = '否';
        }
        if (data.groupData[a].groupPeople.length !=0) {
            for (let c = 0; c < data.groupData[a].groupPeople.length; c++) {
                if (data.groupData[a].groupPeople[c].stampid == userxStampid) {
                    data.groupData[a].joins = '否';
                }
            }
        }
    }
    data.stampid = userxStampid;
    // 数据加入到模板
    let gData = template("groupsList",data);
    let gontent = document.getElementById("groupList");
    gontent.innerHTML = gData;
})
// 点击群聊天
function groupChat(e) {
    for (let j = 0; j < getAll('.chatdx').length; j++) {
        getAll('.chatdx')[j].classList.remove('chat');
    }
    e.classList.add('chat');
    // 要聊天的socketid
    groupChatSocketid = e.dataset.socketid;
    // 命名要聊天的是谁
    document.getElementById('people').innerHTML = e.dataset.name;
    // 判断是否有未读信息
    if (e.nextSibling.style.display == 'block') {
        e.nextSibling.style.display = 'none';
    }
    socket.emit('getChatRecord',{
        // 发送的内容
        privateChatSocketid
    });
}
// 接收历史聊天记录返回内容
socket.on('returnGetChatRecord',function(data) {
    // 内容列表
    let cData = template("chatTemplate",data);
    var content = document.getElementById("chatList");
    content.innerHTML = cData;
    console.log(data);
})
// 哪个群聊天
let groupshat;
// 点击群聊天
function groupChat(e) {
    for (let j = 0; j < document.querySelectorAll('.chatdx').length; j++) {
        getAll('.chatdx')[j].classList.remove('chat');
    }
    e.classList.add('chat');
    // 要聊天的socketid
    groupshat = e.dataset.groupid;
    // 命名要聊天的是谁
    document.getElementById('groupPeople').innerHTML = e.dataset.groupname;
    // 显示点击的群的群人员列表
    document.querySelector('.grouplb').style.display = 'block';
    // 判断是否有未读信息
    if(document.querySelector(`#${e.dataset.groupname}`).style.display == 'block') {
        document.querySelector(`#${e.dataset.groupname}`).style.display = 'none'
    }
    socket.emit('groupChat',{
        // 发送的内容
        groupshat
    });
}
// 接收群成员列表
socket.on('getGroupChat',data=> {
    for (let i = 0; i < data.data.length; i++) {
        if (data.data[i].title == userxStampid) {
            data.data[i].chat = 1;
        }else {
            data.data[i].chat = 0;
        }
    }
    console.log(data)
    // 群人员列表数据加入到模板
    let hData = template("grouplbTemplate",data);
    let hontent = document.getElementById("grouplb");
    hontent.innerHTML = hData;
    // 群聊天记录数据加入到模板
    let qData = template("groupTemplate",data);
    let qontent = document.getElementById("groupChatList");
    qontent.innerHTML = qData;
})
// 提交聊天
function groupSubmit(e) {
    if (document.getElementById('groupPeople').innerHTML =='') {
        alert('请选择聊天对象！');
        return false;
    }else if(document.getElementById('groupContent').value == ''){
        alert('聊天内容不能为空!');
        return false;
    }else {
        let value = document.getElementById('groupContent').value;
        socket.emit('proupChat',{
            // 发送的内容
            value,
            groupshat
        });
        document.getElementById('groupContent').value = '';
    }
}
// 接收群聊天信息
socket.on('getProupChat',data=> {
    for (let i = 0; i < data.data.length; i++) {
        if (data.data[i].title == userxStampid) {
            data.data[i].chat = 1;
        }else {
            data.data[i].chat = 0;
        }
    }
    // 判断现在页面上显示的聊天框是不是当前的群
    if( document.getElementById('groupPeople').innerHTML != data.groupName || document.getElementById('groupPeople').innerHTML == '' ) {
        for (let i = 0; i < document.querySelectorAll('#groupList li').length; i++) {
            if(document.querySelectorAll('#groupList li i')[i].innerHTML == data.groupName) {
                document.querySelectorAll('#groupList li span')[i].style.display = 'block';
            }
        }
    }else {
        // 数据加入到模板
        let qData = template("groupTemplate",data);
        let qontent = document.getElementById("groupChatList");
        qontent.innerHTML = qData;
    }
    console.log(data);
})