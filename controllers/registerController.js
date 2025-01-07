const Patient=require('../models/patients.js');
const unique_UHID=require('../utils/uhid.js');

//registering patients
exports.registerPatient=async(req,res)=>{
    try{
        //checking register info
        console.log(req.body);
        
        //required fields
        //first Name
        //last Name
        //age
        //number of appointments
        //last visit
        //phone number 

        const patient_info={
            "firstName":req.body.firstName,
            "lastName":req.body.lastName,
            "UHID":await unique_UHID(),
            "age":Number(req.body.age),
            "totalAppointments":1,//initially while registering set to 1
            "phoneNumber":req.body.phoneNumber,
        };

        let regex = new RegExp(/[6-9][0-9]{9}/);

        if (regex.test(req.body.phoneNumber) == false){
            return res.status(444).json({
                message:"Please provide a valid phone number"
            })
        }

        const response=await Patient.create(patient_info);
        
        return res.status(200).json({
            success:true,
            message:"Patient registered successfully"
        });
    }catch(error){
            console.log(error);
            return res.status(502).json({
            message:"Some server side error"
            });
    }
};
