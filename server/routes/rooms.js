const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.post('/', roomController.createRoom);
router.post('/data', roomController.checkRoom);
router.post('/hostname', roomController.getHost)

module.exports = router;
