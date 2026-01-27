const express = require('express');
const router = express.Router();
const { uploadCSV, uploadImage } = require('../controllers/upload.controller');
const upload = require('../middlewares/upload.middleware');

router.post('/csv', upload.single('file'), uploadCSV);
router.post('/image', upload.single('image'), uploadImage);

module.exports = router;
