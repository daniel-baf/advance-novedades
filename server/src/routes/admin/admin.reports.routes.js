const express = require('express');
const path = require('path');
const router = express.Router();

const { renderDashboard } = require('./admin.buildings.routes');
const { ADMIN_FINANCE_VIEW, REPORT_TYPES } = require('../../config/consts');

router.post('/report/generate', async (req, res) => {
    try {
        // get data from body
        let { initDate, endDate, reportType } = req.body;
        res.status(200).json({ message: "hi", initDate: initDate, endDate: endDate, reportType: reportType });
    } catch (error) {
        renderDashboard(ADMIN_FINANCE_VIEW)
    }
});

router.get('/report/search/report-types/', async (req, res) => {
    // return possible reports to GUI
    try {
        res.status(200).json({ reports: REPORT_TYPES })
    } catch (error) {
        renderDashboard(ADMIN_FINANCE_VIEW)
    }
});

module.exports = router;

