/*jshint node:true */
'use strict';
var _ = require('lodash');
var r = require('./db');

var connectedUsers = {};

var socketHandler = function (io, socket) {

  socket.on('User:connect', function () {
    var userId = '' + Date.now() + Math.floor(1000 * Math.random());
    if (connectedUsers[userId] === undefined) {
      connectedUsers[userId] = {
        'userId': userId,
        'socketId': socket.id
      };
      io.emit('User:update', userId);
      socket.emit('User:connect', userId);
    }

    r.table('photos')
     .run(r.conn)
     .then(function (cursor) {
       return cursor.toArray();
     })
     .then(function (photos) {
       photos.map(function (photo) {
         photo.file = photo.file.toString('base64');
         return photo;
       });
       socket.emit('Photo:get', photos);
     });

  });

  socket.on('User:disconnect', function () {
    _.each(connectedUsers, function (user, key) {
      if (user.socketId === socket.id) delete connectedUsers[key];
    });
   });

  socket.on('Photo:insert', function (photo) {
    var matches = photo.file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (Array.isArray(matches) && (matches[1] === 'image/png' || matches[1] === 'image/jpeg')) {
      photo.type = matches[1];
      photo.file = r.binary(new Buffer(matches[2], 'base64'));
      r.table('photos')
       .insert(photo)
       .run(r.conn)
       .then(function () {
         socket.emit('Message:update', {
          type: 'success',
          message: 'Image Uploaded'
         });
       });

    } else {
      socket.emit('Message:update', {
        type: 'error',
        message: 'This image is not a JPEG or a PNG'
      });
    }
  });

  socket.on('Photo:delete', function (id) {
    r
      .table('photos')
      .get(id)
      .delete()
      .run(r.conn);
  });

  r.getNewConnection()
   .then(function (conn) {
     r.table('photos')
      .changes()
      .run(conn)
      .then(function (cursor) {
        cursor.each(function (err, result) {
          if (result.new_val === null) {
            io.emit('Photo:delete', result.old_val.id);
          } else {
            var file = result.new_val.file.toString('base64');
            result.new_val.file = file;
            io.emit('Photo:update', result.new_val);
          }
        });
      });
   });

};

module.exports = socketHandler;
