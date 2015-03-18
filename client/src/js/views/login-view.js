/*jshint node:true */
/*global io:true, console:true, $:true */
'use strict';
var React = require('react');

var LoginView = React.createClass({
  render: function () {
    if(this.props.thisUser) return (null);
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-sm-4 col-sm-offset-4 col-xs-8 col-xs-offset-2 login-container'>
            <p>Login. Invite your friends. Play.</p>
            <a id='login-button' className='btn btn-block btn-lg btn-social btn-github'  href='/auth/login'>
               <i className="fa fa-github"></i>
              Login With GitHub
            </a>
          </div>
        </div>
        <div id='container'></div>
      </div>
    );
  }
});

module.exports = LoginView;
