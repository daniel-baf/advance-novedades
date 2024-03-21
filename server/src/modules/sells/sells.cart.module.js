const path = require('path');
const { findStockByPK } = require('../admin/admin.products.module');
const db_connection = require(path.join(__dirname, "../database/db-connection"));

function isNullOrUndefined(value) {
    return value === null || value === undefined || value === '' || isNaN(value);
}

// add item to cart
// structure of DICT: { pledge_id: 1, pledge_size: 'S', quantity: 1, extras: { price: x, note: '' } }
async function addItemToCart1(req, res) {
    try {
        let { pledge_id, pledge_size, quantity, extras_price, extras_note, addExtras } = req.body;
        pledge_id = Number(pledge_id);
        quantity = Number(quantity);
        addExtras = !isNullOrUndefined(addExtras) ? false : Boolean(addExtras); // check if undefined -> false -> Boolean
        let json_tmp = { pledge_id, pledge_size, quantity, extras: {}, message: '', error: '' };
        if (addExtras) {
            json_tmp.extras = { extras_price, extras_note }; // add only if addExtras is true
        }
        if ((Object.keys(json_tmp.extras).length != 0) && (isNullOrUndefined(json_tmp.extras.extras_price) || isNullOrUndefined(json_tmp.extras.extras_note))) {
            return { error: true, message: 'Valores extras no son validos' }; // check extras
        }
        if ((Object.keys(json_tmp.extras).length != 0) && json_tmp.extras_price < 0) { // valid price
            return { error: true, message: 'El precio de los extras no puede ser negativo' };
        }
        if ((Object.keys(json_tmp.extras).length != 0) && json_tmp.extras_note === '') { // valid note
            return { error: true, message: 'La nota de los extras no puede estar vacia' };
        }
        if (isNullOrUndefined(json_tmp.pledge_id) || isNullOrUndefined(json_tmp.pledge_size) || isNullOrUndefined(json_tmp.quantity)) { // valid parameters
            return { error: true, message: 'Los valores para agregar al carrito no son validos' };
        }
        // check if product exists
        let _db_products = await findStockByPK(req.session.user.location.id, json_tmp.pledge_id, json_tmp.pledge_size).then(db_product => {
            return db_product;
        });

        // check if stock is 0 or lower than quantity
        if (_db_products.stock < json_tmp.quantity || _db_products.stock == 0) {
            return { error: true, message: 'No hay suficiente stock para el producto que solicitaste' };
        }
        // check cart
        if (!req.session.cart) {
            req.session.cart = [];
        }
        let index = -1;
        // check if cart contains current item to add
        console.log(req.session.cart);

        for (let _iter = 0; _iter < req.session.cart.length; _iter++) {
            const element = req.session.cart[_iter];
            if (element.pledge_id == json_tmp.pledge_id && element.pledge_size == json_tmp.pledge_size) {
                if (Object.keys(element.extras).length == 0) {
                    index = _iter;
                    break;
                }
            }
        }

        let new_item_json = {
            pledge_id: json_tmp.pledge_id,
            pledge_size: json_tmp.pledge_size,
            quantity: json_tmp.quantity,
            extras: json_tmp.extras
        };

        if (index == -1) {
            req.session.cart.push(new_item_json);
            return { error: false, message: 'Producto agregado al carrito' };
        } else {
            // update cart
            req.session.cart[index].quantity = req.session.cart[index].quantity + new_item_json.quantity;
            return { error: false, message: 'Producto actualizado en el carrito' };
        }
    } catch (error) {
        return { error: true, message: 'No hemos podido agregar el producto al carrito ' + error };
    }
}

// add item to cart
// structure of DICT: { pledge_id: 1, pledge_size: 'S', quantity: 1, extras: { price: x, note: '' } }
function addItemToCart(req, res) {
    let { pledge_id, pledge_size, quantity } = req.body;
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
            // check if cart contains current item to add
            let index = req.session.cart.findIndex(item => item.pledge_id === tmp_json.pledge_id);

            // if item does not exist, then push it to cart
            console.log(req.session.cart);
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
                resolve('Producto editado en el carrito');
            }
        }).catch(error => {
            reject(error);
        });
    });
}


module.exports = { addItemToCart }