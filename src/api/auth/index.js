const router = require('express').Router();
const authCtl = require('./auth.controller');
const {
    validateUserLogin,
    validateLogin,
    validateRegister,
} = require('./auth.validate');

/**
 * *-------------- FOR USERS ----------------
 */

router.post('/user-login', validateUserLogin, authCtl.loginForUsers);
// router.post('/register', validateRegister, authCtl.register);
router.post('/forgot-password', authCtl.sendPasswordResetEmail);
router.post('/reset-password', authCtl.resetPassword);

/**
 * *-------------- FOR ADMINS ----------------
 */

router.post('/login/admin', authCtl.loginForAdmins);

module.exports = router;
