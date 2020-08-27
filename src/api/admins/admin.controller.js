const adminService = require('./admin.service');

module.exports = {
    getAllUser: async (req, res, next) => {
        try {
            const user = await adminService.getAllUser();

            return res.json(user);
        } catch (error) {
            next(error);
        }
    },

    whoAmI: async (req, res, next) => {
        try {
            const { id } = req.user;
            const user = await adminService.whoAmI(id);

            res.json(user);
        } catch (error) {
            next(error);
        }
    },

    getUserById: async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await adminService.getUserById(id);

            res.json(user);
        } catch (error) {
            next(error);
        }
    },

    updateUserById: async (req, res, next) => {
        try {
            const { id } = req.user;
            const user = await adminService.updateUserById(id, req.body);

            res.json(user);
        } catch (error) {
            next(error);
        }
    },

    activateUserByIds: async (req, res, next) => {
        try {
            const { ids } = req.body;
            const activated = await adminService.activateUserByIds(ids);

            res.json({ activated });
        } catch (error) {
            next(error);
        }
    },

    updateUserRoleById: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { role } = req.body;
            const granted = await adminService.updateUserRoleById(id, role);

            res.json({ granted });
        } catch (error) {
            next(error);
        }
    },

    deleteUserById: async (req, res, next) => {
        try {
            const { id } = req.params;
            const affected = await adminService.deleteUserById(id);

            res.json({ affected });
        } catch (error) {
            next(error);
        }
    },

    createUser: async (req, res, next) => {
        try {
            const {userCode} = req.body;
            const user = await adminService.createUser(userCode);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
};
