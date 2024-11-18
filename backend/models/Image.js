const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  imageBase64: String, // This field will store the image as a Base64 encoded string
});

module.exports = mongoose.model("Image", ImageSchema);
