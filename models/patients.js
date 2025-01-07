const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  UHID: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['out-patient', 'in-patient'], 
    required: true,
  },
  totalAppointments: {
    type: Number,
    default: 0,
  },
  bedDetails: {
    bedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bed' }, 
    bedType: { type: String, enum: ['general', 'ICU', 'private'] },
  },
  lastVisit: {
    type: Date,
    default:Date.now,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  }

}, {
  collection: 'patients',
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
