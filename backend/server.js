const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

/* =======================
    DATABASE CONNECTION
======================= */

mongoose
  .connect("mongodb://localhost:27017/APP")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB error:", err));

/* =======================
    MODELS
======================= */

const CustomerSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Phone: { type: String, required: true },
  Email: { type: String, required: true },
  Password: { type: String, required: true },
  Location: { type: String, required: true },
});

const WorkerSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Email: { type: String, required: true },
  Phone: { type: String, required: true },
  Password: { type: String, required: true },
  Location: { type: String, required: true },
  Skills: { type: [String], required: true },
});

const ProblemSchema = new mongoose.Schema({
  Problem: String,
  CustomerPhone: String,
  CustomerLocation: String,
  ProblemType: String,
  customerMongoId: mongoose.Schema.Types.ObjectId,

  assignedWorker: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  status: {
    type: String,
    enum: ["open", "assigned", "completed"],
    default: "open",
  },

  rating: {
    type: Number,
    default: null,
  },

  filename: String,
  contentType: String,
  imageBase64: String,
});

const MessageSchema = new mongoose.Schema(
  {
    problemId: mongoose.Schema.Types.ObjectId,
    senderId: mongoose.Schema.Types.ObjectId,
    receiverId: mongoose.Schema.Types.ObjectId,

    senderName: String,
    receiverName: String,

    text: String,
  },
  { timestamps: true },
);

const CustomerCollection = mongoose.model("Customer", CustomerSchema);
const WorkerCollection = mongoose.model("Worker", WorkerSchema);
const ProblemCollection = mongoose.model("Problem", ProblemSchema);
const Message = mongoose.model("Message", MessageSchema);

/* =======================
    AUTH ROUTES
======================= */

// Worker Register
app.post("/worker", async (req, res) => {
  const { Name, Email, Phone, Password, Location, Skills } = req.body;

  try {
    await WorkerCollection.create({
      Name,
      Email,
      Phone,
      Password,
      Location,
      Skills,
    });

    res.status(201).send("Worker registered successfully");
  } catch (error) {
    res.status(500).send("Error inserting worker");
  }
});

// Customer Register
app.post("/customer", async (req, res) => {
  const { Name, Email, Password, Location, Phone } = req.body;

  try {
    await CustomerCollection.create({
      Name,
      Email,
      Password,
      Location,
      Phone,
    });

    res.status(201).send("Customer registered successfully");
  } catch (error) {
    res.status(500).send("Error inserting customer");
  }
});

