const express = require('express');
const router = express.Router();
const { ensureAdmin } = require('../middleware/auth');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const MedicalRecord = require('../models/MedicalRecord');

// Dashboard
router.get('/dashboard', ensureAdmin, async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalDoctors = await Doctor.countDocuments();
  const totalPatients = await Patient.countDocuments();
  const totalRecords = await MedicalRecord.countDocuments();
  const unverifiedDoctors = await Doctor.find({ verified: false }).populate('user');
  res.render('admin/dashboard', {
    title: 'Admin Dashboard', totalUsers, totalDoctors,
    totalPatients, totalRecords, unverifiedDoctors, user: req.user
  });
});

// List all doctors
router.get('/doctors', ensureAdmin, async (req, res) => {
  const doctors = await Doctor.find().populate('user').sort({ createdAt: -1 });
  res.render('admin/doctors', { title: 'All Doctors', doctors, user: req.user });
});

// Verify doctor
router.post('/doctors/:id/verify', ensureAdmin, async (req, res) => {
  await Doctor.findByIdAndUpdate(req.params.id, { verified: true });
  req.flash('success', 'Doctor verified successfully.');
  res.redirect('/admin/doctors');
});

// List all patients
router.get('/patients', ensureAdmin, async (req, res) => {
  const patients = await Patient.find().populate('user').sort({ createdAt: -1 });
  res.render('admin/patients', { title: 'All Patients', patients, user: req.user });
});

module.exports = router;