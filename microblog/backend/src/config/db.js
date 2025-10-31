const mongoose = require("mongoose");

// Connect to MongoDB
async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/microblog";
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

module.exports = connectDB;
