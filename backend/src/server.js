require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const passport = require("passport");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
require("./config/passport");

const app = express();
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(passport.initialize());
app.use("/api/auth/login", rateLimit({ windowMs: 15*60*1000, max: 5 }));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);

// Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
const http = require("http");
const { Server } = require("socket.io");

// after express app setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("sendMessage", (msg) => {
    io.emit("receiveMessage", msg); // broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
