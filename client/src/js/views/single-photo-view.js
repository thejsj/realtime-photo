'use strict';
var React = require('react');
var _ = require('lodash');

var SinglePhotoView = React.createClass({
  delete: function (evt) {
    this.props.socket.emit('Photo:delete', this.props.photo.id);
  },
  download: function (evt) {
    window.location = '/photo/download/' + this.props.photo.id;
  },
  render: function () {
    var photo = this.props.photo;
    var style = {
      top: photo.y + 'px',
      left: photo.x + 'px'
    };
    return (
      <div className='single-photo-view' style={ style }>
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
