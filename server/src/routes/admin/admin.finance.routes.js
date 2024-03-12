const express = require('express');
const path = require('path');
const router = express.Router();

const { getAllExpenseType } = require('../../modules/admin/admin.finance.module');
const { renderDashboard } = require('./admin.buildings.routes');

// generic function to get a JSON with expenses
async function getExpensesType() {
    // search on DB for all expense type
    let _fetched_data = await getAllExpenseType();
    return _fetched_data;
}

// displays a view with all expense type and allow it to edit it
router.get("/finance/list-all/expense-type", async (req, res) => {
    let _expenses_type = await getExpensesType();
    res.status(200).json(_expenses_type)
});

// display a view with all expenses and allow it to edit it or delete it
router.get("/finance/list-all/expense", async (req, res) => {
    res.status(200).json("LISTAR GASTOS")
});

// inserts a new expense type into DB and renders main view
router.post("/finance/insert/expense-type", (req, res) => {
    // retrieve data from body
    res.status(200).json("INSERTAR TIPO DE GASTO")
})

// inserts a new expense into Db AND RENDER MAIN VIEW
router.post("/finance/insert/expense", (req, res) => {
    // retrieve data from body
    try {
        let { expense_ammount, expense_type } = req.body;
        res.status(200).json({ message: "INSERTAR TIPO DE GASTO", data: { "expense ammount": expense_ammount, "expense_type": expense_type } })
    } catch (error) {
        renderDashboard(req, res, '', error);
    }
})

module.exports = router;

