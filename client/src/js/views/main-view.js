'use strict';
var React = require('react');
var DropView = require('./drop-view');
var PhotoView = require('./photo-view');

var Main = React.createClass({
  render: function () {
    return (
      <div className='main-view'>
        <DropView socket={this.props.socket} userId={this.props.userId} />
        <PhotoView photos={ this.props.photos } />
      </div>
    );
  }
});

module.exports = Main;
