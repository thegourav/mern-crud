const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');
const validate = require('mongoose-validator');

// Define the database model
const OrderSchema = new mongoose.Schema({
  _fishTypeID: {
    type: String,
    required: [true, 'type is required.'],
  },
  fishName: {
    type: String,
  },
  customerName: {
    type: String,
  },
  weight: {
    type: Number,
    required: [true, 'weight is required.'],
  },
  rate:{
    type: Number,
    required: [true, 'rate is required.'],
  },
  price:{
    type: Number,
    required: [true, 'Price is required.'],
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Use the unique validator plugin
OrderSchema.plugin(unique, { message: 'That {PATH} is already taken.' });

const Order = module.exports = mongoose.model('order', OrderSchema);
