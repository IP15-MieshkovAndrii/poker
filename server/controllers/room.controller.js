const { v4: uuidv4 } = require('uuid');
const { respondWithJSON, respondWithError,  responseWithText} = require('../routes/responses');
const Room = require('../models/room.model');
const sequelize = require('../config/db');

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


        sequelize.sync().then(() => {
          console.log('Room table created successfully!');
      
          Room.create({
              room_id: id,
              user1_id: hostName,
              game_state:'waiting',
          }).then(res => {
              console.log(res)
          }).catch((error) => {
              console.error('Failed to create a new record : ', error);
          });
      
        }).catch((error) => {
            console.error('Unable to create table : ', error);
        });


      respondWithJSON(res, 201, {id});
    } catch (error) {
        return respondWithError(res, 500, 'Internal Server Error');
    }
  });
};

exports.joinRoom = async (req, res) => {
  let data = '';
      
  req.on('data', (chunk) => {
      data += chunk;
  });

  req.on('end', () => {
    try {

        const { roomID, userID } = JSON.parse(data);
        console.log("Hi: ",roomID, userID, "--------------------")
        sequelize.sync().then(() => {
          console.log('Room table created successfully!');
          
          Room.findOne({
            where: {
              room_id: roomID
            }
          }).then(room => {
            if (room) {
              if (!room.user1_id) {
                  room.update({ user1_id: userID });
                  return responseWithText(res, 200, "User joined room successfully");
              } else if (!room.user2_id) {
                  room.update({ user2_id: userID });
                  return responseWithText(res, 200, "User joined room successfully");
              } else if (!room.user3_id) {
                  room.update({ user3_id: userID });
                  return responseWithText(res, 200, "User joined room successfully");
              } else if (!room.user4_id) {
                  room.update({ user4_id: userID });
                  return responseWithText(res, 200, "User joined room successfully");
              } else if (!room.user5_id) {
                  room.update({ user5_id: userID });
                  return responseWithText(res, 200, "User joined room successfully");
              } else {
                return respondWithError(res, 409, 'No more places in the room');
              }
            } else {
              return respondWithError(res, 404, 'Room does not exist');
          }
          }).catch((error) => {
            console.error('Failed to create a new record : ', error);
          });
      
        }).catch((error) => {
            console.error('Unable to create table : ', error);
        });

    } catch (error) {
        return respondWithError(res, 500, 'Internal Server Error');
    }
  });


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

