'use strict';

var multer  = require('multer');
var uuid = require('node-uuid');

var img_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/images')
  },
  filename: function (req, file, cb) {
    cb(null, uuid.v4() + "."+file.mimetype.split('/')[1]) //Appending .jpg
  }
})

var vid_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/videos')
  },
  filename: function (req, file, cb) {
    cb(null, uuid.v4() + "."+file.mimetype.split('/')[1]) //Appending .jpg
  }
})

var doc_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/docs')
  },
  filename: function (req, file, cb) {
    cb(null, uuid.v4() + "."+file.mimetype.split('/')[1]) //Appending .jpg
  }
})

var img_upload = multer({ storage: img_storage });
var vid_upload = multer({ storage: vid_storage });
var doc_upload = multer({ storage: doc_storage });

module.exports = {
  img_upload: img_upload,
  vid_upload: vid_upload,
  doc_upload: doc_upload

}
