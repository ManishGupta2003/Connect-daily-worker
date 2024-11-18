const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  Latitude: {
    type: Number,
    required: true,
  },
  Longitude: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Location", LocationSchema);
