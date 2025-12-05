/**
 * MongoDB Connection with Mongoose
 * Handles database connection, caching, and initialization
 */

import mongoose, { Connection } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'opnmart';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface CachedConnection {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

// Cache connection globally to avoid reconnecting in serverless environments
let cached: CachedConnection = (global as any).mongoose || { conn: null, promise: null };

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB using Mongoose
 */
export async function connectDB(): Promise<Connection> {
  // If connection is already cached and ready, return it
  if (cached.conn && mongoose.connection.readyState === 1) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  // If connection promise exists, wait for it
  if (cached.promise) {
    console.log('Waiting for pending MongoDB connection');
    return cached.promise;
  }

  // Create new connection promise
  cached.promise = (async () => {
    try {
      console.log('Connecting to MongoDB...');
      console.log(`URI: ${MONGODB_URI.split('@')[0]}...`);

      const opts = {
        bufferCommands: true, // Changed to true to allow buffering during connection
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
      };

      await mongoose.connect(MONGODB_URI, opts);

      const connection = mongoose.connection;

      console.log('✅ MongoDB connected successfully');
      console.log(`Database: ${MONGODB_DB}`);

      // Handle connection events
      connection.on('disconnected', () => console.warn('⚠️ MongoDB disconnected'));
      connection.on('error', (error) => console.error('❌ MongoDB error:', error));

      cached.conn = connection;
      return connection;
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      cached.promise = null;
      throw error;
    }
  })();

  return cached.promise;
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectDB(): Promise<void> {
  try {
    if (cached.conn) {
      await mongoose.disconnect();
      cached.conn = null;
      cached.promise = null;
      console.log('✅ MongoDB disconnected');
    }
  } catch (error) {
    console.error('❌ Failed to disconnect from MongoDB:', error);
    throw error;
  }
}

/**
 * Get the current connection
 */
export function getConnection(): Connection | null {
  return cached.conn || null;
}

/**
 * Check if connected
 */
export function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export default mongoose;
