var _ = require('lodash');
var chalk = require('chalk');
var Discovery = require('dns-discovery');
var SocketIOClient = require('socket.io-client');
var Vorpal = require('vorpal');

var joinRoom = require('./join-room');
var leaveRoom = require('./leave-room');
var register = require('./register');
var sendMessage = require('./send-message');

var discovery = Discovery();

discovery.once('peer', function(name, peer) {
  startClient('http://' + peer.host + ':' + peer.port);
});

discovery.lookup('noisy-server');

function startClient(serverUrl) {
  var socket = SocketIOClient(serverUrl);
  var vorpal = Vorpal();
  var context = {
    socket: socket,
    username: null,
    room: null,
    log: vorpal.log.bind(vorpal)
  };

  socket.once('connect', handleConnection.bind(null, vorpal, context));
}

function handleConnection(vorpal, context) {
  console.log('Welcome to noisy');

  context.socket.on('message', logMessage(context));
  context.socket.on('user-joined', logJoiningUser(context));
  context.socket.on('user-left', logLeavingUser(context));

  vorpal.command('\\register <username>')
    .description('Registers with a username')
    .alias('\\r')
    .action(register(context));

  vorpal.command('\\join <room>')
    .description('Joins a room')
    .alias('\\j')
    .action(joinRoom(context));

  vorpal.command('\\leave')
    .description('Leaves the current room')
    .alias('\\l')
    .action(leaveRoom(context));

  vorpal.catch('[words...]')
    .description('Sends a message')
    .action(sendMessage(context));

  vorpal.delimiter('> ')
    .show();
}

var logMessage = _.curry(function(context, message) {
  context.log(message.username + ': ' + message.message);
});

var logJoiningUser = _.curry(function(context, message) {
  context.log('# New user: ' + message.username);
});

var logLeavingUser = _.curry(function(context, message) {
  context.log('# User left: ' + message.username);
});
