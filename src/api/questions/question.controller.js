const questionService = require('./question.service');
const scoreboardService = require('../scoreBoard/board.service');
const userService = require('../users/user.service');
const AppError = require('../../common/error/error');
const { httpStatus } = require('../../common/error/http-status');

module.exports = {
    getRandomExam: async function (req, res, next) {
        try {
            const { id } = req.user;
            // check user be made exam
            /*
            if (await scoreboardService.getScoreById(id)) {
                throw new AppError(
                    httpStatus.NOT_FOUND,
                    'User is yet made this exam.',
                    true,
                );
            } */
            if (await userService.isUserStartedExam(id)) {
                throw new AppError(
                    httpStatus.FORBIDDEN,
                    'User has started or completed this exam.',
                    true,
                );
            }
            /* -> Check if user not have information */
            if (await userService.isUserNotHaveInfo(id)) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    'User needs to update personal information to continue.',
                    true,
                );
            }

            console.log(`[%]----- User with id "${id}" got exam at ${new Date()}`);
            await scoreboardService.insertNewUser(id);
            const exam = await questionService.getRandomExam();
            const lengthQues = exam.length;
            let quesStr = '';
            for (let i=0; i<lengthQues; i+=1) {
                quesStr += exam[i].id;
                quesStr += (i < lengthQues - 1) ? '_' : '';
            }
            await userService.updateHistoryQuestions(id, quesStr);
            await scoreboardService.updateTimeStartExam(id);
            return res.json(exam);
        } catch (err) {
            return next(err);
        }
    },
    finalExam: async function (req, res, next) {
        try {
            const { id } = req.user;
            /* Check if user not submit any times before */
            if (await userService.isUserSubmitedExam(id)) {
                throw new AppError(
                    httpStatus.FORBIDDEN,
                    'User has completed this exam.',
                    true,
                );
            }
            const now = new Date();
            const timeServerEnd = now.getTime();
            const { arrayAns, time } = req.body;
            const questionList = await userService.getHistoryQuestions(id);
            const examResult = await questionService.checkQuestionToScore(
                arrayAns, questionList
            );
            console.log(`[%]----- User with id "${id}" submit exam at ${new Date()} with (same/returned): ${examResult.sameLength}/${arrayAns.length}`);
            // update score and time for user
            await scoreboardService.updateScore(id, examResult.score, time, timeServerEnd);
            await userService.updateHistoryAnss(id, examResult.anss);
            return res.json(examResult.score);
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
