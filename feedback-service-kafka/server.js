const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const feedbackRoutes = require('./routes/feedbackRoutes');
app.use('/api', feedbackRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connecté (feedback)');
  app.listen(process.env.PORT, () =>
    console.log(`Feedback Service démarré sur le port ${process.env.PORT}`)
  );
}).catch(err => console.error('Erreur MongoDB:', err));
