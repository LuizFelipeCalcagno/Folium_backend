const express = require('express');
const router = express.Router();
const { confirmLogin } = require('../../controllers/confirmController');

router.post('/', confirmLogin);

module.exports = router;
