/**
 * Created by douqr on 2016/2/18.
 */

/*建立与服务端的socket连接 */
var iosocket = io.connect();

//往服务端推送 新用户消息
var userName = $("#userName").val();
if (!!userName) {
    iosocket.emit('newUser', userName);  //告诉服务器有新用户来了
}
else{
    location.href = "/";
}

//监听用户列表刷新
iosocket.on('userList', function (userList) {
    $('#userList').html("");
    if (!!userList) {
        for (var i = 0; i < userList.length; i++) {
            $('#userList').append($('<li></li>').text(userList[i]));
        }
    }
});

//聊天历史
iosocket.on('messageList', function (msgList) {
    if (!!msgList) {
        for (var i = 0; i < msgList.length; i++) {
            var msg = msgList[i].user + "：" + msgList[i].message;
            $('#messageList').append($('<li></li>').html(msg));
        }
    }
});

//欢迎语
iosocket.on('welcomeMessage', function (msg) {
    $('#welcomeMessage').html(msg);
});

//收到新消息
iosocket.on('message', function (message) {
    $('#messageList').append($('<li></li>').html(message));
});


//发送新消息
function sendMessage() {
    var message = $("#message").val();
    if (!message) {
        alert("请先输入内容!");
        return false;
    }

    var msg = userName + "：" + message;
    iosocket.emit('message', message);  //
    $('#messageList').append($('<li></li>').html(msg));
    $("#message").val("");
}
