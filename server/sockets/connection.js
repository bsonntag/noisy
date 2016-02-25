var _ = require('lodash');

var handleRegister = require('./register');

function handleConnection(users, socket) {
  console.log('New connection');

  socket.on('register', handleRegister(users, socket));
  socket.on('disconnect', handleDisconnect);
}

function handleDisconnect() {
  console.log('Connection closed');
}

module.exports = _.curry(handleConnection, 2);
