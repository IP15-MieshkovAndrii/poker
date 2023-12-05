const express = require('express');
const app = express();

app.post('/api/rooms', (req, res) => {
    const newRoom = {
      id: generateRoomId(),
      roomName: req.body.roomName,
      hostName: req.body.hostName,
    };
  
    res.json(newRoom);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function generateRoomId() {
    return Math.random();
}