// LOGIN (Clean Role Differentiation)
app.post("/login", async (req, res) => {
  const { Email, Password } = req.body;

  try {
    let user = await WorkerCollection.findOne({ Email });

    if (user && user.Password === Password) {
      return res.status(200).json({
        userId: user._id,
        userRole: "worker",
        userName: user.Name,
        userPhone: user.Phone,
        userLocation: user.Location,
        userSkills: user.Skills,
      });
    }

    user = await CustomerCollection.findOne({ Email });

    if (user && user.Password === Password) {
      return res.status(200).json({
        userId: user._id,
        userRole: "client",
        userName: user.Name,
        userPhone: user.Phone,
        userLocation: user.Location,
        userSkills: [],
      });
    }

    return res.status(401).send("Invalid credentials");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

/* =======================
    UPDATE PROFILE
======================= */

app.put("/update-profile", async (req, res) => {
  try {
    const { userId, name, phone, location } = req.body;

    let updatedUser = await WorkerCollection.findByIdAndUpdate(
      userId,
      {
        Name: name,
        Phone: phone,
        Location: location,
      },
      { new: true },
    );

    if (!updatedUser) {
      updatedUser = await CustomerCollection.findByIdAndUpdate(
        userId,
        {
          Name: name,
          Phone: phone,
          Location: location,
        },
        { new: true },
      );
    }

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =======================
    PROBLEM UPLOAD
======================= */

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const {
      Problem,
      ProblemType,
      CustomerPhone,
      CustomerLocation,
      customerMongoId,
    } = req.body;

    const imageBase64 = req.file.buffer.toString("base64");

    const newProblem = new ProblemCollection({
      Problem,
      ProblemType,
      CustomerPhone,
      CustomerLocation,
      customerMongoId,
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      imageBase64,
    });

    await newProblem.save();
    res.status(201).json(newProblem);
  } catch (error) {
    res.status(500).send("Upload error");
  }
});

/* =======================
    SEARCH FOR WORKER
======================= */

app.get("/search", async (req, res) => {
  try {
    const { skills, location } = req.query;

    if (!skills || !location)
      return res
        .status(400)
        .json({ message: "Skills and location are required" });

    const skillsArray = skills.split(",");

    const problems = await ProblemCollection.find({
      ProblemType: { $in: skillsArray },
      CustomerLocation: location,
      status: "open",
    });

    res.json(problems);
  } catch (error) {
    res.status(500).send("Search error");
  }
});

/* =======================
    NEW API ROUTE (ASSIGN)
======================= */

app.put("/assign/:problemId", async (req, res) => {
  const { workerId } = req.body;

  const updated = await ProblemCollection.findByIdAndUpdate(
    req.params.problemId,
    {
      status: "assigned",
      assignedWorker: workerId,
    },
    { new: true },
  );

  res.json(updated);
});

/* =======================
    NEW API ROUTE (RATE & COMPLETE)
======================= */

app.put("/rate/:problemId", async (req, res) => {
  try {
    const { rating } = req.body;

    const problem = await ProblemCollection.findById(req.params.problemId);

    if (problem.rating !== null) {
      return res.status(400).json({ message: "Rating already submitted" });
    }

    problem.rating = rating;
    problem.status = "completed";

    await problem.save();

    res.json({ message: "Rating submitted successfully" });
  } catch (error) {
    res.status(500).send("Rating error");
  }
});

/* =======================
    HISTORY API
======================= */

app.get("/client-history/:clientId", async (req, res) => {
  const jobs = await ProblemCollection.find({
    customerMongoId: req.params.clientId,
    status: { $in: ["assigned", "completed"] },
  });

  res.json(jobs);
});

app.get("/worker-history/:workerId", async (req, res) => {
  const jobs = await ProblemCollection.find({
    assignedWorker: req.params.workerId,
  });

  res.json(jobs);
});

/* =======================
    GET OLD CHAT MESSAGES
======================= */

app.get("/chat/:problemId", async (req, res) => {
  try {
    const messages = await Message.find({
      problemId: req.params.problemId,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).send("Error fetching messages");
  }
});

/* =======================
    SOCKET.IO
======================= */

const io = new Server(server, {
  cors: { origin: ["http://localhost:5173"] },
});

io.on("connection", (socket) => {
  socket.on("join_room", (problemId) => {
    socket.join(problemId);
  });

  socket.on("send_message", async (data) => {
    const newMessage = new Message({
      problemId: data.problemId,
      senderId: data.senderId,
      receiverId: data.receiverId,
      senderName: data.senderName,
      receiverName: data.receiverName,
      text: data.message,
    });

    await newMessage.save();

    io.to(data.problemId).emit("receive_message", newMessage);
  });
});

/* =======================
    UPDATED MY-CHATS ROUTE
======================= */

app.get("/my-chats/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ createdAt: -1 });

    const chatsMap = {};

    for (const msg of messages) {
      const otherUser =
        String(msg.senderId) === String(userId) ? msg.receiverId : msg.senderId;

      const key = `${msg.problemId}_${otherUser}`;

      if (!chatsMap[key]) {
        const problem = await ProblemCollection.findById(msg.problemId);

        chatsMap[key] = {
          problemId: msg.problemId,
          problemName: problem ? problem.Problem : "Problem",
          otherUserId: otherUser,
          otherUserName:
            String(msg.senderId) === String(userId)
              ? msg.receiverName
              : msg.senderName,
          lastMessage: msg.text,
        };
      }
    }

    res.json(Object.values(chatsMap));
  } catch (error) {
    res.status(500).send("Error fetching chats");
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
