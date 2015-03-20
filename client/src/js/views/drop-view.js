'use strict';
var React = require('react');
var _ = require('lodash');

var SinglePhotoView = require('./single-photo-view');

var DragDrop = React.createClass({
  handleFileSelect: function (evt) {
    var x = evt.clientX, y = evt.clientY;
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.dataTransfer.files; // FileList object.
    _.each(files, function (file) {
      var reader = new FileReader();
      reader.onload = function(e) {
        this.props.socket.emit('Photo:insert', {
          'fileName': file.name,
          'file': e.target.result,
          'author': this.props.userId,
          'x': x,
          'y': y
        });
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
        <div className='title'>Drop images here</div>
        { _.map(this.props.photos, function(photo, i) {
          return <SinglePhotoView photo={photo} socket={this.props.socket} />
        }, this) }
      </div>
    );
  }
});

module.exports = DragDrop;
