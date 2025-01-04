require('dotenv').config();
const express = require('express');
const connect = require('./config/connection');  
const Patient = require('./models/patients');  
//routes
const registerRoute=require('./routes/registerRoute.js');
const searchRoute=require('./routes/searchRoute.js');

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


app.use('/v1',registerRoute);
// app.use('/v1',searchRoute);

app.listen(process.env.PORT, () => {
  console.log("Server Listening on Port " + process.env.PORT);
});
