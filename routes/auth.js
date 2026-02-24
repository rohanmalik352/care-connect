const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// GET login
router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Login - CareConnect' });
});

// POST login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    failureRedirect: '/auth/login',
    failureFlash: true
  })(req, res, next);
}, (req, res) => {
  const role = req.user.role;
  if (role === 'admin') return res.redirect('/admin/dashboard');
  if (role === 'doctor') return res.redirect('/doctor/dashboard');
  res.redirect('/patient/dashboard');
});

// GET register
router.get('/register', (req, res) => {
  res.render('auth/register', { title: 'Register - CareConnect' });
});

// POST register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      req.flash('error', 'Email already registered.');
      return res.redirect('/auth/register');
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role: role || 'patient' });

    if (role === 'patient') {
      await Patient.create({ user: user._id });
    } else if (role === 'doctor') {
      await Doctor.create({ user: user._id });
    }

    req.flash('success', 'Account created! Please log in.');
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Registration failed. Try again.');
    res.redirect('/auth/register');
  }
});

// GET logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.flash('success', 'Logged out successfully.');
    res.redirect('/auth/login');
  });
});

module.exports = router;