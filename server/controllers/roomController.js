const generateToken = require('../config/generateToken');
const Room = require('../models/Room');

exports.createRoom = async (req, res) => {
  try {
    const { hostName } = req.body;

    if (!hostName) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    let id = generateRoomID();
    let existingRoom = await Room.findOne({ id });
    while (existingRoom) {
      id = generateRoomID();
      existingRoom = await Room.findOne({ id });
    }

    const newRoom = new Room({id, hostName});
    await newRoom.save();

    const token = generateToken(id);

    res.status(201).json({token});

  } catch (error) {

    console.error('Error:', error);
    res.status(500).send('Internal Server Error');

  }
};

function generateRoomID() {
    return Math.random().toString(36).substring(7);
  }
