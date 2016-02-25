var _ = require('lodash');

function leaveRoom(context, args, callback) {
  var room = context.room;
  if(room) {
    context.room = null;
    context.socket.emit('leave-room');
    context.log('# Left ' + room);
  }
  callback();
}

module.exports = _.curry(leaveRoom, 3);
