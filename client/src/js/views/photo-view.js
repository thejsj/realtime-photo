'use strict';
var React = require('react');
var _ = require('lodash');

var PhotoView = React.createClass({
  render: function () {
    return (
      <div className='photo-view'>
      { _.map(this.props.photos, function(photo, i) {
        console.log('Rendering New Photo')
        console.log(photo.file.substring(0, 30));
        return (
          <img src={photo.file} />
        );
      }, this) }
      </div>
    );
  }
});

module.exports = PhotoView;
