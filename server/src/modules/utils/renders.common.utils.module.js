const { getBuildings } = require("../admin/admin.products.module");

// multiuse function to render login page
async function renderLoginPage(req, res, message = "", error_message = "") {
    // fetch current locations to select
    let _buildings = await getBuildings();
    res.render("login", { message: message, error_message: error_message, buildings: _buildings });
}


function render500Page(res, error_message = "") {
    res.render("500", { error_message: error_message });
}

function renderSellsDashboard(req, res, message, error_message) {
    try {
        res.render("users/sells/sells-view", {
            name: req.session.user.id,
            message: message,
            error_message: error_message,
        });
    } catch (error) {
        render500Page(res, "No hemos podido recuperar tu sesión. " + error);
    }
}

module.exports = { renderLoginPage, render500Page, renderSellsDashboard };