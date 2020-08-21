const models = require('../../models');
const AppError = require('../../common/error/error');
const { httpStatus } = require('../../common/error/http-status');

module.exports = {
    // ###QUESTIONS
    getQuestions: async function (query) {
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
                        left join category_fours  on questions.category_four_id = category_fours.id 
                        left join category_threes on category_fours.parent_id   = category_threes.id
                        left join category_twos   on category_threes.parent_id  = category_twos.id
                        left join category_ones   on category_twos.parent_id    = category_ones.id
                    where 
                        1 = 1 `;

        if (catnum && catid) {
            sql += `AND category_${catnum}s.id in (:catid) `;
        }

        if (content) {
            sql += 'AND questions.content LIKE :content ';
        }

        const questions = await models.sequelize.query(sql, {
            replacements: { catid: catid, content: `%${content}%` },
            type: models.sequelize.QueryTypes.SELECT,
        });

        return questions;
    },

    getQuestionById: async function (id) {
        const found = await models.question.scope('categories').findByPk(id);

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
                        join category_fours  on questions.category_four_id = category_fours.id 
                        join category_threes on category_fours.parent_id   = category_threes.id
                        join category_twos   on category_threes.parent_id  = category_twos.id
                        join category_ones   on category_twos.parent_id    = category_ones.id
                        JOIN 
                            (SELECT (RAND() * (SELECT MAX(id) FROM questions)) AS id) AS tmp 
                                             on questions.id              >= tmp.id
                    where 1 = 1 `;

        if (catnum && catid) {
            sql += `AND category_${catnum}s.id in (:catid) `;
        }

        const question = await models.sequelize.query(
            `${sql} ORDER BY questions.id ASC LIMIT 1`,
            {
                replacements: { catid: catid },
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
                        join category_fours  on questions.category_four_id = category_fours.id 
                        join category_threes on category_fours.parent_id   = category_threes.id
                        join category_twos   on category_threes.parent_id  = category_twos.id
                        join category_ones   on category_twos.parent_id    = category_ones.id
                        JOIN (SELECT id FROM questions ORDER BY RAND() LIMIT :limit) as tmp ON questions.id=tmp.id
                    where
                        1 = 1 `;

        if (catnum && catid) {
            sql += `AND category_${catnum}s.id in (:catid) `;
        }

        if (!limit) {
            limit = 40;
        }

        const question = await models.sequelize.query(sql, {
            replacements: { catid: catid, limit: parseInt(limit, 10) },
            type: models.sequelize.QueryTypes.SELECT,
        });

        return question;
    },

    createQuestion: async function (body) {
        const { categoryFourId } = body;

        const categoryFour = await models.category_four.findByPk(
            categoryFourId,
        );
        if (!categoryFour) {
            throw new AppError(
                httpStatus.UNPROCESSABLE_ENTITY,
                'This categoryFourId does not match any category.',
                true,
            );
        }

        // Insert new category
        const question = await models.question.create(body);

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
        question.set(body);
        const updated = await question.save();

        delete question.dataValues.categoryFour;
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
