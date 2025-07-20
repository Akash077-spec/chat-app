const express = require('express');
const { createChat, createGroupChat, getMessages } = require('../controllers/chatController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/create', auth, createChat);
router.post('/group', auth, createGroupChat);
router.get('/messages/:chatId', auth, getMessages);

module.exports = router;