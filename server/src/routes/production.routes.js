require("dotenv").config();
const express = require("express");
const router = express.Router();
const path = require("path");
const { ROLES } = require("../config/consts");

// MIDDLWARES TO CHECK IF CURRENT USER BELONGS TO PRODUCTION
router.use((req, res, next) => {
  try {
    if (req.session.user.role.NAME === ROLES.PRODUCTION.NAME) {
      next();
    } else {
      res.render("500", {
        error_message: "No tienes permisos para acceder a esta sección",
      });
    }
  } catch (error) {
    res.render("login", {
      error_message: "La sesion ha expirado",
      message: "",
    });
  }
});

// routes
// render main view of dashboard, with a view parameter display just x parameteres
router.get("/dashboard/", (req, res) => {
  renderOperativeDashboard(req, res);
});

function renderOperativeDashboard(req, res, message, error_message) {
  try {
    res.render("users/production/production-view", {
      name: req.session.user.id,
      message: message,
      error_message: error_message,
    });
  } catch (error) {
    res.render("500", {
      error_message: "No hemos podidio recuperar tu sesion. " + error,
    });
  }
}

module.exports = router;
