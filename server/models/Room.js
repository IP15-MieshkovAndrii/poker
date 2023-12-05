const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomID: {
        type: String,
        unique: true,
        required: true,
        },
    roomName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    hostName: {
        type: String,
        required: true,
    },
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
