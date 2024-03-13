const express = require('express');
const path = require('path');
const router = express.Router();

const { getAllExpenseType, insertExpense, insertExpenseType } = require('../../modules/admin/admin.finance.module');
const { renderDashboard } = require('./admin.buildings.routes');
const { ADMIN_FINANCE_VIEW } = require('../../config/consts');

// generic function to get a JSON with expenses
async function getExpensesType() {
    // search on DB for all expense type
    let _fetched_data = await getAllExpenseType();
    return _fetched_data;
}

// render the expense type view
function renderExpenseTypeView(req, res, message, error) {
    res.render("users/admin/finance/expense-type-list", { message: message, error_message: error, name: req.session.user.id });
}

// displays a view with all expense type and allow it to edit it
router.get("/finance/list-all/expense-type", async (req, res) => {
    let _expenses_type = await getExpensesType();
    renderExpenseTypeView(req, res, '', '', _expenses_type);
});

// display a view with all expenses and allow it to edit it or delete it
router.get("/finance/list-all/expense", async (req, res) => {
    res.status(200).json("LISTAR GASTOS")
});

// inserts a new expense type into DB and renders main view
router.post("/finance/insert/expense-type", (req, res) => {
    // retrieve data from body
    try {
        let { expense_type } = req.body;
        insertExpenseType(expense_type, req.session.user.id)
            .then((message) => { renderDashboard(req, res, message, '', ADMIN_FINANCE_VIEW) })
            .catch((error) => { renderDashboard(req, res, '', error, ADMIN_FINANCE_VIEW) })
    } catch (error) {
        renderDashboard(req, res, '', error, ADMIN_FINANCE_VIEW); // unexpected error
    }
})

// inserts a new expense into Db AND RENDER MAIN VIEW
router.post("/finance/insert/expense", async (req, res) => {
    // retrieve data from body
    try {
        let { expense_ammount, expense_type } = req.body;
        insertExpense(expense_ammount, req.session.user.id, expense_type)
            .then((message) => { renderDashboard(req, res, message, '', ADMIN_FINANCE_VIEW) })
            .catch((error) => { renderDashboard(req, res, '', error, ADMIN_FINANCE_VIEW) })
        return;
    } catch (error) {
        renderDashboard(req, res, '', error, ADMIN_FINANCE_VIEW); // unexpected error
    }
})

module.exports = router;

