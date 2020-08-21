/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const models = require('../../models');
const AppError = require('../../common/error/error');
const { httpStatus } = require('../../common/error/http-status');
const arrayShuffle = require('../../common/array/shuffle');

module.exports = {
    // ###QUESTIONS
    getQuestions: async function (query) {
        const { catnum, catid, content } = query;

        let sql = `select 
                        question_v2s.id,
                        question_v2s.content,
                        question_v2s.image,
                        question_v2s.description,
                        answers.id                  as "answers.id",
                        answers.content             as "answers.content",
                        answers.is_result           as "answers.isResult",
                        category_fours.name         as "parent.categoryFour",
                        category_threes.name        as "parent.categoryThree",
                        category_twos.name          as "parent.categoryTwo",
                        category_ones.name          as "parent.categoryOne"

                    from 
                        question_v2s
                        join answers                on question_v2s.id = answers.question_id
                        left join category_fours    on question_v2s.category_four_id = category_fours.id 
                        left join category_threes   on category_fours.parent_id   = category_threes.id
                        left join category_twos     on category_threes.parent_id  = category_twos.id
                        left join category_ones     on category_twos.parent_id    = category_ones.id
                    where 
                        1 = 1 `;

        if (catnum && catid) {
            sql += `AND category_${catnum}s.id in (:catid) `;
        }

        if (content) {
            sql += 'AND question_v2s.content LIKE :content ';
        }

        const option = {
            replacements: { catid: catid, content: `%${content}%` },
            type: models.sequelize.QueryTypes.SELECT,
            include: [
                {
                    model: models.answer,
                    as: 'answers',
                },
                {
                    model: models.category_four,
                    as: 'parent',
                    include: [
                        {
                            model: models.category_three,
                            as: 'parent',
                            include: [
                                {
                                    model: models.category_two,
                                    as: 'parent',
                                    include: [
                                        {
                                            model: models.category_one,
                                            as: 'parent',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            hasJoin: true,
        };

        await models.question_v2._validateIncludedElements(option);
        const questions = await models.sequelize.query(sql, option);

        return questions;
    },

    getQuestionById: async function (id) {
        const found = await models.question_v2.scope('categories').findByPk(id);

        if (!found) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                'This question does not exist.',
                true,
            );
        }

        return found;
    },

    getRandomQuestion: async function (query) {
        const { catnum, catid } = query;

        let sql = `select 
                        question_v2s.id,
                        question_v2s.content,
                        question_v2s.image,
                        question_v2s.description,
                        answers.id                  as "answers.id",
                        answers.content             as "answers.content",
                        answers.is_result           as "answers.isResult",
                        category_fours.name         as "parent.categoryFour",
                        category_threes.name        as "parent.categoryThree",
                        category_twos.name          as "parent.categoryTwo",
                        category_ones.name          as "parent.categoryOne"

                    from 
                        question_v2s
                        join answers                on question_v2s.id = answers.question_id
                        join category_fours         on question_v2s.category_four_id = category_fours.id 
                        join category_threes        on category_fours.parent_id   = category_threes.id
                        join category_twos          on category_threes.parent_id  = category_twos.id
                        join category_ones          on category_twos.parent_id    = category_ones.id
                        join 
                            (SELECT id FROM question_v2s ORDER BY RAND() LIMIT 2) as tmp_ques 
                                                    on question_v2s.id = tmp_ques.id
                    where 1 = 1 `;

        if (catnum && catid) {
            sql += `AND category_${catnum}s.id in (:catid) `;
        }

        const option = {
            replacements: { catid: catid },
            type: models.sequelize.QueryTypes.SELECT,
            include: [
                {
                    model: models.answer,
                    as: 'answers',
                },
                {
                    model: models.category_four,
                    as: 'parent',
                    include: [
                        {
                            model: models.category_three,
                            as: 'parent',
                            include: [
                                {
                                    model: models.category_two,
                                    as: 'parent',
                                    include: [
                                        {
                                            model: models.category_one,
                                            as: 'parent',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            hasJoin: true,
        };

        await models.question_v2._validateIncludedElements(option);
        const question = await models.sequelize.query(sql, option);

        // Shuffle question's answers
        arrayShuffle(question[0].answers);

        return question[0];
    },

    getQuestionResultById: async function (id) {
        const questions = await this.getQuestionById(id);

        const result = questions.answers.map((a) => {
            return a.isResult ? { id: a.id } : null;
        });

        return result;
    },

    getExamResult: async function (ids) {
        const questions = await models.question_v2.scope('categories').findAll({
            where: {
                id: ids || null, // Prevent undefined field error
            },
        });

        const results = questions.map((q) => {
            return {
                id: q.id,
                result: q.answers.map((a) => {
                    return a.isResult ? { id: a.id } : null;
                }),
            };
        });

        return results;
    },

    getRandomExam: async function (query) {
        const { catnum, catid } = query;
        let { limit } = query;

        let sql = `select 
                        question_v2s.id,
                        question_v2s.content,
                        question_v2s.image,
                        question_v2s.description,
                        answers.id                  as "answers.id",
                        answers.content             as "answers.content",
                        answers.is_result           as "answers.isResult",
                        category_fours.name         as "parent.categoryFour",
                        category_threes.name        as "parent.categoryThree",
                        category_twos.name          as "parent.categoryTwo",
                        category_ones.name          as "parent.categoryOne"

                    from 
                        question_v2s
                        join answers                on question_v2s.id = answers.question_id
                        join category_fours         on question_v2s.category_four_id = category_fours.id 
                        join category_threes        on category_fours.parent_id   = category_threes.id
                        join category_twos          on category_threes.parent_id  = category_twos.id
                        join category_ones          on category_twos.parent_id    = category_ones.id
                        JOIN (SELECT id FROM question_v2s ORDER BY RAND() LIMIT :limit) as tmp ON question_v2s.id=tmp.id
                    where
                        1 = 1 `;

        if (catnum && catid) {
            sql += `AND category_${catnum}s.id in (:catid) `;
        }

        if (!limit) {
            limit = 40;
        }

        const option = {
            replacements: { catid: catid, limit: parseInt(limit, 10) },
            type: models.sequelize.QueryTypes.SELECT,
            include: [
                {
                    model: models.answer,
                    as: 'answers',
                },
                {
                    model: models.category_four,
                    as: 'parent',
                    include: [
                        {
                            model: models.category_three,
                            as: 'parent',
                            include: [
                                {
                                    model: models.category_two,
                                    as: 'parent',
                                    include: [
                                        {
                                            model: models.category_one,
                                            as: 'parent',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            hasJoin: true,
        };

        await models.question_v2._validateIncludedElements(option);
        const questions = await models.sequelize.query(sql, option);

        // Shuffle questions's answers
        return questions.map((q) => {
            arrayShuffle(q.answers);
            return q;
        });
    },

    createQuestion: async function (body) {
        const { content, categoryFourId } = body;

        const found = await this.getQuestions({ content });
        if (found.length > 0) {
            throw new AppError(
                httpStatus.UNPROCESSABLE_ENTITY,
                'This question already exist.',
                true,
            );
        }

        // Insert new category
        const question = await models.question_v2.create(body, {
            include: [
                {
                    model: models.answer,
                    as: 'answers',
                },
            ],
            exclude: ['id'],
        });

        return question;
    },

    updateQuestionById: async function (id, body) {
        const { categoryFourId } = body;

        const categoryFour = await models.category_four.findByPk(
            categoryFourId,
        );
        if (categoryFourId && !categoryFour) {
            throw new AppError(
                httpStatus.UNPROCESSABLE_ENTITY,
                'This categoryFourId does not match any category.',
                true,
            );
        }

        const question = await this.getQuestionById(id);

        let updated;

        await models.sequelize.transaction(async (t) => {
            await question.set(body, { transaction: t });

            if (body.answers) {
                await models.answer.destroy({
                    where: {
                        questionId: question.id,
                    },
                    transaction: t,
                });
                await models.answer.bulkCreate(
                    body.answers.map((answer) => {
                        answer.questionId = question.id;
                        return answer;
                    }),
                    {
                        transaction: t,
                        fields: ['content', 'isResult', 'questionId'],
                    },
                );
            }

            await question.save({ transaction: t });

            updated = await question.reload({ transaction: t });
        });

        return updated;
    },

    deleteQuestionById: async function (id) {
        const affected = await models.question_v2.destroy({
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
