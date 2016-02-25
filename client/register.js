var _ = require('lodash');

function handleRegister(context, args, callback) {
  if(!context.username) {
    registerUser(context, args.username, callback);
  }
  else {
    context.log('# You are already registered');
    callback();
  }
}

function registerUser(context, username, callback) {
  context.socket.once('register-response', handleRegisterResponse(context, callback));
  context.socket.emit('register', { username: username });
}

var handleRegisterResponse = _.curry(function(context, callback, message) {
  if(message && message.success) {
    context.username = message.username;
    context.log('# Registered as ' + message.username);
  }
  else {
    context.log('# Could not register as ' + message.username);
  }
  callback();
});

module.exports = _.curry(handleRegister, 2);
