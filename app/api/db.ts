import mongoose from "mongoose";


const cached: { connection?: typeof mongoose; promise?: Promise<typeof mongoose> } = {};
async function connectDb() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
  }

  if (cached.connection) {
    console.info("Using existing MongoDB connection");

    return cached.connection;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts);
    console.info("Creating a new MongoDB connection");
  }

  try {
    cached.connection = await cached.promise;
  } catch (e) {
    cached.promise = undefined;
    throw e;
  }

  return cached.connection;
}

export default connectDb;
