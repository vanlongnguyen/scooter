import 'dotenv/config';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const CircularJSON = require('circular-json');;

const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_ENDPOINT,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const getScooters = (request, response) => {
  pool.query('SELECT * FROM scooter_info ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows);
  })
}

const createScooter = (request, response) => {
	let params = JSON.parse(decodeURI(request._parsedUrl.query));
	
	let lat = params.lat;
	let long = params.long;
	let country = params.country;
	let name = params.name;

	pool.query('INSERT INTO scooter_info (lat, long, country, name) VALUES ($1, $2, $3, $4) RETURNING id;', [lat, long, country, name], (error, results) => {
	    if (error) {
	      throw error
	    }
    	response.status(201).json(results);
  });
}

module.exports = {
  getScooters,
  createScooter
}
