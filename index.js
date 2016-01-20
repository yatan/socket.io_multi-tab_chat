var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

setInterval(function() { 
    io.emit('general message','bot', 'bot message');
    }, 5000);


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  
socket.on('command', function(msg){
    console.log('command: ' + msg);
    if (msg.indexOf("/join ") >= 0)
    {
        //al '/join canal' se queda -> "canal"
        var canal = msg.slice(6);
        console.log('user join: '+canal);
        socket.join(canal);
        socket.room = canal;
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
  
socket.on('general message', function(who, msg){
    console.log('general message: <'+who+'> '+ msg);
    io.emit('general message', who, msg);
    //socket.broadcast.to(id).emit('my message', msg);
});

socket.on('trade message', function(who, msg){
    console.log('trade message: <'+who+'> '+ msg);
    io.emit('trade message', who, msg);
    //socket.broadcast.to(id).emit('my message', msg);
});

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});