const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const studentRoutes = require('./routes/studentRoutes');
app.use('/api', studentRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connecté');
  app.listen(process.env.PORT, () =>
    console.log(`User Service démarré sur le port ${process.env.PORT}`)
  );
}).catch(err => console.error('Erreur MongoDB:', err));


