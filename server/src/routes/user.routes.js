const express = require('express');
const router = express.Router();
const path = require('path')
const db_connection = require(path.join(__dirname, "../modules/database/db-connection"));



router.get("/signin", (req, res) => {
    res.send({ data: "Here is your data" })
});


module.exports = router;