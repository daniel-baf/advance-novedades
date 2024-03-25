require("dotenv").config();
const express = require("express");
const router = express.Router();
const path = require("path");
const { ROLES } = require("../config/consts");
const { renderLoginPage, render500Page } = require("../modules/utils/renders.common.utils.module");

// MIDDLEWARES TO CHECK IF CURRENT USER BELONGS TO PRODUCTION
router.use((req, res, next) => {
  try {
    if (req.session.user.role.NAME === ROLES.PRODUCTION.NAME) {
      next();
    } else {
      render500Page(res, "No tienes permisos para acceder a esta sección");
    }
  } catch (error) {
    renderLoginPage(req, res, "", "La sesión ha expirado");
  }
});

// routes
// render main view of dashboard, with a view parameter display just x parameters
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
    render500Page(res, "No hemos podido recuperar tu sesión. " + error);
  }
}

module.exports = router;
