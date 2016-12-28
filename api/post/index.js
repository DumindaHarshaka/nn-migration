'use strict';

var Router = require('express').Router;
var controller = require('./post.controller');
var auth = require('../../auth/auth.service');
var upload = require('../../upload')

var router = new Router();

// router.get('/', auth.hasRole('admin'), controller.index);
// router.delete('/:id', auth.hasRole('admin'), controller.destroy);
// router.get('/me', auth.isAuthenticated(), controller.me);
// router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
// router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/',upload.img_upload.array('file'),controller.create);
// router.get('/verify/:id', controller.verify);
// router.get('/discard/:id', controller.discard);

module.exports = router;
