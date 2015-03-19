'use strict';
var React = require('react');
var _ = require('lodash');

var SinglePhotoView = React.createClass({
  getInitialState: function () {
    return {
      xOffset: null,
      yOffset: null
    }
  },
  delete: function (evt) {
    this.props.socket.emit('Photo:delete', this.props.photo.id);
  },
  download: function (evt) {
    window.location = '/photo/download/' + this.props.photo.id;
  },
  startDrag: function (evt) {
    var offset = this.getDOMNode().getBoundingClientRect();
    console.log(evt.clientX - offset.left);
    console.log(evt.clietnY - offset.top);
    this.setState({
      xOffset: evt.clientX - offset.left,
      yOffset: evt.clientY - offset.top
    });
    console.log(this.state);
  },
  drag: function (evt) {
    this.props.socket.emit('Photo:update', {
      id: this.props.photo.id,
      x: evt.clientX + this.state.xOffset,
      y: evt.clientY + this.state.yOffset
    });
  },
  endDrag: function (evt) {
    this.props.socket.emit('Photo:update', {
      id: this.props.photo.id,
      x: evt.clientX + this.state.xOffset,
      y: evt.clientY + this.state.yOffset
    });
    this.setState({
      xOffset: null, yOffset: null
    });
  },
  render: function () {
    var photo = this.props.photo;
    var style = {
      top: photo.y + 'px',
      left: photo.x + 'px'
    };
    return (
      <div className='single-photo-view' style={ style }
        onDragEnter={this.startDrag}
        onDrag={this.drag}
        onDragEnd={this.endDrag}
      >
        <div className='buttons'>
          <span
            className="button glyphicon glyphicon-trash"
            aria-hidden="true"
            onClick={this.delete}>
          </span>
          <span
            className="button glyphicon glyphicon-download"
            aria-hidden="true"
            onClick={this.download}>
          </span>
        </div>
        <img
          className='photo'
          src={'data:' + photo.type  + ';base64,' + photo.file }
        />
      </div>
    );
  }
});

module.exports = SinglePhotoView;
