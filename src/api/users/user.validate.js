/* eslint-disable prettier/prettier */
/* eslint-disable no-param-reassign */
const Joi = require('@hapi/joi');
const { schemaValidator } = require('../../common/schema-validator/utils');
const { rolesEnum } = require('./role.enum');

const rolesSchema = Joi.object({
    role: Joi.valid(...rolesEnum).required(),
}).unknown(true);

const idListSchema = Joi.object({
    ids: Joi.array().required().items(Joi.number()),
}).unknown(true);

const userUpdateSchema = Joi.object({
    stdId: Joi.string().min(6).max(255),
    fullName: Joi.string().min(6).max(255),
}).unknown(true);

module.exports = {
    validateUserUpdate: function (req, res, next) {
        try {
            schemaValidator(userUpdateSchema, req.body);

            delete req.body.id;
            delete req.body.roleId;
            delete req.body.isActive;

            next();
        } catch (err) {
            next(err);
        }
    },

    validateRoleUpdate: function (req, res, next) {
        try {
            schemaValidator(rolesSchema, req.body);

            next();
        } catch (err) {
            next(err);
        }
    },


    validateActivationUpdate: function (req, res, next) {
        try {
            schemaValidator(idListSchema, req.body);

            next();
        } catch (err) {
            next(err);
        }
    },
};
