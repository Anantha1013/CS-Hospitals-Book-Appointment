const mongoose=require('mongoose')

const departmentSchema=new mongoose.Schema({
        dept_name:{
            type: String,
            required: true,
        },
        dept_code:{
            //some validation required
            type: String,
            required: true
        }
    },
    {
        collection:'departments',
    }
);

const Department=mongoose.model('Department',departmentSchema);
module.exports=Department;