const userService = require('./user.service');

module.exports = {
    // FOR USER ONLY

    whoAmI: async (req, res, next) => {
        try {
            const { id } = req.user;
            const user = await userService.whoAmI(id);

            res.json(user);
        } catch (error) {
            next(error);
        }
    },

    updateUserFirstLoginById: async (req, res, next) => {
        try {
            const { id } = req.user;
            const user = await userService.updateUserFirstLoginById(
                id,
                req.body,
            );

            res.json(user);
        } catch (error) {
            next(error);
        }
    },

    // ----- FOR ADMIN ONLY ------------------

    getAllUser: async (req, res, next) => {
        try {
            const user = await userService.getAllUser();

            // delete user.dataValues.role;
            // delete user.dataValues.roleId;
            // delete user.dataValues.isActive;
            // delete user.dataValues.id;

            return res.json(user);
        } catch (error) {
            next(error);
        }
    },

    getUserById: async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(id);

            delete user.dataValues.role;
            delete user.dataValues.roleId;
            delete user.dataValues.isActive;
            delete user.dataValues.id;

            res.json(user);
        } catch (error) {
            next(error);
        }
    },

    deleteUserById: async (req, res, next) => {
        try {
            const { id } = req.params;
            const affected = await userService.deleteUserById(id);

            res.json({ affected });
        } catch (error) {
            next(error);
        }
    },

    updateUserById: async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await userService.updateUserById(id, req.body);

            res.json(user);
        } catch (error) {
            next(error);
        }
    },

    // ------------------ NOT USE ---------------------

    activateUserByIds: async (req, res, next) => {
        try {
            const { ids } = req.body;
            const activated = await userService.activateUserByIds(ids);

            res.json({ activated });
        } catch (error) {
            next(error);
        }
    },

    updateUserRoleById: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { role } = req.body;
            const granted = await userService.updateUserRoleById(id, role);

            res.json({ granted });
        } catch (error) {
            next(error);
        }
    },

};
