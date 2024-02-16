// INVENTORY
const STOCK_SELECT_QUERY = "SELECT Inventory_Size_id as size, stock FROM Stock WHERE Building_id = ? AND Inventory_Pledge_id = ?;"
const STOCK_SELECT_BY_PK_QUERY = "SELECT p.`name` as `pname`, b.name as `bname`, s.stock FROM Pledge as p INNER JOIN Inventory as i ON i.Pledge_id = p.id INNER JOIN Stock as s ON (s.Inventory_Pledge_id = i.Pledge_id) AND (s.Inventory_Size_id = i.Size_id) INNER JOIN Building as b ON s.Building_id = b.id WHERE p.id = ? AND i.Size_id = ? AND b.id = ?; "
const STOCK_UPDATE_QUERY = "UPDATE `Stock` SET `stock` = ? WHERE (`Building_id` = ?) and (`Inventory_Pledge_id` = ?) and (`Inventory_Size_id` = ?);"
const PLEDGE_SELECT_QUERY = "SELECT * FROM Pledge;"
// SIZE
const SIZE_SELECT_ALL_QUERY = "SELECT id FROM Size;"
// STOCK

// BUILDING
const BUILDING_INSERT_QUERY = "INSERT INTO Building (name, direction) VALUES (?, ?)";
const BUILDING_UPDATE_QUERY = "UPDATE Building SET name = ?, direction = ? WHERE (id = ?);"
const BUILDING_SEARCH_ID_QUERY = "SELECT * FROM Building WHERE id = ?;"
const BUILDING_DELETE_QUERY = "DELETE FROM Building WHERE (id = ?);"
const BUILDING_SELECT_EXCLUDE_DIR = "SELECT id, name FROM Building;"

module.exports = {
    // buildings
    BUILDING_INSERT_QUERY, BUILDING_DELETE_QUERY, BUILDING_UPDATE_QUERY, BUILDING_SEARCH_ID_QUERY, BUILDING_SELECT_EXCLUDE_DIR,
    // stock
    STOCK_SELECT_QUERY, STOCK_SELECT_BY_PK_QUERY,STOCK_UPDATE_QUERY,
    // INVENTORY
    PLEDGE_SELECT_QUERY,
    // size
    SIZE_SELECT_ALL_QUERY
}