const express = require('express');
const router = express.Router();
const RateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const stringCapitalizeName = require('string-capitalize-name');

const Purchase = require('../models/purchase');
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

const increaseStock = (_fishTypeID, unit) => {
  FishType.findOne({_id:_fishTypeID}).then((response) => {
    const oldStock = response.stock;
    const newStock = oldStock + Number(unit);
    const updatedOrder = {
      $inc: {stock: Number(unit)},
    }
    return FishType.findOneAndUpdate({ _id: _fishTypeID }, updatedOrder);
  }).then((response) => {
    console.log("stock updated" + response);
  })
  .catch((err) => {
    console.log("error in uodating stock.."+err);
    return;
  });
}

// READ (ONE)
router.get('/:id', (req, res) => {
  Purchase.findById(req.params.id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(404).json({ success: false, msg: `No such Purchase exists.` });
    });
});

// READ (ALL)
router.get('/', (req, res) => {
  Purchase.find({})
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
  let newPurchase = new Purchase({
    _fishTypeID: req.body._fishTypeID,
    fishName: req.body.fishName,
    supplierName: req.body.supplierName,
    weight: req.body.weight,
    actualWeight: req.body.actualWeight,
    rate: req.body.rate,
    price: req.body.price,
  });

  newPurchase.save()
    .then((result) => {
      res.json({
        success: true,
        msg: `Successfully added!`,
        result: {
          _id: result._id,
          _fishTypeID: result._fishTypeID,
          fishName: result.fishName,
          supplierName: result.supplierName,
          weight: result.weight,
          actualWeight: result.actualWeight,
          rate: result.rate,
          price: result.price,
          date: result.date,  
        }
      });
      increaseStock(req.body._fishTypeID, Number(req.body.actualWeight));
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

  let updatedPurchase = {
    _fishTypeID: req.body._fishTypeID,
    fishName: req.body.fishName,
    supplierName: req.body.supplierName,
    weight: req.body.weight,
    actualWeight: req.body.actualWeight,
    rate: req.body.rate,
    price: req.body.price,
    date: req.body.date,
  };

  Purchase.findOneAndUpdate({ _id: req.params.id }, updatedPurchase, { runValidators: true, context: 'query' })
    .then((oldResult) => {
        Purchase.findOne({ _id: req.params.id })
        .then((newResult) => {
          res.json({
            success: true,
            msg: `Successfully updated!`,
            result: {
              _id: newResult._id,
              _fishTypeID: newResult._fishTypeID,
              fishName: newResult.fishName,
              supplierName: newResult.supplierName,
              weight: newResult.weight,
              actualWeight: newResult.actualWeight,
              rate: newResult.rate,
              price: newResult.price,
              date: newResult.date,  
            }
          });
          increaseStock(req.body._fishTypeID, Number(req.body.actualWeight));
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

  Purchase.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.json({
        success: true,
        msg: `It has been deleted.`,
        result: {
          _id: result._id,
        }
      });
    })
    .catch((err) => {
      res.status(404).json({ success: false, msg: 'Nothing to delete.' });
    });
});

module.exports = router;
