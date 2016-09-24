/**
 * Express configuration
 */

'use strict';

var express = require('express');
var bodyParser = require('body-parser')

module.exports = {
  default: function(app) {
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({
      extended: false
    }))

    // parse application/json
    app.use(bodyParser.json())

  }
}
