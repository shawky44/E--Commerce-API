import mongoose from "mongoose";

export const connectDB = async (mongoURL) => {
  try {
    await mongoose.connect(mongoURL);
    console.log("✅ Database connected");
  } catch (err) {
    console.log("❌ DB Error:", err.message);
    process.exit(1);
  }
};