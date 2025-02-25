const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});
io.on("connection", (socket) => {
  console.log("User connected", socket.id);
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
  });
  socket.on("send-message", (message) => {
    socket.broadcast.emit("receive-message", message);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});
server.listen(5090, () => console.log("Server running on port 5090"));
