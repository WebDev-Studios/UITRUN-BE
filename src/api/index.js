const router = require('express').Router();
const adminRouter = require('./admins');
const userRouter = require('./users');
const questionRouter = require('./questions');
const authRouter = require('./auth');
const scoreRouter = require('./scoreBoard')

router.use('/admin', adminRouter); // Admins
router.use('/user', userRouter); // Users
router.use('/question', questionRouter); // Questions
router.use('/auth', authRouter); // Authentication
router.use('/score', scoreRouter); // Score Board
module.exports = router;
