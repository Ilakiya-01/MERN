import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  answers: [
    {
      question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      answer: String,
    },
  ],
});

export default mongoose.model("Response", responseSchema);
