require('dotenv').config();
const express = require('express');
const connect = require('./config/connection');  
const Patient = require('./models/patients');  
const app = express();

connect();

app.use(express.json());

app.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find();  
    res.json(patients);  
  } catch (err) {
    console.error("Error fetching patients:", err);
    res.status(500).send("Error fetching patients");
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server Listening on Port " + process.env.PORT);
});
