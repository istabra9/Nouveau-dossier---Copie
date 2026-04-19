import mongoose from "mongoose";

declare global {
  var mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

function getMongoUri() {
  return process.env.MONGODB_URI;
}

const cache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cache;
}

export async function connectToDatabase() {
  const mongoUri = getMongoUri();

  if (!mongoUri) {
    return null;
  }

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(mongoUri, {
      bufferCommands: false,
      dbName: "advancia-trainings",
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
