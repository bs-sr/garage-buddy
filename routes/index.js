const express = require('express');
const router = express.Router();

// Index Route
router.get('', (req, res) => {
  res.render('index');
});

// About Page
router.get('/about', (req, res) => {
  res.render('about');
});

module.exports = router;