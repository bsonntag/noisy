var _ = require('lodash');

function handleWho(context, args, callback) {
  if(!context.username) {
    context.log('# Register first');
    callback();
  }
  else {
    context.socket.once('who-response', onWhoResponse.bind(null, context, callback));
    context.socket.emit('who', {});
  }
}

function onWhoResponse(context, callback, message) {
  context.log('# Online users: ' + _.join(message.users, ', '));
  callback();
}

module.exports = _.curry(handleWho, 3);
