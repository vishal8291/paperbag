const express = require('express');
const { createInquiry } = require('../controllers/inquiryController');
const { requireTenant } = require('../middleware/tenant');
const router = express.Router();

router.post('/', requireTenant, createInquiry);

module.exports = router;
