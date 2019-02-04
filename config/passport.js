const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const usersDebug = require('debug')('app:users');


//Load user model
require('../models/User');
const User = mongoose.model('users');

module.exports = function (passport) {
  passport.use(new LocalStrategy({
    usernameField: 'email'
  },(email, password, done) => {
    User.findOne({
      email: email
    }).then(user => {

      // No user with that email found
      if(!user) {
        return done(null, false, { message: 'Invalid email/password.'});
      }

      // Match password
      bcrypt.compare(password, user.password, (err, isMatch) =>{
        if(err){
          usersDebug('Error with bcrypt compare.');
          usersDebug(err);
          return;
        }

        if(isMatch) {
          return done(null, user)
        } else {
          return done(null, false, { message: 'Invalid email/password.' });
        }


      });

    });
  }));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

}