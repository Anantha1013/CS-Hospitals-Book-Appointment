const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['general', 'ICU', 'private'], 
  },
  isOccupied: {
    type: Boolean,
    default: false,
  },
  patientId: {
    type: String,
    default: null,
  },
  bedIdentifier: {
    type: String,
    unique: true, 
    required: true,
  },
});

const Bed = mongoose.model('Bed', bedSchema);
module.exports = Bed;
