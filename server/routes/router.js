// route.js
const roomController = require('./controllers/roomController');

function router(req, res) {

  const urlParts = req.url.split('/');
  const path = urlParts[1];

  switch (path) {
    case 'rooms':
      if (req.method === 'POST') {
        roomController.createRoom(req, res);
      } else {
        res.end('Invalid method for /rooms');
      }
      break;

    case 'room/data':
      if (req.method === 'POST') {
        roomController.checkRoom(req, res);
      } else {
        res.end('Invalid method for /rooms/data');
      }
      break;

    case 'room/hostname':
      if (req.method === 'POST') {
        roomController.getHost(req, res);
      } else {
        res.end('Invalid method for /rooms/hostname');
      }
      break;

    default:
      res.end('Not Found');
  }
}

module.exports = router;
