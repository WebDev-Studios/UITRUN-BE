const models = require('../../models');
const AppError = require('../../common/error/error');
const { httpStatus } = require('../../common/error/http-status');

module.exports = {
    getRandomExam: async function () {
        const limit = process.env.LIMIT_QUESTION;
        const sql = `select 
                        questions.id,
                        questions.content,
                        questions.answer_a   as answerA,
                        questions.answer_b   as answerB,
                        questions.answer_c   as answerC,
                        questions.answer_d   as answerD,
                        questions.image,
                        questions.description
                    from 
                        questions
                        JOIN (SELECT id FROM questions ORDER BY RAND() LIMIT :limit) as tmp ON questions.id=tmp.id`;

        const question = await models.sequelize.query(sql, {
            replacements: { limit: parseInt(limit, 10) },
            type: models.sequelize.QueryTypes.SELECT,
        });

        return question;
    },
    checkQuestionToScore: async function (arrayAns = [], historyQuestions) {
        /**
         * array : [{id: , ans: }, { , }]
         */
        let score = 0;
        const arraySameQues = [];
        let historyAnss = '';
        const arrayHisQues = historyQuestions.split('_');
        for (let i = 0; i < arrayAns.length; i += 1) {
            const ele = arrayAns[i];
            // check questions return and questions list was created
            if (arrayHisQues.includes(ele.id.toString()) && !arraySameQues.includes(ele.id.toString())) {
                arraySameQues.push(ele.id.toString());
            }
            // eslint-disable-next-line no-await-in-loop
            const found = await models.question.findByPk(ele.id);
            // eslint-disable-next-line no-continue
            if (!found) continue;
            let ansKey = 0;
            switch (ele.ans) {
                case found.answerA:
                    ansKey = 'A';
                    break;
                case found.answerB:
                    ansKey = 'B';
                    break;
                case found.answerC:
                    ansKey = 'C';
                    break;
                case found.answerD:
                    ansKey = 'D';
                    break;
                default:
                    break;
            }

            if (ansKey === found.result) {
                score += 1;
            }
            // Answers - Add user's answer to history answer
            historyAnss += `${ele.id}-${ansKey}`;
            historyAnss += (i < arrayAns.length - 1) ? '_' : '';
        }
        // if length of question return = length of question what have in list of question created -> results | 0
        // if length of ans is 0 -> return history ans is " " (not "") and save to database.
        return {
            score: score,
            anss: (historyAnss === '') ? ' ' : historyAnss,
            sameLength: arraySameQues.length,
        };
    },

    getAll: async function (page = 0, pageSize = 10) {
        const pageNum = parseInt(page, 10);
        const pageSizeNum = parseInt(pageSize, 10);
        const offset = pageNum * pageSizeNum;
        const limit = pageSizeNum;

        const questions = await models.question.findAll({
            limit,
            offset,
            where: {}, // conditions
        });
        return questions;
    },

    searchByContent: async function (content = '') {
        if (content === '') return [];

        const sql = `SELECT *
                FROM questions
                WHERE questions.content LIKE :content `;
        const questions = await models.sequelize.query(sql, {
            replacements: { content: `%${content}%` },
            type: models.sequelize.QueryTypes.SELECT,
        });

        return questions;
    },

    create: async function (data) {
        const question = await models.question.create(data);

        return question;
    },

    getById: async function (id) {
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

    updateById: async function (id, body) {
        const question = await this.getById(id);
        question.set(body);
        const updated = await question.save();

        return updated;
    },

    deleteById: async function (id) {
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

    getRandomQuestion: async function () {
        const sql = `select 
                        questions.id,
                        questions.content,
                        questions.answer_a   as answerA,
                        questions.answer_b   as answerB,
                        questions.answer_c   as answerC,
                        questions.answer_d   as answerD,
                        questions.image,
                        questions.description
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

    getResultById: async function (id) {
        const question = await this.getById(id);

        return question.result;
    },
};
