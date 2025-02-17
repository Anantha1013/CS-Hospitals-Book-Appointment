const express = require('express');
const bookAppointController = require('../controllers/bookAppointmentController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: Department API
 */

/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Get the list of available departments in the hospital
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: Successfully fetched all departments
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                departments:
 *                  type: array
 *       505:
 *         description: Some error in the server side      
 */

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
 *     parameters:
 *       - name: appointmentDate
 *         in: path
 *         description: Format YYYY-MM-DD
 *         required: true
 *       - name: appointmentTime
 *         in: path
 *         description: Format HH:MM
 *         required: true
 *       - name: dept_name
 *         in: path
 *         description: Any valid department name within in the hospital
 *         required: true
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
 *               patientName:
 *                 type: string
 *               patientId:
 *                 type: string
 *               patientType:
 *                 type: string
 *                 enum: [in-patient, out-patient]
 *               bedType:
 *                 type: string
 *                 enum: [general]
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
 *                 appointment:
 *                   type: object
 *                   properties:
 *                     patientId:
 *                       type: string
 *                     patientName:
 *                       type: string
 *                     appointmentDate:
 *                       type: string
 *                       format: date
 *                     appointmentTime:
 *                       type: string
 *                 bedDetails:
 *                   type: object
 *                   properties:
 *                     bedId: string
 *       500:
 *         description: Some server error
 */

router.get('/departments',bookAppointController.departmentsAvailable);
router.get('/doctors', bookAppointController.doctorsAvailable);
router.post('/appointment', bookAppointController.bookAppointment);

module.exports = router;
