/*jshint node:true */
'use strict';
var _ = require('lodash');
var r = require('./db');

var connectedUsers = {};

var socketHandler = function (io, socket) {

  socket.on('connctedUser', function () {
    var userId = '' + Date.now() + Math.floor(1000 * Math.random());
    if (connectedUsers[userId] === undefined) {
      console.log('New connctedUser', userId, _.size(connectedUsers));
      connectedUsers[userId] = {
        'userId': userId,
        'socketId': socket.id
      };
      io.emit('userUpdate', userId);
      socket.emit('connctedUserConfirmation', userId);
    }
  });

  socket.on('disconnect', function () {
    _.each(connectedUsers, function (user, key) {
      if (user.socketId === socket.id) delete connectedUsers[key];
    });
   });

  socket.on('newPhoto', function (photo) {
    console.log('newPhoto');
    photo.file = r.binary(new Buffer(photo.file, 'base64'));
    r.table('photos')
     .insert(photo)
     .run(r.conn);
  });

  r.getNewConnection()
   .then(function (conn) {
     r.table('photos')
      .changes()
      .run(conn)
      .then(function (cursor) {
        cursor.each(function (err, result) {
          io.emit('newPhoto', result.new_val);
        });
      });
   });

};

module.exports = socketHandler;
