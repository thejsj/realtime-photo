/*jshint node:true */
'use strict';


var http = require('http');
var serve = require('koa-static');
var routing = require('koa-routing');

var app = require('koa')();
var config = require('config');
console.log(config);

// var auth = require('./auth');
// var authRouter = require('./auth/authRouter');
var socketHandler = require('./socket-handler');
var fileDownloader = require('./api/file-downloader');
var clientConfigParser = require('./client-config-parser');

// Middleware
app
  .use(routing(app))

app
  .use(serve(__dirname + '/../client'))


app.route('/photo/download/:id')
  .get(fileDownloader);

app.route('/config.js')
  .get(clientConfigParser);

var server = http.createServer(app.callback());
server.listen(config.get('ports').http);
var io = require('socket.io')(server);

io.on('connection', socketHandler.bind(null, io));
console.log('Hello!');
