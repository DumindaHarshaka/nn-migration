'use strict';

var express = require('express');
var Plant = require('./plant.model')
var User = require('../user/user.model')

var router = express.Router();
//
//
//get all plants
//
//
router.get('/', function(req, res) {
  Plant.find({
      type: {
        $nin: ['Response']
      },
      status:{
        $nin:['deleted','closed']
      }

    }, null, {
      sort: {
        createdAt: -1
      }
    })
    .select('-responses.contact_info')
    .populate('responses.response')

  .populate('owner', '_id name')
    .exec(function(err, data) {
      if (err) {
        res.send({
          error: true,
          message: err
        });
        return;
      } else {

        User.populate(data, {
          path: 'responses.response.owner',
          select: '_id name',
          // <== We are populating phones so we need to use the correct model, not User
        }, function(err, docs) {
          if (err) {
            res.send({
              error: true,
              message: err
            });
            return;
          }
          res.send(docs);
        });
      }


    })
});
//
//
// find plants by user
//
//
router.get('/user/:id', function(req, res) {
  Plant.find({
      owner: req.params.id,
      type: {
        $nin: ['Response']
      },
      status:{
        $nin:['deleted','closed']
      }
    }, null, {
      sort: {
        createdAt: -1
      }
    })
    .select('-responses.contact_info')
    .populate('responses.response')

  .populate('owner', '_id name')
    .exec(function(err, data) {
      if (err) {
        res.send({
          error: true,
          message: err
        });
        return;
      } else {

        User.populate(data, {
          path: 'responses.response.owner',
          select: '_id name',
          // <== We are populating phones so we need to use the correct model, not User
        }, function(err, docs) {
          if (err) {
            res.send({
              error: true,
              message: err
            });
            return;
          }
          res.send(docs);
        });
      }


    })
});
//
//
// create a plant
//
//
router.post('/', function(req, res) {

  Plant.create(req.body, function(err, dt) {
    //console.log(req.body);
    //console.log(dt);
    if (err) {
      res.status(500).send({
        error: true,
        message: err
      });

    } else {
      //console.log(dt._id);
      Plant.findOne({
          _id: dt._id
        })
        .populate('owner', '_id name')
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
    }

  })

});
//
//
//update a plant
//
//
router.put('/:id', function(req, res) {
  console.log(req.body);
  Plant.findOneAndUpdate({
    _id: req.params.id
  }, req.body, {
    upsert: true
  }, function(err, doc) {
    if (err) return res.send(500, {
      error: err
    });
    Plant.findOne({
      _id: req.params.id
    }, function(err, doc) {
      if (err) return res.send(500, {
        error: err
      });
      console.log(doc);
      return res.send(doc);
    })


  });

});
//
//
// bid on a plant
//
//
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

  User.findOne({
      email: 'guest@guest.com'
    })
    .exec(function(err, doc) {
      if (err) {
        res.status(500).send({
          error: true,
          message: err
        });
      }
      //
      //
      // get guest user for
      if (req.body.response.owner === 'guest') {
        req.body.response.owner = doc._id;
      }
      //
      //

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
              response: dt._id,
              contact_info: req.body.response.contact_info
            });
            doc.save(function(err, updatedDoc) {
              if (err) {
                res.status(500).send(err);
                return;
              }
              Plant.populate(updatedDoc, {
                path: 'responses.response'
              }, function(err, doc) {
                User.populate(doc, {
                  path: 'responses.response.owner',
                  select: '_id name',
                  // <== We are populating phones so we need to use the correct model, not User
                }, function(err, docs) {
                  if (err) {
                    res.send({
                      error: true,
                      message: err
                    });
                    return;
                  }
                  res.send(docs);
                });

                //res.send(doc);
              });


              console.log("SUCCESS");
            });
          });
        }

      })


    })

  //console.log(req.body.response.owner);


});
//
//
// response by id
//
//
router.get('/response/:id', function(req, res) {
  Plant.findOne({
      'responses._id': req.params.id
    })
    //.select('responses.contact_info')
    .exec(function(err, data) {
      if (err) {
        res.status(500).send({
          error: err
        })
        return;
      }
      var relation = data.responses.id(req.params.id)
      console.log(relation);
      res.status(200).send({
        contact_info: relation.contact_info
      });
    })
});
//
//
// search
//
//
router.get('/search/:id', function(req, res) {
  Plant.find(

      {
        $text: {
          $search: req.params.id
        },
        type: {
          $nin: ['Response']
        },
        status:{
          $nin:['deleted','closed']
        }
      }, {
        score: {
          $meta: "textScore"
        }
      }

    )
    .sort({
      score: {
        $meta: 'textScore'
      }
    })
    .select('-responses.contact_info')
    .populate('responses.response')
    .populate('owner', '_id name')
    .exec(function(err, data) {
      if (err) {
        res.status(500).send({
          error: err
        })
        return;
      }
      User.populate(data, {
        path: 'responses.response.owner',
        select: '_id name',
        // <== We are populating phones so we need to use the correct model, not User
      }, function(err, docs) {
        if (err) {
          res.send({
            error: true,
            message: err
          });
          return;
        }
        console.log(data);
        res.status(200).send(docs);
        //res.send(docs);
      });


    })
});
//
//
// find bids by user
//
//
router.get('/user/bids/:id', function(req, res) {
  Plant.find({
      type: {
        $nin: ['Response']
      }
    }, null, {
      sort: {
        createdAt: -1
      }
    })
    .select('-responses.contact_info')
    .populate({
      path: 'responses.response',
      match: {
        owner: req.params.id
      }
    })
    //.where('responses.response.owner').equals(req.params.id)


  .populate('owner', '_id name')
    .exec(function(err, data) {
      if (err) {
        res.send({
          error: true,
          message: err
        });
        return;
      } else {
        //console.log(data);
        data = data.filter(function(d) {
          d.responses = d.responses.filter(function(response) {
            //console.log(response);
            return true;

          });
          return d.responses.length > 0;
        });
        //console.log(data);

        User.populate(data, {
          path: 'responses.response.owner',
          select: '_id name',
          // <== We are populating phones so we need to use the correct model, not User
        }, function(err, docs) {
          if (err) {
            res.send({
              error: true,
              message: err
            });
            return;
          }
          res.send(docs);
        });
      }


    })
});
//
//
// delete plant
//
//
router.delete('/:id', function(req, res) {
  console.log('deleting - ' + req.params.id);
  Plant.findOneAndUpdate({
    _id: req.params.id
  }, {
    status: 'deleted'
  }, {
    upsert: true
  }, function(err, doc) {
    if (err) return res.send(500, {
      error: err
    });
    Plant.findOne({
      _id: req.params.id
    }, function(err, doc) {
      if (err) return res.send(500, {
        error: err
      });
      console.log(doc);
      return res.send(doc);
    })


  });

});
//
//
// mark a post as closed
//
//
router.post('/close/:id', function(req, res) {
  console.log('closing - ' + req.params.id);
  Plant.findOneAndUpdate({
    _id: req.params.id
  }, {
    status: 'closed'
  }, {
    upsert: true
  }, function(err, doc) {
    if (err) return res.send(500, {
      error: err
    });
    Plant.findOne({
      _id: req.params.id
    }, function(err, doc) {
      if (err) return res.send(500, {
        error: err
      });
      console.log(doc);
      return res.send(doc);
    })


  });

});
//
//
// mark post as review
//
//
router.post('/report/:id', function(req, res) {
  console.log('review - ' + req.params.id);
  Plant.findOneAndUpdate({
    _id: req.params.id
  }, {
    status: 'review'
  }, {
    upsert: true
  }, function(err, doc) {
    if (err) return res.send(500, {
      error: err
    });
    Plant.findOne({
      _id: req.params.id
    }, function(err, doc) {
      if (err) return res.send(500, {
        error: err
      });
      console.log(doc);
      return res.send(doc);
    })


  });

});

// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;
