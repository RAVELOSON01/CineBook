import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;
    
    // If no URI is provided, fallback to in-memory DB for development
    if (!mongoUri) {
      console.log('No MONGODB_URI provided. Starting in-memory MongoDB server...');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
    } else {
      console.log(`Connecting to provided MongoDB URI...`);
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};
