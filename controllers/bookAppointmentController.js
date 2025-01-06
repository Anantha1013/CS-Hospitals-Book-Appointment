const Doctor = require('../models/doctors');
const Patient = require('../models/patients');

exports.doctorsAvailable = async (req, res) => {
  try {
    const { appointmentDate, appointmentTime } = req.query; 
    if (!appointmentDate || !appointmentTime) {
      return res.status(400).send("Missing appointment date or time.");
    }

    const requestedTime = new Date(`${appointmentDate}T${appointmentTime}:00`);

    const doctors = await Doctor.find({
      'appointments.appointmentDate': { $ne: requestedTime } 
    });

    const availableDoctors = doctors.filter(doctor => {
      return doctor.appointments.every(appointment => {
        const existingTime = new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}:00`);
        const timeGap = Math.abs(requestedTime - existingTime) / (1000 * 60); 
        return timeGap >= 30; // Ensure 30-minute gap between appointments
      });
    });

    if (availableDoctors.length === 0) {
      return res.status(404).send("No doctors available at this time.");
    }

    res.status(200).json(availableDoctors); // Return the list of available doctors
  } catch (err) {
    console.error(err);
    res.status(500).send("Error occurred while fetching available doctors.");
  }
};

exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, patientName, patientId, appointmentDate, appointmentTime } = req.body;

    if (!doctorId || !patientId || !appointmentDate || !appointmentTime) {
      return res.status(400).send("Missing required fields.");
    }

    const patient = await Patient.findOneAndUpdate(
      { UHID: patientId },
      { $inc: { totalAppointments: 1 } } 
    );
    if (!patient) {
      return res.status(404).send("Patient does not exist.");
    }

    const requestedTime = new Date(`${appointmentDate}T${appointmentTime}:00`);

    // Find the doctor and check for overlapping appointments
    const doctor = await Doctor.findOne({ reg_no: doctorId });
    if (!doctor) {
      return res.status(404).send("Doctor not found.");
    }

    const isAvailable = doctor.appointments.every(appointment => {
      const existingTime = new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}:00`);
      const timeGap = Math.abs(requestedTime - existingTime) / (1000 * 60); 
      return timeGap >= 30; 
    });

    if (!isAvailable) {
      return res.status(400).send("Doctor is not available at this time.");
    }

    const appointment = {
      patientId,
      patientName,
      appointmentDate: requestedTime,
      appointmentTime,
    };

    doctor.appointments.push(appointment);
    await doctor.save();

    res.status(200).json({
      message: "Appointment booked successfully.",
      appointment, 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error occurred while booking the appointment.");
  }
};
