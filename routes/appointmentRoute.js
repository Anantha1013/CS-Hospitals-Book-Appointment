const express = require('express');
const bookAppointController = require('../controllers/bookAppointmentController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: Doctors API
 */

/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Get list of available doctors
 *     tags: [Doctors]
 *     responses:
 *       200:
 *         description: Successfully fetched the list of doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   dept_name:
 *                     type: string
 *                   ph_no:
 *                     type: string
 *                   speciality:
 *                     type: string
 *                   reg_no:
 *                     type: string              
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /appointment:
 *   post:
 *     summary: Book an appointment with a doctor
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorId:
 *                 type: string
 *               patientId:
 *                 type: string
 *               appointmentDate:
 *                 type: string
 *                 format: date
 *               appointmentTime:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment Scheduled Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Some server error
 */

router.get('/departments',bookAppointController.departmentsAvailable);
router.get('/doctors', bookAppointController.doctorsAvailable);
router.post('/appointment', bookAppointController.bookAppointment);

module.exports = router;
