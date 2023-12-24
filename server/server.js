const http = require('http')
const WebSocket = require('ws');
const socketHandler = require('./sockets/socketHandler');
const router = require('./routes/router')
require('dotenv').config();

const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || '127.0.0.1'

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`${router({ req, res })}`)
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
});

server.on('error', err => {
  if (err.code === 'EACCES') {
    console.log(`No access to port: ${port}`);
  }
});

const ws = new WebSocket.Server({ server });

socketHandler(ws);
