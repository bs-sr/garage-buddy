const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const databaseDebug = require('debug')('app:db');

// Load Vehicle Model
require('../models/Vehicle');
const Vehicle = mongoose.model('vehicles');

// Get vehicles for the add project dropdowns
router.get('', (req, res) => {

  // Query db for vehicles
  Vehicle.find({}, {'_id': 0, 'year': 1, 'make': 1, 'model': 1})
    .then(vehicles => {
      res.send(vehicles);
    })
    .catch(err => {
      databaseDebug('ERROR while querying for all vehicles.');
      databaseDebug(err);
    });

});

module.exports = router;
