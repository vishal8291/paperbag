const express = require('express');
const { createCustomOrder } = require('../controllers/customOrderController');
const router = express.Router();

router.post('/', createCustomOrder);

module.exports = router;
