const express=require('express');
const registerController=require('../controllers/registerController');

const router=express.Router();

router.post('/registerPatient',registerController.registerPatient);
module.exports=router;