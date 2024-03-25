const express = require('express');
const router = express.Router();

router.get('/clients/search/:client_id', (req, res) => {
    // recover USER data
    let { client_id } = req.params;
    res.status(200).json({ nit: req.params.client_nit, name: "Cliente 1", address: "Calle 1", phone: "1234567" })
});

module.exports = router;

