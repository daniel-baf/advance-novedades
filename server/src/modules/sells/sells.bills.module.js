const path = require('path');
const { DEFAULT_BILL_NIT, BILLS_INSERT_QUERY, ROLES, EXTRA_BILL_DETAIL_INSERT_QUERY, BILLS_DETAIL_INSERT_QUERY } = require('../../config/consts');
const db_connection = require(path.join(__dirname, "../database/db-connection"));

// insert n extra bill detail into DB
async function insertExtraBillDetail(detail, price) {
    if (!detail || !price || typeof price !== 'number' || price < 0 || detail.length === 0) {
        throw new Error("No se han enviado todos los datos necesarios para realizar la factura o los datos son inválidos");
    }
    // Insert the detail into the DB and return the last inserted ID
    try {
        const result = await db_connection.query(EXTRA_BILL_DETAIL_INSERT_QUERY, [detail, price]);
        return result.insertId; // Return the last inserted ID
    } catch (error) {
        throw new Error("No hemos podido insertar el detalle de la factura, revisa los datos e inténtalo de nuevo");
    }
}


// function to insert a bill into DB
// send total, date, worker, client_nit, order_id
// worker is a json {id, role, name, location: {id, name}} -> return last inserted id or throw error
async function insertBill(total, date = new Date(), worker, client_nit = DEFAULT_BILL_NIT, order_id = null) {
    if (!total || !date || !worker || !client_nit) {
        throw new Error("No se han enviado todos los datos necesarios para realizar la factura");
    }
    if (!worker || worker.role !== ROLES.SELLS) {
        throw new Error("No se ha podido identificar al trabajador que realiza la factura o no tiene los permisos necesarios");
    }
    if (typeof total !== 'number' || total <= 0) {
        throw new Error("El total de la factura no puede ser menor o igual a 0");
    }

    try {
        const result = await db_connection.query(BILLS_INSERT_QUERY, [client_nit, total, date, order_id, worker.id]);
        return result.insertedId; // return the last inserted id
    } catch (error) {
        throw new Error("No hemos podido insertar la factura, revisa los datos e inténtalo de nuevo");
    }
}

// insert a bill id into DB
async function insertBillDetail(unitary_price, quantity, bill_Id, inventory_pledge_id, inventory_size_id, extra_id = null) {
    // check if any parameter is undefined and if is number, is < 0
    if (!unitary_price || !quantity || !bill_Id || !inventory_pledge_id || !inventory_size_id) {
        throw new Error("No se han enviado todos los datos necesarios para realizar la factura");
    }
    if (typeof unitary_price !== 'number' || unitary_price <= 0 || typeof quantity !== 'number' || quantity <= 0) {
        throw new Error("El precio unitario y la cantidad deben ser números mayores a 0");
    }
    // try to insert the bill detail into the DB
    try {
        const result = await db_connection.query(BILLS_DETAIL_INSERT_QUERY, [unitary_price, quantity, bill_Id, inventory_pledge_id, inventory_size_id, extra_id]);
        return result.insertId; // return the last inserted id
    } catch (error) {
        throw new Error("No hemos podido insertar el detalle de la factura, revisa los datos e inténtalo de nuevo");
    }
}

module.exports = { insertBill, insertExtraBillDetail, insertBillDetail }