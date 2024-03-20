const { getBuildings } = require("../admin/admin.products.module");

// multiuse function to render login page
async function renderLoginPage(req, res, message = "", error_message = "") {
    // fetch current locations to select
    let _buildings = await getBuildings();
    res.render("login", { message: message, error_message: error_message, buildings: _buildings });
}

module.exports = { renderLoginPage };