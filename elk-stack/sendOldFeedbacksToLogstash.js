

const mongoose = require('mongoose');
const fs = require('fs');
const net = require('net');
const path = require('path');

// Fichier local contenant les IDs déjà envoyés
const SENT_FILE = path.join(__dirname, 'alreadySent.json');

// Lire les anciens IDs envoyés
let alreadySent = [];
if (fs.existsSync(SENT_FILE)) {
  alreadySent = JSON.parse(fs.readFileSync(SENT_FILE, 'utf-8'));
}

// Schéma identique
const feedbackSchema = new mongoose.Schema({
  studentId: String,
  sessionId: String,
  rating: Number,
  comment: String,
  date: Date
});
const Feedback = mongoose.model('Feedback', feedbackSchema);

// Connexion MongoDB
mongoose.connect('mongodb://localhost:27017/feedbackdb', {
  serverSelectionTimeoutMS: 10000,
}).then(async () => {
  console.log(' Connecté à MongoDB');

  // Récupérer tous les feedbacks
  const feedbacks = await Feedback.find();
  console.log(` ${feedbacks.length} feedbacks trouvés.`);

  // Filtrer ceux déjà envoyés
  const newFeedbacks = feedbacks.filter(fb => !alreadySent.includes(fb._id.toString()));
  console.log(` ${newFeedbacks.length} nouveaux feedbacks à envoyer.`);

  // Envoyer chaque feedback
  for (const fb of newFeedbacks) {
    const clean = fb.toObject();
    delete clean._id;
    clean.date = new Date(clean.date).toISOString();

    const client = new net.Socket();
    client.connect(5000, 'localhost', () => {
      client.write(JSON.stringify(clean));
      client.end();
    });

    client.on('error', (err) => {
      console.error(' Erreur Logstash:', err.message);
    });

    // Ajouter l'ID à la liste des envoyés
    alreadySent.push(fb._id.toString());
  }

  // Sauvegarder la nouvelle liste
  fs.writeFileSync(SENT_FILE, JSON.stringify(alreadySent, null, 2));

  setTimeout(() => {
    console.log(' Terminé.');
    process.exit(0);
  }, 2000);

}).catch(err => console.error(' Erreur MongoDB:', err.message));
