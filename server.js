var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/index', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
//用来保存用户的连接
var socketList = [];
io.on('connection', (socket) => {
  console.log('a user connected');
   // 加入 用户已经存在再 我们的连接列表中 是不是需要把他替换掉呀 
  socket.on("linked",(name)=>{
      if(searchUser(name)){
          //如果我的连接列表中没有 我请求连接的用户 那么我将它保存否则替换掉连接
        socket.id = name;
        socketList.push(socket);
      }else{
        socket.id = name
        replaceUser(name,socket);
      }
      //推送 xxxx已连接的消息 广播 服务端向每个连接发送一条消息
      brodeCastMsg(("欢迎"+name+"连接聊天室"))
  })

});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
////Action
//便利socketlist来判断用户是否存在
function searchUser(name){
    for(let socket in socketList){
        if(name == socketList[socket].id){
            return false
        }
        return true
    }
}
// 根据 连接的名字替换 socket
function replaceUser(name,socket){
    for(let socket in socketList){
        if(name == socketList[socket].id){
            // 参数socket 代表新连接  也就是说 如果我的连接列表里存在了本连接  那么就将他替换
            socketList[socket] = socket;
            break;

        }
    }
}

//广播消息
function brodeCastMsg(msg){
    //遍历连接列表 发送消息
 for (let socket in socketList){
    socketList[socket].emit("brodeCastMsg",msg);
 }
}