import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  title: String,
  date: String,
  studentId: String,
});

export default mongoose.model('Session', sessionSchema);
