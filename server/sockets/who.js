var _ = require('lodash');

function handleWho(users, username, socket, message) {
  var others = _.without(users, username);
  socket.emit('who-response', {
    users: others,
  });
}

module.exports = _.curry(handleWho, 4);
