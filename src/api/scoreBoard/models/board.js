/* eslint-disable prettier/prettier */

module.exports = (sequelize, Sequelize) => {
    class Board extends Sequelize.Model {}

    Board.init(
        {
            userId: {
                type: Sequelize.STRING(50),
                primaryKey: true,
                unique: true,
                allowNull: false,
            },
            score: {
                type: Sequelize.INTEGER,
                defaultValue: null,
                allowNull: true,
            },
            time: {
                type: Sequelize.INTEGER,
                defaultValue: null,
                allowNull: true,
            }
        },
        {
            sequelize,
            modelName: 'board',
            timestamps: false,
            underscored: true, //  Set the field option on all attributes to the snake_case version of its name
        },
    );

    /**
     * -------------- ASSOCIATION ----------------
     */
    
    Board.associate = function (models) {
        Board.belongsTo(models.user, {
            foreignKey: 'user_id',
            as: 'user',
            onDelete: 'CASCADE',
        });
    };
    

    return Board;
};
