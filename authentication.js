const express = require('express');
const router = express.Router();
const authService = require('./methods/actions');

router.post('/signup', authService.signup);
router.post('/login', authService.login);
router.get('/decode', authService.getinfo);

module.exports = router;