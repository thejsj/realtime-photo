'use strict';
var React = require('react');
var _ = require('lodash');

var SinglePhotoView = React.createClass({
  getInitialState: function () {
    return {
      xOffset: 0,
      yOffset: 0,
      x: 0,
      y: 0,
    };
  },
  delete: function (evt) {
    this.props.socket.emit('Photo:delete', this.props.photo.id);
  },
  download: function (evt) {
    window.location = '/image/download/' + this.props.photo.id;
  },
  startDrag: function (evt) {
    var offset = this.getDOMNode().getBoundingClientRect();
    this.setState({
      xOffset: evt.clientX - offset.left,
      yOffset: evt.clientY - offset.top
    });
  },
  endDrag: function (evt) {
    this.props.socket.emit('Photo:update', {
      id: this.props.photo.id,
      x: evt.clientX - this.state.xOffset,
      y: evt.clientY - this.state.yOffset
    });
    this.setState({
      xOffset: 0, yOffset: 0
    });
  },
  render: function () {
    var photo = this.props.photo;
    var style = {
      top: photo.y + 'px',
      left: photo.x + 'px'
    };
    var image = null;
    if (photo._fileBase64 !== undefined) {
      image = <img
        className='photo'
        src={'data:' + photo.type  + ';base64,' + photo._fileBase64 }
      />
    } else {
      image = <div className='photo-loading'>
          <img className='loading-gif' src='/src/svg/loading.svg' />
      </div>;
    }
    return (
      <div className='single-photo-view' style={ style }
        onDragEnter={this.startDrag}
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
        { image }
      </div>
    );
  }
});

module.exports = SinglePhotoView;
