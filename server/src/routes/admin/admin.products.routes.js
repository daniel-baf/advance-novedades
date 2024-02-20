const express = require('express');
const router = express.Router();
const { loadProducts, findStockByPK, updateStock } = require('../../modules/admin/admin.products.module');

// INVENTORY
router.use(require('./admin.inventory.routes'));
router.use(require('./admin.pledges.routes'))

// PRODUCTS
// load all stock
router.get("/load-products", (req, res) => {
    renderProductStockList(req, res)
});

// edit stock, a post petition with a json object
router.post("/load-products/update-product", async (req, res) => {
    // get params
    try {
        let { building_id, pledge_id, size_id, stock } = req.body
        _fetched_response = await updateStock(building_id, pledge_id, size_id, stock)
        renderProductStockList(req, res, _fetched_response.message, undefined)
    } catch (error) {
        renderProductStockList(req, res, undefined, error)
    }
})

// fetches all products by stock and renders this as html
async function renderProductStockList(req, res, message, error_message) {
    // get data from DB and generate custom JSON
    try {
        _data = await loadProducts();
        res.render("users/admin/products/list-products", { data: _data, name: req.session.user.id, message: message, error_message: error_message });
    } catch (error) {
        // res.render('500', { error_message: 'Ooops, a error just ocurred ' + error })
        res.render("/login", { error_message: "No hemos podidio encontrar el los productos y stocks valido" });
    }
}

// edit a producto by stock
router.get("/load-products/edit-product/:building_id/:pledge_id/:size_id", async (req, res) => {
    try {
        // get data from DB
        let { building_id, pledge_id, size_id } = req.params
        _fetched_data = await findStockByPK(building_id, pledge_id, size_id)
        return res.status(200).json({ data: _fetched_data, ids: { pledge_id: pledge_id, building_id: building_id, size_id: size_id } })
    } catch (error) {
        // return res.status(500).json({ message: "No se pudo ejecutar la operacion " + error })
        res.render("/login", { error_message: "No hemos podidio editar los prodcutos" });
    }
});

module.exports = router;

