const models = require('../../models');
const AppError = require('../../common/error/error');
const { httpStatus } = require('../../common/error/http-status');

module.exports = {
    getScore: async (req, res, next) => {
        try {
            const score = null;
            res.json(score);
        } catch (error) {
            next(error);
        }
    },
    insertNewUser: async (id) => {
        
    },
    updateScore: async (id, score) =>{
        
    }

};
