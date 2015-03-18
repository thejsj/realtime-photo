/*jshint node:true */
'use strict';

var config = require('config');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var q = require('q');
var r = require('../db');

passport.serializeUser(function (user, done) {
  return done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  r
    .table('users')
    .get(id)
    .run(r.conn)
    .then(function (user) {
      done(null, user);
    });
});

var callbackURL = 'http://' + config.get('url') + ':' + config.get('ports').http + '/auth/login/callback';
if (config.get('ports').http === '80') {
  callbackURL = 'http://' + config.get('url') + '/auth/login/callback';
}

passport.use(new GitHubStrategy({
    clientID: config.get('github').clientID,
    clientSecret: config.get('github').clientSecret,
    callbackURL: callbackURL
  },
  function (accessToken, refreshToken, profile, done) {
    if (accessToken !== null) {
      r
        .table('users')
        .getAll(profile.username, { index: 'login' })
        .run(r.conn)
        .then(function (cursor) {
          return cursor.toArray()
            .then(function (users) {
              if (users.length > 0) {
                console.log('User Signed In:', users[0].login);
                return done(null, users[0]);
              }
              return r.table('users')
                .insert({
                  'login': profile.username,
                  'name': profile.displayName || null,
                  'url': profile.profileUrl,
                  'avatarUrl': profile._json.avatar_url
                })
                .run(r.conn)
                .then(function (response) {
                  return r.table('users')
                    .get(response.generated_keys[0])
                    .run(r.conn);
                })
                .then(function (newUser) {
                  console.log('New user Added');
                  done(null, newUser);
                });
            });
        })
        .catch(function (err) {
          console.log('Error Getting User', err);
        });
    }
  }
));

passport.checkIfLoggedIn = function (req, res, next) {
  if (req.user) {
    return next();
  }
  return res.status(401).send('You\'re not logged in');
};

module.exports = passport;
