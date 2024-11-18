const mongoose = require("mongoose");

const WorkerSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Phone: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Location: {
    type: String,
    required: true,
  },
  Skills: {
    type: [String], // Array of strings to store multiple skills
    required: true,
  },
});

module.exports = mongoose.model("Worker", WorkerSchema);
