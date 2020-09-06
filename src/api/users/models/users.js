/* eslint-disable prettier/prettier */
module.exports = (sequelize, Sequelize) => {
    class User extends Sequelize.Model {}

    User.init(
        {
            userCode: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: {
                    args: true,
                    msg: 'User with this userCode already exist.',
                },
            },
            fullName: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            stdId: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            roleId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'user',
            timestamps: true,
            underscored: true,
        },
    );

    User.associate = function (models) {
        User.belongsTo(models.role, {
            foreignKey: 'roleId',
            as: 'role',
            // onDelete: 'SET NULL',
        });
        User.hasOne(models.board, {
            foreignKey: {
                unique: true,
                allowNull: false,
            },
        });
        /**
         * -------------- SCOPES ----------------
         */

        User.addScope('role', {
            include: [
                {
                    model: models.role,
                    as: 'role',
                    required: true,
                    attributes: {
                        exclude: ['id', 'description'],
                    },
                },
            ],
        });
    };
    /**
     * -------------- CLASS METHOD ----------------
     */

    User.validateUserCredentials = async function (credentials, role) {
        const { userCode } = credentials;
        const user = await User.scope('role').findOne({ where: { userCode } });
        if (user && user.role.name === role) {
            return user;
        }

        return null;
    };

    return User;
};
