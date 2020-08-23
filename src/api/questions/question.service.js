const models = require('../../models');
const AppError = require('../../common/error/error');
const { httpStatus } = require('../../common/error/http-status');

module.exports = {
    // ###QUESTIONS
    getQuestions: async function (query) {
        const { content } = query;

        let sql = `select 
                        questions.id,
                        questions.content,
                        questions.answer_a   as answerA,
                        questions.answer_b   as answerB,
                        questions.answer_c   as answerC,
                        questions.answer_d   as answerD,
                        questions.image,
                        questions.description,
                    from 
                        questions 
                    where 
                        1 = 1 `;

        if (content) {
            sql += 'AND questions.content LIKE :content ';
        }

        const questions = await models.sequelize.query(sql, {
            replacements: { content: `%${content}%` },
            type: models.sequelize.QueryTypes.SELECT,
        });

        return questions;
    },

    getQuestionById: async function (id) {
        const found = await models.question.findByPk(id);

        if (!found) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                'This question does not exist.',
                true,
            );
        }

        return found;
    },

    getRandomQuestion: async function () {
        const sql = `select 
                        questions.id,
                        questions.content,
                        questions.answer_a   as answerA,
                        questions.answer_b   as answerB,
                        questions.answer_c   as answerC,
                        questions.answer_d   as answerD,
                        questions.image,
                        questions.description,
                    from 
                        questions
                        JOIN 
                            (SELECT (RAND() * (SELECT MAX(id) FROM questions)) AS id) AS tmp 
                                             on questions.id              >= tmp.id
                    where 1 = 1 `;

        const question = await models.sequelize.query(
            `${sql} ORDER BY questions.id ASC LIMIT 1`,
            {
                type: models.sequelize.QueryTypes.SELECT,
            },
        );

        return question[0];
    },

    getExamResult: async function (ids) {
        const results = await models.question.findAll({
            where: {
                id: ids,
            },
            attributes: ['id', 'result'],
        });

        return results;
    },

    getQuestionResultById: async function (id) {
        const question = await this.getQuestionById(id);

        return question.result;
    },

    getRandomExam: async function (query) {
        let { limit } = query;

        const sql = `select 
                        questions.id,
                        questions.content,
                        questions.answer_a   as answerA,
                        questions.answer_b   as answerB,
                        questions.answer_c   as answerC,
                        questions.answer_d   as answerD,
                        questions.image,
                        questions.description,
                    from 
                        questions
                        JOIN (SELECT id FROM questions ORDER BY RAND() LIMIT :limit) as tmp ON questions.id=tmp.id
                    where
                        1 = 1 `;

        if (!limit) {
            limit = 40;
        }

        const question = await models.sequelize.query(sql, {
            replacements: { limit: parseInt(limit, 10) },
            type: models.sequelize.QueryTypes.SELECT,
        });

        return question;
    },

    createQuestion: async function (body) {
        const question = await models.question.create(body);

        return question;
    },

    updateQuestionById: async function (id, body) {
        const question = await this.getQuestionById(id);
        question.set(body);
        const updated = await question.save();

        return updated;
    },

    deleteQuestionById: async function (id) {
        const affected = await models.question.destroy({
            where: {
                id: id,
            },
        });

        if (affected === 0) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                'This question does not exist.',
                true,
            );
        }

        return affected;
    },
};
