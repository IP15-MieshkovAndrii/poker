const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
    },

    roomID: {
        type: String,
        required: true,
    },
    chips: {
        type: Number,
        default: 1000,
    },
    image: {
        type: String,
        default: './img/user.png',
    }
});

const User = mongoose.model('User', roomSchema);

module.exports = User;