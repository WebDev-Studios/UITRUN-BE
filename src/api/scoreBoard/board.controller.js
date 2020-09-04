const boardService = require('./board.service');

module.exports = {
    getScore: async (req, res, next) => {
        try {
            const score = await boardService.getScore();
            res.json(score);
        } catch (error) {
            next(error);
        }
    },
    getScoreById: async (req, res, next) => {
        try {
            const score = await boardService.getScoreById(req.params.id);
            res.json(score);
        } catch (error) {
            next(error);
        }
    },
    insertNewUser: async (req, res, next) => {
        try {
            const user = await boardService.insertNewUser(req.params.id);
            res.json(user);
        } catch (error) {
            next(error);
        }
    },
};
