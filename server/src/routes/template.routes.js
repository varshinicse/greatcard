const express = require('express');
const router = express.Router();
const { getTemplates, createTemplate, updateLayout } = require('../controllers/template.controller');
const upload = require('../middlewares/upload.middleware');

router.get('/', getTemplates);
router.post('/', upload.single('image'), createTemplate);
router.put('/:id/layout', updateLayout);

module.exports = router;
