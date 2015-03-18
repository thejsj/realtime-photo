'use strict';
var React = require('react');
var _ = require('lodash');

var DragDrop = React.createClass({
  getInitialState: function () {
    return {
      x: 0, y: 0
    };
  },
  handleFileSelect: function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.dataTransfer.files; // FileList object.
    _.each(files, function (file) {
      var reader = new FileReader();
      reader.onload = function(e) {
        console.log('File Loaded');
        console.log(e.target.result.substring(0, 30));
        this.props.socket.emit('newPhoto', {
          'fileName': file.name,
          'file': e.target.result,
          'author': this.props.userId,
          'x': this.state.x,
          'y': this.state.y
        })
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

    window.onmousemove = function (evt) {
      this.setState({
        x: evt.clientX, y: evt.clientY
      });
    }.bind(this);

    return (
      <div className='drop-box' onDragOver={ this.handleDragOver } onDrop={ this.handleFileSelect }>
        Drop files here
      </div>
    );
  }
});

module.exports = DragDrop;
