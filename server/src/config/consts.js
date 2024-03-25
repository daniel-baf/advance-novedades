// INVENTORY
const STOCK_SELECT_QUERY = "SELECT Inventory_Size_id as size, stock FROM Stock WHERE Building_id = ? AND Inventory_Pledge_id = ?;"
const STOCK_SELECT_BY_PK_QUERY = "SELECT p.`name` as `pname`, b.name as `bname`, s.stock FROM Pledge as p INNER JOIN Inventory as i ON i.Pledge_id = p.id INNER JOIN Stock as s ON (s.Inventory_Pledge_id = i.Pledge_id) AND (s.Inventory_Size_id = i.Size_id) INNER JOIN Building as b ON s.Building_id = b.id WHERE p.id = ? AND i.Size_id = ? AND b.id = ?; "
const STOCK_UPDATE_QUERY = "UPDATE `Stock` SET `stock` = ? WHERE (`Building_id` = ?) and (`Inventory_Pledge_id` = ?) and (`Inventory_Size_id` = ?);"
// PLEDGE
const PLEDGE_SELECT_QUERY = "SELECT * FROM Pledge;"
const PLEDGE_SELECT_BY_PK_QUERY = "SELECT * FROM Pledge WHERE id = ?;"
const PLEDGE_UPDATE_QUERY = "UPDATE Pledge SET name = ? WHERE id = ?;"
const PLEDGE_DELETE_QUERY = "DELETE FROM Pledge WHERE id = ?;"
const PLEDGE_INSERT_QUERY = "INSERT INTO Pledge (name) VALUES (?);"
// SIZE
const SIZE_SELECT_ALL_QUERY = "SELECT id FROM Size;"
// USERS
const USER_WORKER_AREA_SELECT_QUERY = "SELECT * FROM Worker_Area;"
const USER_SELECT_BY_PASS_ID_QUERY = "SELECT * FROM Worker WHERE id = ? AND password = ?;"
const USER_SELECT_BY_ID_NO_PASS_QUERY = "SELECT id, name, allowed, Worker_Area_id FROM Worker WHERE id = ?;"
const USER_SELECT_ALL_NO_PASS_QUERY = "SELECT id, name, allowed, Worker_Area_id FROM Worker ORDER BY (Worker_Area_id) DESC, `name` ASC;"
const USER_REMOVE_ACCESS_QUERY = "UPDATE Worker SET allowed = 0 WHERE id = ?;"
const USER_GRANT_ACCESS_QUERY = "UPDATE Worker SET allowed = 1 WHERE id = ?;"
const USER_DELETE_QUERY = "DELETE FROM Worker WHERE id = ?;"
const USER_UPDATE_NO_PASS_QUERY = "UPDATE Worker SET `name` = ?, `allowed` = ?, `Worker_Area_id` = ? WHERE (`id` = ?);"
const USER_UPDATE_QUERY = "UPDATE Worker SET `password` = ?, `name` = ?, `allowed` = ?, `Worker_Area_id` = ? WHERE (`id` = ?);"
const USER_INSERT_QUERY = "CALL insertWorkerAndGetId(?, ?, ?, ?, @generated_id);";
// STOCK
const INVENTORY_SELECT_QUERY = "SELECT i.*, p.name FROM novedades.Inventory AS i INNER JOIN Pledge as p ON p.id = i.Pledge_id;"
const INVENTORY_SELECT_BY_PK_QUERY = "SELECT p.name, i.* FROM Inventory AS i INNER JOIN Pledge AS p ON p.id = i.Pledge_id WHERE (Pledge_id = ?) and (Size_id = ?);"
const INVENTORY_DELETE_QUERY = "DELETE FROM Inventory WHERE (Pledge_id = ?) and (Size_id = ?);"
const INVENTORY_UPDATE_QUERY = "UPDATE Inventory SET price = ? WHERE (Pledge_id = ?) and (Size_id = ?);"
const INVENTORY_INSERT_QUERY = "INSERT INTO Inventory (Pledge_id, Size_id, price) VALUES ?;"
// BUILDING
const BUILDING_INSERT_QUERY = "INSERT INTO Building (name, direction) VALUES (?, ?)";
const BUILDING_UPDATE_QUERY = "UPDATE Building SET name = ?, direction = ? WHERE (id = ?);"
const BUILDING_SEARCH_ID_QUERY = "SELECT * FROM Building WHERE id = ?;"
const BUILDING_DELETE_QUERY = "DELETE FROM Building WHERE (id = ?);"
const BUILDING_SELECT_EXCLUDE_DIR = "SELECT id, name FROM Building;"
// EXPENSE
const GET_ALL_EXPENSE_TYPE_QUERY = "SELECT id, name FROM Expense_Type ORDER BY id ASC;"
const EXPENSE_TYPE_INSERT_QUERY = "INSERT INTO Expense_Type (`name`) VALUES (?)" // insert a single expense type
const EXPENSE_TYPE_READ_ID_QUERY = "SELECT id, name FROM Expense_Type WHERE id = ?;" // read a single expense type
const EXPENSE_TYPE_UPDATE_QUERY = "UPDATE `Expense_Type` SET `name` = ? WHERE (`id` = ?);"
const EXPENSE_TYPE_DELETE_QUERY = "DELETE FROM `Expense_Type` WHERE (`id` = ?);"
const EXPENSE_INSERT_QUERY = "INSERT INTO `Expense` (`ammount`, `date`, `Worker_id`, `Expense_Type_id`) VALUES (?, ?, ?, ?);"
const EXPENSE_SELECT_PROCEDURE = "CALL filter_expenses_dinamically(?,?);"
const EXPENSE_DELETE_QUERY = "DELETE FROM `Expense` WHERE (`id` = ?);"
const EXPENSE_UPDATE_QUERY = "UPDATE `Expense` SET `ammount` = ?, `Expense_Type_id` = ?, date = ? WHERE (`id` = ?);"
const EXPENSE_SELECT_ID_QUERY = "SELECT e.id, e.ammount, e.date, et.id AS `expense_type_id`, et.name AS `expense_type_name`, w.id AS `worker_id`, w.name AS `worker_name` FROM Expense AS e INNER JOIN Expense_Type AS et	ON e.Expense_Type_id = et.id INNER JOIN Worker AS w ON e.Worker_id = w.id WHERE e.id = ?;"
// ADMIN DASHBOARD VIEWS
const ADMIN_USER_VIEW = "users"
const ADMIN_PRODUCTS_VIEW = "products"
const ADMIN_FINANCE_VIEW = "finance"
// REPORTS
const MOST_SOLD_PRODUCTS_REPORT_QUERY = "SELECT Inventory_Pledge_id AS `pledge_id`, (SELECT `name` FROM Pledge WHERE id = `pledge_id`) AS `pledge_name`, Inventory_Size_id AS `size_id`, COUNT(*) AS `total` FROM Bill_Detail GROUP BY Inventory_Pledge_id, Inventory_Size_id ORDER BY total DESC, `pledge_id` ASC LIMIT 20;"
const MOST_SOLD_PRODUCTS_FILTER_DATES_REPORT_QUERY = "SELECT bd.Inventory_Pledge_id AS `pledge_id`, (SELECT `name` FROM Pledge WHERE id = `pledge_id`) AS `pledge_name`, bd.Inventory_Size_id AS `size_id`, COUNT(*) AS `total` FROM Bill_Detail AS bd LEFT JOIN Bill as b ON b.id = bd.Bill_id WHERE b.`date` BETWEEN ? AND ? GROUP BY Inventory_Pledge_id, Inventory_Size_id ORDER BY total DESC, `pledge_id` ASC LIMIT 20;";
const LESS_SOLD_PRODUCTS_REPORT_QUERY = "SELECT Inventory_Pledge_id AS `pledge_id`, (SELECT `name` FROM Pledge WHERE id = `pledge_id`) AS `pledge_name`, Inventory_Size_id AS `size_id`, COUNT(*) AS `total` FROM Bill_Detail GROUP BY Inventory_Pledge_id, Inventory_Size_id ORDER BY total ASC, `pledge_id` ASC LIMIT 20;"
const LESS_SOLD_PRODUCTS_FILTER_DATES_REPORT_QUERY = "SELECT bd.Inventory_Pledge_id AS `pledge_id`, (SELECT `name` FROM Pledge WHERE id = `pledge_id`) AS `pledge_name`, bd.Inventory_Size_id AS `size_id`, COUNT(*) AS `total` FROM Bill_Detail AS bd LEFT JOIN Bill as b ON b.id = bd.Bill_id WHERE b.`date` BETWEEN ? AND ? GROUP BY Inventory_Pledge_id, Inventory_Size_id ORDER BY total ASC, `pledge_id` ASC LIMIT 20;";
const EARNINGS_REPORT_QUERY = "SELECT id, NIT, total, date, Worker_id FROM novedades.Bill ORDER BY `date` DESC;"
const EARNINGS_FILTER_DATES_REPORT_QUERY = "SELECT id, NIT, total, date, Worker_id FROM novedades.Bill WHERE date BETWEEN ? AND ? ORDER BY `date` DESC ;"
const EXPENSE_REPORT_QUERY = "SELECT * FROM novedades.Expense ORDER BY date DESC;"
const EXPENSE_FILTER_DATES_REPORT_QUERY = "SELECT * FROM novedades.Expense WHERE date BETWEEN ? AND ? ORDER BY date DESC;"
const BUILDING_SELECT_REPORT_QUERY = "SELECT * FROM Building;"
// SELLS
const STOCK_FILTER_BY_PLEDGE_ID_AND_BUILDING_QUERY = "SELECT s.Inventory_Pledge_id AS `pledge_id`, s.Inventory_Size_id AS `size`, s.stock, (SELECT name FROM Pledge AS p WHERE p.id = s.Inventory_Pledge_id) AS `pledge_name`, (SELECT i.price FROM Inventory AS i WHERE i.Pledge_id = s.Inventory_Pledge_id AND i.Size_id = s.Inventory_Size_id) AS `price` FROM Stock AS s WHERE Building_id = ? AND Inventory_Pledge_id = ?;"
const STOCK_FILTER_BY_PLEDGE_NAME_AND_BUILDING_QUERY = "SELECT s.Inventory_Pledge_id AS `pledge_id`, s.Inventory_Size_id AS `size`, s.stock, p.`name` AS `pledge_name`, (SELECT i.price FROM Inventory AS i WHERE i.Pledge_id = s.Inventory_Pledge_id AND i.Size_id = s.Inventory_Size_id) AS `price` FROM Stock as s	INNER JOIN Pledge as p ON p.id = s.Inventory_Pledge_id WHERE p.name LIKE ? AND s.Building_id = ?;" // LIKE -> USE % ?
const STOCK_FILTER_BY_PLEDGE_SIZE_AND_BUILDING_QUERY = "SELECT s.Inventory_Pledge_id AS `pledge_id`, s.Inventory_Size_id AS `size`, s.stock, (SELECT name FROM Pledge AS p WHERE p.id = s.Inventory_Pledge_id) AS `pledge_name`, (SELECT i.price FROM Inventory AS i WHERE i.Pledge_id = s.Inventory_Pledge_id AND i.Size_id = s.Inventory_Size_id) AS `price` FROM Stock AS s WHERE Building_id = ? AND Inventory_Size_id = ?;"
const STOCK_FILTER_BY_BUILDING_QUERY = "SELECT s.Inventory_Pledge_id AS `pledge_id`, s.Inventory_Size_id AS `size`, s.stock, (SELECT name FROM Pledge AS p WHERE p.id = s.Inventory_Pledge_id) AS `pledge_name`, (SELECT i.price FROM Inventory AS i WHERE i.Pledge_id = s.Inventory_Pledge_id AND i.Size_id = s.Inventory_Size_id) AS `price` FROM Stock AS s WHERE Building_id = ?"
const CLIENTS_SEARCH_QUERY = "SELECT * FROM Client WHERE NIT = ?;"

