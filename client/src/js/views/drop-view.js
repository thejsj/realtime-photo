'use strict';
var React = require('react');
var _ = require('lodash');
var uuid = require('uuid');

var SinglePhotoView = require('./single-photo-view');

var DragDrop = React.createClass({
  handleFileSelect: function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var x = evt.clientX, y = evt.clientY;
    var files = evt.dataTransfer.files; // FileList object.
    _.each(files, function (file) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var base64 = e.target.result;
        console.log(e.target);
        var matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (Array.isArray(matches) && (matches[1] === 'image/png' || matches[1] === 'image/jpeg')) {
          console.log('Photo:insert');
          var id = uuid.v4();
          var newPhoto = {
            'id': id,
            'fileName': file.name,
            // 'file': file,
            'type': matches[1],
            'author': this.props.userId,
            'x': x,
            'y': y
          };
          var newPhotoFile = {
            'id': id,
            'file': file
          };
          // Here we should find a way to add it to our local copy an re-render
          // the DOM, but this is not really the React.js way of doing it
          this.props.socket.emit('Photo:update', newPhoto);
          this.props.socket.emit('Photo:update', newPhotoFile);
        } else {
          console.log('Error', matches[1]);
        }
      }.bind(this);
      reader.readAsDataURL(file);
    }.bind(this));
  },
  handleDragOver: function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  },
  render: function () {
    return (
      <div className='drop-box photo-view' onDragOver={ this.handleDragOver } onDrop={ this.handleFileSelect }>
        <div className='title'>Drag and drop</div>
        { _.map(this.props.photos, function(photo, i) {
          return <SinglePhotoView key={photo.id} photo={photo} socket={this.props.socket} />
        }, this) }
      </div>
    );
  }
});

module.exports = DragDrop;
