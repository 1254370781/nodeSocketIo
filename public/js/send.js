// 发送公屏内容
function publicSubmit(e) {
    if(document.getElementById('publicContent').value == ''){
        alert('聊天内容不能为空!');
        return false;
    }else {
        let value = document.getElementById('publicContent').value;
        socket.emit('sendChat',{
            // 发送的内容
            value
        });
        document.getElementById('publicContent').value = '';
    }1
}
// 接收公屏反馈信息
socket.on('allSendChat',data=> {
    // 遍历内容
    for (let i = 0; i < data.data.length; i++) {
        // userxStampid == `{{user.stampid}}`   要在页面先命名  这里才能用  要不然这里直接用`{{user.stampid}}` underfind
        if (data.data[i].title == userxStampid) {
            data.data[i].chat = 1;
        }else {
            data.data[i].chat = 0;
        }
    }
    // 数据加入到模板
    let aData = template("sendTemplate",data);
    let aontent = document.getElementById("sendChatList");
    aontent.innerHTML = aData;
    // console.log(data);
})