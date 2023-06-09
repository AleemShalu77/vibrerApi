const express = require('express');
const router = express.Router();
const routes = require('./routes/index')
const mongoose = require('mongoose');
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const url = 'mongodb://0.0.0.0:27017/vibrer'
const swaggerDefinition = require("./config").SWAGGER_DEFINATION
var cors = require('cors')
var app = express();
app.use(express.json());
app.use(cors({
  origin:'*'
}));

mongoose.connect(url,{useNewUrlParser:true})

//swagger
const options = {
  swaggerDefinition,
  apis: ["./swagger/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);
app.get("/swagger.json", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const con = mongoose.connection

con.on('open',() => {
    console.log('Connected...')
})

//Routes
app.use("/", routes(router)); 

// error handler
app.use((error, req, res, next) => {
  if (!error) {
    return next();
  }
  console.log(error)
  res.status(error.status || 500).send({
    status: error.status || 500,
    error: error.message || error,
    data: error.data || ''
  });
});

app.listen(3000,() => {
    console.log('Server started')
})