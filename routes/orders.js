const express = require('express');
const router = express.Router();
const RateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const stringCapitalizeName = require('string-capitalize-name');

const Order = require('../models/order');
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

const decreaseStock = (_fishTypeID, unit) => {
  FishType.findOne({_id:_fishTypeID}).then((response) => {
    const oldStock = response.stock;
    const newStock = oldStock - Number(unit);
    const updatedOrder = {
      $inc : {stock: -(Number(unit))},
    };   
    return FishType.findOneAndUpdate({ _id: _fishTypeID }, updatedOrder);
  }).then((oldResult) => {
    console.log("success in orderplacing");      
  })
  .catch((err) => {
    console.log("error in orderplacing"+err);
    return;
  });
}

// READ (ONE)
router.get('/:id', (req, res) => {
  Order.findById(req.params.id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(404).json({ success: false, msg: `No such Order exists.` });
    });
});

// READ (ALL)
router.get('/', (req, res) => {
  Order.find({})
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

  let newOrder = new Order({
    _fishTypeID: req.body._fishTypeID,
    fishName: req.body.fishName,
    customerName: req.body.customerName,
    weight: req.body.weight,
    rate: req.body.rate,
    price: req.body.price,
    date: req.body.date,
  });

  newOrder.save()
    .then((result) => {
      res.json({
        success: true,
        msg: `Successfully added!`,
        result: {
          _id: result._id,
          _fishTypeID: result._fishTypeID,
          fishName: result.fishName,
          customerName: result.customerName,
          weight: result.weight,
          rate: result.rate,
          price: result.price,
          date: result.date,  
        }
      });
      decreaseStock(req.body._fishTypeID, Number(req.body.weight));
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

  let updatedOrder = {
    _fishTypeID: req.body._fishTypeID,
    fishName: req.body.fishName,
    customerName: req.body.customerName,
    weight: req.body.weight,
    rate: req.body.rate,
    price: req.body.price,
    date: req.body.date,
  };

  Order.findOneAndUpdate({ _id: req.params.id }, updatedOrder, { runValidators: true, context: 'query' })
    .then((oldResult) => {
        Order.findOne({ _id: req.params.id })
        .then((newResult) => {
          res.json({
            success: true,
            msg: `Successfully updated!`,
            result: {
              _id: newResult._id,
              _fishTypeID: newResult._fishTypeID,
              fishName: newResult.fishName,
              customerName: newResult.customerName,
              weight: newResult.weight,
              rate: newResult.rate,
              price: newResult.price,
              date: newResult.date,  
            }
          });
          decreaseStock(req.body._fishTypeID, Number(req.body.weight));
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

  Order.findByIdAndRemove(req.params.id)
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
