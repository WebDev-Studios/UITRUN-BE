/* eslint-disable prettier/prettier */
const router = require('express').Router();
const userCtl = require('./user.controller');
const { checkPermission } = require('../auth/auth.permission');
const {
    validateUserUpdate,
} = require('./user.validate');
const auth = require('../auth/passport.strategy')();

router.use(auth.authenticate);

/**
 * -------------- FOR USERS ----------------
 */
router.get('/', checkPermission(['user']), userCtl.getAllUser);

router.get('/me', checkPermission(['user']), userCtl.whoAmI); // Get user profile by credentials
router.patch(
    '/update',
    checkPermission(['user']),
    validateUserUpdate,
    userCtl.updateUserById,
); // Update user profile

/**
 * -------------- FOR ADMINS ----------------
 */

module.exports = router;