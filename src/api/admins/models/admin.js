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
    class Admins extends Sequelize.Model {}

    Admins.init(
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
            },
            roleId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
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

    Admins.associate = function (models) {
        Admins.belongsTo(models.role, {
            foreignKey: 'roleId',
            as: 'role',
            // onDelete: 'SET NULL',
        });
        Admins.hasOne(models.password_reset_token, {
            foreignKey: {
                unique: true,
                allowNull: false,
            },
        });

        /**
         * -------------- SCOPES ----------------
         */

        Admins.addScope('role', {
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

        Admins.addScope('token', {
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

    Admins.beforeCreate(encryptPasswordIfChanged);
    Admins.beforeUpdate(encryptPasswordIfChanged);

    /**
     * -------------- INSTANCE METHOD ----------------
     */

    Admins.prototype.validPassword = function (password) {
        return crypt.validPassword(password, this.password);
    };

    /**
     * -------------- CLASS METHOD ----------------
     */

    Admins.validateUserCredentials = async function (credentials, role) {
        const { username, password } = credentials;
        const user = await Admins.scope('role').findOne({
            where: { username },
        });
        if (
            user &&
            user.validPassword(password) && // password is validated
            (user.role.name === 'admin' || user.role.name === 'editor')
        ) {
            return user;
        }

        return null;
    };

    return Admins;
};
