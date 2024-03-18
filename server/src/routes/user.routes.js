// required modules
require("dotenv").config();
const express = require("express");
const router = express.Router();
const path = require("path");

const {
  USER_SELECT_BY_PASS_ID_QUERY,
  USER_SELECT_BY_ID_QUERY,
  ROLES,
} = require("../config/consts");
const db_connection = require(path.join(
  __dirname,
  "../modules/database/db-connection"
));
const encrypt = require(path.join(
  __dirname,
  "../modules/database/encrypter.module"
));

const { listWorkerAreas } = require("../modules/admin/admin.users.module");

// main view, implemente a landing page
router.get("/", (req, res) => {
  res.status(200).json({ message: "VALID CALL, NOT IMPLEMENTED MAIN PAGE" });
});

// login page, render a form to login
router.get("/login", (req, res) => {
  renderLoginPage(req, res);
});

// logout and destroy session
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect(302, "/login");
});

// multiuse function to render login page
function renderLoginPage(req, res, message = "", error_message = "") {
  res.render("login", { message: message, error_message: error_message });
}

// searches for a user and generates a session user
async function getUserForSession(id, password) {
  return await new Promise((resolve, reject) => {
    db_connection.query(
      USER_SELECT_BY_PASS_ID_QUERY,
      [id, password],
      (_error, _result) => {
        // error handling
        if (_error || !_result || _result.length == 0) {
          reject("Credenciales invalidas");
        } else {
          resolve(_result[0]);
        }
      }
    );
  })
    .then((result) => {
      return {
        id: result.id,
        password: result.password,
        name: result.name,
        allowed: !!result.allowed,
        role: ROLES[result.Worker_Area_id],
      };
    })
    .catch((error) => {
      return {
        id: "",
        role: ROLES.UNKNOWN,
        error_message: error,
      };
    });
}

// login and directionate to different paths
router.post("/signin", async (req, res) => {
  try {
    // encrypt password
    let { id, password } = req.body; // retreive data
    password = encrypt(password); // encrypt data to avoid decrypting access
    // execute query and search for data
    _user_session = await getUserForSession(id, password);
    // check if role is UNKNOWN
    if (_user_session.role == ROLES.UNKNOWN) {
      // not authorized
      renderLoginPage(req, res, undefined, _user_session.error_message);
      return;
    }
    // check if user is authorized
    if (!_user_session.allowed) {
      // not authorized
      renderLoginPage(req, res, undefined, "Tu usuario no esta autorizado");
      return;
    }
    // valid login, create session
    req.session.user = _user_session;
    switch (_user_session.role.NAME) {
      case ROLES.ADMIN.NAME:
        return res.redirect(302, "/admin/dashboard/products"); // render admi dashboard
      case ROLES.PRODUCTION.NAME:
        return res.redirect(302, "/production/dashboard"); // render production dashboard
      case ROLES.SELLS.NAME:
        return res.redirect(302, "/sells/dashboard"); // render sells dashboard
      default:
        renderLoginPage(req, res, undefined, "No se reconoce tu usuario");
        break;
    }
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
    res.status(500).json({
      error: "No se ha podido obtener las areas de trabajo, " + error,
    });
  }
});

module.exports = router;
