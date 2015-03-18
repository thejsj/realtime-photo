'use strict';
var React = require('react');
var DropView = require('./drop-view');
var MessageView = require('./message-view');

var Main = React.createClass({
  render: function () {
    return (
      <div className='main-view'>
        <DropView socket={this.props.socket} userId={this.props.userId} photos={ this.props.photos }/>
        <MessageView messages={ this.props.messages } />
      </div>
    );
  }
});

module.exports = Main;
