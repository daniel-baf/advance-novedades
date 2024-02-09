const express = require('express');
const router = express.Router();
const { loadProducts } = require('../../modules/admin/admin.products.module');


// PRODUCTS
// load all stock
router.get("/load-products", async (req, res) => {
    // get data from DB and generate custom JSON
    try {
        _data = await loadProducts();
        res.render("users/admin/products/list-products", { data: _data });
        // return res.status(201).json({ data: _data });
    } catch (error) {
        res.render('500', { error_message: 'Ooops, a error just ocurred ' + error })
    }
});


module.exports = router;

