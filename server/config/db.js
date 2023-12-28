// const { Sequelize, DataTypes } = require('sequelize');
// const RoomModel = require('../models/Room');
// const UserModel = require('../models/User');

// const sequelize = new Sequelize({
//   dialect: 'mysql',
//   host: '127.0.0.1',
//   username: 'Andrii',
//   password: 'Andrii',
//   database: 'Poker',
// });

// const Room = RoomModel(sequelize, DataTypes);
// const User = UserModel(sequelize, DataTypes);


// Room.hasMany(User, { foreignKey: 'roomID' });
// User.belongsTo(Room, { foreignKey: 'roomID' });

// sequelize.authenticate()
//   .then(() => {
//     console.log('Database synchronized');
//   })
//   .catch((err) => {
//     console.error('Error synchronizing the database:', err);
//   });

// module.exports = { Room, User, sequelize};
