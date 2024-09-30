/* eslint-disable */
import mongoose from 'mongoose';

let isConnected = false; // track the connection

export async function dbConnect() {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB: ', error);
    throw new Error('Could not connect to MongoDB');
  }
}
