const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  abhaId: { type: String, unique: true, sparse: true },
  dob: Date,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  bloodGroup: String,
  phone: String,
  address: String,
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  allergies: [String],
  chronicConditions: [String],
  currentMedications: [String],
  biometricLinked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', PatientSchema);