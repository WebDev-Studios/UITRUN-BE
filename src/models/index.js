const Sequelize = require('sequelize');
const path = require('path');
const config = require('config').get('db');
const glob = require('glob');
const { rolesMap } = require('../api/admins/role.enum');

require('dotenv').config();

const db = {};

// Create connection
const sequelize = new Sequelize(
    process.env.DB_NAME || config.database,
    process.env.DB_USERNAME || config.username,
    process.env.DB_PASSWORD || config.password,
    {
        timezone: '+07:00',
        host: process.env.DB_HOST || config.host,
        dialect: 'mysql',
        logging: false,
    },
);

// Checking if connection is established
(async function connect() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        console.log(process.env.DB_NAME);
    }
})();

// Import all models from each api to database
glob.sync('api/**/models/*.js', {
    cwd: process.env.NODE_PATH || 'src',
}).forEach((file) => {
    const model = require(path.join(file))(sequelize, Sequelize);
    console.log(model);
    db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

(async function seeders() {
    try {
        await db.admin.create({
            username: process.env.ADMIN_USERNAME || 'admin',
            password: process.env.ADMIN_PASSWORD || '@V3ryStR0N9P@asSWorD',
            roleId: rolesMap.admin, // user role
            isActive: true,
        });

        console.log('Admin account was seeded.');
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            console.log('Admin accound already exist in database.');
        } else {
            console.log(err);
        }
    }
})();

module.exports = db;
