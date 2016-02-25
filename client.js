var _ = require('lodash');
var chalk = require('chalk');
var SocketIOClient = require('socket.io-client');
var Vorpal = require('vorpal');

var socket = SocketIOClient('http://localhost:9002');
var vorpal = Vorpal();
var username = null;
var room = null;

socket.once('connect', function() {
  console.log('Welcome!');

  socket.on('message', function(message) {
    vorpal.log(message.username + ': ' + message.message);
  });

  socket.on('user-joined', function(message) {
    vorpal.log('# New user: ' + message.username);
  });

  socket.on('user-left', function(message) {
    vorpal.log('# User left: ' + message.username);
  });

  vorpal.command('\\register <username>')
    .description('Registers with a username')
    .alias('\\r')
    .action(register);

  vorpal.command('\\join <room>')
    .description('Joins a room')
    .alias('\\j')
    .action(joinRoom);

  vorpal.command('\\leave')
    .description('Leaves the current room')
    .alias('\\l')
    .action(leaveRoom);

  vorpal.catch('[words...]')
    .description('Sends a message')
    .action(sendMessage);

  vorpal.delimiter('> ')
    .show();
});

function register(args, callback) {
  if(!username) {
    var self = this;
    socket.emit('register', { username: args.username });
    socket.once('register-response', function(message) {
      if(message && message.success) {
        username = args.username;
        self.log('# Registered as ' + username);
      }
      else {
        self.log('# Could not register as ' + args.username);
      }
      callback();
    });
  }
  else {
    this.log('# You are already registered');
    callback();
  }
}

function joinRoom(args, callback) {
  var self = this;
  if(!username) {
    self.log('# Register first');
    callback();
  }
  else if(room) {
    self.log('# You are already in a room');
  }
  else {
    socket.emit('join-room', _.pick(args, 'room'));
    socket.once('join-response', onJoined);
  }

  function onJoined(message) {
    room = message.room
    self.log('# Joined ' + room);
    callback();
  }
}

function leaveRoom(args, callback) {
  if(room) {
    room = null;
    socket.emit('leave-room');
  }
  callback();
}

function sendMessage(args, callback) {
  if(!username) {
    this.log('# Register first');
  }
  else if(!room) {
    this.log('# Join a room first');
  }
  else {
    var message = args.words.join(' ');
    socket.emit('message', { message: message });
  }
  callback();
}
