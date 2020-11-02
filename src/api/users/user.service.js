/* eslint-disable camelcase */
const models = require('../../models');
const AppError = require('../../common/error/error');
const { httpStatus } = require('../../common/error/http-status');
const { rolesMap } = require('./role.enum');

module.exports = {
    whoAmI: async function (id) {
        const user = await this.getUserById(id);

        delete user.dataValues.password;
        delete user.dataValues.historyQues;
        delete user.dataValues.historyAnss;
        delete user.dataValues.roleId;
        delete user.dataValues.role;
        delete user.dataValues.id;

        return user;
    },
    /* ================== FOR QUESTIONS ================== */
    isUserNotHaveInfo: async function (id) {
        const user = await this.getUserById(id);
        return user.fullName === '' || user.stdId === '';
    },
    isUserStartedExam: async function (id) {
        const user = await this.getUserById(id);
        return user.historyQues !== '';
    },
    isUserSubmitedExam: async function (id) {
        const user = await this.getUserById(id);
        return user.historyAnss !== '';
    },
    getHistoryQuestions: async function (id) {
        const user = await this.getUserById(id);
        return user.historyQues;
    },
    updateHistoryQuestions: async function (id, questions) {
        const user = await models.user.update(
            {
                historyQues: questions,
            },
            {
                where: {
                    id: id,
                },
            },
        );
        return user;
    },
    updateHistoryAnss: async function (id, anss) {
        const user = await models.user.update(
            {
                historyAnss: anss,
            },
            {
                where: {
                    id: id,
                },
            },
        );
        return user;
    },

    // All function below is for USER only
    createUser: async function (userCode) {
        const user = await models.user.create({
            userCode: userCode,
            stdId: '',
            fullName: '',
            numberPhone: '',
            roleId: rolesMap.user, // user role
        });

        return user;
    },

    updateUserFirstLoginById: async function (id, body) {
        const user = await this.getUserById(id);
        if (user.fullName !== '' || user.stdId !== '') {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'This user has been updated.',
                true,
            );
        }
        user.set(body);
        const updated = await user.save();

        delete updated.dataValues.roleId;
        delete updated.dataValues.role;
        delete updated.dataValues.id;

        return updated;
    },

    // All function below is for ADMIN only

    updateUserById: async function (id, body) {
        const user = await this.getUserById(id);
        user.set(body);
        const updated = await user.save();

        delete updated.dataValues.roleId;
        delete updated.dataValues.role;
        delete updated.dataValues.id;

        return updated;
    },

    getUserById: async function (id) {
        const found = await models.user.scope('role').findByPk(id);

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
                [models.Sequelize.Op.or]: [{ stdId: identifier }],
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
    resetResultByCode: async function (code) {
        const user = await models.user.findOne({
            where: {
                userCode: code,
            },
        });
        if (!user) return null;
        user.historyQues = '';
        user.historyAnss = '';
        const updated = await user.save();
        return updated;
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
        const info = await models.user.findAll({
            where: {
                roleId: [rolesMap.user, rolesMap.editor],
            },
        });
        return info;
    },

    activeUserByIds: async function (ids) {
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
    banUserByIds: async function (ids) {
        const activated = await models.user.update(
            {
                isActive: false,
            },
            {
                where: {
                    id: ids,
                },
            },
        );

        return activated;
    },

    /* ------------- NOT USE ------------------ */

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
