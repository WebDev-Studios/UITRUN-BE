/* eslint-disable prettier/prettier */
const passport = require('passport');
const passportJWT = require('passport-jwt');
const config = require('config').get('jwt');

const models = require('../../models');
const AppError = require('../../common/error/error');
const { httpStatus } = require('../../common/error/http-status');

const { ExtractJwt } = passportJWT;
const { Strategy } = passportJWT;
const params = {
    secretOrKey: process.env.JWT_SECRET || config.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

module.exports = function () {
    /**
     * -------------- PASSPORT STRATEGY ----------------
     */

    const strategy = new Strategy(params, async (payload, done) => {
        try {
            const admin = await models.admin.scope('role').findByPk(payload.sub);
            const user = await models.user.scope('role').findByPk(payload.sub);
            
            const info = admin || user;

            if (info) {
                return done(null, {
                    id: info.id,
                    role: info.role.name,
                    isActive: info.isActive,
                });
            }

            return done(null, false);
        } catch (err) {
            return done(err, false);
        }
    });

    passport.use(strategy);

    return {
        /**
         * -------------- PASSPORT INITIALIZE ----------------
         */

        initialize: function () {
            return passport.initialize();
        },

        /**
         * -------------- PASSPORT AUTHENTICATE MIDDLEWARES ----------------
         */

        authenticate: function (req, res, next) {
            return passport.authenticate(
                'jwt',
                config.session,
                (err, user, info) => {
                    if (err) {
                        return next(err);
                    }
                    if (!user) {
                        return next(
                            new AppError(
                                httpStatus.UNAUTHORIZED,
                                'Invalid Credentials.',
                                true,
                            ),
                        );
                    }
                    if (!user.isActive) {
                        throw new AppError(
                            httpStatus.FORBIDDEN,
                            'This account hasn’t been activated yet.',
                            true,
                        );
                    }

                    req.user = user;
                    return next();
                },
            )(req, res, next);
        },
    };
};
