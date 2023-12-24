

const { Sequelize, DataTypes } = require('sequelize');

const User = Sequelize.define('User', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
    nickname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    roomID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    chips: {
        type: DataTypes.INTEGER,
        defaultValue: 1000,
    },
    image: {
        type: DataTypes.STRING,
        defaultValue: './img/user.png',
    },
});

module.exports = User;
