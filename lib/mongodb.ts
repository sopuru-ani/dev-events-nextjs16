import mongoose from 'mongoose';

/**
 * Interface for caching the Mongoose connection to prevent multiple connections
 * during development hot reloads in Next.js serverless environment.
 */
type MongooseCache = {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

/**
 * Global cache for Mongoose connection. Using global to persist across hot reloads.
 */
declare global {
  var mongooseCache: MongooseCache | undefined;
}

/**
 * Retrieves the MongoDB URI from environment variables.
 * Throws an error if not defined to ensure proper configuration.
 */
const MONGODB_URI: string = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Connects to MongoDB using Mongoose with caching to avoid multiple connections.
 * Returns the cached connection if available, otherwise establishes a new one.
 *
 * @returns Promise resolving to the Mongoose connection
 */
async function connectDB(): Promise<mongoose.Connection> {
  // Initialize global cache if not present
  if (!global.mongooseCache) {
    global.mongooseCache = { conn: null, promise: null };
  }

  const cache: MongooseCache = global.mongooseCache;

  // Return cached connection if available
  if (cache.conn) {
    return cache.conn;
  }

  // Create a new connection promise if none exists
  if (!cache.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false, // Disable mongoose buffering
    };

    cache.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose.connection;
    });
  }

  try {
    // Await the connection promise and cache the result
    cache.conn = await cache.promise;
  } catch (error) {
    // Reset promise on error to allow retry
    cache.promise = null;
    throw error;
  }

  return cache.conn;
}

export default connectDB;