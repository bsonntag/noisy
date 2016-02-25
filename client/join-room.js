var _ = require('lodash');

function handleJoinRoom(context, args, callback) {
  if(!context.username) {
    context.log('# Register first');
    callback();
  }
  else if(context.room) {
    context.log('# You are already in a room');
  }
  else {
    context.socket.once('join-response', onJoined(context, callback));
    context.socket.emit('join-room', _.pick(args, 'room'));
  }
}

var onJoined = _.curry(function(context, callback, message) {
  context.room = message.room
  context.log('# Joined ' + context.room);
  callback();
});

module.exports = _.curry(handleJoinRoom, 3);
