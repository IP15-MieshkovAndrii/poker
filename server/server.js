const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
const socketIO = require('socket.io')
const http = require('http')

require('dotenv').config();

const app = express();

const httpServer = http.createServer(app)

const PORT = process.env.PORT || 3000;
// const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:8080';

connectDB();

const socketServer = socketIO(httpServer, {
  cors: {
    origin: '*',
  }
})

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json({extended: false}));

app.use('/rooms', require('./routes/rooms'));


mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
