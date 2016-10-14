'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var email = require('../../email/email.service');
var jwt = require('jsonwebtoken');

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
  /**
   * Get list of users
   * restriction: 'admin'
   */
  index: function(req, res) {
    return User.find({}, '-salt -password').exec()
      .then(users => {
        res.status(200).json(users);
      })
      .catch(handleError(res));
  },

  /**
   * Creates a new user
   */
  create: function(req, res, next) {

    console.log(req.body);
    var newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.role = 'user';
    newUser.save()
      .then(function(user) {
        email.sendVerification({
          verification_code: user.verification_code,
          to: user.email
        });
        var token = jwt.sign({
          _id: user._id
        }, config.secrets.session, {
          expiresIn: 60 * 60 * 5
        });
        res.json({
          token
        });
      })
      .catch(validationError(res));
  },
  verify: function(req, res, next) {
    return User.findOne({
        verification_code: req.params.id
      }).exec()
      .then(user => {
        user.verified = true;
        user.save()
          .then(user => {
            res.redirect("/email-verified");
          })
          .catch(next())
      })

  },
  discard: function(req, res, next) {
    return User.findOne({
        verification_code: req.params.id
      }).exec()
      .then(user => {
        console.log(user);
        console.log(user.verified);

        if (user.verified === 'false') {
          user.active = false;
          user.save()
          .then(user => {
              res.redirect("/email-discarded");
            })
            .catch(console.log(err))
        }else {
          //res.redirect("/");
        }

      })
  },
  /**
   * Get a single user
   */
  show: function(req, res, next) {
    var userId = req.params.id;

    return User.findById(userId).exec()
      .then(user => {
        if (!user) {
          return res.status(404).end();
        }
        res.json(user.profile);
      })
      .catch(err => next(err));
  },

  /**
   * Deletes a user
   * restriction: 'admin'
   */
  destroy: function(req, res) {
    return User.findByIdAndRemove(req.params.id).exec()
      .then(function() {
        res.status(204).end();
      })
      .catch(handleError(res));
  },

  /**
   * Change a users password
   */
  changePassword: function(req, res, next) {
    var userId = req.user._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);

    return User.findById(userId).exec()
      .then(user => {
        if (user.authenticate(oldPass)) {
          user.password = newPass;
          return user.save()
            .then(() => {
              res.status(204).end();
            })
            .catch(validationError(res));
        } else {
          return res.status(403).end();
        }
      });
  },

  /**
   * Get my info
   */
  me: function(req, res, next) {
    var userId = req.user._id;

    return User.findOne({
        _id: userId
      }, '-salt -password').exec()
      .then(user => { // don't ever give out the password or salt
        if (!user) {
          return res.status(401).end();
        }
        res.json(user);
      })
      .catch(err => next(err));
  },

  /**
   * Authentication callback
   */
  authCallback: function(req, res, next) {
    res.redirect('/');
  }
}
