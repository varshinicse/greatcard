const express = require('express');
const router = express.Router();
const { generateBulk } = require('../controllers/generate.controller');

router.post('/bulk', generateBulk);

module.exports = router;
