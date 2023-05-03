const express = require('express');
const router = express.Router();
const routes = require('./routes/index')
const mongoose = require('mongoose');
const url = 'mongodb://0.0.0.0:27017/vibrer'

var app = express();
app.use(express.json());

mongoose.connect(url,{useNewUrlParser:true})

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