const path = require('path');
const { findStockByPK } = require('../admin/admin.products.module');
const db_connection = require(path.join(__dirname, "../database/db-connection"));

// add item to cart
// structure of DICT: { pledge_id: 1, pledge_size: 'S', quantity: 1, extras: { price: x, note: '' } }
function addItemToCart(req, res) {
    let { pledge_id, pledge_size, quantity, extras: { } } = req.query;
    return new Promise((resolve, reject) => {
        // // check valid inputs
        if (pledge_id === undefined || pledge_size === undefined || quantity === undefined) {
            reject('Valores invalidos para agregar al carrito');
        }
        let tmp_json = { pledge_id: pledge_id, pledge_size: pledge_size, quantity: Number(quantity) };
        // check if product exists
        findStockByPK(req.session.user.location.id, tmp_json.pledge_id, tmp_json.pledge_size).then(result => {
            // check if stock is 0 or lower than quantity
            if (result.stock < tmp_json.quantity || result.stock == 0) {
                reject('No hay suficiente stock para el producto que solicitaste');
            }
            return result.stock;
        }).then((current_stock) => {
            // check cart
            if (req.session.cart == undefined) {
                req.session.cart = [];
            }
            // check if cart contains current item to add
            let index = req.session.cart.findIndex(item => item.pledge_id === tmp_json.pledge_id);

            // if item does not exist, then push it to cart
            if (index === -1) {
                req.session.cart.push(tmp_json);
                resolve('Producto agregado al carrito');
            } else {
                // check if new sum is lower than stock
                let _new_request = Number(tmp_json.quantity) + Number(req.session.cart[index].quantity);
                if (_new_request > current_stock) {
                    reject('No hay suficiente stock para el producto que solicitaste');
                }
                // update cart
                req.session.cart[index].quantity = _new_request;
                console.log(req.session.cart);
                resolve('Producto agregado al carrito');
            }
        }).catch(error => {
            reject(error);
        });
    });
}

module.exports = { addItemToCart }