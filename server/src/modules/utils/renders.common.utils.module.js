const { DEFAULT_BILL_NIT } = require("../../config/consts");
const { getBuildings } = require("../admin/admin.products.module");

// multiuse function to render login page
async function renderLoginPage(req, res, message = "", error_message = "") {
    // fetch current locations to select
    let _buildings = await getBuildings();
    res.render("login", { message: message, error_message: error_message, buildings: _buildings });
}

// render a 500 page internal server error
function render500Page(res, error_message = "") {
    res.render("500", { error_message: error_message });
}

// render sells dashboard
function renderSellsDashboard(req, res, message, error_message) {
    try {
        res.render("users/sells/sells-view", { name: req.session.user.id, message: message, error_message: error_message });
    } catch (error) {
        render500Page(res, "No hemos podido recuperar tu sesión. " + error);
    }
}

// render sub page for sells, clients actions
function renderSellsClientDashboard(req, res, message, error_message) {
    try {
        res.render('users/sells/clients/sells-client-view.ejs', { name: req.session.user.id, message, error_message })
    } catch (error) {
        render500Page(res, "No hemos podido recuperar tu sesión. " + error);
    }
}

// render a sub page for clients, list client/clients into a table, and allow actions
function renderSellsClientListDashboard(req, res, message, error_message, clients = []) {
    try {
        res.render('users/sells/clients/sells-client-list-view.ejs', { name: req.session.user.id, message, error_message, clients, DEFAULT_BILL_NIT: DEFAULT_BILL_NIT })
    } catch (error) {
        render500Page(res, "No hemos podido recuperar tu sesión. " + error);
    }
}

module.exports = { renderLoginPage, render500Page, renderSellsDashboard, renderSellsClientDashboard, renderSellsClientListDashboard };