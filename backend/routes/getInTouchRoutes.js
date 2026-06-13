const express = require('express');
const { submitGetInTouch } = require('../controllers/getInTouchController');
const { requireTenant } = require('../middleware/tenant');
const router = express.Router();

router.post('/', requireTenant, submitGetInTouch);

module.exports = router;
