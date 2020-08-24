/* eslint-disable prettier/prettier */
const models = require('../../models');
const userCodeArr = require('../users/user.code').userCodeArray;
const { createUser, getUserByIdentifier } = require('../admins/admin.service');
const { uCreateUser } = require('../users/user.service');
const { issueJWT } = require('../../common/crypto/utils');
const AppError = require('../../common/error/error');
const { httpStatus } = require('../../common/error/http-status');
const { passwordResetEmail } = require('../../common/email/send');
// const admin = require('../admins/models/admin');

module.exports = {
    register: async function (body) {
        const user = await createUser(body);

        const jwt = issueJWT(user.id);

        return {
            user: { username: user.username },
            token: jwt.token,
            exprires: jwt.expires,
        };
    },

    login: async function (credentials, forRole) {
        if (forRole === 'user') {
            let info = await models.user.validateUserCredentials(
                credentials,
                forRole,
            );
            if (!info) {
                console.log('UserCode not used');
                if (userCodeArr.includes(credentials.userCode)) {
                    info = await uCreateUser(credentials.userCode);
                } else {
                    throw new AppError(
                        httpStatus.UNAUTHORIZED,
                        'Invalid Credentials.',
                        true,
                    );
                }
            }
    
            // if (!info.isActive) {
            //     throw new AppError(
            //         httpStatus.FORBIDDEN,
            //         'This account hasn’t been activated yet.',
            //         true,
            //     );
            // }

            const jwt = issueJWT(info.id);

            return {
                user: { userCode: info.userCode },
                token: jwt.token,
                exprires: jwt.expires,
            };
        }
        if (forRole === 'admin') {
            const info = await models.admin.validateUserCredentials(
                credentials,
                forRole,
            );
            if (!info) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    'Invalid Credentials.',
                    true,
                );
            }
    
            // if (!info.isActive) {
            //     throw new AppError(
            //         httpStatus.FORBIDDEN,
            //         'This account hasn’t been activated yet.',
            //         true,
            //     );
            // }
    
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

        const user = await getUserByIdentifier(identifier);

        const psToken = await models.password_reset_token.upsert({
            userId: user.id,
            token: 'kkkkkkkkk',
            expires: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
        });

        await passwordResetEmail(user.email, psToken.token);

        return { message: 'Reset password email was sended.' };
    },
};
