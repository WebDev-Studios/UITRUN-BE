module.exports = (sequelize, Sequelize) => {
    class Board extends Sequelize.Model {}

    Board.init(
        {
            userId: {
                type: Sequelize.STRING(50),
                primaryKey: true,
                unique : true,
                allowNull : false,
            },
            startTime: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            finishTime: { 
                type: Sequelize.DATE, 
                allowNull: true 
            },
            score: {
                type: Sequelize.INTEGER,
                allowNull: false,
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
     * -------------- ASSOSIATION ----------------
     */

    Board.associate = function (models) {
        Board.belongsTo(models.user, {
            foreignKey: 'userId',
            as: 'user',
            onDelete: 'CASCADE',
        });
    };

    return Board;
};