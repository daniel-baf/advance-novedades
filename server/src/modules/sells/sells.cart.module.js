const path = require('path');
const { findStockByPK } = require('../admin/admin.products.module');
const { insertBill } = require('./sells.bills.module');
const db_connection = require(path.join(__dirname, "../database/db-connection"));

function isNullOrUndefined(value) {
    return value === null || value === undefined || value === '';
}

// find index of cart, to check if item is already in cart
// send ignore_extras = true to ignore extras je. to find index at update sentence
function findIndexCart(_new_item_json, session) {
    let index = -1;
    // check if cart contains current item to add
    for (let _iter = 0; _iter < session.shopping_cart.items.length; _iter++) {
        // search for the pledge in session
        const _cart_item = session.shopping_cart.items[_iter];

        // check if pledge_id and pledge_size are the same
        if (!(_cart_item.pledge_id === _new_item_json.pledge_id && _cart_item.pledge_size === _new_item_json.pledge_size)) {
            continue;
        }
        // check if extras has same length
        if (Object.keys(_new_item_json.extras).length !== Object.keys(_cart_item.extras).length) {
            continue;
        }
        if ((Object.keys(_new_item_json.extras).length != 0) && (_new_item_json.extras.extras_price !== _cart_item.extras.extras_price || _new_item_json.extras.extras_note !== _cart_item.extras.extras_note)) {
            // check if extras has same values
            continue;
        }
        index = _iter;
        break;

    }
    return index;
}

// common function to add, use it to edit too
async function addItemCartSubMethod(session, pledge_id, pledge_size, quantity, extras_price, extras_note, addExtras, pledge_name, pledge_price) {
    try {
        pledge_id = Number(pledge_id);
        quantity = Number(quantity);
        pledge_price = Number(pledge_price);
        addExtras = isNullOrUndefined(addExtras) ? false : true; // check if undefined -> false -> Boolean
        let json_tmp = { pledge_id, pledge_size, quantity, pledge_price, extras: {}, message: '', error: '' };
        if (addExtras) {
            json_tmp.extras = { extras_price: Number(extras_price), extras_note: extras_note }; // add only if addExtras is true
        }
        if (addExtras && (isNullOrUndefined(json_tmp.extras.extras_price) || isNullOrUndefined(json_tmp.extras.extras_note))) {
            return { error: true, message: 'Valores extras no son validos' }; // check extras
        }
        if (addExtras && json_tmp.extras_price < 0) { // valid price
            return { error: true, message: 'El precio de los extras no puede ser negativo' };
        }
        if (pledge_price < 0) { // valid price
            return { error: true, message: 'El precio de la prenda no puede ser negativo' };
        }
        if (addExtras && json_tmp.extras_note === '') { // valid note
            return { error: true, message: 'La nota de los extras no puede estar vacía' };
        }
        if (isNullOrUndefined(json_tmp.pledge_id) || isNullOrUndefined(json_tmp.pledge_size) || isNullOrUndefined(json_tmp.quantity) || isNullOrUndefined(pledge_name)) { // valid parameters
            return { error: true, message: 'Los valores para agregar al carrito no son validos' };
        }
        // check if product exists
        let _db_products = await findStockByPK(session.user.location.id, json_tmp.pledge_id, json_tmp.pledge_size).then(db_product => {
            return db_product;
        });
        // new json to push
        let new_item_json = { pledge_id: json_tmp.pledge_id, pledge_name: pledge_name, pledge_size: json_tmp.pledge_size, pledge_price: pledge_price, quantity: json_tmp.quantity, extras: json_tmp.extras };
        // check if stock is 0 or lower than quantity
        if (_db_products.stock < json_tmp.quantity || _db_products.stock == 0) {
            return { error: true, message: 'No hay suficiente stock para el producto que solicitaste' };
        }
        let index = findIndexCart(json_tmp, session);
        if (index == -1) {
            session.shopping_cart.items.push(new_item_json);
            return { error: false, message: 'Producto agregado al carrito' };
        } else {
            // update cart
            // check if stock is 0 or lower than quantity
            let _json_backup = session.shopping_cart.items[index].quantity;
            session.shopping_cart.items[index].quantity = session.shopping_cart.items[index].quantity + new_item_json.quantity;
            if (_db_products.stock < session.shopping_cart.items[index].quantity) {
                session.shopping_cart.items[index].quantity = _json_backup;
                return { error: true, message: 'No hay suficiente stock para el producto que solicitaste' };
            }
            return { error: false, message: 'Producto actualizado en el carrito' };
        }
    } catch (error) {
        return { error: true, message: 'No hemos podido agregar el producto al carrito ' + error };
    }
}

// add item to cart
// structure of DICT: { pledge_id: 1, pledge_size: 'S', quantity: 1, extras: { price: x, note: '' } }
async function addItemToCart(req, res) {
    let { pledge_id, pledge_size, quantity, extras_price, extras_note, addExtras, pledge_name, pledge_price } = req.body;
    return addItemCartSubMethod(req.session, pledge_id, pledge_size, quantity, extras_price, extras_note, addExtras, pledge_name, pledge_price);
}


