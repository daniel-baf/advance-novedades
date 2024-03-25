const path = require('path');
const { findStockByPK } = require('../admin/admin.products.module');
const db_connection = require(path.join(__dirname, "../database/db-connection"));

function isNullOrUndefined(value) {
    return value === null || value === undefined || value === '';
}

function findIndexCart(json_tmp, session) {
    let index = -1;
    // check if cart contains current item to add
    for (let _iter = 0; _iter < session.shopping_cart.length; _iter++) {
        const element = session.shopping_cart[_iter];

        if (element.pledge_id == json_tmp.pledge_id && element.pledge_size == json_tmp.pledge_size) {
            if (Object.keys(json_tmp.extras).length === Object.keys(element.extras).length) {
                index = _iter;
                break;
            }
        }
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
            session.shopping_cart.push(new_item_json);
            return { error: false, message: 'Producto agregado al carrito' };
        } else {
            // update cart
            // check if stock is 0 or lower than quantity
            let _json_backup = session.shopping_cart[index].quantity;
            session.shopping_cart[index].quantity = session.shopping_cart[index].quantity + new_item_json.quantity;
            if (_db_products.stock < session.shopping_cart[index].quantity) {
                session.shopping_cart[index].quantity = _json_backup;
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
function deleteFromCart(pledge_id, pledge_size, with_extras, session) {
    try {
        let json_object = { pledge_id, pledge_size, extras: {} };
        if (with_extras) {
            json_object.extras = { extras_price: 0, extras_note: '' };
        }
        let index = findIndexCart(json_object, session);
        if (index == -1) {
            return { error: true, message: 'No hemos podido encontrar el producto en el carrito' };
        }
        session.shopping_cart.splice(index, 1);
        return { error: false, message: 'Producto eliminado del carrito' };
    } catch (error) {
        return { error: true, message: 'No hemos podido recuperarnos de un error inesperado ' + error.message };
    }
}

// -- to quantity
function decreaseFromCart(pledge_id, pledge_size, with_extras, session) {
    try {
        let json_object = { pledge_id, pledge_size, extras: {} };
        if (with_extras) {
            json_object.extras = { extras_price: 0, extras_note: '' };
        }
        let index = findIndexCart(json_object, session);
        if (index == -1) {
            return { error: true, message: 'No hemos podido encontrar el producto en el carrito' };
        }
        if (session.shopping_cart[index].quantity <= 1) { // if current quantity is 1, delete it
            return deleteFromCart(pledge_id, pledge_size, with_extras, session);
        } else {
            session.shopping_cart[index].quantity = session.shopping_cart[index].quantity - 1;
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
        let _json_backup = session.shopping_cart[index];
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
            session.shopping_cart[index] = json_object;
            return { error: false, message: 'Producto del carrito editado' };
        }
    } catch (error) {
        return { error: true, message: 'No hemos podido recuperarnos de un error inesperado ' + error.message };
    }
}


// function to edit cart
async function editCart(json_object, session) {
    try {
        if (json_object.quantity < 0) {
            return { error: true, message: "Stock no puede ser negativo" }
        }
        // check if json_object contains extras
        // update just the quantity
        let index = findIndexCart(json_object, session);
        if (index === -1) {
            return { error: true, message: "El carrito no existía en el carrito de compras" }
        }
        // let backup = session.shopping_cart[index];
        // look out for the product stock
        let _db_product = await findStockByPK(session.user.location.id, json_object.pledge_id, json_object.pledge_size).then(db_product => {
            return db_product;
        });
        // compare stock with how much i have and hm they want
        if (_db_product.stock < (json_object.quantity)) {
            return { error: true, message: "No hay suficiente stock" }
        }
        // delete and insert new value
        console.log(_db_product);
        console.log(session.shopping_cart);
        console.log(json_object);
        session.shopping_cart[index].quantity = json_object.quantity;
        if (Object.keys(session.shopping_cart[index].extras).length != 0) {
            session.shopping_cart[index].extras = json_object.extras;
        }

        return { error: false, message: "Se ha agregado al carrito" }
    } catch (error) {
        return { error: true, message: 'No hemos podido recuperarnos de un error inesperado ' + error.message };
    }
}
module.exports = { addItemToCart, editCart, deleteFromCart, decreaseFromCart, increaseFromCart }