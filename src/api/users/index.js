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

/**
 * -------------- FOR ADMIN ----------------
 */

 // Get all user
router.get('/', checkPermission(['admin']), userCtl.getAllUser);

// Get user by ID
router.get('/:id', checkPermission(['admin']), userCtl.getUserById);

// Update user by ID
router.patch('/:id', checkPermission(['admin']), userCtl.updateUserById);

// Delete user by ID
router.delete('/:id', checkPermission(['admin']), userCtl.deleteUserById);
// Reset result user by code
router.post('/reset-result-quiz-by-code', checkPermission(['admin']), userCtl.resetUserResultByCode);

module.exports = router;
