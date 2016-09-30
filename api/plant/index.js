'use strict';

var express = require('express');
var Plant = require('./plant.model')

var router = express.Router();

router.get('/', function(req, res) {
  Plant.find({
      type: {
        $nin: ['Response']
      }
    }, null, {
      sort: {
        createdAt: -1
      }
    })
    .populate('responses.response')
    .exec(function(err, data) {
      if (err) {
        res.send({
          error: true,
          message: err
        });
        return;
      }

      res.send(data);
    })
});
// router.get('/:id', controller.show);
router.post('/', function(req, res) {

  Plant.create(req.body, function(err, dt) {
    console.log(req.body);
    console.log(dt);
    if (err) {
      res.status(500).send({
        error: true,
        message: err
      });

    } else {
      res.send(dt)
    }

  })

});

router.post('/response', function(req, res) {
  if (req.body.response) {
    req.body.response.type = "Response";
  } else {
    res.status(400).send({
      error: true,
      message: "Empty request body"
    });
    return;
  }

  console.log("object of post -> " + req.body);
  Plant.create(req.body.response, function(err, dt) {
    console.log(req.body);
    console.log(dt);
    if (err) {
      res.status(500).send({
        error: true,
        message: err
      });

    } else {
      console.log("object id of response-> " + dt._id);
      Plant.findOne({
        _id: req.body.id
      }, function(err, doc) {
        console.log(doc);
        doc.responses.push({
          response: dt._id
        });
        doc.save(function(err, updatedDoc) {
          if (err) {
            res.status(500).send(err);
            return;}
          Plant.populate(updatedDoc, {path:'responses.response'}, function(err, doc) {
            res.send(doc);
           });


          console.log("SUCCESS");
        });
      });
    }

  })

});
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;
