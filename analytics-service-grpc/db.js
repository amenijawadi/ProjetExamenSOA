const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);
let db;

async function connect() {
  await client.connect();
  db = client.db('feedbackdb');
  console.log('✅ Connected to MongoDB (feedbackdb)');
}

function getCollection() {
  return db.collection('feedbacks');
}

module.exports = { connect, getCollection };
