const path = require('path');
const { GET_ALL_EXPENSE_TYPE_QUERY, EXPENSE_TYPE_INSERT_QUERY, EXPENSE_INSERT_QUERY } = require('../../config/consts');
const db_connection = require(path.join(__dirname, "../database/db-connection"));

// search all expenses type on DB and return fetched data, empty if null, error if invalid call
function getAllExpenseType() {
    return new Promise((resolve, reject) => {
        db_connection.query(GET_ALL_EXPENSE_TYPE_QUERY, (error, result) => {
            if (error) {
                reject("No hemos podido encontrar los tipos de gastos en la BD " + id); // Reject the Promise if there is an error
            } else {
                resolve(result);  // Resolve the Promise with the result
            }
        });
    });
}

// insert into DB a new expense type
function insertExpense(_ammount, _worker_id, _expense_type) {
    return new Promise((resolve, reject) => {
        // check if ammount is > 0
        if (_ammount < 0) reject('No puedes ingresar valores menores a 0')
        // check if _expense_type is invalid
        if (!_expense_type) reject('No has ingresado un valor valido para el tipo de gasto')
        // check if user is invalid
        if (!_worker_id) reject('No es un usuario valido el que ha insertado el gasto')
        // check if a no admin is trying to insert the expense
        if (!_worker_id.includes("ADM")) reject("No estas autorizado para ejecutar esta operacion")
        // valid operation, proced to insert
        let _date = new Date();         // configure date to current date
        _ammount = Number.parseFloat(_ammount) // cast to double
        db_connection.query(EXPENSE_INSERT_QUERY, [_ammount, _date, _worker_id, _expense_type], (error, result) => {
            if (error) {
                reject(`No se ha podidio insertar gasto, ${error}`)
            } else {
                resolve(`Se ha insertado el gasto de Q${_ammount} correctamente`)
            }
        });
    });
}

// inset an expense type into DB
function insertExpenseType(_expense_name) {
    return new Promise((resolve, reject) => {
        // check if _expense_type is invalid
        if (!_expense_name) reject('No has ingresado un valor valido para el tipo de gasto')
        // check if user is invalid
        if (!_worker_id) reject('No es un usuario valido el que ha insertado el gasto')
        // check if a no admin is trying to insert the expense
        if (!_worker_id.includes("ADM")) reject("No estas autorizado para ejecutar esta operacion")
        // valid operation, proced to insert
        db_connection.query(EXPENSE_TYPE_INSERT_QUERY, [_expense_name], (error, result) => {
            if (error) {
                reject(`No se ha podidio insertar el tipo de gasto, ${error}`)
            } else {
                resolve(`Se ha insertado el tipo de gasto ${_expense_name.toLowerCase()}`)
            }
        });
    });
}

module.exports = { getAllExpenseType }