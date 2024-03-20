const express = require('express');
const path = require('path');
const router = express.Router();

const { CART_SEARCH_TYPES } = require("../../config/consts");
const { searchStockByParameter } = require('../../modules/sells/sells.stock.module');
const { addItemToCart } = require('../../modules/sells/sells.cart.module');

const { renderLoginPage } = require('../../modules/utils/renders.common.utils.module');

// functions
// render items list for current session
function renderItemsSearched(req, res, message, error_message, data = []) {
    try {
        res.render("users/sells/cart/add-item-cart", {
            name: req.session.user.id,
            message: message,
            error_message: error_message,
            filterTypes: CART_SEARCH_TYPES,
            data: data,
            building: req.session.user.location.name
        });
    } catch (error) {
        render500Page(res, "No hemos podidio recuperar tu sesion. " + error);
    }
}

// TMP testing page to create a new sell
router.get("/stock/search/", (req, res) => {
    renderItemsSearched(req, res, "", "");
});

// search items in cart
router.post("/stock/search/", (req, res) => {
    try {
        let { searchType, searchId } = req.body;
        // fetch promisse to get data from stock
        searchStockByParameter(searchType, searchId, req.session.user.location.id).then((data) => {
            renderItemsSearched(req, res, "Busqueda completada", "", data);
        }).catch((error) => {
            renderItemsSearched(req, res, "", error);
        });
    } catch (error) {
        renderItemsSearched(req, res, "", error);
    }
});

// add item to cart
router.get("/cart/add/", (req, res) => {
    try {
        addItemToCart(req, res).then((result) => {
            renderItemsSearched(req, res, result, "");
        }).catch((error) => {
            renderItemsSearched(req, res, "", error);
        });
    } catch (error) {
        renderLoginPage(req, res, '', error)
    }
});




module.exports = router;

