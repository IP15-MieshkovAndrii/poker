const { v4: uuidv4 } = require('uuid');
const { respondWithJSON, respondWithError } = require('../routes/responses');



exports.createRoom = async (req, res) => {
  let data = '';
      
  req.on('data', (chunk) => {
      data += chunk;
  });

  req.on('end', () => {
    try {

        const { hostName } = JSON.parse(data);
        if (!hostName) {
            return respondWithError(res, 400, 'Need host!');
        }
        let id = uuidv4();
        respondWithJSON(res, 201, {id});
    } catch (error) {
        return respondWithError(res, 500, 'Internal Server Error');
    }
  });
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
