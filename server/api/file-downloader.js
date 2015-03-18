/*jshint node:true */
'use strict';

var _ = require('lodash');

var r = require('../db');

var fileDownloader = function *(next) {
  var id = _.last(this.request.url.split('/'));
  yield r
    .table('photos')
    .get(id)
    .run(r.conn)
    .then(function (result) {
      this.set('Content-disposition', 'attachment; filename=' + result.fileName);
      this.body = result.file;
    }.bind(this));
};

module.exports = fileDownloader;
