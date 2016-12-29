'use strict';

var User = require('../user/user.model');
var Post = require('./post.model');
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
      req.body.post.images = result;
      console.log(result);
      console.log(req.body);
      Post.create(req.body.post,function(err,result) {
        console.log(result);
      })
    }).catch(function(err) {
      console.log(err);
    })

  },
  findAll: function(req, res) {
    Post.find({
      type: {
        $nin: ['comment']
      },
      status: {
        $nin: ['deleted', 'closed', 'pending']
      }

    }, null, {
      sort: {
        createdAt: -1
      }
    }).select('-status').populate('comments.comment').populate('owner', '_id name').exec(function(err, data) {
      if (err) {
        res.send({error: true, message: err});
        return;
      } else {

        return User.populate(data, {
          path: 'comments.comment.owner',
          select: '_id name',
          // <== We are populating phones so we need to use the correct model, not User
        }, function(err, docs) {
          if (err) {
            res.send({error: true, message: err});
            return;
          }
          res.send(docs);
        });
      }

    })
  }
}
