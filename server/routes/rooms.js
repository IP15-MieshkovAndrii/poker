// const express = require('express');
// const router = express.Router();
// const roomController = require('../controllers/roomController');

// router.post('/', roomController.createRoom);
// router.post('/data', roomController.checkRoom);
// router.post('/hostname', roomController.getHost)

// module.exports = router;

const http = require('http');
const url = require('url');
const roomController = require('../controllers/roomController');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (req.method === 'POST' && parsedUrl.pathname === '/rooms') {
    roomController.createRoom(req, res);
  } else if (req.method === 'POST' && parsedUrl.pathname === '/rooms/data') {
    roomController.checkRoom(req, res);
  } else if (req.method === 'POST' && parsedUrl.pathname === '/rooms/hostname') {
    roomController.getHost(req, res);
  } else {
    sendResponse(res, 404, { error: 'Not Found' });
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

