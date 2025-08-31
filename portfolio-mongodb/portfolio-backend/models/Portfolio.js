import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({}, { strict: false });

export default mongoose.model("Portfolio", portfolioSchema, "portfolio");
