const questionService = require('./question.service');
// const scoreboardService = require('../scoreBoard/models/board');
const AppError = require('../../common/error/error');
const { httpStatus } = require('../../common/error/http-status');

module.exports = {
    getRandomExam: async function (req, res, next) {
        try {
            /*
            const { id } = req.user;
            // check user be made exam
            if (await scoreboardService.checkUser(id)) {
                // if yes -> return message
                throw new AppError(
                    httpStatus.NOT_FOUND,
                    'User is yet made this exam.',
                    true,
                );
            }
            */

            // if not yes -> make random exam
            const exam = await questionService.getRandomExam();

            return res.json(exam);
        } catch (err) {
            return next(err);
        }
    },
    finalExam: async function (req, res, next) {
        try {
            const { arrayAns } = req.body;
            /*
            const { id } = req.user;
            // update score for user
            const score = await scoreboardService.updateScore(id, examScore);

            return res.json(score);
             */
            const examScore = await questionService.checkQuestionToScore(
                arrayAns,
            );

            return res.json(examScore);
        } catch (err) {
            return next(err);
        }
    },

    getAll: async function (req, res, next) {
        try {
            const { page, pageSize } = req.query;
            const questions = await questionService.getAll(page, pageSize);

            return res.json(questions);
        } catch (err) {
            return next(err);
        }
    },
    searchByContent: async function (req, res, next) {
        try {
            const { content } = req.query;
            const questions = await questionService.searchByContent(content);
            return res.json(questions);
        } catch (err) {
            return next(err);
        }
    },

    create: async function (req, res, next) {
        try {
            const question = await questionService.create(req.body);

            return res.json(question);
        } catch (err) {
            return next(err);
        }
    },

    getById: async function (req, res, next) {
        try {
            const { id } = req.params;
            const question = await questionService.getById(id);

            return res.json(question);
        } catch (err) {
            return next(err);
        }
    },

    updateById: async function (req, res, next) {
        try {
            const { id } = req.params;
            const cat = await questionService.updateById(id, req.body);

            return res.json(cat);
        } catch (err) {
            return next(err);
        }
    },

    deleteById: async function (req, res, next) {
        try {
            const { id } = req.params;
            const affected = await questionService.deleteById(id);

            return res.json({ affected });
        } catch (err) {
            return next(err);
        }
    },

    getRandomQuestion: async function (req, res, next) {
        try {
            const { id } = req.user;
            const question = await questionService.getRandomQuestion(
                req.query,
                id,
            );

            return res.json(question);
        } catch (err) {
            return next(err);
        }
    },
};
