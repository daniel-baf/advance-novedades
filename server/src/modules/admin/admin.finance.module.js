const path = require('path');
const { GET_ALL_EXPENSE_TYPE_QUERY, EXPENSE_TYPE_INSERT_QUERY, EXPENSE_INSERT_QUERY, EXPENSE_TYPE_READ_ID_QUERY, EXPENSE_TYPE_UPDATE_QUERY, EXPENSE_TYPE_DELETE_QUERY,
    EXPENSE_SELECT_PROCEDURE, EXPENSE_DELETE_QUERY, EXPENSE_UPDATE_QUERY, EXPENSE_SELECT_ID_QUERY } = require('../../config/consts');
const db_connection = require(path.join(__dirname, "../database/db-connection"));

// format a date
// Your formatDate function
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

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

// find an expense by ID
function findExpenseTypeById(_id) {
    return new Promise((resolve, reject) => {
        db_connection.query(EXPENSE_TYPE_READ_ID_QUERY, [_id], (error, result) => {
            // check valid id
            if (!_id) reject("No has ingresado un ID valido") // Reject if invalid id, ej. NaN, undefined...
            if (error) {
                reject("No hemos podido encontrar el gasto en la BD " + id); // Reject the Promise if there is an error
            } else {
                resolve({ id: result[0].id, name: result[0].name });  // Resolve the Promise with the result
            }
        });
    });
}

// inset an expense type into DB
function insertExpenseType(_expense_name = '', _worker_id = '') {
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

// update expense type
function updateExpenseType(_id = '', _name = '') {
    return new Promise((resolve, reject) => {
        // check if _id is invalid
        if (!_id) reject('No has ingresado un valor valido para el tipo de gasto')
        // check if _name is invalid
        if (!_name) reject('No has ingresado un valor valido para el tipo de gasto')
        // cast id to int
        _id = Number.parseInt(_id);
        // valid operation, proced to insert
        db_connection.query(EXPENSE_TYPE_UPDATE_QUERY, [_name, _id], (error) => {
            if (error) {
                reject(`No se ha podidio actualizar el tipo de gasto, ${error}`)
            } else {
                resolve(`Se ha actualizado el tipo de gasto ${_name.toLowerCase()}`)
            }
        });
    });
}

// DELETE EXPENSE TYPE
function deleteExpenseType(_id = '') {
    return new Promise((resolve, reject) => {
        // check if _id is invalid
        if (!_id) reject('No has ingresado un valor valido para el tipo de gasto')
        // cast id to int
        _id = Number.parseInt(_id);
        // valid operation, proced to insert
        db_connection.query(EXPENSE_TYPE_DELETE_QUERY, [_id], (error, result) => {
            if (error) {
                reject(`No puedes borrar valores que ya hayan sido usados en un registro de gastos`)
            } else {
                resolve(`Se ha borrado el tipo de gasto ${_id} | Registros afectados ${result.affectedRows}`)
            }
        });
    });
}


// insert into DB a new expense type
function insertExpense(_ammount = 0, _worker_id = '', _expense_type = '') {
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
        db_connection.query(EXPENSE_INSERT_QUERY, [_ammount, _date, _worker_id, _expense_type], (error) => {
            if (error) {
                reject(`No se ha podidio insertar gasto, ${error}`)
            } else {
                resolve(`Se ha insertado el gasto de Q${_ammount} correctamente`)
            }
        });
    });
}

// list all expenses on DB
function listExpensesByFilter(_init_date = null, _end_date = null) {
    // cast '' to NULL
    // check wich date is higher or lower to send it 
    if ((!_init_date && !_end_date) && !(_init_date instanceof Date) || !(_end_date instanceof Date)) {
        // swap if _end_date < _init_date
        let _tmp_date = _init_date;
        _init_date = _init_date < _end_date ? _init_date : _end_date;
        _end_date = _init_date === _tmp_date ? _end_date : _tmp_date;
    }
    // change possible values of NaN, undefined... to NULL
    _init_date = _init_date === '' || _init_date === undefined ? null : _init_date;
    _end_date = _end_date === '' || _end_date === undefined ? null : _end_date;
    // call procedure to get dinamically data
    return new Promise((resolve, reject) => {
        // call procedure
        db_connection.query(EXPENSE_SELECT_PROCEDURE, [_init_date, _end_date], (error, result) => {
            if (error) {
                reject({ message: `No se puede filtrar por los valores dados ${_init_date} ${_end_date}`, error: error })
            } else {
                resolve(result[0]) // return rows on DB
            }
        });
    });
}

// delete a expense from DB
function deleteExpenseById(_id) {
    return new Promise((resolve, reject) => {
        // check valid id
        if (!_id) reject("Id invalido")
        // try to delete
        db_connection.query(EXPENSE_DELETE_QUERY, [_id], (error, result) => {
            if (error) {
                reject("No hemos podido borrar el gasto en la BD " + id); // Reject the Promise if there is an error
            } else {
                resolve(`Se ha borrado el gasto con el id ${_id} | Cambios realizados: ${result.affectedRows}`);  // Resolve the Promise with the result
            }
        });
    });
}

// search a expense by ID
function searchExpenseById(_id) {
    return new Promise((resolve, reject) => {
        if (!_id) reject("Datos invalidos") // Reject if invalid id
        db_connection.query(EXPENSE_SELECT_ID_QUERY, [_id], (error, result) => {
            if (error) reject("No se ha podido encontrar el gasto")
            else resolve(result[0])
        });
    });
};

// update a expense into DB log
function updateExpense(_id, _ammount, _worker_id, _expense_type, _date) {
    return new Promise((resolve, reject) => {
        if (!_worker_id || !_expense_type || !_id || !_ammount || !_date) reject("Datos invalidos") // Reject if invalid worker_id
        if (_ammount < 0) reject("No puedes ingresar valores menores a 0") // Reject if invalid ammount
        if (!_worker_id.includes("ADM")) reject("No estas autorizado para ejecutar esta operacion") // Reject if invalid user
        // valid operation, proced to insert
        db_connection.query(EXPENSE_UPDATE_QUERY, [_ammount, _expense_type, _date, _id], (error, result) => {
            if (error) reject("No se ha podido actualizar el gasto")
            else resolve(`Se ha actualizado el gasto con el id ${_id} | Cambios realizados: ${result.affectedRows}`)
        });
    });
}

module.exports = {
    getAllExpenseType, insertExpense, insertExpenseType, findExpenseTypeById, updateExpenseType, deleteExpenseType,
    listExpensesByFilter, formatDate, deleteExpenseById, updateExpense, searchExpenseById
}