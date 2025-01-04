const Doctor = require('../models/doctors')
const Patient = require('../models/patients')

exports.doctorsAvailable = async (req,res) =>{
    try{
        const doctors = await Doctor.find()
        res.json(doctors)
    }catch(err){
        console.log(err);
        res.json(200).send("Error Occurred")
    }
};
exports.bookAppointment = async (req, res) => {
    try {
      const { doctorId, patientName ,patientId, appointmentDate, appointmentTime } = req.body;
  
      if (!doctorId || !patientId || !appointmentDate || !appointmentTime) {
        return res.status(400).send("Missing required fields.");
      }
      const patient = await Patient.findOneAndUpdate(
        {UHID : patientId},
        {
            $inc: {
                totalAppointments : 1,
            },
        },
    );
    if(!patient){
        return res.status(404).send("Patient does not exist")
    }
      const doctor = await Doctor.findOneAndUpdate(
        { reg_no: doctorId },
        {
          $push: {
            appointments: { patientId, patientName,appointmentDate, appointmentTime },
          },
        },
      );
  
      if (!doctor) {
        return res.status(404).send("Doctor not found.");
      }
  
      res.status(200).json({
        message: "Appointment booked successfully.",
        doctor,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error occurred while booking the appointment.");
    }
};
  