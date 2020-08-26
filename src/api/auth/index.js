const router = require('express').Router();
const authCtl = require('./auth.controller');
const {
    validateAdminLogin,
    validateUserLogin,
} = require('./auth.validate');

/**
 * *-------------- FOR USERS ----------------
 */

router.post('/login', validateUserLogin, authCtl.loginForUsers);

/**
 * *-------------- FOR ADMINS ----------------
 */

router.post('/login/admin', validateAdminLogin, authCtl.loginForAdmins);

module.exports = router;
