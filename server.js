require('dotenv').config();
const express = require('express');
const connect = require('./config/connection');  
const Patient = require('./models/patients');  
const specs = require('./config/swagger.js')
const swaggerUi = require('swagger-ui-express')
//routes
const registerRoute=require('./routes/registerRoute.js');
const searchRoute=require('./routes/searchRoute.js');
const appointmentRoute = require('./routes/appointmentRoute.js')

const app = express();

connect();

app.use(express.json());
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs,{explorer : true})
);
app.use('/v1',registerRoute);
app.use('/v1',searchRoute);
app.use('/v1',appointmentRoute);
app.listen(process.env.PORT, () => {
  console.log("Server Listening on Port " + process.env.PORT);
});
