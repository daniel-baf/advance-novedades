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

router.get("/dashboard", async (req, res) => {
    adminBuildingRouter.renderDashboard(req, res, '', '');
})


module.exports = router;