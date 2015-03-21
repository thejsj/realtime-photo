/*jshint node:true */
'use strict';

var _ = require('lodash');

var r = require('../db');

var fileDownloader = function (req, res) {
  var id = req.params.id;
  r
    .table('photos')
    .get(id)
    .run(r.conn)
    .then(function (result) {
      res.setHeader('Content-disposition', 'attachment; filename=' + result.fileName);
      res.send(result.file);
    }.bind(this));
};

module.exports = fileDownloader;
