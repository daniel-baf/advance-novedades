const path = require('path');
const { findStockByPK } = require('../admin/admin.products.module');
const db_connection = require(path.join(__dirname, "../database/db-connection"));

function isNullOrUndefined(value) {
    return value === null || value === undefined || value === '';
}

// add item to cart
// structure of DICT: { pledge_id: 1, pledge_size: 'S', quantity: 1, extras: { price: x, note: '' } }
async function addItemToCart(req, res) {
    try {
        let { pledge_id, pledge_size, quantity, extras_price, extras_note, addExtras, pledge_name } = req.body;
        pledge_id = Number(pledge_id);
        quantity = Number(quantity);
        addExtras = isNullOrUndefined(addExtras) ? false : true; // check if undefined -> false -> Boolean
        let json_tmp = { pledge_id, pledge_size, quantity, extras: {}, message: '', error: '' };
        if (addExtras) {
            json_tmp.extras = { extras_price: extras_price, extras_note: extras_note }; // add only if addExtras is true
        }
        if (addExtras && (isNullOrUndefined(json_tmp.extras.extras_price) || isNullOrUndefined(json_tmp.extras.extras_note))) {
            return { error: true, message: 'Valores extras no son validos' }; // check extras
        }
        if (addExtras && json_tmp.extras_price < 0) { // valid price
            return { error: true, message: 'El precio de los extras no puede ser negativo' };
        }
        if (addExtras && json_tmp.extras_note === '') { // valid note
            return { error: true, message: 'La nota de los extras no puede estar vacia' };
        }
        if (isNullOrUndefined(json_tmp.pledge_id) || isNullOrUndefined(json_tmp.pledge_size) || isNullOrUndefined(json_tmp.quantity) || isNullOrUndefined(pledge_name)) { // valid parameters
            return { error: true, message: 'Los valores para agregar al carrito no son validos' };
        }
        // check if product exists
        let _db_products = await findStockByPK(req.session.user.location.id, json_tmp.pledge_id, json_tmp.pledge_size).then(db_product => {
            return db_product;
        });

        let index = -1;
        // check if cart contains current item to add
        for (let _iter = 0; _iter < req.session.shopping_cart.length; _iter++) {
            const element = req.session.shopping_cart[_iter];
            if (element.pledge_id == json_tmp.pledge_id && element.pledge_size == json_tmp.pledge_size) {
                if (Object.keys(element.extras).length == 0) {
                    index = _iter;
                    break;
                }
            }
        }
        // new json to push
        let new_item_json = { pledge_id: json_tmp.pledge_id, pledge_name: pledge_name, pledge_size: json_tmp.pledge_size, quantity: json_tmp.quantity, extras: json_tmp.extras };
        // check if stock is 0 or lower than quantity
        if (_db_products.stock < json_tmp.quantity || _db_products.stock == 0) {
            return { error: true, message: 'No hay suficiente stock para el producto que solicitaste' };
        }
        if (index == -1) {
            req.session.shopping_cart.push(new_item_json);
            return { error: false, message: 'Producto agregado al carrito' };
        } else {
            // update cart
            // check if stock is 0 or lower than quantity
            let _session_stock_backup = req.session.shopping_cart[index].quantity;
            req.session.shopping_cart[index].quantity = req.session.shopping_cart[index].quantity + new_item_json.quantity;
            if (_db_products.stock < req.session.shopping_cart[index].quantity) {
                req.session.shopping_cart[index].quantity = _session_stock_backup;
                return { error: true, message: 'No hay suficiente stock para el producto que solicitaste' };
            }
            return { error: false, message: 'Producto actualizado en el carrito' };
        }
    } catch (error) {
        return { error: true, message: 'No hemos podido agregar el producto al carrito ' + error };
    }
}

module.exports = { addItemToCart }