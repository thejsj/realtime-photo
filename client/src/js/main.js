'use strict';
var React = require('react');
var MainView = require('./views/main-view');


var render = function (state) {
  React.render(
    <MainView
      photos={state.photos}
      socket={state.socket}
      userId={state.userId}
    />,
    document.getElementById('container')
  );
};

var state = {
  socket: io.connect('http://' + window.config.url + ':' + window.config.ports.http),
  photos: {}
};

state.socket.emit('connctedUser');

state.socket.on('userUpdate', function (users) {
});

state.socket.on('connctedUserConfirmation', function (userId) {
  state.userId = userId;
  render(state);
});

state.socket.on('newPhoto', function (photo) {
  state.photos[photo.id] = photo;
  render(state);
});
