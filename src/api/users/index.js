const router = require('express').Router();
const userCtl = require('./user.controller');
const { checkPermission } = require('../auth/auth.permission');
const { validateUserUpdate } = require('./user.validate');
const auth = require('../auth/passport.strategy')();

router.use(auth.authenticate);

/**
 * -------------- FOR USERS ----------------
 */

 // Get user profile by credentials

router.get('/me', checkPermission(['user']), userCtl.whoAmI);

 // Update user profile at first login
router.patch(
    '/update-first-login',
    checkPermission(['user']),
    validateUserUpdate,
    userCtl.updateUserFirstLoginById,
);

module.exports = router;
