var _ = require('lodash');

var handleJoinRoom = require('./join-room');
var handleWho = require('./who');

function handleRegister(users, socket, message) {
  if(!message || !message.username)
    return;

  if(_.includes(users, message.username)) {
    socket.emit('register-response', {
      success: false,
      username: username
    });
  }
  else {
    registerUser(users, message.username, socket);
  }
}

function registerUser(users, username, socket) {
  users.push(username);

  console.log('New user: ' + username);
  console.log(users);

  setupSocket(users, username, socket);

  socket.emit('register-response', {
    success: true,
    username: username
  });
}

function setupSocket(users, username, socket) {
  socket.on('join-room', handleJoinRoom(username, socket));
  socket.on('who', handleWho(users, username, socket));

  socket.on('disconnect', function() {
    _.pull(users, username);
    console.log(users);
  });
}

module.exports = _.curry(handleRegister, 3);
