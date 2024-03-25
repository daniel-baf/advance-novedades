const path = require('path');
const { CART_SEARCH_TYPES, STOCK_FILTER_BY_PLEDGE_ID_AND_BUILDING_QUERY, STOCK_FILTER_BY_PLEDGE_NAME_AND_BUILDING_QUERY, STOCK_FILTER_BY_PLEDGE_SIZE_AND_BUILDING_QUERY, STOCK_FILTER_BY_BUILDING_QUERY } = require('../../config/consts');
const db_connection = require(path.join(__dirname, "../database/db-connection"));

// generic function to send typeof query, and search id, to return custom promise
function searchStockByParameter(searchType, searchId, building) {
    // check if searchId is null -> return all rows from current building stock
    if (searchId == '' || searchId == undefined || searchType == undefined) {
        return searchStockByBuilding(building);
    }
    // check searchType in switch case
    switch (searchType) {
        case CART_SEARCH_TYPES.ID:
            return searchStockById(Number(searchId), Number(building));
        case CART_SEARCH_TYPES.NAME:
            return searchStockByName(searchId, Number(building));
        case CART_SEARCH_TYPES.SIZE:
            return searchStockBySize(searchId, Number(building));
        default:
            throw new Error("Tipo de búsqueda invalido");
    }
}

// search by ID in stock, and current session building
function searchStockById(id, building) {
    return new Promise((resolve, reject) => {
        db_connection.query(STOCK_FILTER_BY_PLEDGE_ID_AND_BUILDING_QUERY, [building, id], (error, result) => {
            if (error) {
                reject("No hemos podido filtrar stock por id: " + error); // Reject the Promise if there is an error
            } else {
                resolve(result);  // Resolve the Promise with the result
            }
        });
    });
}

// search by name in stock, and current session building
function searchStockByName(name, building) {
    return new Promise((resolve, reject) => {
        db_connection.query(STOCK_FILTER_BY_PLEDGE_NAME_AND_BUILDING_QUERY, [`%${name}%`, building], (error, result) => {
            if (error) {
                reject("No hemos podido filtrar stock por nombre: " + error); // Reject the Promise if there is an error
            } else {
                resolve(result);  // Resolve the Promise with the result
            }
        });
    });
}

// search by size in stock, and current session building
function searchStockBySize(size, building) {
    return new Promise((resolve, reject) => {
        db_connection.query(STOCK_FILTER_BY_PLEDGE_SIZE_AND_BUILDING_QUERY, [building, size], (error, result) => {
            if (error) {
                reject("No hemos podido filtrar stock por talla: " + error); // Reject the Promise if there is an error
            } else {
                resolve(result);  // Resolve the Promise with the result
            }
        });
    });
}

// return all stock from current building
function searchStockByBuilding(building) {
    return new Promise((resolve, reject) => {
        db_connection.query(STOCK_FILTER_BY_BUILDING_QUERY, [building], (error, result) => {
            if (error) {
                reject("No hemos podido filtrar stock por edificio: " + error); // Reject the Promise if there is an error
            } else {
                resolve(result);  // Resolve the Promise with the result
            }
        });
    });
}

module.exports = { searchStockByParameter }