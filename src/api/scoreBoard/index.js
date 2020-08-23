const router = require('express').Router();
const boardCtl = require('./board.controller');

router.get('/', boardCtl.getScore);

module.exports = router;