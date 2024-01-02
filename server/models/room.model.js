const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Room = sequelize.define('rooms', {
    room_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    user1_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },    
    user2_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    user3_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    user4_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    user5_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    game_state: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});


module.exports = Room;
