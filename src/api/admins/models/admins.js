/* eslint-disable no-param-reassign */
/* CREATE TABLE "User" (
    "id" int PRIMARY KEY AUTO_INCREMENT,
    "idStudent" nvarchar(50) NOT NULL,
    "name" text NOT NULL,
    "dateOfBirth" datetime NOT NULL,
    "major" text NOT NULL,
    "email" text NOT NULL,
    "userName" text NOT NULL,
    "passWord" text NOT NULL,
    "idRole" int NOT NULL
); */

const crypt = require('../../../common/crypto/utils');

module.exports = (sequelize, Sequelize) => {
    class Admin extends Sequelize.Model {}

    Admin.init(
        {
            username: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: {
                    args: true,
                    msg: 'User with this username already exist.',
                },
            },
            password: {
                type: Sequelize.STRING(255),
                allowNull: false,
            }
        },
        {
            sequelize,
            modelName: 'admin',
            timestamps: true,
            underscored: true,
        },
    );

    /**
     * -------------- ASSOSIATION ----------------
     */

    Admin.associate = function (models) {
        
        Admin.hasOne(models.password_reset_token, {
            foreignKey: {
                unique: true,
                allowNull: false,
            },
        });


        /**
         * -------------- SCOPES ---------------
         */

        Admin.addScope('role', {
            include: [
                {
                    model: models.role,
                    as: 'role',
                    required: true,
                    attributes: {
                        exclude: ['id', 'description'],
                    },
                },
            ],
        });
        Admin.addScope('token', {
            include: [
                {
                    model: models.password_reset_token,
                    required: true,
                    attributes: {
                        exclude: ['id', 'userId'],
                    },
                },
            ],
        });
    };

    /**
     * -------------- HOOKS ----------------
     */

    function encryptPasswordIfChanged(user, options) {
        if (user.changed('password')) {
            const hashedPassword = crypt.genPassword(user.get('password'));
            user.password = hashedPassword;
        }
    }

    Admin.beforeCreate(encryptPasswordIfChanged);
    Admin.beforeUpdate(encryptPasswordIfChanged);

    /**
     * -------------- INSTANCE METHOD ----------------
     */

    Admin.prototype.validPassword = function (password) {
        return crypt.validPassword(password, this.password);
    };

    /**
     * -------------- CLASS METHOD ----------------
     */

    Admin.validateUserCredentials = async function (credentials, role) {
        const { username, password } = credentials;

        const user = await Admin.findOne({ where: { username } });

        if (
            user &&
            user.validPassword(password)
        ) {
            return user;
        }

        return null;
    };

    return Admin;
};
