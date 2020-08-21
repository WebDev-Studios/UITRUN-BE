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
    class QuestionsV2 extends Sequelize.Model {}

    QuestionsV2.init(
        {
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            image: { type: Sequelize.STRING(255) },
            description: { type: Sequelize.STRING(255) },
        },
        {
            sequelize,
            modelName: 'question_v2',
            timestamps: false,
            underscored: true, //  Set the field option on all attributes to the snake_case version of its name
        },
    );

    QuestionsV2.associate = function (models) {
        QuestionsV2.hasMany(models.answer, {
            foreignKey: 'questionId',
            as: 'answers',
        });
    };

    return QuestionsV2;
};
