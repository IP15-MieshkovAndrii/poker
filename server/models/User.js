

const {DataTypes } = require('sequelize');
const {sequelize} = require('../config/db')

// const User = sequelize.define('User', {
//     id: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//         primaryKey: true,
//       },
//     nickname: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     roomID: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     chips: {
//         type: DataTypes.INTEGER,
//         defaultValue: 1000,
//     },
//     image: {
//         type: DataTypes.STRING,
//         defaultValue: './img/user.png',
//     },
// });

const User = {};

module.exports = User;
