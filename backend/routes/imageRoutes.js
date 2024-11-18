const express = require("express");
const router = express.Router();
const multer = require("multer");
const Image = require("../models/Image");

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST route for uploading images
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { originalname, mimetype, buffer } = req.file;
    const imageBase64 = buffer.toString("base64");

    // Save image data to MongoDB
    const newImage = new Image({
      filename: originalname,
      contentType: mimetype,
      imageBase64: imageBase64,
    });

    await newImage.save();
    res.status(201).send("Image uploaded successfully");
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).send("Error uploading image");
  }
});

// GET route to retrieve the most recently uploaded image
router.get("/latest-image", async (req, res) => {
  try {
    const image = await Image.findOne().sort({ _id: -1 });

    if (!image) {
      return res.status(404).send("No images found");
    }

    res.set("Content-Type", image.contentType);
    res.send(Buffer.from(image.imageBase64, "base64"));
  } catch (error) {
    console.error("Error retrieving image:", error);
    res.status(500).send("Error retrieving image");
  }
});

module.exports = router;
