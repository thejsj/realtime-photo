'use strict';
var config = require('config');

var clientConfigParser = function *(next) {
  var _config = {
    'ports': config.get('ports'),
    'url': config.get('url')
  };
  console.log('--- Hello! ---');
  this.type = 'text/javascript';
  this.body = 'window.config = ' + JSON.stringify(_config) + ';';
  yield next;
};

module.exports = clientConfigParser;
