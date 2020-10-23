const models = require('../../models');
const adminServices = require('../admins/admin.service');
const userServices = require('../users/user.service');
const userCodes = require('../users/user.codes');
const { issueJWT } = require('../../common/crypto/utils');
const AppError = require('../../common/error/error');
const { httpStatus } = require('../../common/error/http-status');
const { passwordResetEmail } = require('../../common/email/send');

module.exports = {
    register: async function (body) {
        const user = await adminServices.createUser(body);

        const jwt = issueJWT(user.id);

        return {
            user: { username: user.username },
            token: jwt.token,
            exprires: jwt.expires,
        };
    },

    login: async function (credentials, forRole) {
        console.log(forRole);
        if (forRole === 'user') {
            let info = await models.user.validateUserCredentials(
                credentials,
                forRole,
            );
            if (!info) {
                if (userCodes.includes(credentials.userCode)) {
                    info = await userServices.createUser(credentials.userCode);
                } else {
                    throw new AppError(
                        httpStatus.UNAUTHORIZED,
                        'Invalid User Code.',
                        true,
                    );
                }
            }

            const jwt = issueJWT(info.id);

            return {
                user: { 
                    userCode: info.userCode,
                    fullName: info.fullName,
                    numberPhone: info.numberPhone,
                    stdId: info.stdId,
                },
                token: jwt.token,
                exprires: jwt.expires,
            };
        }
        if (forRole === 'admin') {
            const info = await models.admin.validateUserCredentials(
                credentials,
            );
            if (!info) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    'Invalid Credentials.',
                    true,
                );
            }

            const jwt = issueJWT(info.id);

            return {
                user: { username: info.username },
                token: jwt.token,
                exprires: jwt.expires,
            };
        }
    },

    sendPasswordResetEmail: async function (body) {
        const { identifier } = body;

        const user = await adminServices.getUserByIdentifier(identifier);

        const psToken = await models.password_reset_token.upsert({
            userId: user.id,
            token: 'kkkkkkkkk',
            expires: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
        });

        await passwordResetEmail(user.email, psToken.token);

        return { message: 'Reset password email was sended.' };
    },
};
