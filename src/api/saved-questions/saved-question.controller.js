const savedQuestionService = require('./saved-question.service');

module.exports = {
    getSavedQuestion: async function (req, res, next) {
        try {
            const { id: userId } = req.user;
            const questions = await savedQuestionService.getSavedQuestion(
                userId,
                req.query,
            );

            res.json(questions);
        } catch (err) {
            next(err);
        }
    },

    getRandomSavedQuestion: async function (req, res, next) {
        try {
            const { id: userId } = req.user;
            const question = await savedQuestionService.getRandomSavedQuestion(
                userId,
                req.query,
            );

            res.json(question);
        } catch (err) {
            next(err);
        }
    },

    getExamFromSavedQuestion: async function (req, res, next) {
        try {
            const { id: userId } = req.user;
            const questions = await savedQuestionService.getExamFromSavedQuestion(
                userId,
                req.query,
            );

            res.json(questions);
        } catch (err) {
            next(err);
        }
    },

    saveQuestion: async function (req, res, next) {
        try {
            const { id: userId } = req.user;
            const { id: questionId } = req.params;
            const saved = await savedQuestionService.saveQuestion(
                userId,
                questionId,
            );

            res.json({ saved });
        } catch (err) {
            /**
             * ? I can't overide default message for duplicate items because of of PRIMARY KEY contraints.
             * ? So I have to handle it here.
             * ? Try to find a better way to do it.
             */
            if (err.name === 'SequelizeUniqueConstraintError') {
                err.errors[0].message = 'This question is already saved.';
            }

            next(err);
        }
    },

    removeFromSavedQuestion: async function (req, res, next) {
        try {
            const { id: userId } = req.user;
            const { id: questionId } = req.params;
            const affected = await savedQuestionService.removeFromSavedQuestion(
                userId,
                questionId,
            );

            res.json({ affected });
        } catch (err) {
            next(err);
        }
    },
};
