'use strict';

var express = require('express');
var Plant = require('./plant.model')

var router = express.Router();

// router.get('/', controller.index);
// router.get('/:id', controller.show);
router.post('/', function(req, res) {

  Plant.create(req.body, function(err, dt) {
    if (err) res.send(err);
    console.log(dt);
    res.send({done:true})

  })

});
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;
