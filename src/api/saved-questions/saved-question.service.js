const models = require('../../models');
const { getQuestionById } = require('../questions/question.service');
const AppError = require('../../common/error/error');
const { httpStatus } = require('../../common/error/http-status');

module.exports = {
    getSavedQuestion: async function (userId, query) {
        const { catnum, catid, content } = query;

        let sql = `select 
                        questions.id,
                        questions.content,
                        questions.answer_A   as answerA,
                        questions.answer_B   as answerB,
                        questions.answer_C   as answerC,
                        questions.answer_D   as answerD,
                        questions.is_shuffle as isShuffle,
                        questions.image,
                        questions.description,
                        category_fours.name  as categoryFour, 
                        category_threes.name as categoryThree,
                        category_twos.name   as categoryTwo,
                        category_ones.name   as categoryOne
                    from 
                        questions 
                        join saved_questions      on saved_questions.question_id = questions.id
                        left join category_fours  on questions.category_four_id  = category_fours.id 
                        left join category_threes on category_fours.parent_id    = category_threes.id
                        left join category_twos   on category_threes.parent_id   = category_twos.id
                        left join category_ones   on category_twos.parent_id     = category_ones.id
                    where 
                        saved_questions.user_id = :userId `;

        if (catnum && catid) {
            sql += `AND category_${catnum}s.id in (:catid) `;
        }

        if (content) {
            sql += 'AND questions.content LIKE :content ';
        }

        const questions = await models.sequelize.query(sql, {
            replacements: {
                catid: catid,
                content: `%${content}%`,
                userId: userId,
            },
            type: models.sequelize.QueryTypes.SELECT,
        });

        return questions;
    },

    getRandomSavedQuestion: async function (userId, query) {
        const { catnum, catid } = query;

        let sql = `select 
                        questions.id,
                        questions.content,
                        questions.answer_A   as answerA,
                        questions.answer_B   as answerB,
                        questions.answer_C   as answerC,
                        questions.answer_D   as answerD,
                        questions.is_shuffle as isShuffle,
                        questions.image,
                        questions.description,
                        category_fours.name  as categoryFour, 
                        category_threes.name as categoryThree,
                        category_twos.name   as categoryTwo,
                        category_ones.name   as categoryOne
                    from 
                        questions
                        join saved_questions on saved_questions.question_id = questions.id
                        join category_fours  on questions.category_four_id  = category_fours.id 
                        join category_threes on category_fours.parent_id    = category_threes.id
                        join category_twos   on category_threes.parent_id   = category_twos.id
                        join category_ones   on category_twos.parent_id     = category_ones.id
                        JOIN (SELECT question_id as id FROM saved_questions ORDER BY RAND() LIMIT 2) as tmp ON questions.id=tmp.id
                    where 
                        saved_questions.user_id = :userId `;

        if (catnum && catid) {
            sql += `AND category_${catnum}s.id in (:catid) `;
        }

        const question = await models.sequelize.query(sql, {
            replacements: { catid: catid, userId: userId },
            type: models.sequelize.QueryTypes.SELECT,
        });

        return question[0];
    },

    getExamFromSavedQuestion: async function (userId, query) {
        const { catnum, catid } = query;
        let { limit } = query;

        let sql = `select 
                        questions.id,
                        questions.content,
                        questions.answer_A   as answerA,
                        questions.answer_B   as answerB,
                        questions.answer_C   as answerC,
                        questions.answer_D   as answerD,
                        questions.is_shuffle as isShuffle,
                        questions.image,
                        questions.description,
                        category_fours.name  as categoryFour, 
                        category_threes.name as categoryThree,
                        category_twos.name   as categoryTwo,
                        category_ones.name   as categoryOne
                    from 
                        questions
                        join saved_questions on saved_questions.question_id = questions.id
                        join category_fours  on questions.category_four_id  = category_fours.id 
                        join category_threes on category_fours.parent_id    = category_threes.id
                        join category_twos   on category_threes.parent_id   = category_twos.id
                        join category_ones   on category_twos.parent_id     = category_ones.id
                        JOIN (SELECT question_id as id FROM saved_questions ORDER BY RAND() LIMIT :limit) as tmp ON questions.id=tmp.id
                    where
                        saved_questions.user_id = :userId `;

        if (catnum && catid) {
            sql += `AND category_${catnum}s.id in (:catid) `;
        }

        if (!limit) {
            limit = 40;
        }

        const question = await models.sequelize.query(sql, {
            replacements: {
                catid: catid,
                limit: parseInt(limit, 10),
                userId: userId,
            },
            type: models.sequelize.QueryTypes.SELECT,
        });

        return question;
    },

    saveQuestion: async function (userId, questionId) {
        await getQuestionById(questionId);

        const saved = await models.saved_question.create({
            userId,
            questionId,
        });

        if (saved) {
            return 1;
        }

        return 0;
    },

    removeFromSavedQuestion: async function (userId, questionId) {
        const deleted = await models.saved_question.destroy({
            where: {
                questionId: questionId,
                userId: userId,
            },
        });

        if (deleted === 0) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                'This question does not exist.',
                true,
            );
        }
        return deleted;
    },
};
