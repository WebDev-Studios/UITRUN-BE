module.exports = (sequelize, Sequelize) => {
    class PasswordResetToken extends Sequelize.Model {}

    PasswordResetToken.init(
        {
            token: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            expires: { type: Sequelize.DATE },
        },
        {
            sequelize,
            modelName: 'password_reset_token',
            timestamps: false,
            underscored: true, //  Set the field option on all attributes to the snake_case version of its name
        },
    );

    /**
     * -------------- ASSOSIATION ----------------
     */

    PasswordResetToken.associate = function (models) {
        PasswordResetToken.belongsTo(models.user, { onDelete: 'CASCADE' });
    };

    return PasswordResetToken;
};
