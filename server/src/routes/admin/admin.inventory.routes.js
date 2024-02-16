const express = require('express');
const router = express.Router();

const { getAllInventory } = require('../../modules/admin/admin.inventory.module');

// INVENTORY
router.get("/load-inventory", (req, res) => {
    try {
        renderInventoryList(req, res)
    } catch (error) {
        res.redirect("/login")
    }
})

async function renderInventoryList(req, res, message = '', error_message = '') {
    try {
        // get data from DB and generate custom JSON
        db_iventory = await getAllInventory();
        // res.status(200).json({ name: req.session.user.id, message: message, error_message: error_message, data: db_iventory });
        res.render("users/admin/products/list-inventory", { name: req.session.user.id, message: message, error_message: error_message, data: db_iventory });
    } catch (error) {
        res.redirect("/login")
    }
}


module.exports = router;

