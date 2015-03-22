/*jshint node:true */
'use strict';

var config = require('config');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
io.set('transports', ["websocket", "polling"]);

console.log(config);
// var auth = require('./auth');
// var authRouter = require('./auth/authRouter');
var socketHandler = require('./socket-handler');
var fileDownloader = require('./api/file-downloader');
var clientConfigParser = require('./client-config-parser');

server.listen(config.get('ports').http);

// Middleware
app
  .use('/config.js', clientConfigParser)
  .get('/photo/download/:id', fileDownloader)
  .use(express.static(__dirname + '/../client'))
  .use('*', function (req, res) {
    res.status(404).send('404 Not Found').end();
  });

io.on('connection', socketHandler.bind(null, io));

console.log('-- 10:00 -- Hello! --- ', new Date().toString());
