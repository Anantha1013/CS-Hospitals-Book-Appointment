const express=require('express');
const searchPatientController=require('../controllers/searchPatientController.js');

const router=express.Router();


/**
 * @swagger
 * /searchPatient:
 *   post:
 *     summary: Search for an already visited person
 *     tags: [Search Patient]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UHID:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 UHID:
 *                   type: string
 *                 age:
 *                   type: number
 *                 totalAppointments:
 *                   type: number
 *                 lastVisit:
 *                   type: date
 *                 phoneNumber:
 *                   type: string
 *       201:
 *         description: Patient not found
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             message:
 *              type: string
 *       400:
 *        description: UHID not provided
 *        content:
 *         application/json:
 *          schema:
 *           type: object
 *           properties:
 *            message:
 *             type string
 *       502:
 *         description: Some server error
 */

router.post('/searchPatient',searchPatientController.searchPatient);
module.exports=router;