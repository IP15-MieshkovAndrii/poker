const express = require('express');
const app = express();
const cors = require('cors');
const roomRoute = require('./routes/roomRoutes'); 

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:8080',
}));

app.use(express.json());

app.use('/api/rooms', roomRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
