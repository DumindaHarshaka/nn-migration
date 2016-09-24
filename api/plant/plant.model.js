// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var plantSchema = new Schema({
  address: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  quantity: {
    type: Number,
    required: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  approved: {
    type: Boolean,
    required: false,
    default: true
  },
}, {
  timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Plant = mongoose.model('Plant', plantSchema);

// make this available to our users in our Node applications
module.exports = Plant;
