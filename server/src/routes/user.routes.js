// required modules
require('dotenv').config()
const express = require('express');
const router = express.Router();
const path = require('path')
const db_connection = require(path.join(__dirname, "../modules/database/db-connection"));
const encrypt = require(path.join(__dirname, "../modules/database/encrypter.module"))

// main view, implemente a landing page
router.get("/", (req, res) => {
    res.status(200).json({ message: "VALID CALL, NOT IMPLEMENTED MAIN PAGE" });
})

// login page, render a form to login
router.get("/login", (req, res) => {
    renderLoginPage(req, res);
});


// multiuse function to render login page
function renderLoginPage(req, res, message = '', error_message = '') {
    res.render('login', { message: message, error_message: error_message })
}

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
            if (_error || (!_result || _result.length == 0)) {  // no data valid
                renderLoginPage(req, res, undefined, 'No hemos podido encontrar tus datos ');
                return
            } else {// valid login
                _response = { id: _result[0].id, name: _result[0].name, role: _result[0].Worker_Area_id };
                req.session.user = _response;
                if (_response.role == 'ADMIN') {
                    return res.redirect(302, '/admin/dashboard/products'); // render admi dashboard
                } else if (_response.role == 'SELLS') {
                    return res.redirect(302, '/sells/dashboard');  // render sells dashboard
                } else if (_response.role == 'PRODUCTION') {
                    return res.redirect(302, '/production/dashboard'); // render production dashboard
                } else { // If none of the roles match, render login page with an error message
                    return renderLoginPage(req, res, undefined, 'No se reconoce tu usuario');
                }
            }
        });
    } catch (error) {
        // send to login
        renderLoginPage(req, res, undefined, error);
    }
});

// register a new user | admin must be auth
// generates ID automatically
router.post("/signup", (req, res) => {
    try {
        // extract JSON data from request body
        let { password, name, Worker_area_id } = req.body;
        // check invalid dta
        if (password == '' || name == '' || Worker_area_id == '') {
            return res.status(406).json({ message: 'No se han enviado datos validos' });
        }

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
        renderLoginPage(req, res, undefined, error);
    }
});


module.exports = router;