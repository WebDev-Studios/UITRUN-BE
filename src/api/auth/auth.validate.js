/* eslint-disable no-param-reassign */
const Joi = require('@hapi/joi');
const { schemaValidator } = require('../../common/schema-validator/utils');

const loginUserSchema = Joi.object({
    userCode: Joi.string().min(5).max(5).required(),
}).unknown(true);
const loginAdminSchema = Joi.object({
    username: Joi.string().min(1).max(255).required(),
    password: Joi.string().min(1).max(255).required(),
}).unknown(true);


module.exports = {
    // Use for login
    validateUserLogin: function (req, res, next) {
        try {
            schemaValidator(loginUserSchema, req.body);

            next();
        } catch (err) {
            next(err);
        }
    },
    validateAdminLogin: function (req, res, next) {
        try {
            schemaValidator(loginAdminSchema, req.body);

            next();
        } catch (err) {
            next(err);
        }
    },
};
