var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  
socket.on('command', function(msg){
    console.log('command: ' + msg);
    if(msg == "/a")
    {
        console.log('user join: test');
        socket.join('test');
        socket.room = 'test';
    }
    //io.emit('chat message', msg);
    //socket.broadcast.to(id).emit('my message', msg);
});

socket.on('channel', function(msg){
    console.log('<'+socket.room+'>: ' + msg);
    io.sockets.in(socket.room).emit('updatechat', socket.room, msg);
    //io.emit('chat message', msg);
    //socket.broadcast.to(id).emit('my message', msg);
});
  
socket.on('general message', function(msg){
    console.log('general message: ' + msg);
    io.emit('general message', msg);
    //socket.broadcast.to(id).emit('my message', msg);
});
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});