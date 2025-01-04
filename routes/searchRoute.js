const express=require('express');
const searchPatientController=require('../controllers/searchPatientController.js');

const router=express.Router();

router.post('/searchPatient',searchPatientController.searchPatient);
module.exports=router;