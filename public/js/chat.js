// 私聊
getAll = ele => document.querySelectorAll(ele);
let privateChatSocketid;
// 点击聊天
function chat(e) {
    for (let j = 0; j < getAll('.chatd').length; j++) {
        getAll('.chatd')[j].classList.remove('chat');
    }
    e.classList.add('chat');
    // 要聊天的socketid
    privateChatSocketid = e.dataset.socketid;
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
// 提交聊天
function submit(e) {
    if (document.getElementById('people').innerHTML =='') {
        alert('请选择聊天对象！');
        return false;
    }else if(document.getElementById('content').value == ''){
        alert('聊天内容不能为空!');
        return false;
    }else {
        let value = document.getElementById('content').value;
        socket.emit('privateChat',{
            // 发送的内容
            value,
            privateChatSocketid
        });
        document.getElementById('content').value = '';
    }
}
// 接收私聊服务端返回的内容
socket.on('returnPrivateChat',function(data) {
    // 内容列表
    if( document.getElementById('people').innerHTML != data.chatName || document.getElementById('people').innerHTML == '' ) {
        for (let i = 0; i < document.querySelectorAll('#onlineList li').length; i++) {
            if(document.querySelectorAll('#onlineList li i')[i].innerHTML == data.chatName) {
                document.querySelectorAll('#onlineList li span')[i].style.display = 'block';
            }
        }
    }else {
        let cData = template("chatTemplate",data);
        var content = document.getElementById("chatList");
        content.innerHTML = cData;
    }
    // console.log(data);
})