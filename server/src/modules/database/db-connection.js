require('dotenv').config();

const mysql = require('mysql');

// global function to connect to DB
var db_connection = mysql.createConnection({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// generate the connection
db_connection.connect((err) => {
    console.log(!err ? "Successfully connected to DB" : "Unable to connect to DB: " + err);
    // TODO implement an error manager and call it
});

module.exports = db_connection;