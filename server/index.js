/*jshint node:true */
'use strict';

var config = require('config');
var http = require('http');
var serve = require('koa-static');
var routing = require('koa-routing');

var app = require('koa')();
console.log(config);

// var auth = require('./auth');
// var authRouter = require('./auth/authRouter');
var socketHandler = require('./socket-handler');
var fileDownloader = require('./api/file-downloader');
var clientConfigParser = require('./client-config-parser');

app
  .use(function *(next) {
    console.log(' -- request -- ');
    yield next;
  });

// Middleware
app
  .use(routing(app))
  // .use(auth.initialize())
  // .use(auth.session());

app
  .use(serve(__dirname + '/../client'))


app.route('/photo/download/:id')
  .get(fileDownloader);

app.route('/config.js')
  .get(clientConfigParser);

var server = http.createServer(app.callback());
server.listen(8000);
var io = require('socket.io')(server);

io.on('connection', socketHandler.bind(null, io));
console.log('Hello!');
