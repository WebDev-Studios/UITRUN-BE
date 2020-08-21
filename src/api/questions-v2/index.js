const router = require('express').Router();
const questionCtl = require('./question-v2.controller');
const { checkPermission } = require('../auth/auth.permission');
const auth = require('../auth/passport.strategy')();
const {
    validateCreateSchema,
    validateUpdateSchema,
} = require('./question-v2.validate');

router.use(auth.authenticate);

// GET
router.get('/', questionCtl.getQuestions);
router.get('/random', questionCtl.getRandomQuestion); // Return a random question by a set of category
router.get('/exam', questionCtl.getRandomExam); // Return a random exam
router.get('/result', questionCtl.getExamResult);
router.get('/result/:id', questionCtl.getQuestionResultById);
router.get('/:id', questionCtl.getQuestionById);

// CREATE
router.post(
    '/',
    checkPermission(['admin', 'editor']),
    validateCreateSchema,
    questionCtl.createQuestion,
); // Create a new question

// UPDATE
router.patch(
    '/:id',
    checkPermission(['admin', 'editor']),
    validateUpdateSchema,
    questionCtl.updateQuestionById,
); // Update information of a question

// DELETE
router.delete(
    '/:id',
    checkPermission(['admin']),
    questionCtl.deleteQuestionById,
); // Delete a question

module.exports = router;
