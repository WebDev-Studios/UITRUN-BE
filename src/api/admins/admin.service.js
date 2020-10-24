/* eslint-disable camelcase */
const models = require('../../models');
const AppError = require('../../common/error/error');
const { httpStatus } = require('../../common/error/http-status');
const { rolesMap } = require('./role.enum');
const userService = require('../users/user.service');

module.exports = {
    whoAmI: async function (id) {
        const user = await this.getUserById(id);

        delete user.dataValues.password;
        delete user.dataValues.roleId;
        delete user.dataValues.role;
        delete user.dataValues.id;

        return user;
    },

    // All function below is for USER only
    createUser: async function (body) {
        const user = await userService.createUser(body);

        return user;
    },

    updateUserById: async function (id, body) {
        const user = await this.getUserById(id);
        user.set(body);
        const updated = await user.save();

        delete updated.dataValues.password;
        delete updated.dataValues.roleId;
        delete updated.dataValues.role;
        delete updated.dataValues.id;

        return updated;
    },

    // All function below is for ADMIN only

    getUserById: async function (id) {
        const found = await models.user.findByPk(id);

        if (!found) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                'This user does not exist.',
                true,
            );
        }

        return found;
    },

    getUserByIdentifier: async function (identifier) {
        const user = await models.user.findOne({
            where: {
                [models.Sequelize.Op.or]: [
                    { userCode: identifier },
                    { stdId: identifier },
                ],
            },
        });

        if (!user) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                'User with this identifier does not exist.',
                true,
            );
        }

        return user;
    },

    deleteUserById: async function (id) {
        const deleted = await models.user.destroy({
            where: {
                id: id,
                roleId: [rolesMap.user, rolesMap.editor],
            },
        });

        if (deleted === 0) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                'This user does not exist.',
                true,
            );
        }

        return deleted;
    },

    getAllUser: async function () {
        const info = await models.user.findAll({});
        return info;
    },

    activateUserByIds: async function (ids) {
        const activated = await models.user.update(
            {
                isActive: true,
            },
            {
                where: {
                    id: ids,
                },
            },
        );

        return activated;
    },

    updateUserRoleById: async function (id, role) {
        const granted = await models.user.update(
            {
                roleId: rolesMap[role],
            },
            {
                where: {
                    id: id,
                },
            },
        );

        return granted;
    },
};
