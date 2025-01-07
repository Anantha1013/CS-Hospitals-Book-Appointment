const express=require('express');
const registerController=require('../controllers/registerController');

const router=express.Router();


/**
 * @swagger
 * /registerPatient:
 *   post:
 *     summary: Register a new patient
 *     tags: [Register Patient]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               age:
 *                 type: number
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       444:
 *         description:Invalid phone number
 *       502:
 *         description: Some server error
 */

router.post('/registerPatient',registerController.registerPatient);
module.exports=router;