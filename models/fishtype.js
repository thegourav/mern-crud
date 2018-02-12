const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');
const validate = require('mongoose-validator');

const nameValidator = [
  validate({
    validator: 'isLength',
    arguments: [0, 40],
    message: 'Type must not exceed {ARGS[1]} characters.'
  })
];

// Define the database model
const FishTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    validate: nameValidator
  },
  category: {
    type: String,
  },
  stock: {
    type: Number,
  },
});

// Use the unique validator plugin
FishTypeSchema.plugin(unique, { message: 'That {PATH} is already taken.' });

const FishType = module.exports = mongoose.model('fishtype', FishTypeSchema);
