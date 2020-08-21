module.exports = (sequelize, Sequelize) => {
    class Roles extends Sequelize.Model {}

    Roles.init(
        {
            name: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
            },
            description: {
                type: Sequelize.STRING(255),
            },
        },
        {
            sequelize,
            modelName: 'role',
            timestamps: false,
            underscored: true,
        },
    );

    /**
     * -------------- ASSOSIATION ----------------
     */

    Roles.associate = function (models) {
        Roles.hasMany(models.admin, {
            foreignKey: 'roleId',
            as: 'role',
        });
    };

    return Roles;
};
