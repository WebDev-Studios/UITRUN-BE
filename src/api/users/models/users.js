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
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'user',
            timestamps: true,
            underscored: true,
        },
    );

    User.associate = function (models) {

        User.hasOne(models.board, {
            foreignKey: {
                unique: true,
                allowNull: false,
            },
        });
    }

    return User;
}