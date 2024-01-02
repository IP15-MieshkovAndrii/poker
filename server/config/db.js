const Sequelize = require("sequelize");
require('dotenv').config();

const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const host = process.env.DATABASE_HOST;
const port = process.env.DATABASE_PORT;

const sequelize = new Sequelize(
    'Poker',
    username,
    password,
    {
        host,
        port,
        dialect: 'mysql'
    }
);

module.exports = sequelize;