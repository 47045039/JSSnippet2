/**
 * Created by mts on 14-7-16.
 */

var NET = require('net');
var HOST = '127.0.0.1';
var PORT = 3333;

var onListeningListener = function() {
  console.log('############ server listening: ', arguments);
}

var onConnectListener = function(socket) {
  console.log('############ server connect to ' + socket.remoteAddress + ':' + socket.remotePort);
 server.getConnections(function(err, count) {
   console.log('############ server connects: ', arguments);
 });

  socket.on('data', function(data) {
    console.log('###### receive socket data: ', data.toString());
    socket.write('server receive data from: ' + socket.remoteAddress + ':' + socket.remotePort);
//    socket.end();
  });
  socket.on('error', function() {
    console.log('###### socket error: ', socket.remoteAddress, socket.remotePort, arguments);
  });
  socket.on('finish', function() {
    console.log('###### socket finish: ', socket.remoteAddress, socket.remotePort, arguments);
  });
  socket.on('end', function() {
    console.log('###### socket end: ', socket.remoteAddress, socket.remotePort, arguments);
  });
};

var onErrorListener = function(err) {
  console.log('############ server error: ', arguments);
  if (err.code == 'EADDRINUSE') {
    console.log('############ server addr in use: ', server.address());
  }
}

var onCloseListener = function() {
  console.log('############ server close: ', arguments);
}

var server = NET.createServer();
server.on('listening', onListeningListener);
server.on('connection', onConnectListener);
server.on('error', onErrorListener);
server.on('close', onCloseListener);
server.listen(PORT, HOST);

