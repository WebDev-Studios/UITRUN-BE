module.exports = (sequelize, Sequelize) => {
    class SavedQuestion extends Sequelize.Model {}

    SavedQuestion.init(
        {},
        {
            sequelize,
            modelName: 'saved_question',
            timestamps: true,
            underscored: true, //  Set the field option on all attributes to the snake_case version of its name
        },
    );

    /**
     * -------------- ASSOSIATION ----------------
     */

    SavedQuestion.associate = function (models) {
        SavedQuestion.belongsTo(models.user);
        SavedQuestion.belongsTo(models.question);

        /**
         * -------------- SCOPE ----------------
         */
    };

    return SavedQuestion;
};
