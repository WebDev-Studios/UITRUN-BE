const models = require('../../models');
const adminServices = require('../admins/admin.service');
const userServices = require('../users/user.service');
const userCodes = require('../users/user.codes');
const { issueJWT } = require('../../common/crypto/utils');
const AppError = require('../../common/error/error');
const { httpStatus } = require('../../common/error/http-status');

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

            // If account banned by admin
            if (!info.isActive) {
                throw new AppError(
                    httpStatus.FORBIDDEN,
                    'This account has been banned yet.',
                    true,
                );
            }

            const jwt = issueJWT(info.id);

            return {
                user: { userCode: info.userCode },
                token: jwt.token,
                exprires: jwt.expires,
            };
        }
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

        const jwt = issueJWT(info.id);

            return {
                user: { username: info.username },
                token: jwt.token,
                exprires: jwt.expires,
            };
        }
    },

};
