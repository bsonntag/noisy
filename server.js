var _ = require('lodash');
var http = require('http');
var SocketIO = require('socket.io');

var server = http.createServer();
var io = SocketIO(server);
var users = [];

io.on('connection', function(socket) {
  console.log('New connection');

  socket.on('register', function(message) {
    if(!(message && message.username))
      return;

    if(_.includes(users, message.username)) {
      socket.emit('register-response', { success: false });
      return;
    }

    var username = message.username;
    users.push(username);

    console.log('New user: ' + username);
    console.log(users);

    socket.on('join-room', function(message) {
      if(!(message && message.room))
        return;

      var room = message.room;
      socket.join(room);

      socket.on('message', function(message) {
        socket.to(room)
          .emit('message', _.extend({ username: username }, message));
      });

      socket.on('leave-room', function() {
        socket.removeAllListeners('message');
        socket.removeAllListeners('leave-room');
        socket.leave(room);
        socket.to(room)
          .emit('user-left', { username: username });
      });

      socket.to(room)
        .emit('user-joined', { username: username });

      socket.emit('join-response', { room: room });
    });

    socket.on('disconnect', function() {
      _.pull(users, username);
      console.log(users);
    });

    socket.emit('register-response', { success: true });
  });

  socket.on('disconnect', function() {
    console.log('Connection closed');
  });
});

server.on('listening', function() {
  console.log('Server running');
});

server.listen(9002);
