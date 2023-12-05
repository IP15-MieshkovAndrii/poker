const Room = require('../models/Room');

exports.createRoom = async (req, res) => {
  try {
    const { roomName, password, hostName } = req.body;

    if (!roomName || !password || !hostName) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const existingRoom = await Room.findOne({ $or: [{ roomName }, { roomID: generateRoomID() }] });

    if (existingRoom) {
        res.status(202).send("Such room already exist");
    }

    const newRoom = new Room({ roomID: generateRoomID(), roomName, password, hostName });
    await newRoom.save();

    res.status(201).json(newRoom);

  } catch (error) {

    console.error('Error:', error);
    res.status(500).send('Internal Server Error');

  }
};

function generateRoomID() {
    return Math.random().toString(36).substring(7);
  }
