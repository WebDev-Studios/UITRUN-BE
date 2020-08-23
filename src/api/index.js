const router = require('express').Router();
const userRouter = require('./admins');
const questionRouter = require('./questions');
const authRouter = require('./auth');
const scoreRouter = require('./scoreBoard')

router.use('/user', userRouter); // Users
router.use('/question', questionRouter); // Questions
router.use('/auth', authRouter); // Authentication
router.use('/score', scoreRouter); // Score Board
module.exports = router;
