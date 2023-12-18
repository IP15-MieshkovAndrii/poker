// const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
const http = require('http')
const WebSocket = require('ws');
const socketHandler = require('./sockets/socketHandler');

require('dotenv').config();

// const app = express();

const PORT = process.env.PORT || 3000;
const socketPort = process.env.SOCKET_PORT || 8000;

// const httpServer = http.createServer(app)
// const wsServer = new WebSocket.Server({ port: socketPort });

connectDB();

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!\n');
});

const wsServer = new WebSocket.Server({ noServer: true });

// app.use(cors({
//   origin: true,
//   credentials: true,
// }));
// app.use(express.json());

// app.use('/rooms', require('./routes/rooms'));


mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
}).on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

// httpServer.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

server.listen(PORT, () => {
  console.log(`HTTP Server is running on port ${PORT}`);
});

wsServer.on('connection', (ws, req) => {
  // Handle WebSocket connections
  console.log('WebSocket connected:', req.url);
});

server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (ws) => {
    wsServer.emit('connection', ws, request);
  });
});


// httpServer.on('upgrade', (request, socket, head) => {
//   wsServer.handleUpgrade(request, socket, head, (ws) => {
//     wsServer.emit('connection', ws, request);
//   });
// });



socketHandler(wsServer);


