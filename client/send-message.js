var _ = require('lodash');

function sendMessage(context, args, callback) {
  if(!context.username) {
    context.log('# Register first');
  }
  else if(!context.room) {
    context.log('# Join a room first');
  }
  else {
    var message = args.words.join(' ');
    context.socket.emit('message', { message: message });
  }
  callback();
}

module.exports = _.curry(sendMessage, 3);
