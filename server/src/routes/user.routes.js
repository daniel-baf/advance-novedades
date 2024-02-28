// required modules
require('dotenv').config()
const express = require('express');
const router = express.Router();
const path = require('path');


const { USER_SELECT_BY_PASS_ID_QUERY, USER_SELECT_BY_ID_QUERY } = require('../config/consts');
const db_connection = require(path.join(__dirname, "../modules/database/db-connection"));
const encrypt = require(path.join(__dirname, "../modules/database/encrypter.module"))

const { listWorkerAreas } = require('../modules/admin/admin.users.module');


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
        _query = USER_SELECT_BY_PASS_ID_QUERY
        db_connection.query(_query, [id, password], (_error, _result) => {
            // error handling
            if (_error || (!_result || _result.length == 0)) {  // no data valid
                renderLoginPage(req, res, undefined, 'No hemos podido encontrar tus datos ');
                return
            }
            // check if user is authorized
            if (_result[0].allowed == 0) { // not authorized
                renderLoginPage(req, res, undefined, 'Tu usuario no esta autorizado');
                return
            }
            // valid login
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
        });
    } catch (error) {
        // send to login
        renderLoginPage(req, res, undefined, error);
    }
});

// get areas of work
router.get("/user/get-areas", async (req, res) => {
    try {
        let aread_db = await listWorkerAreas();
        res.status(200).json({ areas: aread_db });
    } catch (error) {
        res.status(500).json({ error: "No se ha podido obtener las areas de trabajo, " + error });
    }
});

module.exports = router;