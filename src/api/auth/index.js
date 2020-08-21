const router = require('express').Router();
const authCtl = require('./auth.controller');
const { validateLogin, validateRegister } = require('./auth.validate');

/**
 * *-------------- FOR USERS ----------------
 */

router.post('/login', validateLogin, authCtl.loginForUsers);
router.post('/register', validateRegister, authCtl.register);
router.post('/forgot-password', authCtl.sendPasswordResetEmail);
router.post('/reset-password', authCtl.resetPassword);

/**
 * *-------------- FOR ADMINS ----------------
 */

router.post('/login/admin', authCtl.loginForAdmins);

module.exports = router;
