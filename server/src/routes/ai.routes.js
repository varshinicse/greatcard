const express = require('express');
const router = express.Router();
const { generateAIImage } = require('../controllers/ai.controller');

router.post('/generate-image', generateAIImage);

module.exports = router;
