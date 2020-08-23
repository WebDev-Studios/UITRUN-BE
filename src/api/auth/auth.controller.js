const authService = require('./auth.service');

module.exports = {
    register: async function (req, res, next) {
        try {
            const DTO = await authService.register(req.body);

            res.json(DTO);
        } catch (err) {
            next(err);
        }
    },

    loginForUsers: async function (req, res, next) {
        try {
            console.log(` Controller data: ${req.body}`);
            const DTO = await authService.login(req.body, 'user'); // for users and editors

            res.json(DTO);
        } catch (err) {
            console.log(` Controller data - error: ${req.body}`);
            next(err);
        }
    },

    loginForAdmins: async function (req, res, next) {
        try {
            const DTO = await authService.login(req.body, 'admin'); // for admins and editors

            res.json(DTO);
        } catch (err) {
            next(err);
        }
    },

    sendPasswordResetEmail: async function (req, res, next) {
        try {
            const DTO = await authService.sendPasswordResetEmail(req.body);

            res.json(DTO);
        } catch (err) {
            next(err);
        }
    },

    resetPassword: async function (req, res, next) {
        try {
            const DTO = await authService.resetPassword(req.body);

            res.json(DTO);
        } catch (err) {
            next(err);
        }
    },
};
