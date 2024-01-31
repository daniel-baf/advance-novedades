// requires
const express = require('express');
const path = require('path')
var cors = require('cors');
const db_connection = require(path.join(__dirname, 'src/modules/database', 'db-connection'));
// router
const user_routes = require(path.join(__dirname, 'src/routes/', 'user.routes'))


const app = express();          // app uses express
app.use(cors());                // implement CORS flags for browsers
app.use(express.urlencoded({ extended: true}), express.json());                // JSON implement



// Routes
app.use('/user', user_routes)

module.exports = app;             // export configuration