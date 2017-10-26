var express = require('express');
var path = require('path');
var IO = require('socket.io');
var router = express.Router();

var app = express();
var server = require('http').Server(app);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// 创建socket服务
var socketIO = IO(server);
// 房间用户名单
var roomInfo = {};

socketIO.on('connection', function(socket) {
  // 获取请求建立socket连接的url
  // 如: http://localhost:3000/room/room_1, roomID为room_1
  var url = socket.request.headers.referer;
  var splited = url.split('/');
  var roomID = splited[splited.length - 1]; // 获取房间ID
  var user = '';

  socket.on('join', function(userName) {
    user = userName;

    // 将用户昵称加入房间名单中
    if (!roomInfo[roomID]) {
      roomInfo[roomID] = [];
    }
    roomInfo[roomID].push(user);

    socket.join(roomID); // 加入房间
    // 通知房间内人员
    socketIO.to(roomID).emit('sys', user + '加入了房间', roomInfo[roomID]);
    console.log(user + '加入了' + roomID);
  });

  socket.on('leave', function() {
    socket.emit('disconnect');
  });

  socket.on('disconnect', function() {
    // 从房间名单中移除
    var index = roomInfo[roomID].indexOf(user);
    if (index !== -1) {
      roomInfo[roomID].splice(index, 1);
    }

    socket.leave(roomID); // 退出房间
    socketIO.to(roomID).emit('sys', user + '退出了房间', roomInfo[roomID]);
    console.log(user + '退出了' + roomID);
  });

  // 接收用户消息,发送相应的房间
  socket.on('message', function(msg) {
    // 验证如果用户不在房间内则不给发送
    if (roomInfo[roomID].indexOf(user) === -1) {
      return false;
    }
    socketIO.to(roomID).emit('msg', user, msg);
  });

});

// room page
router.get('/room/:roomID', function(req, res) {
  var roomID = req.params.roomID;

  // 渲染页面数据(见views/room.hbs)
  res.render('room', {
    roomID: roomID,
    users: roomInfo[roomID]
  });
});

app.use('/', router);

server.listen(3000, function() {
  console.log('server listening on port 3000');
});
// ----------------------------------------
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/socket/client/index.html', function(req, res) {
    res.send('<h1>welcome</h1>');
  })
  //在线用户
var onlineUser = {};
var onlineCount = 0;

io.on('connection', function(socket) {
  console.log('新用户登录');

  //监听新用户加入
  socket.on('login', function(obj) {
    socket.name = obj.userid;
    //检查用户在线列表
    if (!onlineUser.hasOwnProperty(obj.userid)) {
      onlineUser[obj.userid] = obj.username;
      //在线人数+1
      onlineCount++;
    }
    //广播消息
    io.emit('login', {
      onlineUser: onlineUser,
      onlineCount: onlineCount,
      user: obj
    });
    console.log(obj.username + "加入了聊天室");
  })

  //监听用户退出
  socket.on('disconnect', function() {
    //将退出用户在在线列表删除
    if (onlineUser.hasOwnProperty(socket.name)) {
      //退出用户信息
      var obj = {
        userid: socket.name,
        username: onlineUser[socket.name]
      };
      //删除
      delete onlineUser[socket.name];
      //在线人数-1
      onlineCount--;
      //广播消息
      io.emit('logout', {
        onlineUser: onlineUser,
        onlineCount: onlineCount,
        user: obj
      });
      console.log(obj.username + "退出了聊天室");
    }
  })

  //监听用户发布聊天内容
  socket.on('message', function(obj) {
    //向所有客户端广播发布的消息
    io.emit('message', obj);
    console.log(obj.username + '说：' + obj.content);
  });
})
http.listen(4000, function() {
  console.log('listening on *:4000');
});