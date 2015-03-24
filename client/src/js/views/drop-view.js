'use strict';
var React = require('react');
var _ = require('lodash');
var axios = require('axios');

var SinglePhotoView = require('./single-photo-view');
var checkType = require('./check-type');

var DragDrop = React.createClass({
  handleFileSelect: function (evt) {
    var socket = this.props.socket;
    evt.stopPropagation();
    evt.preventDefault();
    var x = evt.clientX, y = evt.clientY;
    var files = evt.dataTransfer.files; // FileList object.
    _.each(files, function (file) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var base64 = e.target.result;
        var matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (Array.isArray(matches) && checkType(matches[1])) {
          var image = {
            'fileName': file.name,
            'type': matches[1],
            'author': this.props.userId,
            'x': x,
            'y': y
          };
          axios.post('/image', {
            image : image
          })
          .then(function (response) {
            var id = response.data.id;
            var data = new FormData();
            data.append('file', e.target.result);
            var opts = {
              transformRequest: function(data) { return data; }
            };
            return axios.put('image/' + id, data, opts);
          })
          .then(function () {
            socket.emit('Message:mirror', {
              type: 'success',
              message: 'Image Uploaded',
              time: Date.now()
            });
          })
          .catch(function (err) {
            socket.emit('Message:mirror', {
              type: 'error',
              message: err.data.message || 'Error uploadig Image',
              time: Date.now()
            });
          });
        } else {
          socket.emit('Message:mirror', {
            type: 'error',
            message: 'Invalid image type',
            time: Date.now()
          });
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
