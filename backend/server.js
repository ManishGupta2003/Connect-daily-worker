const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer");

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/APP")
  .then(() => {
    console.log("mongodb connected succesfully");
  })
  .catch(() => {
    console.log("failed");
  });

const CustomerSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  Phone: {
    type: String,
    required: true,
  },
  Email: {
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
});
const CustomerCollection = mongoose.model("CustomerCollection", CustomerSchema);

const WorkerSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
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
const WorkerCollection = mongoose.model("WorkerCollection", WorkerSchema);

const app = express();
app.use(express.json());
app.use(cors());

app.post("/worker", async (req, res) => {
  const { Name, Email, Phone, Password, Location, Skills } = req.body;

  console.log("Received worker data:", req.body); // Log incoming data

  const data = {
    id: 1, // 1 for worker
    Name: Name,
    Email: Email,
    Phone: Phone,
    Password: Password,
    Location: Location,
    Skills: Skills, // Ensure Skills field is an array
  };

  try {
    await WorkerCollection.insertMany(data); // Use insertOne
    res.status(201).send("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error); // Log detailed error
    res.status(500).send("Error inserting data");
  }
});

app.post("/customer", async (req, res) => {
  const { Name, Email, Password, Location, Phone } = req.body;

  const data = {
    id: 0, // 0 for customer
    Name: Name,
    Email: Email,
    Password: Password,
    Location: Location,
    Phone: Phone,
  };
  try {
    await CustomerCollection.insertMany([data]);
    res.status(201).send("Data inserted successfully");
  } catch (error) {
    res.status(500).send("Error inserting data");
  }
});

app.post("/login", async (req, res) => {
  const { Email, Password } = req.body;

  try {
    // Find the customer or worker by email
    const user =
      (await CustomerCollection.findOne({ Email: Email })) ||
      (await WorkerCollection.findOne({ Email: Email }));

    if (!user) {
      return res.status(401).send("User not found");
    }

    // Check if the password matches
    if (user.Password !== Password) {
      return res.status(401).send("Invalid password");
    }

    // Create a session or token for the user
    // For simplicity, here we are sending user details as a response
    res.status(200).json({
      message: "Login successful",
      userId: user.id,
      userName: user.Name,
      userPhone: user.Phone, // Include phone number if available
      userLocation: user.Location,
      userSkills: user.Skills || null,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Internal server error");
  }
});

const ProblemSchema = new mongoose.Schema({
  Problem: {
    type: String,
    required: true,
  },
  CustomerPhone: {
    type: String,
    required: true,
  },
  CustomerLocation: {
    type: String,
    required: true,
  },
  ProblemType: {
    type: String,
    required: true,
  },
  filename: String,
  contentType: String,
  imageBase64: String, // Store the image as a Base64 encoded string
});

const ProblemCollection = mongoose.model("ProblemCollection", ProblemSchema);

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST route for uploading images and problem details
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { Problem, ProblemType, CustomerPhone, CustomerLocation } = req.body;

    if (!CustomerPhone || !CustomerLocation) {
      return res
        .status(400)
        .send("Customer phone number and location are required");
    }

    if (!Problem || !ProblemType || !req.file) {
      return res
        .status(400)
        .send("All fields are required, including the image");
    }

    const { originalname, mimetype, buffer } = req.file;
    const imageBase64 = buffer.toString("base64");

    // Save problem and image data to MongoDB
    const newProblem = new ProblemCollection({
      Problem,
      CustomerPhone,
      CustomerLocation,
      ProblemType,
      filename: originalname,
      contentType: mimetype,
      imageBase64,
    });

    await newProblem.save();
    res.status(201).send("Problem and image uploaded successfully");
  } catch (error) {
    console.error("Error uploading problem and image:", error);
    res.status(500).send("Error uploading problem and image");
  }
});

// POST route for uploading images and problem details
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { Problem, ProblemType } = req.body;
    const CustomerPhone = req.body.CustomerPhone; // Get from the request body

    if (!CustomerPhone) {
      return res.status(400).send("Customer phone number is required");
    }

    if (!Problem || !ProblemType || !req.file) {
      return res
        .status(400)
        .send("All fields are required, including the image");
    }

    const { originalname, mimetype, buffer } = req.file;
    const imageBase64 = buffer.toString("base64");

    // Save problem and image data to MongoDB
    const newProblem = new ProblemCollection({
      Problem,
      CustomerPhone,
      ProblemType,
      filename: originalname,
      contentType: mimetype,
      imageBase64,
    });

    await newProblem.save();
    res.status(201).send("Problem and image uploaded successfully");
  } catch (error) {
    console.error("Error uploading problem and image:", error);
    res.status(500).send("Error uploading problem and image");
  }
});

// GET route to retrieve the most recently uploaded image
app.get("/problems", async (req, res) => {
  try {
    const { skill, location } = req.query;

    // Validate input
    if (!skill || !location) {
      return res.status(400).send("Skill and location are required");
    }

    // Fetch problems matching the skill and location
    const problems = await ProblemCollection.find({
      ProblemType: skill,
      CustomerLocation: location,
    });

    res.status(200).json(problems);
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).send("Error fetching problems");
  }
});

app.get("/search", async (req, res) => {
  try {
    // Retrieve query parameters
    const { skills, location } = req.query;

    // Check if skills and location are provided
    if (!skills || !location) {
      return res
        .status(400)
        .json({ message: "Skills and location are required" });
    }

    // Parse skills from comma-separated string
    const skillsArray = skills.split(",");

    // Query problems based on location and skill
    const problems = await ProblemCollection.find({
      ProblemType: { $in: skillsArray },
      CustomerLocation: location,
    });

    // Send the found problems
    res.json(problems);
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

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
const LocationCollection = mongoose.model("LocationCollection", LocationSchema);
app.post("/location", async (req, res) => {
  const { Latitude, Longitude } = req.body;
  console.log("Received location data:", req.body);

  const data = {
    Latitude: Latitude,
    Longitude: Longitude,
  };
  try {
    await LocationCollection.insertMany([data]);
    res.status(201).send("Data inserted successfully");
  } catch (error) {
    res.status(500).send("Error inserting data");
  }
});

app.listen(3000, () => {
  console.log("server start with port 3000");
});
