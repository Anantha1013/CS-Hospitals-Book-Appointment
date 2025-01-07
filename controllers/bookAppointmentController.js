const Doctor = require('../models/doctors');
const Patient = require('../models/patients');
const Bed = require('../models/bed');
const Department = require('../models/departments');

exports.departmentsAvailable = async (req, res) => {
  try {
    const depts = await Department.find({}, "dept_name");
    const departmentNames = depts.map((dept) => dept.dept_name);

    console.log(departmentNames);

    return res.status(200).json({
      message: "ok",
      departments: departmentNames,
    });
  } catch (error) {
    console.log(error);
    return res.status(505).json({
      message: "Some error in the server side",
    });
  }
};

exports.doctorsAvailable = async (req, res) => {
  try {
    const { appointmentDate, appointmentTime, dept_name } = req.query;

    if (!appointmentDate || !appointmentTime || !dept_name) {
      return res.status(400).json({ error: "Missing appointment date, time, or department." });
    }

    const requestedTime = new Date(`${appointmentDate}T${appointmentTime}:00`);
    console.log("Requested Time:", requestedTime.toISOString());

    const doctors = await Doctor.find({ dept_name });

    const availableDoctors = doctors.filter((doctor) =>
      doctor.appointments.every((appointment) => {
        const existingTime = new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}:00`);
        const timeGap = Math.abs(requestedTime - existingTime) / (1000 * 60); // Minutes
        console.log(
          `Doctor ID: ${doctor.reg_no}, Existing Time: ${existingTime.toISOString()}, Time Gap: ${timeGap} minutes`
        );
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
      const {
        doctorId,
        patientName,
        patientId,
        patientType,
        bedType,
        appointmentDate,
        appointmentTime,
      } = req.body;
  
      if (
        !doctorId ||
        !patientName ||
        !patientId ||
        !patientType ||
        !appointmentDate ||
        !appointmentTime
      ) {
        return res.status(400).json({ error: "Missing required fields." });
      }
  
      console.log("Received appointmentDate:", appointmentDate);
      console.log("Received appointmentTime:", appointmentTime);
  
      // Validate and construct requested time
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Format: YYYY-MM-DD
      const timeRegex = /^\d{2}:\d{2}$/; // Format: HH:mm
      if (!dateRegex.test(appointmentDate) || !timeRegex.test(appointmentTime)) {
        return res.status(400).json({
          error: "Invalid date or time format. Expected formats: YYYY-MM-DD and HH:mm.",
        });
      }
  
      const requestedTime = new Date(`${appointmentDate}T${appointmentTime}:00`);
      if (isNaN(requestedTime)) {
        return res.status(400).json({
          error: "Unable to parse the appointment date and time. Please check the inputs.",
        });
      }
  
      console.log("Parsed Requested Time:", requestedTime.toISOString());
  
      // Fetch doctor and check availability
      const doctor = await Doctor.findOne({ reg_no: doctorId });
      if (!doctor) {
        return res.status(404).json({ error: "Doctor not found." });
      }
  
      console.log("Doctor Appointments:", doctor.appointments);
  
      const isAvailable = doctor.appointments.every((appointment) => {
        const existingDate = new Date(appointment.appointmentDate);
        const [hours, minutes] = appointment.appointmentTime.split(":");
        const existingTime = new Date(existingDate.setHours(hours, minutes, 0, 0)); // Correctly set the time
    
        if (isNaN(existingTime)) {
            console.error("Invalid existing appointment time:", appointment);
            return false; // Skip invalid times
        }
        
        const timeGap = Math.abs(requestedTime - existingTime) / (1000 * 60); // Minutes
        console.log(
            `Existing Time: ${existingTime.toISOString()}, Time Gap: ${timeGap} minutes`
        );
        return timeGap >= 30;
    });    
      if (!isAvailable) {
        return res
          .status(400)
          .json({ error: "Doctor is not available at this time." });
      }
  
      // Check if patient already exists
      let patient = await Patient.findOne({ UHID: patientId });
      console.log("Existing Patient:", patient);
  
      if (!patient) {
        // Create new patient dynamically
        const patientData = {
          UHID: patientId,
          name: patientName,
          type: patientType.toLowerCase(),
          bedDetails: patientType.toLowerCase() === "in-patient" ? {} : null,
        };
        patient = await Patient.create(patientData);
      } else {
        // Update patient type dynamically
        patient.type = patientType.toLowerCase();
        if (patientType.toLowerCase() === "out-patient") {
          patient.bedDetails = null; // Remove bed details for out-patients
        }
        await patient.save();
      }
  
      console.log("Updated Patient:", patient);
  
      // Allocate bed only if doctor is available
      let bedDetails = null;
      if (patientType.toLowerCase() === "in-patient") {
        if (!bedType) {
          return res
            .status(400)
            .json({ error: "Bed type is required for in-patients." });
        }
  
        // Allocate bed
        const allocatedBed = await Bed.findOneAndUpdate(
          { Type: bedType, isOccupied: false },
          { $set: { isOccupied: true, patientId } },
        );
  
        if (!allocatedBed) {
          return res
            .status(400)
            .json({ error: `No beds available for the required bed type (${bedType}).` });
        }
  
        // Update patient's bed details
        bedDetails = {
          bedId: allocatedBed._id,
          bedType: allocatedBed.Type,
        };
        patient.bedDetails = bedDetails;
        await patient.save();
        console.log("Allocated Bed:", allocatedBed);
      }
  
      // Create and save appointment
      const appointment = {
        patientId,
        patientName,
        appointmentDate,
        appointmentTime,
      };
  
      doctor.appointments.push(appointment);
      await doctor.save();
  
      res.status(200).json({
        message: "Appointment booked successfully.",
        appointment,
        bedDetails: bedDetails || null,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error occurred while booking the appointment." });
    }
};
