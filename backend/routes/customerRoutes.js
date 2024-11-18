const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");

// Route for adding a customer
router.post("/customer", async (req, res) => {
  const { Name, Email, Password, Location } = req.body;

  const data = {
    Name,
    Email,
    Password,
    Location,
  };

  try {
    await Customer.create(data);
    res.status(201).send("Data inserted successfully");
  } catch (error) {
    res.status(500).send("Error inserting data");
  }
});

module.exports = router;
