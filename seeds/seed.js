require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const MedicalRecord = require('../models/MedicalRecord');
const Discussion = require('../models/Discussion');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/careconnect');
  console.log('MongoDB Connected');
};

const seed = async () => {
  await connectDB();

  // Clear existing
  await Promise.all([User.deleteMany(), Patient.deleteMany(), Doctor.deleteMany(), MedicalRecord.deleteMany(), Discussion.deleteMany()]);
  console.log('Cleared existing data');

  const hash = (pw) => bcrypt.hash(pw, 10);

  // Create Admin
  const adminUser = await User.create({ name: 'Admin CareConnect', email: 'admin@careconnect.in', password: await hash('admin123'), role: 'admin' });

  // Create Ddrrohan@careconnect.inoctors
  const drRohanUser = await User.create({ name: 'Rohan Malik', email: '', password: await hash('doctor123'), role: 'doctor' });
  const drManviUser = await User.create({ name: 'Manvi punia', email: 'drmanvi@careconnect.in', password: await hash('doctor123'), role: 'doctor' });

  const drRohan = await Doctor.create({ user: drRohanUser._id, registrationNumber: 'MH/2020/45678', specialization: 'Cardiologist', hospital: 'AIIMS Delhi', district: 'South Delhi', state: 'Delhi', experience: 8, verified: true });
  const drManvi = await Doctor.create({ user: drManviUser._id, registrationNumber: 'DL/2019/23456', specialization: 'General Physician', hospital: 'Safdarjung Hospital', district: 'New Delhi', state: 'Delhi', experience: 5, verified: true });

  // Create Patients
  const patient1User = await User.create({ name: 'Naman Chaudhary', email: 'naman@gmail.com', password: await hash('patient123'), role: 'patient' });
  const patient2User = await User.create({ name: 'Aditya Chandra', email: 'aditya@gmail.com', password: await hash('patient123'), role: 'patient' });

  const patient1 = await Patient.create({ user: patient1User._id, abhaId: 'ABHA12345678', dob: new Date('1995-06-15'), gender: 'Male', bloodGroup: 'O+', phone: '9876543210', allergies: ['Penicillin', 'Dust'], chronicConditions: ['Hypertension'], biometricLinked: true });
  const patient2 = await Patient.create({ user: patient2User._id, abhaId: 'ABHA87654321', dob: new Date('1990-03-22'), gender: 'Male', bloodGroup: 'B+', phone: '9876500000', allergies: [], chronicConditions: ['Diabetes Type 2'], biometricLinked: false });

  // Create Medical Records
  const rec1 = await MedicalRecord.create({ patient: patient1._id, doctor: drRohan._id, visitType: 'OPD', chiefComplaint: 'Chest pain and shortness of breath', diagnosis: ['Stable Angina', 'Hypertension'], symptoms: ['Chest pain', 'Shortness of breath', 'Fatigue'], prescription: [{ medicine: 'Amlodipine', dosage: '5mg', duration: '30 days', instructions: 'Once daily after breakfast' }, { medicine: 'Aspirin', dosage: '75mg', duration: '30 days', instructions: 'Once daily after dinner' }], doctorNotes: 'Patient is stable. Advised stress test. Review in 4 weeks. Lifestyle modification required.', followUpDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), hospital: 'AIIMS Delhi' });

  await MedicalRecord.create({ patient: patient2._id, doctor: drManvi._id, visitType: 'OPD', chiefComplaint: 'Increased thirst and frequent urination', diagnosis: ['Type 2 Diabetes Mellitus'], symptoms: ['Polydipsia', 'Polyuria', 'Fatigue'], prescription: [{ medicine: 'Metformin', dosage: '500mg', duration: '60 days', instructions: 'Twice daily with meals' }], doctorNotes: 'HbA1c is 8.2%. Diet counselling done. Review in 8 weeks with HbA1c report.', hospital: 'Safdarjung Hospital' });

  // Create Discussions
  const disc1 = await Discussion.create({ title: 'Managing Hypertension in COVID-19 Recovered Patients', content: 'I have been seeing several patients who recovered from COVID-19 but continue to show persistent hypertension even 6 months post-recovery. Standard ACE inhibitor therapy does not seem as effective. Has anyone else noticed this pattern? What alternative protocols are you using?', author: drRohan._id, category: 'Case Discussion', tags: ['covid', 'hypertension', 'cardiology'], replies: [{ doctor: drManvi._id, content: 'Yes, we have seen similar cases. We have had some success adding a low-dose ARB alongside the existing regimen. Would suggest monitoring renal function closely in these patients. Also recommending cardio-pulmonary rehab where available.' }] });

  await Discussion.create({ title: 'Protocol for Rural Emergency Triage using Telemedicine', content: 'Our district hospital has limited specialist access. We have been developing a triage protocol using WhatsApp video for remote consultation with AIIMS. Sharing our initial framework here — happy to get feedback from rural practitioners.', author: drManvi._id, category: 'Treatment Protocol', tags: ['rural', 'telemedicine', 'emergency', 'triage'], isAnonymous: false });

  console.log('\n✅ Seed completed!\n');
  console.log('Login credentials:');
  console.log('Admin  → admin@careconnect.in / admin123');
  console.log('Doctor → drrohan@careconnect.in / doctor123');
  console.log('Doctor → drmanvi@careconnect.in / doctor123');
  console.log('Patient→ naman@gmail.com / patient123');
  console.log('Patient→ aditya@gmail.com / patient123');

  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });