/**
 * Created by mts on 14-7-16.
 */

var fs = require('fs');
var path = require('path');

function cbk(err, src, dst) {
  if (err) {
    console.warn('###### Copy file failed: ', src, '-->', dst);
  } else {
    console.log('###### Copy file success: ', src, '-->', dst);
  }
}

var write_opts = {
  mode: 438,
  flags: 'a'
};
// 使用pipe方式，具有自动的流量控制。
function copy(src, dst, cbk) {
  var read = fs.createReadStream(path.join(__dirname, src));
  var write = fs.createWriteStream(path.join(__dirname, dst), write_opts);

  read.on('data', function(chunk) {
    console.log('###### read data: ', chunk.toString());
  });

  // 所有的write事件都收不到。
  //  write.on('data', function(chunk) {
  //    console.log('###### write data: ', chunk.toString());
  //  });

  // 错误发生后，close事件无法收到。和socket的error事件不同。
  read.on('error', function(err) {
    console.log('###### read error: ', err);
    cbk && cbk(err, src, dst);
  });

  //  write.on('error', function() {
  //    console.log('###### write error: ', arguments);
  //  });

  read.on('close', function() {
    console.log('###### read close: ', arguments);
    cbk && cbk(null, src, dst);
  });

  //  write.on('close', function() {
  //    console.log('###### write close: ', arguments);
  //  });

  read.pipe(write);
}

var read_opts2 = {
  highWaterMark: 64,
  encoding: 'utf8'  // 在data事件中，chunk是string，而不是buffer
};
var write_opts2 = {
  highWaterMark: 64,
  flags: 'w'
};
// 使用write方式写数据。没有流量控制。
function copy2(src, dst, cbk) {
  var read = fs.createReadStream(path.join(__dirname, src), read_opts2);
  var write = fs.createWriteStream(path.join(__dirname, dst), write_opts2);

  read.on('data', function(chunk) {
    console.log('###### read data: ', chunk); // typeof chunk === 'string'
    write.write(chunk.toString().replace(new RegExp(src, 'g'), dst));
  });

  // 所有的write事件都收不到。
  //  write.on('data', function(chunk) {
  //    console.log('###### write data: ', chunk.toString());
  //  });

  // 错误发生后，close事件无法收到。和socket的error事件不同。
  read.on('error', function(err) {
    console.log('###### read error: ', err);
    cbk && cbk(err, src, dst);
  });

  //  write.on('error', function() {
  //    console.log('###### write error: ', arguments);
  //  });

  read.on('close', function() {
    console.log('###### read close: ', arguments);
    cbk && cbk(null, src, dst);
  });

  //  write.on('close', function() {
  //    console.log('###### write close: ', arguments);
  //  });
}

var read_opts3 = {
  highWaterMark: 128,
  encoding: 'utf8'  // 在data事件中，chunk是string，而不是buffer
};
var write_opts3 = {
  highWaterMark: 64,
  flags: 'w'
};
// 使用write方式写数据。手动流量控制。
function copy3(src, dst, cbk) {
  var read = fs.createReadStream(path.join(__dirname, src), read_opts3);
  var write = fs.createWriteStream(path.join(__dirname, dst), write_opts3);

  read.on('data', function(chunk) {
    console.log('###### read data: ', chunk); // typeof chunk === 'string'
    if (!write.write(chunk.toString().replace(new RegExp(src, 'g'), dst))) {
      console.log('###### pause read data');
      read.pause();
    };
  });

  // 错误发生后，close事件无法收到。和socket的error事件不同。
  read.on('error', function(err) {
    console.log('###### read error: ', err);
    cbk && cbk(err, src, dst);
  });

  read.on('close', function() {
    console.log('###### read close: ', arguments);
    cbk && cbk(null, src, dst);
  });

  write.on('drain', function() {
    console.log('###### write drain: ', arguments);
    console.log('###### resume read data');
    read.resume();
  });
}

//copy('src', 'dst', cbk);
//copy2('src', 'dst', cbk);
copy3('src', 'dst', cbk);