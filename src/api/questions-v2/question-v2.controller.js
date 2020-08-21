const questionService = require('./question-v2.service');

module.exports = {
    // ###QUESTIONS
    getQuestions: async function (req, res, next) {
        try {
            const questions = await questionService.getQuestions(req.query);

            res.json(questions);
        } catch (err) {
            next(err);
        }
    },

    getQuestionById: async function (req, res, next) {
        try {
            const { id } = req.params;
            const question = await questionService.getQuestionById(id);

            res.json(question);
        } catch (err) {
            next(err);
        }
    },

    getRandomQuestion: async function (req, res, next) {
        try {
            const question = await questionService.getRandomQuestion(req.query);

            res.json(question);
        } catch (err) {
            next(err);
        }
    },

    getQuestionResultById: async function (req, res, next) {
        try {
            const { id } = req.params;
            const result = await questionService.getQuestionResultById(id);

            res.json({ result });
        } catch (err) {
            next(err);
        }
    },

    getRandomExam: async function (req, res, next) {
        try {
            const exam = await questionService.getRandomExam(req.query);

            res.json(exam);
        } catch (err) {
            next(err);
        }
    },

    getExamResult: async function (req, res, next) {
        try {
            const { ids } = req.query;
            const results = await questionService.getExamResult(ids);

            res.json({ results });
        } catch (err) {
            next(err);
        }
    },

    createQuestion: async function (req, res, next) {
        try {
            const question = await questionService.createQuestion(req.body);

            res.json(question);
        } catch (err) {
            next(err);
        }
    },

    updateQuestionById: async function (req, res, next) {
        try {
            const { id } = req.params;
            const cat = await questionService.updateQuestionById(id, req.body);

            return res.json(cat);
        } catch (err) {
            next(err);
        }
    },

    deleteQuestionById: async function (req, res, next) {
        try {
            const { id } = req.params;
            const affected = await questionService.deleteQuestionById(id);

            res.json({ affected });
        } catch (err) {
            next(err);
        }
    },
};
