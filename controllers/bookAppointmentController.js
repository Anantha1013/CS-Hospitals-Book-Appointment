const Doctor = require('../models/doctors');
const Patient = require('../models/patients');
const Bed = require('../models/bed');
const Department = require('../models/departments');

exports.departmentsAvailable = async(req,res) => {
  try{

    const depts=await Department.find({},"dept_name");
    const departmentNames = depts.map(dept => dept.dept_name);

    console.log(departmentNames);

    return res.status(200).json({
      message:"ok",
      departments:departmentNames
    });
  }
  catch(error){
    console.log(error);
    return res.status(505).json({
      message:"Some error in the server side"
    });
  }
}
exports.doctorsAvailable = async (req, res) => {
  try {
    const { appointmentDate, appointmentTime, dept_name } = req.query;

    if (!appointmentDate || !appointmentTime || !dept_name) {
      return res.status(400).json({ error: "Missing appointment date, time, or department." });
    }

    const requestedTime = new Date(`${appointmentDate}T${appointmentTime}:00`);

    const doctors = await Doctor.find({ dept_name });

    const availableDoctors = doctors.filter((doctor) =>
      doctor.appointments.every((appointment) => {
        const existingTime = new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}:00`);
        const timeGap = Math.abs(requestedTime - existingTime) / (1000 * 60); // Minutes
        return timeGap >= 30;
      })
    );

    if (availableDoctors.length === 0) {
      return res.status(404).json({ message: "No doctors available at this time in the specified department." });
    }

    res.status(200).json(availableDoctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error occurred while fetching available doctors." });
  }
};

exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, patientName, patientId, appointmentDate, appointmentTime } = req.body;

    if (!doctorId || !patientId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Fetch patient and validate existence
    const patient = await Patient.findOne({ UHID: patientId });
    if (!patient) {
      return res.status(404).json({ error: "Patient does not exist." });
    }

    // Handle in-patient bed allocation
    if (patient.type === 'in-patient') {
      const allocatedBed = await Bed.findOneAndUpdate(
        { type: patient.bedDetails?.bedType || 'general', isOccupied: false },
        { $set: { isOccupied: true, patientId } },
        { new: true }
      );

      if (!allocatedBed) {
        return res.status(400).json({ error: "No beds available for the required bed type." });
      }

      patient.bedDetails = {
        bedId: allocatedBed._id,
        bedType: allocatedBed.type,
      };
      await patient.save();
    }

    const requestedTime = new Date(`${appointmentDate}T${appointmentTime}:00`);

    // Fetch doctor and check availability
    const doctor = await Doctor.findOne({ reg_no: doctorId });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    const isAvailable = doctor.appointments.every((appointment) => {
      const existingTime = new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}:00`);
      const timeGap = Math.abs(requestedTime - existingTime) / (1000 * 60); // Minutes
      return timeGap >= 30;
    });

    if (!isAvailable) {
      return res.status(400).json({ error: "Doctor is not available at this time." });
    }

    // Create and save appointment
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
      bedDetails: patient.bedDetails || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error occurred while booking the appointment." });
  }
};
