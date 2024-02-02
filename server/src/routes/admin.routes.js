require('dotenv').config()
const express = require('express');
const router = express.Router();
const path = require('path')
const db_connection = require(path.join(__dirname, "../modules/database/db-connection"));


router.get("/dashboard", (req, res) => {
    res.render('users/admin/admin-view', { name: req.session.user.id })
})

// load 100 extra products
router.get("/load-products", async (req, res) => {
    // get data from DB and generate custom JSON
    try {
        _data = { stockable_pile: [], summary: { buildings: 0, pledges: 0, building_list: [], pledges_list: [] } }
        // get buildings
        _data.summary.building_list = await getBuildings();
        _data.summary.buildings = _data.summary.building_list.length;
        // get products
        _data.summary.pledges_list = await getPledges();
        _data.summary.pledges = _data.summary.pledges_list.length;
        // stockable info
        _data.stockable_pile = await generateProductsJSON(_data.summary.building_list, _data.summary.pledges_list);
        res.render("users/admin/products/list-products", { data: _data });
        // return res.status(201).json({ data: _data });
    } catch (error) {
        res.status(500).json({ message: 'Ooops, a error just ocurred ' + error })
    }
});

// get buildings from DB
function getBuildings() {
    return new Promise((resolve, reject) => {
        try {
            const query = "SELECT id, name FROM Building;";
            db_connection.query(query, (error, result) => {
                if (error) {
                    reject("No hemos podido encontrar edificios: " + error); // Reject the Promise if there is an error
                } else {
                    resolve(result);  // Resolve the Promise with the result
                }
            });
        } catch (error) {
            reject('Unable to get buildings: ' + error); // If there is an error in the try block, reject the Promise
        }
    });
}

// get all pledges from DB
function getPledges() {
    return new Promise((resolve, reject) => {
        try {
            const query = "SELECT * FROM Pledge;";
            db_connection.query(query, (error, result) => {
                if (error) {
                    reject("No hemos podido encontrar prendas: " + error); // Reject the Promise if there is an error
                } else {
                    resolve(result);  // Resolve the Promise with the result
                }
            });
        } catch (error) {
            reject('Unable to get pledges: ' + error); // If there is an error in the try block, reject the Promise
        }
    });
}

function generateProductsJSON(_buildings, _pledges) {
    return new Promise(async (resolve, reject) => {
        try {
            const _output_result = [];

            for (const _pledge of _pledges) {
                const _pledge_node = { id: _pledge.id, name: _pledge.name, locations: [] };

                for (const _building of _buildings) {
                    const _location = { id: _building.id, name: _building.name, availability: [] };

                    try {
                        const stockAvailability = await getStockByBuildingAndPledge(_pledge.id, _building.id);
                        _location.availability = stockAvailability;
                    } catch (error) {
                        reject('Unable to get stock availability: ' + error);
                        return;
                    }

                    _pledge_node.locations.push(_location);
                }

                _output_result.push(_pledge_node);
            }

            resolve(_output_result);
        } catch (error) {
            reject('Unable to get availability: ' + error);
        }
    });

    function getStockByBuildingAndPledge(_pledge_id, _building_id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT Inventory_Size_id as size, stock FROM Stock WHERE Building_id = ? AND Inventory_Pledge_id = ?;";
            db_connection.query(query, [_building_id, _pledge_id], (error, result) => {
                if (error) {
                    reject("No hemos podido encontrar existencias: " + error);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = router;