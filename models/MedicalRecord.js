const mongoose = require('mongoose');

const MedicalRecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  visitDate: { type: Date, default: Date.now },
  visitType: { type: String, enum: ['OPD', 'IPD', 'Emergency', 'Teleconsult'], default: 'OPD' },
  chiefComplaint: String,
  diagnosis: [String],
  symptoms: [String],
  prescription: [{
    medicine: String,
    dosage: String,
    duration: String,
    instructions: String
  }],
  labReports: [{
    testName: String,
    result: String,
    file: String,
    date: Date
  }],
  doctorNotes: String,
  followUpDate: Date,
  hospital: String,
  isEmergency: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema);