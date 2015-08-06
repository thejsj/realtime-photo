'use strict';
/**
 * Configuration Structure
 *
 * default.js
 * - test.js
 * - development.js
 * - - staging.js
 * - - - production.js
 */
var config = {
  'rethinkdb': {
    'host': 'localhost',
    'port': 28015,
    'db': 'realtime_photo_sharing'
  },
  'ports': {
    'http': 8000,
  },
  'url': 'localhost',
  'googleAnaylitcsUACode': false
};
module.exports = config;
