/**
 * Created by douqr on 2016/2/17.
 */

var io = require('socket.io')();
var userList = [];
var Message = require("./models/messageModel");

/*设置在连接后进行的处理*/
io.on('connection', function (_socket) {
    console.log(_socket.id + ': connection');

    //查询在线用户列表
    _socket.emit('welcomeMessage', '欢迎来到竞价聊天室!'); //推送欢迎信息
    var totalCount =  Message.find({}).count(function(err,count){
        Message.find({}).sort({time: 1}).skip(count > 5 ?  count - 5 : 0).exec(function (err, docs) {
            _socket.emit('messageList', docs); //推送聊天历史
        });
    });

    _socket.on('disconnect', function () {
        console.log(_socket.id + ': disconnect');
        if (_socket.userName) {
            RemoveUser(_socket.userName);
            _socket.broadcast.emit('userList', userList); //对所有客户端推送消息：刷新用户列表
            _socket.broadcast.emit('message', _socket.userName + ",离开聊天室!");
        }
    });

    /*设置message监听事件 */

    //新用户登录
    _socket.on("newUser", function (userName) {
        console.log("new user join :" + userName);
        userList.push(userName); //加入在线用户列表
        _socket.userName = userName; //当前socket中存放用户名【退出时，可以删除列表中的用户】
        _socket.emit('userList', userList); //往当前连接发送消息：刷新用户列表
        _socket.emit('message', "欢迎 " + userName + ",进入聊天室!");
        _socket.broadcast.emit('userList', userList); //对其他所有客户端进行广播：刷新用户列表
        _socket.broadcast.emit('message', "欢迎 " + userName + ",进入聊天室!");
    });

    _socket.on('message', function (msg) {
        var message = new Message({"user": _socket.userName, "message": msg, "time": new Date()});
        message.save(function (err) {
            _socket.broadcast.emit('message', _socket.userName + ":" + msg); //对所有客户端进行广播
        });
    });
});


/*删除用户*/
function RemoveUser(userName) {
    for (var i = 0; i < userList.length; i++) {
        if (userList[i] == userName)
            userList.splice(i, 1);
    }
}

exports.listen = function (_server) {
    return io.listen(_server);
};