// delete from cart, search by pledge, and as extras != object without, use
// that one to check id of array cart
function deleteFromCart(pledge_id, pledge_size, session, extras = {}) {
    try {
        let json_object = { pledge_id, pledge_size, extras: extras };
        let index = findIndexCart(json_object, session);
        if (index == -1) {
            return { error: true, message: 'No hemos podido encontrar el producto en el carrito' };
        }
        session.shopping_cart.items.splice(index, 1);
        return { error: false, message: 'Producto eliminado del carrito' };
    } catch (error) {
        return { error: true, message: 'No hemos podido recuperarnos de un error inesperado ' + error.message };
    }
}

// -- to quantity
function decreaseFromCart(pledge_id, pledge_size, session, extras = {}) {
    try {
        let json_object = { pledge_id, pledge_size, extras: extras };
        let index = findIndexCart(json_object, session);
        if (index == -1) {
            return { error: true, message: 'No hemos podido encontrar el producto en el carrito' };
        }
        if (session.shopping_cart.items[index].quantity <= 1) { // if current quantity is 1, delete it
            return deleteFromCart(pledge_id, pledge_size, session, extras);
        } else {
            session.shopping_cart.items[index].quantity = session.shopping_cart.items[index].quantity - 1;
            return { error: false, message: 'Producto del carrito editado' };
        }
    } catch (error) {
        return { error: true, message: 'No hemos podido recuperarnos de un error inesperado ' + error.message };
    }
}


// ++ to quantity
async function increaseFromCart(pledge_id, pledge_size, session, extras = {}) {
    try {
        let json_object = { pledge_id, pledge_size, extras: extras };
        let index = findIndexCart(json_object, session);
        if (index == -1) {
            return { error: true, message: 'No hemos podido encontrar el producto en el carrito' };
        }
        // make a backup of current quantity
        let _json_backup = session.shopping_cart.items[index];
        // remove and insert new value
        json_object = {
            pledge_id, pledge_name: _json_backup.pledge_name, pledge_size,
            pledge_price: _json_backup.pledge_price, quantity: _json_backup.quantity,
            extras: _json_backup.extras
        };
        json_object.quantity = json_object.quantity + 1;
        // check if new value is lower than stock
        let _db_products = await findStockByPK(session.user.location.id, json_object.pledge_id, json_object.pledge_size).then(db_product => {
            return db_product;
        });
        if (_db_products.stock < json_object.quantity) {
            return { error: true, message: 'No hay suficiente stock para el producto que solicitaste' };
        } else {
            session.shopping_cart.items[index] = json_object;
            return { error: false, message: 'Producto del carrito editado' };
        }
    } catch (error) {
        return { error: true, message: 'No hemos podido recuperarnos de un error inesperado ' + error.message };
    }
}


// function to edit cart, send a new JSON to update, and the previous JSON (extras) to find it on DB
async function editCart(json_object, session, _old_json_extras = {}) {
    try {
        if (json_object.quantity < 0) {
            return { error: true, message: "Stock no puede ser negativo" }
        }
        // check if json_object contains extras
        // update just the quantity
        let recover_json = JSON.parse(JSON.stringify(json_object)); // fin index with previous values of JSON
        recover_json.extras = _old_json_extras;
        let index = findIndexCart(recover_json, session);
        if (index === -1) {
            return { error: true, message: "El producto no existía en el carrito de compras" }
        }
        // look out for the product stock
        let _db_product = await findStockByPK(session.user.location.id, json_object.pledge_id, json_object.pledge_size).then(db_product => {
            return db_product;
        });
        // compare stock with how much i have and hm they want
        if (_db_product.stock < (json_object.quantity)) {
            return { error: true, message: "No hay suficiente stock" }
        }
        // delete and insert new value
        session.shopping_cart.items[index].quantity = json_object.quantity;
        if (Object.keys(session.shopping_cart.items[index].extras).length != 0) {
            session.shopping_cart.items[index].extras = json_object.extras;
        }

        return { error: false, message: "Se ha agregado al carrito" }
    } catch (error) {
        return { error: true, message: 'No hemos podido recuperarnos de un error inesperado ' + error.message };
    }
}


// function to generate a bill into DB
// shopping cart is a JSON with the following structure
// [ { pledge_id, pledge_name, pledge_size, pledge_price, quantity, extras: { extras_price, extras_note } } ]
// worker is a JSON { id, role, name, location: { id, name } }
async function generateBIll(shopping_cart, worker, order_id = null) {
    let response = { error: true, message: '', inserted_id: null };
    try {
        await db_connection.beginTransaction(); // init a transaction
        let total = 0;
        shopping_cart.items.forEach(item => {
            subtotal = item.pledge_price * item.quantity; // calculate subtotal and check if negative sub re
            // check if extras has values
            if (Object.keys(item.extras).length !== 0) {
                subtotal += item.extras.extras_price;
            }
            if (subtotal <= 0) {
                throw new Error(`Se ha calculado un subtotal negativo o igual a 0 para el producto ${item.pledge_name}`);
            }
            total += subtotal;
        });
        response = { error: false, message: 'Factura generada con éxito', inserted_id: 1, total };
        // response.inserted_id = await insertBill(shopping_cart.total, new Date(), worker, shopping_cart.client.NIT, order_id); // await for success message -> continue to insert
        db_connection.commit();
    } catch (error) {
        // If any operation fails, rollback the transaction
        response.message = `Error interno en la transacción implementada ${error}`;
    } finally {
        if (response.error) {
            await db_connection.rollback();
        }
        await db_connection.end();
        return response;
    }
}
module.exports = { addItemToCart, editCart, deleteFromCart, decreaseFromCart, increaseFromCart, generateBIll }