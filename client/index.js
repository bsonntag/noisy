var _ = require('lodash');
var chalk = require('chalk');
var Discovery = require('dns-discovery');
var SocketIOClient = require('socket.io-client');
var Vorpal = require('vorpal');

var exit = require('./exit');
var help = require('./help');
var joinRoom = require('./join-room');
var leaveRoom = require('./leave-room');
var register = require('./register');
var sendMessage = require('./send-message');
var who = require('./who');

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

  vorpal.find('help')
    .remove();

  vorpal.find('exit')
    .remove();

  vorpal.command('\\help [command...]')
    .description('Provides help for a given command.')
    .alias('\\h')
    .action(help);

  vorpal.command('\\exit')
    .description('Exits the application.')
    .alias('\\quit', '\\e', '\\q')
    .action(exit);

  vorpal.command('\\register <username>')
    .description('Registers with a username.')
    .alias('\\r')
    .action(register(context));

  vorpal.command('\\join <room>')
    .description('Joins a room.')
    .alias('\\j')
    .action(joinRoom(context));

  vorpal.command('\\leave')
    .description('Leaves the current room.')
    .alias('\\l')
    .action(leaveRoom(context));

  vorpal.command('\\who')
    .description('Lists online users.')
    .action(who(context));

  vorpal.catch('[words...]')
    .description('Sends a message to everyone in the room.')
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
