'use strict';

var User = require('../user/user.model');
var config = require('../../config/environment');
var email = require('../../email/email.service');
var gm = require('gm');

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function getMeta(path) {
  return new Promise(function(resolve, reject) {
    gm('./' + path).size(function(err, size) {
      if (!err) {
        console.log(size.height);
        resolve({
          url: path,
          meta: {
            height: size.height,
            width: size.width
          }
        });
      } else {
        reject(err);
      }
    })
  });
}

module.exports = {
  create: function(req, res) {
    var promises = [];
    for (var i = 0; i < req.files.length; i++) {
      promises.push(getMeta(req.files[i].path))
    }
    Promise.all(promises).then(function(result) {
      console.log(result);
    }).catch(function(err) {
      console.log(err);
    })

  }
}
