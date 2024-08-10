const express = require('express');
const { getPrompt, postPrompt, getInfo } = require('../controllers/dataController.js');

const router = express.Router();

router.get('/fetch/prompt', getPrompt);
router.get('/fetch/info', getInfo);
router.post('/update/promptResponse', postPrompt);

module.exports = router;
