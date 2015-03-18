/*jshint node:true */
'use strict';

var config = require('config');
console.log(config);
var http = require('http');
var serve = require('koa-static');
var routing = require('koa-routing');

var app = require('koa')();

// var auth = require('./auth');
// var authRouter = require('./auth/authRouter');
var socketHandler = require('./socket-handler');
var clientConfigParser = require('./client-config-parser');

// Middleware
app
  .use(routing(app))
  // .use(auth.initialize())
  // .use(auth.session());

app
  .use(serve(__dirname + '/../client'))

app.route('/config.js')
  .get(clientConfigParser);

var server = http.createServer(app.callback());
var io = require('socket.io')(server);
server.listen(8000);

io.on('connection', socketHandler.bind(null, io));
