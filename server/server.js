const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
const http = require('http')
const WebSocket = require('ws');
const socketHandler = require('./sockets/socketHandler');

require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;
const socketPort = process.env.SOCKET_PORT || 8000;

const httpServer = http.createServer(app)
const wsServer = new WebSocket.Server({ port: socketPort });

connectDB();

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

app.use('/rooms', require('./routes/rooms'));


mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
}).on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


httpServer.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (ws) => {
    wsServer.emit('connection', ws, request);
  });
});



socketHandler(wsServer);