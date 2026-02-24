const express = require('express');
const router = express.Router();
const { ensureDoctor } = require('../middleware/auth');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const MedicalRecord = require('../models/MedicalRecord');
const Discussion = require('../models/Discussion');
const User = require('../models/User');

// Dashboard
router.get('/dashboard', ensureDoctor, async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  const recentRecords = await MedicalRecord.find({ doctor: doctor?._id })
    .populate({ path: 'patient', populate: { path: 'user' } })
    .sort({ createdAt: -1 }).limit(5);
  const totalPatients = await MedicalRecord.distinct('patient', { doctor: doctor?._id });
  const discussions = await Discussion.find().sort({ createdAt: -1 }).limit(3)
    .populate({ path: 'author', populate: { path: 'user' } });
  res.render('doctor/dashboard', {
    title: 'Doctor Dashboard', doctor, recentRecords,
    patientCount: totalPatients.length, discussions, user: req.user
  });
});

// Search patient by ABHA ID or name
router.get('/search-patient', ensureDoctor, async (req, res) => {
  const { q } = req.query;
  let patients = [];
  if (q) {
    const users = await User.find({ name: new RegExp(q, 'i'), role: 'patient' });
    const userIds = users.map(u => u._id);
    patients = await Patient.find({
      $or: [{ user: { $in: userIds } }, { abhaId: new RegExp(q, 'i') }]
    }).populate('user');
  }
  res.render('doctor/search-patient', { title: 'Search Patient', patients, q, user: req.user });
});

// View patient profile (for doctor)
router.get('/patient/:patientId', ensureDoctor, async (req, res) => {
  const patient = await Patient.findById(req.params.patientId).populate('user');
  const records = await MedicalRecord.find({ patient: patient._id })
    .populate({ path: 'doctor', populate: { path: 'user' } })
    .sort({ visitDate: -1 });
  res.render('doctor/patient-view', { title: 'Patient Records', patient, records, user: req.user });
});

// Add medical record
router.get('/add-record/:patientId', ensureDoctor, async (req, res) => {
  const patient = await Patient.findById(req.params.patientId).populate('user');
  res.render('doctor/add-record', { title: 'Add Medical Record', patient, user: req.user });
});

router.post('/add-record/:patientId', ensureDoctor, async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  const { visitType, chiefComplaint, diagnosis, symptoms, doctorNotes, followUpDate, isEmergency } = req.body;
  const prescription = [];
  if (req.body.medicine) {
    const medicines = Array.isArray(req.body.medicine) ? req.body.medicine : [req.body.medicine];
    medicines.forEach((med, i) => {
      prescription.push({
        medicine: med,
        dosage: (Array.isArray(req.body.dosage) ? req.body.dosage[i] : req.body.dosage) || '',
        duration: (Array.isArray(req.body.duration) ? req.body.duration[i] : req.body.duration) || '',
        instructions: (Array.isArray(req.body.instructions) ? req.body.instructions[i] : req.body.instructions) || ''
      });
    });
  }
  await MedicalRecord.create({
    patient: req.params.patientId,
    doctor: doctor._id,
    visitType,
    chiefComplaint,
    diagnosis: diagnosis ? diagnosis.split(',').map(s => s.trim()) : [],
    symptoms: symptoms ? symptoms.split(',').map(s => s.trim()) : [],
    prescription,
    doctorNotes,
    followUpDate: followUpDate || null,
    isEmergency: isEmergency === 'on',
    hospital: doctor.hospital
  });
  req.flash('success', 'Medical record added successfully.');
  res.redirect(`/doctor/patient/${req.params.patientId}`);
});

// Doctor profile
router.get('/profile', ensureDoctor, async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  res.render('doctor/profile', { title: 'Doctor Profile', doctor, user: req.user });
});

router.post('/profile', ensureDoctor, async (req, res) => {
  const { registrationNumber, specialization, hospital, district, state, experience } = req.body;
  await Doctor.findOneAndUpdate({ user: req.user._id }, {
    registrationNumber, specialization, hospital, district, state, experience
  }, { upsert: true });
  req.flash('success', 'Profile updated.');
  res.redirect('/doctor/profile');
});

// Doctor forum - list
router.get('/forum', ensureDoctor, async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};
  const discussions = await Discussion.find(filter)
    .populate({ path: 'author', populate: { path: 'user' } })
    .sort({ createdAt: -1 });
  res.render('doctor/forum', { title: 'Doctor Forum', discussions, category, user: req.user });
});

// New discussion
router.get('/forum/new', ensureDoctor, (req, res) => {
  res.render('doctor/forum-new', { title: 'Start Discussion', user: req.user });
});

router.post('/forum/new', ensureDoctor, async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  const { title, content, category, tags, isAnonymous } = req.body;
  await Discussion.create({
    title, content, category,
    tags: tags ? tags.split(',').map(s => s.trim()) : [],
    isAnonymous: isAnonymous === 'on',
    author: doctor._id
  });
  req.flash('success', 'Discussion posted!');
  res.redirect('/doctor/forum');
});

// Discussion detail & reply
router.get('/forum/:id', ensureDoctor, async (req, res) => {
  const discussion = await Discussion.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true })
    .populate({ path: 'author', populate: { path: 'user' } })
    .populate({ path: 'replies.doctor', populate: { path: 'user' } });
  res.render('doctor/forum-detail', { title: discussion.title, discussion, user: req.user });
});

router.post('/forum/:id/reply', ensureDoctor, async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  await Discussion.findByIdAndUpdate(req.params.id, {
    $push: { replies: { doctor: doctor._id, content: req.body.content } }
  });
  res.redirect(`/doctor/forum/${req.params.id}`);
});

module.exports = router;