/**
 * MongoDB Connection Utility
 * Note: This is for reference if you need to use MongoDB on the backend API
 * Frontend apps typically don't connect directly to MongoDB - use your backend API instead
 */

import { MongoClient, Db, MongoClientOptions } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'opnmart';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

/**
 * Connect to MongoDB
 * This is typically used on the backend, not the frontend
 */
export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const options: MongoClientOptions = {
    maxPoolSize: 10,
  };

  const client = new MongoClient(MONGODB_URI, options);

  try {
    await client.connect();
    const db = client.db(MONGODB_DB);

    cachedClient = client;
    cachedDb = db;

    return { client: cachedClient, db: cachedDb };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

/**
 * Get the cached database connection
 */
export async function getDb(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  const { db } = await connectToDatabase();
  return db;
}

/**
 * Close database connection
 */
export async function closeDatabase() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
}
