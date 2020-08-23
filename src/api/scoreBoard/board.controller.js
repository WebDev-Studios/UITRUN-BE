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
};
