import mongoose from 'mongoose';

const showSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theaterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
  showTime: { type: Date, required: true },
  price: { type: Number, required: true },
  totalSeats: { type: Number, default: 100 }
}, { timestamps: true });

export default mongoose.models.Show || mongoose.model('Show', showSchema);
