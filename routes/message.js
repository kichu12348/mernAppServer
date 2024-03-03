const router = require('express').Router();
const { getMessages, sendMessage } = require('../controllers/message');
const {lightAuth} = require('../services/Auth');


router.post('/getMessages',lightAuth, getMessages);
router.post('/sendMessage',lightAuth, sendMessage);

module.exports = router;