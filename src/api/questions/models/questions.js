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
    class Questions extends Sequelize.Model {}

    Questions.init(
        {
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            answerA: { type: Sequelize.TEXT, allowNull: false },
            answerB: { type: Sequelize.TEXT, allowNull: false },
            answerC: { type: Sequelize.TEXT, allowNull: false },
            answerD: { type: Sequelize.TEXT, allowNull: false },
            result: {
                type: Sequelize.ENUM({
                    values: ['A', 'B', 'C', 'D'],
                }),
                allowNull: false,
            },
            image: { type: Sequelize.STRING(255) },
            description: { type: Sequelize.STRING(255) },
            isShuffle: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'question',
            timestamps: false,
            underscored: true, //  Set the field option on all attributes to the snake_case version of its name
        },
    );
    return Questions;
};
