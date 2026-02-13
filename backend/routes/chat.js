const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// Send Message
router.post("/send-message", async (req, res) => {
  try {
    const { problemId, senderId, receiverId, text } = req.body;

    const newMessage = await Message.create({
      problemId,
      senderId,
      receiverId,
      text,
    });

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: "Message not saved" });
  }
});

// Get Conversation by problem
router.get("/messages/:problemId", async (req, res) => {
  try {
    const messages = await Message.find({
      problemId: req.params.problemId,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Cannot fetch messages" });
  }
});

// Get Chat List for user
router.get("/chat-list/:userId", async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ senderId: req.params.userId }, { receiverId: req.params.userId }],
    }).populate("problemId");

    const grouped = {};

    messages.forEach((msg) => {
      const key = msg.problemId._id.toString();
      grouped[key] = msg;
    });

    res.json(Object.values(grouped));
  } catch (err) {
    res.status(500).json({ error: "Chat list error" });
  }
});

module.exports = router;
