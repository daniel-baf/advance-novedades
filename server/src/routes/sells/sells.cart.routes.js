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
        // initialize cart
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
    // display all values by default
    searchStockByParameter('', "", req.session.user.location.id).then((data) => {
        renderItemsSearched(req, res, "", "", data);
    });
});

// search items in cart
router.post("/stock/search/", async (req, res) => {
    try {
        let { searchType, searchId } = req.body;
        // fetch promisse to get data from stock
        searchStockByParameter(searchType, searchId, req.session.user.location.id).then((data) => {
            renderItemsSearched(req, res, "Busqueda completada", "", data);
            return data;
        }).catch((error) => {
            renderItemsSearched(req, res, "", error);
        });
    } catch (error) {
        renderItemsSearched(req, res, "", error);
    }
});

// add item to cart
router.post("/cart/add/", (req, res) => {
    if (req.session.shopping_cart == undefined) {
        req.session.shopping_cart = [];
    }

    try {
        addItemToCart(req, res).then((result) => {
            renderItemsSearched(req, res, result, "");
        }).catch((error) => {
            renderItemsSearched(req, res, "", error);
        });
    } catch (error) {
        renderLoginPage(req, res, '', error)
    }


    // try {
    //     // wait for cart adding
    //     let status = await addItemToCart(req, res).then((result) => {
    //         return result;
    //     });

    //     res.status(200).json(status);
    // // wait for data to display
    // let _data = await searchStockByParameter(CART_SEARCH_TYPES.ID, req.query.pledge_id, req.session.user.location.id).then((data) => {
    //     return data;
    // });
    // // check if error
    // console.log(req.session.cart);
    // if (!status.error) {
    //     // render page with message and data
    //     renderItemsSearched(req, res, status.message, "", _data);
    // } else {
    //     renderItemsSearched(req, res, "", status.message, _data);
    // }
    // } catch (error) {
    //     renderLoginPage(req, res, '', error)
    // }
});




module.exports = router;

