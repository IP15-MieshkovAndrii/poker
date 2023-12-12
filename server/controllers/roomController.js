const generateToken = require('../config/generateToken');
const Room = require('../models/Room');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

exports.createRoom = async (req, res) => {
  try {
    const { hostName } = req.body;

    if (!hostName) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    let id = uuidv4();
    let existingRoom = await Room.findOne({ id });
    while (existingRoom) {
      id = uuidv4();
      existingRoom = await Room.findOne({ id });
    }

    const newRoom = new Room({id, hostName});
    await newRoom.save();

    const newUser = new User({nickname: hostName, roomID: id});
    await newUser.save();

    res.status(201).json({id, newUser});

  } catch (error) {

    console.error('Error:', error);
    res.status(500).send('Internal Server Error');

  }
};

exports.checkRoom = async (req, res) => {
  try {
    const { roomID, nickname } = req.body;

    if (!roomID) {
      return res.status(400).json({ error: 'Token is required in the request body.' });
    }

    const existingRoom = await Room.findOne({ id: roomID });

    if (existingRoom) {
      const newUser = new User({nickname, roomID: roomID});
      await newUser.save();

      res.status(200).json({ message: 'Room exists' });
    } else {
      res.status(201).json({ message: 'Room not found' });
    }

  } catch (error) {

    console.error('Error:', error);
    res.status(500).send('Internal Server Error');

  }
};

