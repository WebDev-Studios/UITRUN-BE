const router = require('express').Router();
const adminCtl = require('./admin.controller');
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

router.get('/me', checkPermission(['user', 'editor']), adminCtl.whoAmI); // Get user profile by credentials
router.patch(
    '/',
    checkPermission(['user', 'editor']),
    validateUserUpdate,
    adminCtl.updateUserById,
); // Update user profile

/**
 * -------------- FOR ADMINS ----------------
 */

router.get('/', checkPermission(['admin']), adminCtl.getAllUser); // Get all users include editors
router.get('/:id', checkPermission(['admin']), adminCtl.getUserById); // Get users or editors by id

router.patch(
    '/activate',
    checkPermission(['admin']),
    validateActivationUpdate,
    adminCtl.activateUserByIds,
); // Users activation
router.patch(
    '/role/:id',
    checkPermission(['admin']),
    validateRoleUpdate,
    adminCtl.updateUserRoleById,
); // Change user role from user to editor and vice versa

router.delete('/:id', checkPermission(['admin']), adminCtl.deleteUserById); // Delete users or editors by id

module.exports = router;
