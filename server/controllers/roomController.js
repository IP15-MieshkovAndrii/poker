const { v4: uuidv4 } = require('uuid');
const { Room, User } = require('../models/db');

exports.createRoom = async (req, res) => {
  try {
    const { hostName } = req.body;

    if (!hostName) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    let id = uuidv4();
    let existingRoom = await Room.findOne({ where: { id } });
    while (existingRoom) {
      id = uuidv4();
      existingRoom = await Room.findOne({ where: { id } });
    }

    const newRoom = await Room.create({ id, hostName });
    const newUser = await User.create({ nickname: hostName, roomID: id });

    res.status(201).json({ id, newUser });

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

    const existingRoom = await Room.findOne({ where: { id: roomID } });

    if (existingRoom) {
      const newUser = await User.create({ nickname, roomID: roomID });
      res.status(200).json({ message: 'Room exists' });
    } else {
      res.status(201).json({ message: 'Room not found' });
    }

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getHost = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Token is required in the request body.' });
    }

    const room = await Room.findOne({ where: { id } });
    res.status(200).json({ hostname: room.hostName });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
};
