const express = require('express');
const router = express.Router();
const { loadProducts, findStockByPK, updateStock } = require('../../modules/admin/admin.products.module');


// PRODUCTS
// load all stock
router.get("/load-products", (req, res) => {
    renderProductStockList(req, res)
});


// edit stock
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

async function renderProductStockList(req, res, message, error_message) {
    // get data from DB and generate custom JSON
    try {
        _data = await loadProducts();
        res.render("users/admin/products/list-products", { data: _data, name: req.session.user.id, message: message, error_message: error_message });
    } catch (error) {
        res.render('500', { error_message: 'Ooops, a error just ocurred ' + error })
    }
}

// display stock
router.get("/load-products/edit-product/:building_id/:pledge_id/:size_id", async (req, res) => {
    try {
        // get data from DB
        let { building_id, pledge_id, size_id } = req.params
        _fetched_data = await findStockByPK(building_id, pledge_id, size_id)
        return res.status(200).json({ data: _fetched_data, ids: { pledge_id: pledge_id, building_id: building_id, size_id: size_id } })
    } catch (error) {
        return res.status(500).json({ message: "No se pudo ejecutar la operacion " + error })
    }
});

module.exports = router;

