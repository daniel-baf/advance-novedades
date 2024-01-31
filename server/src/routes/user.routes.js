// required modules
require('dotenv').config()
const express = require('express');
const router = express.Router();
const path = require('path')
const db_connection = require(path.join(__dirname, "../modules/database/db-connection"));
const encrypt = require(path.join(__dirname, "../modules/database/encrypter.module"))
const jwt = require('jsonwebtoken')


// login and directionate to different paths
router.post("/signin", (req, res) => {
    try {
        // encrypt password
        let { id, password } = req.body; // retreive data
        password = encrypt(password); // encrypt data to avoid decrypting access
        // execute query and search for data
        _query = "SELECT * FROM Worker WHERE id = ? AND password = ?;"
        db_connection.query(_query, [id, password], (_error, _result) => {
            // error handling
            if (_error || _result.length <= 0) return res.status(406).json({ message: 'Revisa tus credenciales, contraseña y/o usuario incorrectos' });
            // valid login
            let _response = { id: _result[0].id, name: _result[0].name, Worker_Area_id: _result[0].Worker_Area_id };
            let _access_token = jwt.sign(_response, process.env.ACCESS_TOKEN, { expiresIn: "8h" });
            return res.status(201).json({ token: _access_token })
        })
    } catch (error) {
        return res.status(500).json({message: 'Something went wrong on server ' + error})
    }
});

// register a new user | admin must be auth
// generates ID automatically
router.post("/signup", (req, res) => {
    try {
        // extract JSON data from request body
        let { password, name, Worker_area_id } = req.body;
        // encrypt and create password
        password = encrypt(password); // encrypt password
        _query = "CALL insertWorkerAndGetId(?, ?, ?, @generated_id);";
        db_connection.query(_query, [password, name, Worker_area_id], (error, result) => {
            // error handling
            if (error) return res.status(406).json({ message: 'No ha sido posible completar la operacion: ' + error });
            // retrieve OUT variable value
            db_connection.query('SELECT @generated_id AS generated_key', (_error, _output_result) => {
                if (_error) {
                    // Handle error fetching OUT variable
                    return res.status(500).json({ message: 'Error fetching generated ID' });
                }
                const _generated_key = _output_result[0].generated_key;
                // Use the generated key
                return res.status(201).json({ message: 'Se ha generado el usuario nuevo con ID: ' + _generated_key });
            });
        })
    } catch (error) {
        res.status(500).json({ message: 'Ooops, a error just ocurred ' + error })
    }
});


module.exports = router;