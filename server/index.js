var _ = require('lodash');
var http = require('http');
var SocketIO = require('socket.io');

var handleConnection = require('./sockets/connection');

var port = 9002;
var server = http.createServer();
var io = SocketIO(server);
var users = [];

io.on('connection', handleConnection(users));

server.on('listening', function() {
  console.log('Server running on port ' + port);
});

server.listen(port);
