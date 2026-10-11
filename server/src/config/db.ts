import mongoose from 'mongoose';
import { config } from './env.js';

let mongodInstance: any = null;

export async function connectDB(): Promise<string> {
  const uri = config.mongoUri;

  if (uri && uri.trim() !== '') {
    try {
      console.log(`[Database] Connecting to configured MongoDB URI...`);
      await mongoose.connect(uri);
      console.log(`[Database] Connected successfully to MongoDB at ${uri.split('@').pop()?.split('/')[0] || uri}`);
      return uri;
    } catch (err) {
      console.warn(`[Database] Failed to connect to specified MONGODB_URI:`, err);
      if (config.isProduction) {
        throw err;
      }
      console.log(`[Database] Falling back to in-memory MongoDB for local demonstration mode...`);
    }
  }

  // Fallback to in-memory MongoDB for seamless out-of-the-box local testing and demo
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create({
      instance: {
        dbName: 'lotus_impex_db',
      },
      spawn: {
        timeout: 60000,
      },
    });
    const memoryUri = mongodInstance.getUri();
    await mongoose.connect(memoryUri);
    console.log(`[Database] Connected to In-Memory MongoDB (${memoryUri}) for local demo.`);
    return memoryUri;
  } catch (error) {
    console.error(`[Database] Critical error establishing MongoDB connection:`, error);
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
}
