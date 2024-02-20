require('dotenv').config()
const express = require('express');
const router = express.Router();
const path = require('path');
// routes
adminBuildingRouter = require(path.join(__dirname, 'admin/', 'admin.buildings.routes'));

// buildings paths
router.use(adminBuildingRouter.router);
// products paths
router.use(require(path.join(__dirname, 'admin/', 'admin.products.routes')));

// render main view of dashboard, with a view parameter display just x parameteres
router.get("/dashboard/:view", async (req, res) => {
    let view = req.params.view
    adminBuildingRouter.renderDashboard(req, res, '', '', view);
})

module.exports = router;