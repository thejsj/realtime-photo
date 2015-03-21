'use strict';
var React = require('react');
var MainView = require('./views/main-view');
var _ = require('lodash');

var render = function (state) {
  React.render(
    <MainView
      photos={state.photos}
      socket={state.socket}
      messages={state.messages}
      userId={state.userId}
    />,
    document.getElementById('container')
  );
};

var state = {
  socket: io.connect('http://' + window.config.url + ':' + window.config.ports.http),
  photos: {},
  messages: []
};
window.state = state;

state.socket.emit('User:connect');

state.socket.on('User:update', function (users) {
});

state.socket.on('User:connect', function (userId) {
  state.userId = userId;
  render(state);
});

state.socket.on('Photo:update', function (photo) {
  if (!state.photos[photo.id]) state.photos[photo.id] = {};
  state.photos[photo.id] = _.extend(state.photos[photo.id], photo);
  if (state.photos[photo.id]._fileBase64 === undefined && photo.file !== undefined) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var base64 = e.target.result.match(/^data:([A-Za-z-+\/]*);base64,(.+)$/);
      state.photos[photo.id]._fileBase64 = base64[2];
      render(state);
    }.bind(this);
    reader.readAsDataURL(new Blob([photo.file]));
  };
  render(state);
});

state.socket.on('Photo:get', function (photos) {
  photos.forEach(function (photo){
    state.photos[photo.id] = photo;
    var reader = new FileReader();
    reader.onload = function(e) {
      var base64 = e.target.result.match(/^data:([A-Za-z-+\/]*);base64,(.+)$/);
      state.photos[photo.id]._fileBase64 = base64[2];
      render(state);
    }.bind(this);
    reader.readAsDataURL(new Blob([photo.file]));
  });
});

state.socket.on('Photo:delete', function (id) {
  delete state.photos[id];
  render(state);
});

state.socket.on('Message:update', function (message) {
  state.messages.push(message);
  render(state);
  setTimeout(function () {
    // Delete Error
    state.messages.shift();
    render(state);
  }, 3000);
});
