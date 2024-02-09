const BUILDING_INSERT_QUERY = "INSERT INTO Building (name, direction) VALUES (?, ?)";
const BUILDING_UPDATE_QUERY = "UPDATE Building SET name = ?, direction = ? WHERE (id = ?);"
const BUILDING_SEARCH_ID_QUERY = "SELECT * FROM Building WHERE id = ?;"

module.exports = { 
    BUILDING_INSERT_QUERY,
    BUILDING_UPDATE_QUERY, BUILDING_SEARCH_ID_QUERY
}