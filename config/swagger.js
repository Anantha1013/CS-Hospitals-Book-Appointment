const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const path = require('path');

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "CS Hospitals Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000/v1", 
      },
    ],
  },
  apis: [path.join(__dirname, "../routes/*.js")], 
};

const specs = swaggerJsdoc(options);
module.exports = specs;