// REPORTS TYPES
const REPORT_TYPES = {
    // finance
    EXPENSES: "GASTOS",
    EARNINGS: "GANANCIAS",
    MOST_SOLD_PRODUCTS: "PRODUCTOS MAS VENDIDOS",
    LESS_SOLD_PRODUCTS: "PRODUCTOS MENOS VENDIDOS",
    // NET_PROFIT: "UTILIDADES (GANANCIAS - GASTOS)",
    // administration
    BUILDINGS: "EDIFICIOS",
    PLEDGES: "PRODUCTOS",
    USERS: "USUARIOS",  // reuse code
    // clothes
    SIZES: "TALLAS",
    // GENERAL_STATUS: "RESUMEN GENERAL",
};

// ROLES
const ROLES = {
    ADMIN: { TAG: "ADM", NAME: "ADMIN" },
    PRODUCTION: { TAG: "PRD", NAME: "PRODUCTION" },
    SELLS: { TAG: "SLLS", NAME: "SELLS" },
    UNKNOWN: { TAG: "UNK", NAME: "UNKNOWN" }
}

// CART
// SEARCH TYPES
const CART_SEARCH_TYPES = {
    ID: "CÓDIGO",
    NAME: "NOMBRE",
    SIZE: "TALLA",
}


module.exports = {
    // buildings
    BUILDING_INSERT_QUERY, BUILDING_DELETE_QUERY, BUILDING_UPDATE_QUERY, BUILDING_SEARCH_ID_QUERY, BUILDING_SELECT_EXCLUDE_DIR,
    // stock
    STOCK_SELECT_QUERY, STOCK_SELECT_BY_PK_QUERY, STOCK_UPDATE_QUERY,
    // INVENTORY
    PLEDGE_SELECT_QUERY, PLEDGE_SELECT_BY_PK_QUERY, PLEDGE_UPDATE_QUERY, PLEDGE_DELETE_QUERY, PLEDGE_INSERT_QUERY,
    INVENTORY_SELECT_QUERY, INVENTORY_DELETE_QUERY, INVENTORY_UPDATE_QUERY, INVENTORY_SELECT_BY_PK_QUERY, INVENTORY_INSERT_QUERY,
    // size
    SIZE_SELECT_ALL_QUERY,
    // users
    USER_WORKER_AREA_SELECT_QUERY, USER_SELECT_BY_PASS_ID_QUERY, USER_SELECT_BY_ID_NO_PASS_QUERY, USER_SELECT_ALL_NO_PASS_QUERY,
    USER_REMOVE_ACCESS_QUERY, USER_GRANT_ACCESS_QUERY, USER_DELETE_QUERY, USER_UPDATE_QUERY, USER_INSERT_QUERY, USER_UPDATE_NO_PASS_QUERY,
    // EXPENSES
    GET_ALL_EXPENSE_TYPE_QUERY, EXPENSE_TYPE_INSERT_QUERY, EXPENSE_INSERT_QUERY, EXPENSE_TYPE_READ_ID_QUERY, EXPENSE_TYPE_UPDATE_QUERY,
    EXPENSE_TYPE_DELETE_QUERY, EXPENSE_SELECT_PROCEDURE, EXPENSE_DELETE_QUERY, EXPENSE_UPDATE_QUERY, EXPENSE_SELECT_ID_QUERY,
    // ADMIN VIEWS
    ADMIN_USER_VIEW, ADMIN_PRODUCTS_VIEW, ADMIN_FINANCE_VIEW,
    // REPORT TYPES
    REPORT_TYPES, MOST_SOLD_PRODUCTS_REPORT_QUERY, LESS_SOLD_PRODUCTS_REPORT_QUERY, EARNINGS_REPORT_QUERY, EXPENSE_REPORT_QUERY, BUILDING_SELECT_REPORT_QUERY,
    MOST_SOLD_PRODUCTS_FILTER_DATES_REPORT_QUERY, LESS_SOLD_PRODUCTS_FILTER_DATES_REPORT_QUERY, EARNINGS_FILTER_DATES_REPORT_QUERY, EXPENSE_FILTER_DATES_REPORT_QUERY,
    // ROLES + SHOPPING CART
    ROLES, CART_SEARCH_TYPES,
    // STOCK
    STOCK_FILTER_BY_PLEDGE_ID_AND_BUILDING_QUERY, STOCK_FILTER_BY_PLEDGE_NAME_AND_BUILDING_QUERY, STOCK_FILTER_BY_PLEDGE_SIZE_AND_BUILDING_QUERY,
    STOCK_FILTER_BY_BUILDING_QUERY,
    // CLIENTS
    CLIENTS_SEARCH_QUERY
}