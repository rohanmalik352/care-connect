require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const passport = require('passport');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
connectDB();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Passport
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global variables for all views
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/patient', require('./routes/patient'));
app.use('/doctor', require('./routes/doctor'));
app.use('/admin', require('./routes/admin'));

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found', user: req.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 CareConnect running at http://localhost:${PORT}`);
});