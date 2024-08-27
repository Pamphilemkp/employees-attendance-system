import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cachedClient = global.mongo;

if (!cachedClient) {
  cachedClient = global.mongo = { conn: null, promise: null };
}

async function dbConnect() {
  if (cachedClient.conn) {
    return cachedClient.conn;
  }

  if (!cachedClient.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cachedClient.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  cachedClient.conn = await cachedClient.promise;
  return cachedClient.conn;
}

export default dbConnect;
