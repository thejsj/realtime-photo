/*jshint node:true */
'use strict';
var _ = require('lodash');
var r = require('./db');

var connectedUsers = {};

var socketHandler = function (io, socket) {

  socket.on('User:connect', function () {
    console.log('User:connect');
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
         console.log(photo.file.substring(0, 40));
         return photo;
       });
       socket.emit('Photo:get', photos);
     });

  });

  socket.on('User:disconnect', function () {
    console.log('User:disconnect');
    _.each(connectedUsers, function (user, key) {
      if (user.socketId === socket.id) delete connectedUsers[key];
    });
   });

  socket.on('Photo:insert', function (photo) {
    console.log('Insert Photo');
    var matches = photo.file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (Array.isArray(matches) && (matches[1] === 'image/png' || matches[1] === 'image/jpeg')) {
      photo.type = matches[1];
      try {
        console.log(photo.file.substring(0, 40));
        photo.file = r.binary(new Buffer(matches[2], 'base64'));
        console.log('Insert Into Table');
        r.table('photos')
         .insert(photo)
         .run(r.conn)
         .then(function () {
           console.log('Emit Socket Update');
           socket.emit('Message:update', {
            type: 'success',
            message: 'Image Uploaded'
           });
         });
      } catch(err) {
        console.log('Error Inserting Photo', err);
      }
    } else {
      socket.emit('Message:update', {
        type: 'error',
        message: 'This image is not a JPEG or a PNG'
      });
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
    console.log('Photo:delete');
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
          console.log('Photo:update (cursor)');
          if (result.new_val === null) {
            console.log('Photo:delete (cursor)');
            io.emit('Photo:delete', result.old_val.id);
          } else {
            console.log('Photo:update (cursor)');
            // Send the metadata first, and then the base64 encoded image
            var main = result.new_val;
            var copy = _.clone(result.new_val);
            delete copy.file;
            var image_copy = {
              id: main.id,
              file: main.file.toString('base64')
            };
            console.log(image_copy.file.substring(0, 40));
            io.emit('Photo:update', copy);
            io.emit('Photo:update', image_copy);
          }
        });
      });
   });

};

module.exports = socketHandler;
