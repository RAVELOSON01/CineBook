import mongoose from 'mongoose';

const theaterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.Theater || mongoose.model('Theater', theaterSchema);
