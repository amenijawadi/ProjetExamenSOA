/*const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const produceFeedback = require('../kafka/producer');

// Ajouter un feedback et le publier sur Kafka
router.post('/feedbacks', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    
    // Envoyer à Kafka
    await produceFeedback(feedback);



    res.status(201).json(feedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Voir tous les feedbacks
router.get('/feedbacks', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
*/



const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const produceFeedback = require('../kafka/producer');

router.post('/feedbacks', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();

    await produceFeedback(feedback);  // Kafka + Logstash en un seul appel

    res.status(201).json(feedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/feedbacks', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
