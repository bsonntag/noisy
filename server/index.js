var _ = require('lodash');
var Discovery = require('dns-discovery');
var http = require('http');
var SocketIO = require('socket.io');

var handleConnection = require('./sockets/connection');

var discovery = Discovery();
var port = 9002;
var server = http.createServer();
var io = SocketIO(server);
var users = [];

io.on('connection', handleConnection(users));

server.on('listening', function() {
  console.log('Server running on port ' + port);
  discovery.announce('noisy-server', port);
});

server.listen(port);
