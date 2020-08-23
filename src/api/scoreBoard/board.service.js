const models = require('../../models');
const AppError = require('../../common/error/error');
const { httpStatus } = require('../../common/error/http-status');

module.exports = {
    getScore: async () => {
        const score = await models.board.findAll({});
        return score;
    },
    insertNewUser: async (id) => {
        const user = await models.board.create({
            userId: id,
            startTime: new Date(Date.now()),
            score: 0,
        });
        return user;
    },
    updateScore: async (id, score) => {
        const user = await models.board.update(
            {
                score: score,
                finishTime: new Date(Date.now()),
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
