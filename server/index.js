/*jshint node:true */
'use strict';


var http = require('http');
var express = require('express');
var app = express();
var config = require('config');
console.log(config);
var server = require('http').Server(app);
var io = require('socket.io')(config.get('ports').socket);

// var auth = require('./auth');
// var authRouter = require('./auth/authRouter');
var socketHandler = require('./socket-handler');
var fileDownloader = require('./api/file-downloader');
var clientConfigParser = require('./client-config-parser');

// Middleware
app
  .use('/config.js', clientConfigParser)
  .get('/photo/download/:id', fileDownloader)
  .use(express.static(__dirname + '/../client'));

io.on('connection', socketHandler.bind(null, io));
server.listen(config.get('ports').http);
console.log('Hello!');
