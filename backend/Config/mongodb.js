import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const mongo_url = process.env.MONGO_URI;

async function connectDB() {
  try {
    await mongoose.connect(mongo_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connection successful");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}

export default connectDB;
