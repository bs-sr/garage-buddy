const express = require('express');
const router = express.Router();
const usersDebug = require('debug')('app:users');
const databaseDebug = require('debug')('app:db');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');



// Load User Model
require('../models/User');
const User = mongoose.model('users');


// User login route
router.get('/login', (req, res) => {
  res.render('users/login');
});

// User logout route
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You have logged out');
  res.redirect('/users/login');
});

// User register route
router.get('/register', (req, res) => {
  res.render('users/register');
});

// Login form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/projects',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Resgister form POST
router.post('/register', (req, res) => {
  let errors = [];

  // Name not blank
  if(req.body.name.length < 1) {
    errors.push({
      text: 'Please fill out the name field.'
    });
  }

  // Email not blank
  if(req.body.email.length < 1) {
    errors.push({
      text: 'Please fill out the email field.'
    });
  }

  // Password match
  if (req.body.password != req.body.password2) {
    errors.push({
      text: 'Passwords do not match.'
    });
  }

  // Password length
  if(req.body.password.length < 5) {
    errors.push( {
      text: 'Password must be at least 6 characters long.'
    });
  }

  if(errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name
    });
  } else {

    // Email doesnt already exist
    User.findOne({
        email: req.body.email
      })
      .then(user => {
        if (user) {
          errors.push({
            text: 'Email already in use.'
          });

          res.render('users/register', {
            errors: errors,
            name: req.body.name
          })
        }else {
          const newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          }

          // Hash password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) {
                usersDebug('ERROR with bcrypt password hash.')
                usersDebug(err);
                return;
              } else {
                newUser.password = hash;

                // Redirect
                new User(newUser)
                  .save()
                  .then(user => {
                    req.flash('success_msg', 'You are now registered and can log in.');
                    res.redirect('/users/login');
                  })
                  .catch(err => {
                    req.flash('error_msg', 'Error adding new user.');
                    databaseDebug('ERROR while saving new user.');
                    databaseDebug(err);
                  });

              }
            });
          });
        }
      });
  }

});

module.exports = router;