const router = require('express').Router();
const auth = require('../auth/passport.strategy')();
const { checkPermission } = require('../auth/auth.permission');
const questionCtl = require('./question.controller');
const {
    validateQuestionCreate,
    validateQuestionUpdate,
} = require('./question.validate');

router.use(auth.authenticate);

/**
 * -------------- FOR USERS ----------------
 */
router
    .route('/exam')
    .get(
        checkPermission(['admin', 'editor', 'user']),
        questionCtl.getRandomExam,
    ) // Return a random exam detail
    .post(checkPermission(['admin', 'editor', 'user']), questionCtl.finalExam); // Return score for this exam

/**
 * -------------- FOR ADMINS ----------------
 */
router
    .route('/')
    .get(checkPermission(['admin', 'editor']), questionCtl.getAll)
    .post(
        checkPermission(['admin', 'editor']),
        validateQuestionCreate,
        questionCtl.create,
    );
router
    .route('/search')
    .get(checkPermission(['admin', 'editor']), questionCtl.searchByContent);

router
    .route('/:id')
    .get(checkPermission(['admin', 'editor']), questionCtl.getById)
    .patch(
        checkPermission(['admin', 'editor']),
        validateQuestionUpdate,
        questionCtl.updateById,
    )
    .delete(checkPermission(['admin']), questionCtl.deleteById);

module.exports = router;
