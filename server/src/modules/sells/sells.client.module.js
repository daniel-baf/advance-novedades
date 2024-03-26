const path = require('path');
const { CLIENTS_LIST_ALL_QUERY, CLIENTS_DELETE_QUERY, CLIENTS_UPDATE_QUERY, CLIENTS_INSERT_QUERY } = require('../../config/consts');
const { CLIENTS_SEARCH_BY_NIT_QUERY } = require(path.join(__dirname, "../../config/consts"));
const db_connection = require(path.join(__dirname, "../database/db-connection"));

// function to insert a new user into DB
function searchClientByNit(nit = 'CF') {
    nit = nit.trim().toUpperCase();
    return new Promise((resolve, reject) => {
        db_connection.query(CLIENTS_SEARCH_BY_NIT_QUERY, [nit], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result[0]);
        });
    });
}

// function to list all users in DB
function listClients() {
    return new Promise((resolve, reject) => {
        db_connection.query(CLIENTS_LIST_ALL_QUERY, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
}

// function to delete a existing client in DB
function deleteClient(nit) {
    return new Promise((resolve, reject) => {
        db_connection.query(CLIENTS_DELETE_QUERY, [nit], (err, result) => {
            if (err) {
                reject("No podemos borrar al usuario, recuerda que no podemos borrar un usuario que ya ha realizado una compra.")
            }
            resolve(result);
        });
    });
}

// function to update a existing client in DB
function updateClient(nit, name, address, phone_number) {
    return new Promise((resolve, reject) => {
        // check valid insert types
        nit = nit.trim().toUpperCase();
        name = name.trim().toUpperCase();
        address = address.trim().toUpperCase();

        if (!nit || !name || !address || !phone_number) {
            reject('El NIT, nombre, dirección y número de teléfono son obligatorios');
        }
        // check length of number and contains no blank spaces or special characters
        if (phone_number.length < 8 || /\s|\.|\-/.test(phone_number)) {
            reject('El número de teléfono debe contener 8 dígitos');
        }

        db_connection.query(CLIENTS_UPDATE_QUERY, [name, address, phone_number, nit], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve("Se ha actualizado el usuario con NIT " + nit + " exitosamente");
        });
    });
}

// function to insert a new client into DB
function insertClient(nit, name, address = 'ciudad', phone_number) {
    return new Promise((resolve, reject) => {
        address = address.trim().toUpperCase();
        nit = nit.trim().toUpperCase();
        name = name.trim().toUpperCase();

        if (address.length === 0) {
            reject('La dirección no puede estar vacía');
        }
        db_connection.query(CLIENTS_INSERT_QUERY, [nit, name, address, phone_number], (err, result) => {
            if (err) {
                reject("No podemos insertar al cliente, el NIT ya esta registrado en la base de datos.");
            }
            resolve(result);
        });
    });
}


module.exports = { searchClientByNit, listClients, deleteClient, updateClient, insertClient }