// INVENTORY
const STOCK_SELECT_QUERY = "SELECT Inventory_Size_id as size, stock FROM Stock WHERE Building_id = ? AND Inventory_Pledge_id = ?;"
const PLEDGE_SELECT_QUERY = "SELECT * FROM Pledge;"
// SIZE
const SIZE_SELECT_ALL_QUERY = "SELECT id FROM Size;"

// BUILDING
const BUILDING_INSERT_QUERY = "INSERT INTO Building (name, direction) VALUES (?, ?)";
const BUILDING_UPDATE_QUERY = "UPDATE Building SET name = ?, direction = ? WHERE (id = ?);"
const BUILDING_SEARCH_ID_QUERY = "SELECT * FROM Building WHERE id = ?;"
const BUILDING_DELETE_QUERY = "DELETE FROM Building WHERE (id = ?);"
const BUILDING_SELECT_EXCLUDE_DIR = "SELECT id, name FROM Building;"

module.exports = { 
    // buildings
    BUILDING_INSERT_QUERY, BUILDING_DELETE_QUERY,BUILDING_UPDATE_QUERY, BUILDING_SEARCH_ID_QUERY, BUILDING_SELECT_EXCLUDE_DIR,
    // stock
    STOCK_SELECT_QUERY, PLEDGE_SELECT_QUERY,
    // size
    SIZE_SELECT_ALL_QUERY
}