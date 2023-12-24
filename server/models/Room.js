// models/room.js
const { Sequelize, DataTypes } = require('sequelize');

const Room = Sequelize.define('Room', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    
    hostName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Room;
