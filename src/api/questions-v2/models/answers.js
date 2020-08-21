/* CREATE TABLE "questions" (
    "id" int(11) NOT NULL AUTO_INCREMENT,
    "question_content" text NOT NULL,
    "answer_A" text NOT NULL,
    "answer_B" text NOT NULL,
    "answer_C" text NOT NULL,
    "answer_D" text NOT NULL,
    "image" varchar(255) DEFAULT NULL,
    "description" varchar(255) DEFAULT NULL,
    "createdAt" datetime NOT NULL,
    "updatedAt" datetime NOT NULL,
    PRIMARY KEY ("id")
) */

module.exports = (sequelize, Sequelize) => {
    class Answer extends Sequelize.Model {}

    Answer.init(
        {
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            isResult: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            questionId: { type: Sequelize.INTEGER, allowNull: false },
        },
        {
            sequelize,
            modelName: 'answer',
            timestamps: false,
            underscored: true, //  Set the field option on all attributes to the snake_case version of its name
        },
    );

    Answer.associate = function (models) {
        Answer.belongsTo(models.question_v2, {
            foreignKey: 'questionId',
            as: 'answers',
            onDelete: 'CASCADE',
        });
    };

    return Answer;
};
