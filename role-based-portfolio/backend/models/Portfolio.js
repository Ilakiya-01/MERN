const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
  home: {
    name: String,
    title: String,
    subtitle: String,
  },
  about: String,
  skills: [String],
  projects: [
    {
      name: String,
      description: String,
      link: String,
    },
  ],
});

module.exports = mongoose.model("Portfolio", portfolioSchema, "portfolio");
