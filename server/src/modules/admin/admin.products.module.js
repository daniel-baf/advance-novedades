const path = require('path');
const { STOCK_SELECT_QUERY, PLEDGE_SELECT_QUERY, BUILDING_SELECT_EXCLUDE_DIR, SIZE_SELECT_ALL_QUERY } = require('../../config/consts');
const db_connection = require(path.join(__dirname, "../database/db-connection"));


// custom JSON generator and returner to display into mage
async function loadProducts() {
    _data = { stockable_pile: [], summary: { buildings: 0, pledges: 0, building_list: [], pledges_list: [] } }
    // get buildings
    _data.summary.building_list = await getBuildings();
    _data.summary.buildings = _data.summary.building_list.length;
    // get products
    _data.summary.pledges_list = await getPledges();
    _data.summary.pledges = _data.summary.pledges_list.length;
    // stockable info
    _data.stockable_pile = await generateProductsJSON(_data.summary.building_list, _data.summary.pledges_list);
    return _data;
}

// get buildings from DB
function getBuildings() {
    return new Promise((resolve, reject) => {
        db_connection.query(BUILDING_SELECT_EXCLUDE_DIR, (error, result) => {
            if (error) {
                reject("No hemos podido encontrar edificios: " + error); // Reject the Promise if there is an error
            } else {
                resolve(result);  // Resolve the Promise with the result
            }
        });

    });
}

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

// Generate JSON with products and all custom data
async function generateProductsJSON(_buildings, _pledges) {
    try {
        // Define a function to get stock availability
        async function getStockByBuildingAndPledge(_pledge_id, _building_id) {
            return new Promise((resolve, reject) => {
                db_connection.query(STOCK_SELECT_QUERY, [_building_id, _pledge_id], (error, result) => {
                    if (error) {
                        reject("Unable to get stock availability: " + error);
                    } else {
                        resolve(result);
                    }
                });
            });
        }

        // Map pledges to an array of promises for fetching stock availability
        const pledgePromises = _pledges.map(async _pledge => {
            const _pledge_node = { id: _pledge.id, name: _pledge.name, locations: [] };

            // Map buildings to an array of promises for fetching stock availability
            const locationPromises = _buildings.map(async _building => {
                try {
                    const stockAvailability = await getStockByBuildingAndPledge(_pledge.id, _building.id);
                    return { id: _building.id, name: _building.name, availability: stockAvailability };
                } catch (error) {
                    throw new Error(error);
                }
            });

            _pledge_node.locations = await Promise.all(locationPromises);

            return _pledge_node;
        });

        // Wait for all pledges' promises to resolve
        const pledgeNodes = await Promise.all(pledgePromises);

        return pledgeNodes;
    } catch (error) {
        throw new Error('Unable to generate products JSON: ' + error);
    }
}

// get sizes list FROM DB
async function getSizes() {
    return new Promise((resolve, reject) => {
        db_connection.query(SIZE_SELECT_ALL_QUERY, (error, result) => {
            if (error) {
                reject("No hemos podido encontrar tallas: " + error); // Reject the Promise if there is an error
            } else {
                resolve(result);  // Resolve the Promise with the result
            }
        });
    });
}

module.exports = { loadProducts, getBuildings, getSizes }