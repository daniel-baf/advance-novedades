const path = require('path');
const { DEFAULT_BILL_NIT, BILLS_INSERT_QUERY, ROLES, EXTRA_BILL_DETAIL_INSERT_QUERY, BILLS_DETAIL_INSERT_QUERY, BILLS_DETAIL_EXTRAS_INSERT_MULTIPLE_QUERY, BILLS_DETAIL_INSERT_MULTIPLE_QUERY } = require('../../config/consts');
const db_connection = require(path.join(__dirname, "../database/db-connection"));

// insert n extra bill detail into DB
async function insertExtraBillDetail(detail, price) {
    let response = { error: false, message: "Extra insertado con éxito", extra_id: null };
    if (!detail || !price || typeof price !== 'number' || price < 0 || detail.length === 0) {
        return { error: true, message: "Datos incorrectos para insertar un extra del producto" };
    }
    // Insert the detail into the DB and return the last inserted ID
    try {
        let connection = await db_connection();
        const result = await new Promise((resolve, reject) => {
            connection.query(EXTRA_BILL_DETAIL_INSERT_QUERY, [detail, price], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
        // check if inserted
        if (result.affectedRows === 0) {
            return { error: true, message: "No se ha podido insertar el extra, revisa los datos e inténtalo de nuevo" };
        }
        response.extra_id = result.insertId;
        return response;
    } catch (error) {
        return { error: true, message: 'Error no recuperable al insertar extras' };
    }
}

// insert multiple extra bill detail into DB return IDS
async function insertMultipleExtraBillDetail(data) {
    let response = { error: false, message: "Extras insertados con éxito", extras_ids: [] };
    if (!data || data.length === 0) {
        return { error: true, message: "Datos inválidos para insertar multiples detalles extras" };
    }
    // insert extras
    let ids = [];

    let connection = await db_connection();
    try {
        await connection.beginTransaction();
        for (let i = 0; i < data.length; i++) {
            let _status_id = await insertExtraBillDetail(data[i].detail, data[i].price);
            if (_status_id.error) {
                response = _status_id;
                return; // exit function, error
            }
            ids.push(_status_id.extra_id);
        }
        response.extras_ids = ids;
    } catch (error) {
        response = { error: true, message: `Error inesperado:  ${error.message}` };
    } finally {
        if (response.error) {
            await connection.rollback();
        } else {
            await connection.commit();
        }
        return response;
    }
}


// function to insert a bill into DB
// send total, date, worker, client_nit, order_id
// worker is a json {id, role, name, location: {id, name}} -> return last inserted id or throw error
async function insertBill(total, date = new Date(), worker, client_nit = DEFAULT_BILL_NIT, order_id = null) {
    // Format the date as YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];
    if (!total || !date || !worker || !client_nit) {
        throw new Error("No se han enviado todos los datos necesarios para realizar la factura");
    }
    if (!worker || worker.role !== ROLES.SELLS) {
        throw new Error("No se ha podido identificar al trabajador que realiza la factura o no tiene los permisos necesarios");
    }
    if (typeof total !== 'number' || total <= 0) {
        throw new Error("El total de la factura no puede ser menor o igual a 0");
    }

    let connection = await db_connection();
    try {
        // Use a promise to execute the query
        return await new Promise((resolve, reject) => {
            connection.query(BILLS_INSERT_QUERY, [client_nit, total, formattedDate, order_id, worker.id], (error, result) => {
                if (error) {
                    reject({ error: true, message: "No se ha podido insertar la factura, revisa que los datos del cliente y productos sean correctos" + error });
                } else {
                    resolve({ error: false, message: "Factura generada con éxito", bill_id: result.insertId });
                }
            });
        });
    } catch (error) {
        return { error: true, message: error.message };
    }
}

// insert a bill id into DB
async function insertBillDetail(unitary_price, quantity, bill_Id, inventory_pledge_id, inventory_size_id, extra_id = null) {
    // check if any parameter is undefined and if is number, is < 0
    if (!unitary_price || !quantity || !bill_Id || !inventory_pledge_id || !inventory_size_id) {
        throw new Error("No se han enviado todos los datos necesarios para insertar el detalle de factura");
    }
    if (typeof unitary_price !== 'number' || unitary_price <= 0 || typeof quantity !== 'number' || quantity <= 0) {
        throw new Error("El precio unitario y la cantidad deben ser números mayores a 0");
    }
    // try to insert the bill detail into the DB
    try {
        let connection = await db_connection();
        return await new Promise((resolve, reject) => {
            connection.query(BILLS_DETAIL_INSERT_QUERY, [unitary_price, quantity, bill_Id, inventory_pledge_id, inventory_size_id, extra_id], (error, result) => {
                if (error) {
                    reject({ error: true, message: "No se ha podido insertar el detalle de la factura, revisa que los datos del producto sean correctos" + error });
                } else {
                    resolve({ error: false, message: "Detalle de factura insertado con éxito", detail_id: result.insertId });
                }
            });
        });
    } catch (error) {
        return { error: true, message: error.message }
    }

}

// function to insert multiple bill details into DB
// send an array of objects with unitary_price, quantity, bill_id, inventory_pledge_id, inventory_size_id, extra_id
async function insertMultipleBillDetails(_data_rows) {
    try {
        let connection = await db_connection();
        return await new Promise((resolve, reject) => {
            connection.query(BILLS_DETAIL_INSERT_MULTIPLE_QUERY, [_data_rows], (error, result) => {
                if (error) {
                    reject({ error: true, message: "No se ha podido insertar los detalles de la factura, revisa que los datos de los productos sean correctos" + error });
                } else {
                    resolve({ error: false, message: "Detalles de factura insertados con éxito", affected_rows: result.affectedRows });
                }
            });
        });
    } catch (error) {
        return { error: true, message: error.message };
    }
}

module.exports = { insertBill, insertExtraBillDetail, insertBillDetail, insertMultipleExtraBillDetail, insertMultipleBillDetails }