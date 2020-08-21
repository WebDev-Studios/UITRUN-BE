const router = require('express').Router();
const auth = require('../auth/passport.strategy')();
const savedQuestionCtl = require('./saved-question.controller');

router.use(auth.authenticate);

/**
 * -------------- FOR USERS ----------------
 */

router.get('/', savedQuestionCtl.getSavedQuestion);
router.get('/random', savedQuestionCtl.getRandomSavedQuestion);
router.get('/exam', savedQuestionCtl.getExamFromSavedQuestion);
router.post('/:id', savedQuestionCtl.saveQuestion); // Return a random exam
router.delete('/:id', savedQuestionCtl.removeFromSavedQuestion);

module.exports = router;
