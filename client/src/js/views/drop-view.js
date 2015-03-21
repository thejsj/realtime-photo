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
        var base64 = e.target.result;
        var matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (Array.isArray(matches) && (matches[1] === 'image/png' || matches[1] === 'image/jpeg')) {
          this.props.socket.emit('Photo:insert', {
            'fileName': file.name,
            'file': file,
            'type': matches[1],
            'author': this.props.userId,
            'x': x,
            'y': y
          });
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
        <div className='title'>Drop images here</div>
        { _.map(this.props.photos, function(photo, i) {
          return <SinglePhotoView key={photo.id} photo={photo} socket={this.props.socket} />
        }, this) }
      </div>
    );
  }
});

module.exports = DragDrop;
