const path = require('path');
const db_connection = require(path.join(__dirname, "../database/db-connection"));

function getMostSoldProducts() {
    return new Promise((resolve, reject) => {
        db_connection.query(MOST_SOLD_PRODUCTS_QUERY, (error, result) => {
            if (error) {
                reject("Unable to get most sold products: " + error);
            } else {
                resolve(result);
            }
        });
    });

}

module.exports = { loadProducts, getBuildings, getSizes, findStockByPK, updateStock }