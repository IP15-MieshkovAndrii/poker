// models/room.js
const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db')

// const Room = sequelize.define('Room', {
//     id: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//         primaryKey: true,
//     },
    
//     hostName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
// });

const Room = {}

module.exports = Room;
