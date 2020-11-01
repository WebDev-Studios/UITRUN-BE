const models = require('../../models');
const AppError = require('../../common/error/error');
const { httpStatus } = require('../../common/error/http-status');

module.exports = {
    getScore: async () => {
        // const score = await models.board.findAll({});
        // return score;
        const sql = `select 
                        users.std_id,
                        users.full_name,
                        boards.score,
                        boards.time
                    from 
                        boards join users on boards.user_id = users.id `;
        const score = await models.sequelize.query(sql, {
            type: models.sequelize.QueryTypes.SELECT,
        });
        return score;
    },
    insertNewUser: async (id) => {
        const user = await models.board.create({
            userId: id,
            fullName: '',
            score: 0,
            time: 0,
        });
        return user;
    },
    updateScore: async (id, score, time) => {
        if (
            await models.board.findAll({
                where: {
                    userId: id,
                    score: {
                        [models.Sequelize.Op.ne]: 0,
                    },
                    time: {
                        [models.Sequelize.Op.ne]: 0,
                    },
                }
            })
        ) {
            // if yes -> return made exam
            throw new AppError(
                httpStatus.NOT_FOUND,
                'User is yet made this exam.',
                true,
            );
        }
        const user = await models.board.update(
            {
                score: score,
                time: time,
            },
            {
                where: {
                    userId: id,
                },
            },
        );
        return user;
    },
    getScoreById: async (id) => {
        const score = await models.board.findByPk(id);

        return score;
    },
};
