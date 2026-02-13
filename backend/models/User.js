const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
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
  Role: {
    type: String,
    enum: ["worker", "client"],
    required: true,
  },
  Skills: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("User", UserSchema);
