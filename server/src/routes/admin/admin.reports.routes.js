const express = require('express');
const path = require('path');
const router = express.Router();

const { renderDashboard } = require('./admin.buildings.routes');
const { ADMIN_FINANCE_VIEW, REPORT_TYPES } = require('../../config/consts');
const { generateReportJSON } = require('../../modules/admin/admin.reports.module');

router.post('/report/generate', async (req, res) => {
    try {
        // get data from body
        let { initDate, endDate, reportType } = req.body;
        let _table_data = await generateReportJSON(initDate, endDate, reportType);
        // render view dynamic-table-report.ejs
        res.render('users/admin/reports/dynamic-table-report', { name: req.session.user.id, table_data: _table_data, reportType: reportType });
        // res.status(200).json({ table_data: _table_data, reportType: reportType });
    } catch (error) {
        renderDashboard(req, res, '', error);
    }
});

router.get('/report/search/report-types/', async (req, res) => {
    // return possible reports to GUI
    try {
        res.status(200).json({ reports: REPORT_TYPES })
    } catch (error) {
        renderDashboard(req, res, '', error);
    }
});

module.exports = router;

