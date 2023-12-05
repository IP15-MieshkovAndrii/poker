require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')

const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:8080';

connectDB();

app.use(cors({
  origin: CORS_ORIGIN,
}));

app.use(express.json());

app.use('/rooms', require('./routes/rooms'));


mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
