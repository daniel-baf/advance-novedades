const path = require('path')
const db_connection = require(path.join(__dirname, "../database/db-connection"));
const { INVENTORY_SELECT_QUERY } = require('../../config/consts');


async function getAllInventory() {
    return new Promise((resolve, reject) => {
        db_connection.query(INVENTORY_SELECT_QUERY, (err, result) => {
            if (err) {
                reject(err)
            }
            resolve(result)
        });
    });
}


module.exports = { getAllInventory }