require('dotenv').config();
import express from 'express';


console.log('Hello Project.'); 
const app = express();
const db = require('../models/connect')

var http = require('http');
var serveStatic = require('serve-static');

app.use(express.static('public'));


app.get('/', (request, response) => {

});

app.get('/getScooters', db.getScooters);

app.get('/createScooter', db.createScooter);

// Create server
var server = http.createServer(function onRequest (req, res) {
  serve(req, res, finalhandler(req, res));
});


app.listen(process.env.PORT, () =>
  console.log('Example app listening on port ' + process.env.PORT),
);

