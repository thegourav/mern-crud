const express = require('express');
const router = express.Router();
const RateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const stringCapitalizeName = require('string-capitalize-name');

const FishType = require('../models/fishtype');

// Attempt to limit spam post requests for inserting data
const minutes = 5;
const postLimiter = new RateLimit({
  windowMs: minutes * 60 * 1000, // milliseconds
  max: 100, // Limit each IP to 100 requests per windowMs 
  delayMs: 0, // Disable delaying - full speed until the max limit is reached 
  handler: (req, res) => {
    res.status(429).json({ success: false, msg: `You made too many requests. Please try again after ${minutes} minutes.` });
  }
});

// READ (ONE)
router.get('/:id', (req, res) => {
    FishType.findById(req.params.id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(404).json({ success: false, msg: `No such Fishtype exists.` });
    });
});

// READ (ALL)
router.get('/', (req, res) => {
    FishType.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
    });
});

// CREATE
router.post('/', postLimiter, (req, res) => {

  // Validate the age
  //let name = sanitizeAge(req.body.age);
  //if (age < 5 && age != '') return res.status(403).json({ success: false, msg: `You're too young for this.` });
  //else if (age > 130 && age != '') return res.status(403).json({ success: false, msg: `You're too old for this.` });

  let newFishType = new FishType({
    name: sanitizeName(req.body.name),
    category: sanitizeCategory(req.body.category),
    stock: req.body.stock, 
  });

  newFishType.save()
    .then((result) => {
      res.json({
        success: true,
        msg: `Successfully added!`,
        result: {
          _id: result._id,
          name: result.name,
          category: result.category,
          stock: result.stock,   
        }
      });
    })
    .catch((err) => {
      if (err.errors) {
        if (err.errors.name) {
          res.status(400).json({ success: false, msg: err.errors.name.message });
          return;
        }
        if (err.errors.category) {
          res.status(400).json({ success: false, msg: err.errors.gender.message });
          return;
        }
        // Show failed if all else fails for some reasons
        res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
      }
    });
});

// UPDATE
router.put('/:id', (req, res) => {

  // Validate the age
//   let age = sanitizeAge(req.body.age);
//   if (age < 5 && age != '') return res.status(403).json({ success: false, msg: `You're too young for this.` });
//   else if (age > 130 && age != '') return res.status(403).json({ success: false, msg: `You're too old for this.` });

  let updatedFishType = {
    name: sanitizeName(req.body.name),
    category: sanitizeCategory(req.body.category),
    stock: req.body.stock,
  };
  
  //only update stock
  if(updatedFishType.stock !== null && typeof updatedFishType.name === 'undefined'){
    updatedFishType = {
      stock: req.body.stock,
    }
  }

  FishType.findOneAndUpdate({ _id: req.params.id }, updatedFishType, { runValidators: true, context: 'query' })
    .then((oldResult) => {
        FishType.findOne({ _id: req.params.id })
        .then((newResult) => {
          res.json({
            success: true,
            msg: `Successfully updated!`,
            result: {
              _id: newResult._id,
              name: newResult.name,
              category: newResult.category,
              stock: newResult.stock,  
            }
          });
        })
        .catch((err) => {
          res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
          return;
        });
    })
    .catch((err) => {
      if (err.errors) {
        if (err.errors.name) {
          res.status(400).json({ success: false, msg: err.errors.name.message });
          return;
        }
        if (err.errors.category) {
          res.status(400).json({ success: false, msg: err.errors.gender.message });
          return;
        }
        // Show failed if all else fails for some reasons
        res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
      }
    });
});

// DELETE
router.delete('/:id', (req, res) => {

  FishType.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.json({
        success: true,
        msg: `It has been deleted.`,
        result: {
          _id: result._id,
          name: result.name,
          category: result.category,  
        }
      });
    })
    .catch((err) => {
      res.status(404).json({ success: false, msg: 'Nothing to delete.' });
    });
});

module.exports = router;

// Minor sanitizing to be invoked before reaching the database
sanitizeName = (name) => {
  return stringCapitalizeName(name);
}
sanitizeCategory = (category) => {
  // Return empty if it's neither of the two
  return (category === 'L' || category === 'S' || category === 'M') ? category : '';
}
