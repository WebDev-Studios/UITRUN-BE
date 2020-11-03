const models = require('../../models');
const AppError = require('../../common/error/error');
const { httpStatus } = require('../../common/error/http-status');

module.exports = {
    getScoreById: async (id) => {
        const score = await models.board.findByPk(id);

        return score;
    },
    getScore: async () => {
        const sql = `select
                        users.std_id,
                        users.full_name,
                        boards.score,
                        boards.time_client as 'time'
                    from 
                        boards join users on boards.user_id = users.id `;
        const score = await models.sequelize.query(sql, {
            type: models.sequelize.QueryTypes.SELECT,
        });
        return score;
    },
    getScoreFull: async () => {
        const sql = `select
                        users.std_id as "mssv",
                        users.full_name as "name",
                        users.history_ques as 'questions',
                        users.history_anss as 'list_anss_returned',
                        boards.score as 'score',
                        boards.time_client as 'client_submited_at',
                        boards.time_server as 'server_saved_at,
                        boards.time_start_exam as 'exam_started_at'
                    from 
                        boards join users on boards.user_id = users.id `;
        const score = await models.sequelize.query(sql, {
            type: models.sequelize.QueryTypes.SELECT,
        });
        return score;
    },
    
    insertNewUser: async (id) => {
        const olduser = await models.board.findByPk(id);
        if (olduser) return olduser;
        const user = await models.board.create({
            userId: id,
            score: 0,
            timeClient: 0,
            timeServer: 0,
        });
        return user;
    },
    updateScore: async (id, score, timeClient, timeServerEnd) => {
        const user = await models.board.findByPk(id);
        const timeServerStart = new Date(user.timeStartExam);
        let timeClientServer = (timeServerEnd - timeServerStart.getTime()) / 1000;
        timeClientServer = timeClientServer < 0 ? 0 : timeClientServer;
        timeClientServer = timeClientServer > 900 ? 900 : timeClientServer;
        user.score = (timeClient > 900 || timeClient < 0) ? -1*score : score;
        user.timeClient = timeClient;
        user.timeServer = timeClientServer;
        console.log(`[%]----- User with id "${id}" has submited exam with client/server time: ${timeClient} / ${timeClientServer} (s)`);
        const updated = await user.save();

        delete updated.dataValues.timeServer;

        return updated;
    },
    updateTimeStartExam: async (id) => {
        const user = await models.board.findByPk(id);
        user.timeStartExam = new Date();
        const updated = await user.save();

        delete updated.dataValues.timeServer;
        delete updated.dataValues.timeClient;
        delete updated.dataValues.timeStartExam;
        delete updated.dataValues.score;

        return updated;
    },

    deleteResultByUserId: async function (id) {
        const deleted = await models.board.destroy({
            where: {
                userId: id,
            },
        });

        if (deleted === 0) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                'No results found to delete.',
                true,
            );
        }

        return deleted;
    },
};