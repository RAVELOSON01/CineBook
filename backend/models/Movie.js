import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  genre: { type: String, required: true },
  language: { type: String, required: true },
  posterUrl: { type: String, required: true },
  trailerUrl: { type: String }
}, { timestamps: true });

export default mongoose.models.Movie || mongoose.model('Movie', movieSchema);
