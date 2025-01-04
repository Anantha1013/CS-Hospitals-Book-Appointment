const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true,
    },
    dept_name : {
        type : String,
        require : true,
    },
    ph_no : {
        type : String,
        require : true,
    },
    speciality : {
        type : String,
        require : true,
    },
    reg_no : {
        type : String,
        require : true,
    },
    appointments : {
        type : Array,
        default : [],
    }
},{
    collection : 'doctors',
});

const Doctor = mongoose.model("Doctor",doctorSchema);

module.exports = Doctor;