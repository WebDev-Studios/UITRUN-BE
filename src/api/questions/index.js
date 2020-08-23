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

router.get('/',checkPermission(['admin', 'editor', 'user']), questionCtl.getQuestions);
router.get('/random', questionCtl.getRandomQuestion); // Return a random question
router.get('/exam', questionCtl.getRandomExam); // Return a random exam
router.get('/result', questionCtl.getExamResult);
router.get('/result/:id', questionCtl.getQuestionResultById);

/**
 * -------------- FOR ADMINS ----------------
 */

router.get(
    '/:id',
    checkPermission(['admin', 'editor']),
    questionCtl.getQuestionById,
);

router.post(
    '/',
    checkPermission(['admin', 'editor']),
    validateQuestionCreate,
    questionCtl.createQuestion,
); // Create new question

router.patch(
    '/:id',
    checkPermission(['admin', 'editor']),
    validateQuestionUpdate,
    questionCtl.updateQuestionById,
); // Update question's information

router.delete(
    '/:id',
    checkPermission(['admin']),
    questionCtl.deleteQuestionById,
); // Delete a question

module.exports = router;
