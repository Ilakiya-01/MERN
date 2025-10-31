// Run this script ONCE to fix unique index errors in your User collection
const mongoose = require("mongoose");
const User = require("./src/models/User");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/YOUR_DB_NAME";

mongoose.connect(MONGO_URI).then(async () => {
  try {
    await User.collection.dropIndexes();
    await User.ensureIndexes();
    console.log("User indexes reset! You can now register new users.");
  } catch (err) {
    console.error("Error resetting indexes:", err);
  } finally {
    mongoose.disconnect();
  }
});
