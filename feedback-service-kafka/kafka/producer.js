/*
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'feedback-service',
  brokers: ['192.168.1.21:9092']
});

const producer = kafka.producer();

const produceFeedback = async (feedback) => {
  await producer.connect();
  await producer.send({
    topic: 'feedback-topic',
    messages: [
      { value: JSON.stringify(feedback) }
    ]
  });
  console.log('Message Kafka envoyé:', feedback);

  await producer.disconnect();
};

module.exports = produceFeedback;
*/






const { Kafka } = require('kafkajs');
const net = require('net');

// === KAFKA ===
const kafka = new Kafka({
  clientId: 'feedback-service',
  brokers: ['10.99.7.136:9092']
});

const producer = kafka.producer();

// === LOGSTASH ===
const sendToLogstash = (feedback) => {
  // Convertir en objet JavaScript pur si c’est un document Mongoose
  const plainFeedback = feedback.toObject ? feedback.toObject() : { ...feedback };

  // Supprimer le champ _id (non accepté par Elasticsearch)
  delete plainFeedback._id;

  // S'assurer que la date est bien au format ISO et la renommer @timestamp
  if (plainFeedback.date) {
    plainFeedback['@timestamp'] = new Date(plainFeedback.date).toISOString();
    delete plainFeedback.date;
  }

  const client = new net.Socket();
  client.connect(5000, 'localhost', () => {
    client.write(JSON.stringify(plainFeedback));
    client.end();
  });

  client.on('error', (err) => {
    console.error('Erreur Logstash :', err.message);
  });
};

// === Fonction principale ===
const produceFeedback = async (feedback) => {
  try {
    await producer.connect();
    await producer.send({
      topic: 'feedback-topic',
      messages: [
        { value: JSON.stringify(feedback) } // on garde complet pour Kafka
      ]
    });
    console.log('✅ Message envoyé à Kafka');

    // Envoyer à Logstash (nettoyé)
    sendToLogstash(feedback);
    console.log('✅ Message envoyé à Logstash');

    await producer.disconnect();
  } catch (err) {
    console.error('❌ Erreur Kafka ou Logstash :', err.message);
  }
};

module.exports = produceFeedback;
