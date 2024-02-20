const path = require('path');
const { PLEDGE_SELECT_QUERY, PLEDGE_SELECT_BY_PK_QUERY, PLEDGE_UPDATE_QUERY } = require('../../config/consts');
const db_connection = require(path.join(__dirname, "../database/db-connection"));

// get all pledges from DB
function getPledges() {
    return new Promise((resolve, reject) => {
        db_connection.query(PLEDGE_SELECT_QUERY, (error, result) => {
            if (error) {
                reject("No hemos podido encontrar prendas: " + error); // Reject the Promise if there is an error
            } else {
                resolve(result);  // Resolve the Promise with the result
            }
        });
    });
}

// get pledge by id from DB
async function getPledgeById(pledge_id) {
    try {
        db_data = await new Promise((resolve, reject) => {
            db_connection.query(PLEDGE_SELECT_BY_PK_QUERY, [pledge_id], (error, result) => {
                if (error) {
                    reject("No hemos podido encontrar la prenda: " + error); // Reject the Promise if there is an error
                } else {
                    resolve(result);  // Resolve the Promise with the result
                }
            });
        });
        return [true, { id: db_data[0].id, name: db_data[0].name }]
    } catch (error) {
        return [false, error];
    }
}

// update a pledge on DB
async function updatePledge(pledge_id, pledge_name) {
    try {
        db_data = new Promise((resolve, reject) => {
            db_connection.query(PLEDGE_UPDATE_QUERY, [pledge_name, pledge_id], (error, result) => {
                if (error) {
                    reject("No hemos podido actualizar la prenda: " + error); // Reject the Promise if there is an error
                } else {
                    resolve(result);  // Resolve the Promise with the result
                }
            });
        });
        return [true, "Prenda actualizada para el id: " + pledge_id];
    } catch (error) {
        return [false, error];
    }
}

module.exports = { getPledges, getPledgeById, updatePledge }