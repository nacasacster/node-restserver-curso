require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario.js'));

mongoose.connect(process.env.ulrDB, (err, res) => {
    if (err) throw err;
    console.log('bases de datos online');
}); //27017 es el purto con el que se esta trabajando 

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', 5000);
});