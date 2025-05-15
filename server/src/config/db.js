import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongooseStr = process.env.DATABASE_URL;
const dbConfig = { dbName: process.env.DATABASE_NAME };
const database = mongoose.connection;

// Set up event listeners before connecting
database.on("error", (error) => console.log(`MongoDB ${error}`));
database.once("connected", () => console.log(`MongoDB Connected!`));

async function connect() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongooseStr, dbConfig);
  } catch (err) {
    console.error(`MongoDB Connection error: ${err.message}`);
    process.exit(1);
  }
}

export { connect };
