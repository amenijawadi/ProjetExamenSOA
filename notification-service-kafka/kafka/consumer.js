const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: ['10.99.7.136:9092']
});

const consumer = kafka.consumer({ groupId: 'notification-group' });

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'feedback-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Nouveau message reçu : ${message.value.toString()}`);
      const feedback = JSON.parse(message.value.toString());
      console.log('📧 Notification envoyée à l’étudiant :');
      console.log(`Merci pour votre avis sur la session ${feedback.sessionId}`);
    },
  });
};

module.exports = runConsumer;
