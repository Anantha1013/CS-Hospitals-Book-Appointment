const {Patient}=require('../models/patients.js');

//searching Patient by UHID
exports.searchPatient=async(req,res)=>{
    try{
        const { UHID } = req.body;

        if (!UHID) {
            return res.status(400).json({
                success: false,
                message: "UHID is required"
            });
        }

        const pat=await Patient.findOne({UHID});
        if(pat){
            return res.status(200).json({pat});
        }

        else{

            //redirect to register
            return res.status(200).json({
                success:false,
                message:"No such patient please register"
            })
        }

    }
    catch(error){
        res.status(500).json({error});
    }
};