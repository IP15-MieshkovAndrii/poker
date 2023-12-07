const generateToken = require('../config/generateToken');
const Room = require('../models/Room');
const jwt = require('jsonwebtoken');

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

exports.checkRoom = async (req, res) => {
  try {
    const { roomID } = req.body;
    const token = roomID

    if (!token) {
      return res.status(400).json({ error: 'Token is required in the request body.' });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const existingRoom = await Room.findOne({ id: decodedToken.id });
    if (existingRoom) {
      res.status(200).json({ message: 'Room exists' });
    } else {
      res.status(404).json({ error: 'Room not found' });
    }

  } catch (error) {

    console.error('Error:', error);
    res.status(500).send('Internal Server Error');

  }
};

function generateRoomID() {
    return Math.random().toString(36).substring(7);
  }
