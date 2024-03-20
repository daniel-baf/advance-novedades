require("dotenv").config();
const express = require("express");
const router = express.Router();
const path = require("path");
const { ROLES } = require("../config/consts");
const { renderLoginPage, render500Page, renderSellsDashboard } = require("../modules/utils/renders.common.utils.module");

// MIDDLWARES TO CHECK IF CURRENT USER BELONGS TO PRODUCTION
router.use((req, res, next) => {
    try {
        if (req.session.user.role.NAME === ROLES.SELLS.NAME) {
            next();
        } else {
            render500Page(res, "No tienes permisos para acceder a esta sección");
        }
    } catch (error) {
        renderLoginPage(req, res, "", "La sesion ha expirado");
    }
});

// routes
// cart paths
router.use(require(path.join(__dirname, "sells/", "sells.cart.routes")));

// render main view of dashboard, with a view parameter display just x parameteres
router.get("/dashboard/", (req, res) => {
    renderSellsDashboard(req, res);
});

module.exports = router;
