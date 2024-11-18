const express = require("express");
const router = express.Router();
const Worker = require("../models/Worker");

// Route for adding a worker
router.post("/worker", async (req, res) => {
  const { Name, Email, Phone, Password, Location, Skills } = req.body;

  const data = {
    Name,
    Email,
    Phone,
    Password,
    Location,
    Skills,
  };

  try {
    await Worker.create(data);
    res.status(201).send("Data inserted successfully");
  } catch (error) {
    res.status(500).send("Error inserting data");
  }
});

// Route for searching workers by skills
router.get("/search", async (req, res) => {
  const { skill } = req.query; // Get the skill from query parameters

  try {
    const workers = await Worker.find({ Skills: skill }); // Search workers by skill
    res.status(200).json(workers); // Send found workers as response
  } catch (error) {
    console.error("Error searching for workers:", error);
    res.status(500).send("Error searching for workers");
  }
});

module.exports = router;
