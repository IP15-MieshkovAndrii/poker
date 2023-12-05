const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  console.log(req.body);
  const newRoom = {
    roomName: req.body.roomName,
    password: req.body.password,
    hostName: req.body.hostName,
  };

  res.send(newRoom);
});

module.exports = router;
