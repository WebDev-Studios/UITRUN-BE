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
            isDidExam: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
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

    // User.associate = function (models) {
    //     User.hasOne(models.board, {
    //         foreignKey: {
    //             unique: true,
    //             allowNull: false,
    //         },
    //     });
    // };

    /**
     * -------------- INSTANCE METHOD ----------------
     */

    /**
     * -------------- CLASS METHOD ----------------
     */

    User.validateUserCredentials = async function (credentials) {
        const { userCode } = credentials;

        const user = await User.findOne({ where: { userCode } });

        if (user) {
            return user;
        }

        return null;
    };

    return User;
};
