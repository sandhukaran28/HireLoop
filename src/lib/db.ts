import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

type MongooseCache = { conn: Mongoose | null; promise: Promise<Mongoose> | null };

const globalWithMongoose = global as typeof globalThis & { mongoose?: MongooseCache };

const cached: MongooseCache =
  globalWithMongoose.mongoose ?? (globalWithMongoose.mongoose = { conn: null, promise: null });

async function connectDB(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
