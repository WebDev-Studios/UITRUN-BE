const router = require('express').Router();
const boardCtl = require('./board.controller');

router.get('/', boardCtl.getScore);
router.get('/:id', boardCtl.getScoreById);
router.post('/', boardCtl.insertNewUser);


module.exports = router;