const router = require('express').Router();
const userCtl = require('./user.controller');
const { checkPermission } = require('../auth/auth.permission');
const { validateUserUpdate } = require('./user.validate');
const auth = require('../auth/passport.strategy')();

router.use(auth.authenticate);

/**
 * -------------- FOR USERS ----------------
 */

router.get('/me', checkPermission(['user']), userCtl.whoAmI); // Get user profile by credentials

router.patch(
    '/update-first-login',
    checkPermission(['user']),
    validateUserUpdate,
    userCtl.updateUserFirstLoginById,
); // Update user profile at first login

/**
 * -------------- FOR ADMINS ----------------
 */

module.exports = router;
