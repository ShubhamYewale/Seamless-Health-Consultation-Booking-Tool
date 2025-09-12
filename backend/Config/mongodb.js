import mongoose from "mongoose";

const mongo_url =
  process.env.MONGO_URI ||
  "mongodb+srv://shubhamyewale1213_db_user:hRZt3glcUx8h7oOH@cluster0.mmmpl63.mongodb.net/Doctors?retryWrites=true&w=majority";

async function main() {
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

main();

export default main;
