const path = require('path')
const db_connection = require(path.join(__dirname, "../database/db-connection"));
const { getBuildings } = require(path.join(__dirname, "./admin.products.module"));
const { BUILDING_INSERT_QUERY, BUILDING_UPDATE_QUERY, BUILDING_SEARCH_ID_QUERY } = require('../../config/consts');



// return all products from DB
async function listBuildings() {
    return await getBuildings()
}

// insert a new building to DB
async function insertBuilding(building_name, building_direction) {
    try {
        // Check valid inputs
        if (building_name === '' || building_direction === '') {
            return [false, 'Invalid inputs'];
        }

        // Perform the insert query
        const result = await new Promise((resolve, reject) => {
            db_connection.query(BUILDING_INSERT_QUERY, [building_name, building_direction], (error, result) => {
                if (error) {
                    reject("No se ha podido insertar el edificio: " + error);
                } else {
                    resolve(result);
                }
            });
        });
        // If the query was successful, return true
        return [true, "Edificio insertado correctamente"];
    } catch (error) {
        return [false, "No se ha podido insertar el edificio: " + error];
    }
}

// seraches building by id
async function searchBuilding(building_id) {
    // use promisses to send the result
    try {
        const result = await new Promise((resolve, reject) => {
            db_connection.query(BUILDING_SEARCH_ID_QUERY, [building_id], (error, result) => {
                if (error) {
                    reject("No se ha podido encontrar el edificio con id " + building_id + " ERROR " + error);
                } else {
                    resolve(result);
                }
            });
        });
        return [true, { id: result[0].id, name: result[0].name, direction: result[0].direction }];
    } catch (error) {
        return [false, "No se ha podido encontrar el edificio con id " + building_id + " ERROR " + error];
    }
}


async function updateBuilding(building_id, building_name, building_direction) {
    try {
        const result = await new Promise((resolve, reject) => {
            db_connection.query(BUILDING_UPDATE_QUERY, [building_name, building_direction, building_id], (_error, _result) => {
                if (_error) {
                    reject("No se ha podido editar el edificio: " + _error)
                } else {
                    resolve(result)
                }
            });
        });
        return [true, { message: "Edificio con id " + building_id + " editado correctamente " }]
    } catch (error) {
        return [false, "No se ha podido editar el edificio: " + error]
    }
}

module.exports = { listBuildings, insertBuilding, updateBuilding, searchBuilding }