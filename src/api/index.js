/* eslint-disable prettier/prettier */
const router = require('express').Router();
const adminRouter = require('./admins');
const userRouter = require('./users');
const questionRouter = require('./questions');
const authRouter = require('./auth');

router.use('/admin', adminRouter); // Admin
router.use('/user', userRouter); // Users
router.use('/question', questionRouter); // Questions
router.use('/auth', authRouter); // Authentication

module.exports = router;
