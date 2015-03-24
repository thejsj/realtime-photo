/*jshint node:true */
'use strict';

var _ = require('lodash');
var r = require('../db');
var multiparty = require('multiparty');

var imageDownloader = function (req, res) {
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

var imageCreate = function (req, res) {
  if (req.body.image) {
    r
      .table('photos')
      .insert(req.body.image)
      .run(r.conn)
      .then(function (query_result) {
        res.json( {
          id: query_result.generated_keys[0]
        });
      });
  }
};

var _checkType = function (str) {
  var types = [
    'image/png',
    'image/jpeg',
    'image/gif'
  ];
  if (types.indexOf(str) !== -1) return true;
  return false;
};

var imageUpdate = function (req, res) {
  var form = new multiparty.Form();
  form.parse(req, function (err, fields) {
    /*
     * TODO: Add messages
     * 1. Size
     * 2. Uploaded
     * 3. Error
     */
    if (fields.file && req.params.id) {
      var image = fields.file[0];
      var matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (Array.isArray(matches) && _checkType(matches[1])) {
        if (image) image = r.binary(new Buffer(matches[2], 'base64'));
        r
          .table('photos')
          .get(req.params.id)
          .update({
            file: image
          })
          .run(r.conn)
          .then(function (query_result) {
            res.json( {
              id: req.params.id
            });
          });
      };
    }
  });
}

exports.download = imageDownloader;
exports.create = imageCreate;
exports.update = imageUpdate;
