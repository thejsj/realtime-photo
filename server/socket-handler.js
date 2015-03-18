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
    console.log('Adding newPhoto');
    var matches = photo.file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    console.
    photo.type = matches[1];
    photo.file = r.binary(new Buffer(mathces[2], 'base64'));
    console.log(matches[2].substring(0, 30));
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
          var file = result.new_val.file.toString('base64');
          console.log('Sending New File');
          console.log(file.substring(0, 30));
          result.new_val.file = file;
          io.emit('newPhoto', result.new_val);
        });
      });
   });

};

module.exports = socketHandler;
