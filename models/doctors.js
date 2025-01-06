const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
{
    patientId: { 
        type: String, 
        required: true 
    },
    patientName: { 
        type: String, 
        required: true 
    },
    appointmentDate: { 
        type: Date, 
        required: true 
    },
    appointmentTime: { 
        type: String, 
        required: true 
    },
}
);
const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, 
      minlength: 3,
    },
    dept_name: {
      type: String,
      required: true,
      trim: true,
    },
    ph_no: {
      type: String,
      required: true,
      unique: true, 
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v); 
        },
        message: (props) => `${props.value} is not a valid 10-digit phone number.`,
      },
    },
    speciality: {
      type: String,
      required: true,
      trim: true,
    },
    reg_no: {
      type: String,
      required: true,
      unique: true,
      match: /^REG-\d{6}$/,
    },
    appointments: [appointmentSchema],
  },
  {
    collection: 'doctors',
  }
);

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
