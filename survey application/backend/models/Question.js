import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: String,
  options: [String],
});

export default mongoose.model("Question", questionSchema);
