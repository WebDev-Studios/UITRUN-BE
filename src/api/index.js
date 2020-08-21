const router = require('express').Router();
const userRouter = require('./admins');
const questionRouter = require('./questions');
const authRouter = require('./auth');

router.use('/user', userRouter); // Users
router.use('/question', questionRouter); // Questions
router.use('/auth', authRouter); // Authentication

module.exports = router;
