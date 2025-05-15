const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const runConsumer = require('./kafka/consumer');

const app = express();
const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log(`Notification Service en écoute sur le port ${PORT}`);
  runConsumer(); // Démarre le consommateur Kafka
});
