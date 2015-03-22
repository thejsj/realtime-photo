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
       socket.emit('Photo:get', photos);
     });

  });

  socket.on('User:disconnect', function () {
    _.each(connectedUsers, function (user, key) {
      if (user.socketId === socket.id) delete connectedUsers[key];
    });
   });

  socket.on('Photo:insert', function (photo) {
    if (photo.file) {
      photo.file = r.binary(photo.file);
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
      console.log('Photo DOESN"T has file');
    }
  });

  socket.on('Photo:update', function (photo) {
    if (photo.id) {
      r
        .table('photos')
        .get(photo.id)
        .update(photo)
        .run(r.conn);
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
            // Send the metadata first, and then the base64 encoded image
            var main = result.new_val;
            var copy = _.clone(result.new_val);
            delete copy.file;
            var image_copy = {
              id: main.id,
              file: main.file
            };
            io.emit('Photo:update', copy);
            io.emit('Photo:update', image_copy);
          }
        });
      });
   });

};

module.exports = socketHandler;
