var _ = require('lodash');

function handleJoinRoom(username, socket, message) {
  var user = { username: username };
  if(message && message.room) {
    joinRoom(user, message.room, socket);
  }
  else {
    socket.emit('join-response', { success: false });
  }
}

function joinRoom(user, room, socket) {
  socket.join(room);
  socket.on('message', sendMessage(user, room, socket));
  socket.on('leave-room', leaveRoom(user, room, socket));

  socket.to(room).emit('user-joined', user);
  socket.emit('join-response', {
    success: true,
    room: room
  });
}

var sendMessage = _.curry(function(user, room, socket, message) {
  socket.to(room).emit('message', _.extend(message, user));
});

var leaveRoom = _.curry(function(user, room, socket, message) {
  socket.removeAllListeners('message');
  socket.removeAllListeners('leave-room');
  socket.leave(room);
  socket.to(room).emit('user-left', user);
});

module.exports = _.curry(handleJoinRoom, 3);
