const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 8080 });
server.on("connection", (socket) => {
  console.log("🔗 Client mới đã kết nối");
  socket.send("Chào mừng đến với WebSocket Server!");
  socket.on("message", (message) => {
    console.log(`📩 Tin nhắn nhận được: ${message}`);
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Người dùng: ${message}`);
      }
    });
  });
});
console.log("📡 WebSocket chạy tại ws://localhost:8080");
