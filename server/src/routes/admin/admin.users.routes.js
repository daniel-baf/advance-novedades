const express = require('express');
const path = require('path');
const router = express.Router();

const { USERS_VIEW } = require('../../config/consts');
const { signup, searchUserById, toggleAuthorizationToUser, searchAllUsers } = require(path.join(__dirname, '../../modules/admin/admin.users.module'));
adminBuildingRouter = require(path.join(__dirname, 'admin.buildings.routes'));

// render view of usersListPage
function renderUserListPage(_users_db, res, req, message = '', error_message = '', current_view = '') {
    // TODO render a new view with users list, may be 1 or none
    res.render('users/admin/users/user-list', { users: _users_db, name: req.session.user.name, message: message, error_message: error_message, current_view: current_view })
}

// generic function to search a user by id
async function searchUsersArrayMiddleFunction(search_all = true, id = '') {
    try {
        // search by user
        // extract JSON data from request body
        if (search_all) {
            return searchAllUsers();
        }
        // empty user, search all users
        let _db_user = await searchUserById(id);
        return [_db_user];
    } catch (error) {
        return [];
    }
}

// req, res to get data, id to execute operation, and true or false to auth or unauth
async function executeToggleGrants(req, res, authorize = false) {
    try {
        let { id } = req.params; // id to remove
        let { current_view } = req.query; // recover current view to render page again
        // call unauthorize function
        let _response = await toggleAuthorizationToUser(id, req.session, authorize);
        // check if success
        let db_user = await searchUsersArrayMiddleFunction(search_all = current_view === '', id = current_view);
        if (!_response[0]) {
            // render page with error message
            renderUserListPage(db_user, res, req, '', _response[1], current_view = current_view);
            return;
        } else {
            // render page with success message
            renderUserListPage(db_user, res, req, _response[1], '', current_view = current_view);
            return;
        }
    } catch (error) {
        // render dashboard and display error message if any
        adminBuildingRouter.renderDashboard(req, res, '', "No se pudo procesar la busqueda de usuarios, " + error.message, USERS_VIEW);
    }
}

// register a new user | admin must be auth
// generates ID automatically
router.post("/user/create", async (req, res) => {
    // extract JSON data from request body
    let { password, name, Worker_area_id, authorized } = req.body;
    // call signup function
    let [success, data] = await signup(password, name, Worker_area_id, authorized);
    // check if success
    if (!success) {
        // render page with error
        adminBuildingRouter.renderDashboard(req, res, '', data, USERS_VIEW);
    }
    // render page with success message
    adminBuildingRouter.renderDashboard(req, res, data, '', USERS_VIEW);
});

router.get("/user/search", async (req, res) => {
    try {
        // search by user
        let { user } = req.query;
        let db_user = await searchUsersArrayMiddleFunction(search_all = user === '', id = user);
        // check if db_user is empty array
        if (db_user.length == 0) {
            adminBuildingRouter.renderDashboard(req, res, "No existe un usuario con el ID proporcinado", '', USERS_VIEW);
            return;
        }
        // TODO valid user data, render a new view
        renderUserListPage(db_user, res, req, '', '', current_view = user);
    } catch (error) {
        adminBuildingRouter.renderDashboard(req, res, '', "No se pudo procesar la busqueda de usuarios, " + error, USERS_VIEW);
    }
});

router.get("/user/search/all", async (req, res) => {
    try {
        let users_db = await searchUsersArrayMiddleFunction(search_all = true);
        // check if users_db is empty array
        if (users_db.length == 0) {
            adminBuildingRouter.renderDashboard(req, res, "No se encontraron usuarios", '', USERS_VIEW);
            return;
        }
        // valid search, render all fetched users
        renderUserListPage(users_db, res, req, current_view = '');
    } catch (error) {
        adminBuildingRouter.renderDashboard(req, res, '', "No se pudieron buscar todos los usuarios, " + error, USERS_VIEW);
    }
});

router.get("/user/delete/:id", async (req, res) => {
    // extract JSON data from request body
    let { id } = req.params; // id to remove
    let { current_view } = req.query; // recover current view to render page again
    // call delete function
});

router.get("/user/update/:id", async (req, res) => {
});

// authorize user
router.get("/user/auth/:id", async (req, res) => {
    // extract JSON data from request body
    executeToggleGrants(req, res, true);
});

// unauthorize user
router.get("/user/unauth/:id", async (req, res) => {
    // extract JSON data from request body
    executeToggleGrants(req, res, false);
});

module.exports = router;

