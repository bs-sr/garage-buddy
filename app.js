const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const startupDebug = require('debug')('app:startup');
const databaseDebug = require('debug')('app:db');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const passport = require('passport');

const express = require('express');
const app = express();

const port = process.env.PORT || 5000;

// #region Config

// Passport config
require('./config/passport')(passport);

// DB config
const db = require('./config/database');

// #endregion

// #region MongoDB
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true
  })
  .then(() => {
    databaseDebug('MongoDB Connected...');
  })
  .catch(err => {
    databaseDebug('ERROR connecting to MongoDB');
    databaseDebug(err);
  });

// #endregion

// #region Middleware

// Express Session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder middleware
app.use(express.static(path.join(__dirname, 'public')));

// Method Override middleware
app.use(methodOverride('_method'));

// Connect Flash middleware
app.use(flash());

// #endregion

// #region Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// #endregion

// #region Routing

// Load Routes
const index = require('./routes/index');
const projects = require('./routes/projects');
const users = require('./routes/users');

// Use Routes
app.use('', index);
app.use('/projects', projects);
app.use('/users', users);

// #endregion

// Start the server
app.listen(port, () => {
  startupDebug('Starting GarageBuddy App');
  startupDebug(`Server listening on port ${port}...`);
});