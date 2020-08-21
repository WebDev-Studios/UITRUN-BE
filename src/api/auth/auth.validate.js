/* eslint-disable no-param-reassign */
const Joi = require('@hapi/joi');
const { schemaValidator } = require('../../common/schema-validator/utils');

const loginSchema = Joi.object({
    username: Joi.string().min(1).max(255).required(),
    password: Joi.string().min(1).max(255).required(),
}).unknown(true);

const registerSchema = Joi.object({
    username: Joi.string().min(6).max(255).required(),
    password: Joi.string()
        .min(6)
        .max(255)
        .regex(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
        .required(),
    stdId: Joi.string().min(6).max(255).required(),
    fullName: Joi.string().min(6).max(255).required(),
    major: Joi.string().min(6).max(255),
    email: Joi.string().min(6).max(255).email().required(),
    dateOfBirth: Joi.date().required(),
}).unknown(true);

module.exports = {
    // Use for login
    validateLogin: function (req, res, next) {
        try {
            schemaValidator(loginSchema, req.body);

            next();
        } catch (err) {
            next(err);
        }
    },

    // Use for register
    validateRegister: function (req, res, next) {
        try {
            schemaValidator(registerSchema, req.body);

            next();
        } catch (err) {
            next(err);
        }
    },
};
