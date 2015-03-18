'use strict';
var React = require('react');
var _ = require('lodash');

var MessageView = React.createClass({
  render: function () {
    return (
      <div className='error-view'>
      { _.map(this.props.messages, function(message, i) {
        return (
          <div className={ message.type + ' message' }>
            <p>{ message.message }</p>
          </div>
        );
      }, this) }
      </div>
    );
  }
});

module.exports = MessageView;
