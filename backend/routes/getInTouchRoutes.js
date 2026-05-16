const express = require('express');
const { submitGetInTouch } = require('../controllers/getInTouchController');
const router = express.Router();

router.post('/', submitGetInTouch);

module.exports = router;
