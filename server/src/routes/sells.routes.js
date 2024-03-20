require("dotenv").config();
const express = require("express");
const router = express.Router();
const path = require("path");
const { ROLES } = require("../config/consts");
const { renderLoginPage } = require("../modules/utils/renders.common.utils.module");

// MIDDLWARES TO CHECK IF CURRENT USER BELONGS TO PRODUCTION
router.use((req, res, next) => {
    try {
        if (req.session.user.role.NAME === ROLES.SELLS.NAME) {
            next();
        } else {
            res.render("500", {
                error_message: "No tienes permisos para acceder a esta sección",
            });
        }
    } catch (error) {
        renderLoginPage(req, res, "", "La sesion ha expirado");
    }
});

// routes
// render main view of dashboard, with a view parameter display just x parameteres
router.get("/dashboard/", (req, res) => {
    renderSellsDashboard(req, res);
});

// TMP testing page to create a new sell
router.get("/cart/items/", (req, res) => {
    res.render("users/sells/cart/add-item-cart", {
        name: req.session.user.id,
        message: "",
        error_message: "",
    });

});

function renderSellsDashboard(req, res, message, error_message) {
    try {
        res.render("users/sells/sells-view", {
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
