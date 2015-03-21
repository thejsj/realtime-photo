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
      console.log('IO User:udpate #1');
      io.emit('User:update', userId);
      console.log('END IO User:udpate #1');
      console.log('User Connect #1');
      socket.emit('User:connect', userId);
      console.log('End User Connect #1');
    }
    r.table('photos')
     .run(r.conn)
     .then(function (cursor) {
       return cursor.toArray();
     })
     .then(function (photos) {
       console.log('Photo Get #1');
       socket.emit('Photo:get', photos);
       console.log('End Photo Get #1');
     });

  });

  socket.on('User:disconnect', function () {
    _.each(connectedUsers, function (user, key) {
      if (user.socketId === socket.id) delete connectedUsers[key];
    });
   });

  socket.on('Photo:insert', function (photo) {
    if (photo.file) {
      console.log('Photo HAS file');
      photo.file = r.binary(photo.file);
      r.table('photos')
       .insert(photo)
       .run(r.conn)
       .then(function () {
         console.log('Emit Message Update #1');
         socket.emit('Message:update', {
          type: 'success',
          message: 'Image Uploaded'
         });
         console.log('End Emit Message Update #1');
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
            console.log('IO Photo Delete #1', result.old_val.id);
            io.emit('Photo:delete', result.old_val.id);
            console.log('END IO Photo Delete #1');
          } else {
            // Send the metadata first, and then the base64 encoded image
            var main = result.new_val;
            var copy = _.clone(result.new_val);
            delete copy.file;
            var image_copy = {
              id: main.id,
              file: main.file
            };
            console.log('Emit IO Photo Update #1', copy);
            io.emit('Photo:update', copy);
            console.log('End IO Emit Photo Update #1')
            io.emit('Photo:update', image_copy);
          }
        });
      });
   });

};

module.exports = socketHandler;
