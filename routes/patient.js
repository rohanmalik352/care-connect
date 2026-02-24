const express = require('express');
const router = express.Router();
const { ensurePatient } = require('../middleware/auth');
const Patient = require('../models/Patient');
const MedicalRecord = require('../models/MedicalRecord');
const Doctor = require('../models/Doctor');

// Dashboard
router.get('/dashboard', ensurePatient, async (req, res) => {
  const patient = await Patient.findOne({ user: req.user._id });
  const records = await MedicalRecord.find({ patient: patient?._id })
    .populate({ path: 'doctor', populate: { path: 'user' } })
    .sort({ visitDate: -1 })
    .limit(5);
  res.render('patient/dashboard', { title: 'Patient Dashboard', patient, records, user: req.user });
});

// Full medical history
router.get('/records', ensurePatient, async (req, res) => {
  const patient = await Patient.findOne({ user: req.user._id });
  const records = await MedicalRecord.find({ patient: patient?._id })
    .populate({ path: 'doctor', populate: { path: 'user' } })
    .sort({ visitDate: -1 });
  res.render('patient/records', { title: 'My Medical Records', records, user: req.user });
});

// Single record detail
router.get('/records/:id', ensurePatient, async (req, res) => {
  const record = await MedicalRecord.findById(req.params.id)
    .populate({ path: 'doctor', populate: { path: 'user' } });
  res.render('patient/record-detail', { title: 'Record Detail', record, user: req.user });
});

// Profile
router.get('/profile', ensurePatient, async (req, res) => {
  const patient = await Patient.findOne({ user: req.user._id });
  res.render('patient/profile', { title: 'My Profile', patient, user: req.user });
});

// Update profile
router.post('/profile', ensurePatient, async (req, res) => {
  const { dob, gender, bloodGroup, phone, address, allergies, chronicConditions } = req.body;
  await Patient.findOneAndUpdate({ user: req.user._id }, {
    dob, gender, bloodGroup, phone, address,
    allergies: allergies ? allergies.split(',').map(s => s.trim()) : [],
    chronicConditions: chronicConditions ? chronicConditions.split(',').map(s => s.trim()) : []
  }, { upsert: true });
  req.flash('success', 'Profile updated successfully.');
  res.redirect('/patient/profile');
});

module.exports = router;