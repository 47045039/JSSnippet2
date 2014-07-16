/**
 * Created by mts on 14-7-16.
 */

var NET = require('net');
var HOST = '127.0.0.1';
var PORT = 3333;

var onLookupListener = function() {
  console.log('@@@@@@@@@@@@ client lookup: ', arguments);
}

var onConnectListener = function() {
  console.log('@@@@@@@@@@@@ client connect: ', arguments);
  console.log('local address: ', socket.localAddress + ':' + socket.localPort);
  console.log('remote address: ', socket.remoteAddress + ':' + socket.remotePort);

  socket.write(socket.localAddress + ':' + socket.localPort
      + ' write some data to ' + socket.remoteAddress + ':' + socket.remotePort);
//  socket.end();
};

var onDataListener = function(data) {
  console.log('@@@@@@@@@@@@ client receive data: ', data.toString());

  socket.pause();
}

var onDrainListener = function(data) {
  console.log('@@@@@@@@@@@@ client drain: ', arguments);
}

var timeoutCount = 1;
var onTimeoutListener = function(data) {
  console.log('@@@@@@@@@@@@ client timeout: ', arguments);

  socket.write(socket.localAddress + ':' + socket.localPort
      + ' write some data to ' + (timeoutCount++) + ' ' + socket.remoteAddress + ':' + socket.remotePort);
  socket.resume();
}

var onErrorListener = function(err) {
  console.log('@@@@@@@@@@@@ client error: ', arguments);
}

var onEndListener = function() {
  console.log('@@@@@@@@@@@@ client end: ', arguments);
}

var onCloseListener = function(hasError) {
  console.log('@@@@@@@@@@@@ client close: ', arguments);
}

//NET.createConnection({
//  host: HOST,
//  port: PORT,
//  allowHalfOpen: false
//}, onConnectListener);
var socket = NET.connect(PORT, HOST);
socket.on('lookup', onLookupListener);
socket.on('connect', onConnectListener);
socket.on('data', onDataListener);
socket.on('drain', onDrainListener);
socket.on('timeout', onTimeoutListener);
socket.on('error', onErrorListener);
socket.on('end', onEndListener);
socket.on('close', onCloseListener);

socket.setTimeout(2000);