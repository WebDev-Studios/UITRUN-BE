const router = require('express').Router();
const userCtl = require('./admin.controller');
const { checkPermission } = require('../auth/auth.permission');
const {
    validateUserUpdate,
    validateRoleUpdate,
    validateActivationUpdate,
} = require('./admin.validate');
const auth = require('../auth/passport.strategy')();

router.use(auth.authenticate);

/**
 * -------------- FOR USERS ----------------
 */

router.get('/me', checkPermission(['user', 'editor']), userCtl.whoAmI); // Get user profile by credentials
router.patch(
    '/',
    checkPermission(['user', 'editor']),
    validateUserUpdate,
    userCtl.updateUserById,
); // Update user profile

/**
 * -------------- FOR ADMINS ----------------
 */

router.get('/', checkPermission(['admin']), userCtl.getAllUser); // Get all users include editors
router.get('/:id', checkPermission(['admin']), userCtl.getUserById); // Get users or editors by id

router.patch(
    '/activate',
    checkPermission(['admin']),
    validateActivationUpdate,
    userCtl.activateUserByIds,
); // Users activation
router.patch(
    '/role/:id',
    checkPermission(['admin']),
    validateRoleUpdate,
    userCtl.updateUserRoleById,
); // Change user role from user to editor and vice versa

router.delete('/:id', checkPermission(['admin']), userCtl.deleteUserById); // Delete users or editors by id

module.exports = router;
