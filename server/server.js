const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
const io = require('socket.io')
const http = require('http')
const ws = require("ws");
const socketHandler = require('./sockets/socketHandler');

require('dotenv').config();

const app = express();

const httpServer = http.createServer(app)

const PORT = process.env.PORT || 3000;
// const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:8080';

connectDB();

const socketServer = io(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  wsEngine: ws.Server,
});

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

app.use('/rooms', require('./routes/rooms'));


mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})

socketHandler(socketServer);


