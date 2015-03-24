/*jshint node:true */
'use strict';

var config = require('config');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
io.set('transports', ["websocket", "polling"]);

var bodyParser = require('body-parser');

console.log(config);
var socketHandler = require('./socket-handler');
var imageDownload = require('./api/image').download
var imageCreate = require('./api/image').create;
var imageUpdate = require('./api/image').update;
var clientConfigParser = require('./client-config-parser');

server.listen(config.get('ports').http);

// Middlewares
app
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .use(bodyParser.json());

// Routes
app
  .use('/config.js', clientConfigParser)
  .get('/image/download/:id', imageDownload)
  .post('/image/:id', imageUpdate)
  .put('/image/:id', imageUpdate)
  .post('/image/', imageCreate)
  .use(express.static(__dirname + '/../client'))
  .use('*', function (req, res) {
    res.status(404).send('404 Not Found').end();
  });

io.on('connection', socketHandler.bind(null, io));

console.log(new Date().toString());
