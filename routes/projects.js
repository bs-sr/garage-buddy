const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const databaseDebug = require('debug')('app:db');

const {ensureAuthenticated} = require('../helpers/auth');


// Load Project Model
require('../models/Project');
const Project = mongoose.model('projects');

// Projects Index Page
router.get('', ensureAuthenticated, (req, res) => {

  // Query db for projects
  Project.find({
    user: req.user.id
  })
    .sort({
      date: 'desc'
    })
    .then(projects => {
      res.render('projects/index', {
        projects: projects
      });

    })
    .catch(err => {
      databaseDebug('ERROR while querying for all projects.');
      databaseDebug(err);
    });
});

// Add Project Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('projects/add');
});

// Add Process Form
router.post('', ensureAuthenticated, (req, res) => {

  // Input validation
  let errors = [];

  if (!req.body.make) {
    errors.push({
      text: 'Please add a make for your project.'
    })
  }
  if (!req.body.model) {
    errors.push({
      text: 'Please add a model for your project.'
    })
  }
  if (!req.body.year) {
    errors.push({
      text: 'Please add a year for your project.'
    })
  }
  if (!req.body.plans) {
    errors.push({
      text: 'Please add plans for your project.'
    })
  }

  if (errors.length > 0) {
    res.render('projects/add', {
      errors: errors,
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      plans: req.body.plans
    });

    return;
  } else {

    const newProject = {
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      plans: req.body.plans,
      user: req.user.id
    }

    // Redirect
    new Project(newProject)
      .save()
      .then(project => {
        req.flash('success_msg', 'New project has been added.');
        res.redirect('/projects');
      })
      .catch(err => {
        req.flash('error_msg', 'Error adding new project.');
        databaseDebug('ERROR while saving new project.');
        databaseDebug(err);
      });

  }
});

// Edit Project Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {

  // Query db for the specific project
  Project.findOne({
      _id: req.params.id
    })
    .then(project => {

      // Ensure current user owns this project
      if(project.user != req.user.id) {
        req.flash('error_msg', 'You are not authorized to edit this project.');
        res.redirect('/projects');
      } else {
        res.render('projects/edit', {
          project: project
        });
      }


    })
    .catch(err => {
      databaseDebug('ERROR while querying for a project.');
      databaseDebug(err);
    });
});

// Edit Form Process
router.put('/:id', ensureAuthenticated, (req, res) => {

  // Query db for the specific project
  Project.findOne({
      _id: req.params.id
    })
    .then(project => {
      // Update values
      project.make = req.body.make;
      project.model = req.body.model;
      project.year = req.body.year;
      project.plans = req.body.plans;

      project.save()
        .then(project => {
          req.flash('success_msg', 'Project succcesfully edited.');
          res.redirect('/projects');
        })
        .catch(err => {
          databaseDebug('ERROR while saving updated values.');
          databaseDebug(err);
        })
    })
    .catch(err => {
      req.flash('error_msg', 'Error updating project.');
      databaseDebug('ERROR while updating values.');
      databaseDebug(err);
    });

});

// Delete Project
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Project.deleteOne({
      _id: req.params.id
    })
    .then(() => {
      req.flash('success_msg', 'Project deleted.');
      console.log(res.locals);
      res.redirect('/projects');
    })
    .catch(err => {
      req.flash('error_msg', 'Error deleting project.');
      databaseDebug('ERROR while deleting a project.');
      databaseDebug(err);
    })
});

module.exports = router;

