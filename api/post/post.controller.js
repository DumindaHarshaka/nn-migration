'use strict';

var User = require('../user/user.model');
var config = require('../../config/environment');
var email = require('../../email/email.service');


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
module.exports = {
  create: function(req,res) {
    //console.log(req.files);
    console.log(req.files);
  }
}
