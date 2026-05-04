const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Simple route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Socket connection
let users = [];

io.on("connection", (socket) => {

  socket.on("join", (username) => {
    socket.username = username;
    users.push(username);

    io.emit("user list", users);

    io.emit("chat message", {
      user: "System",
      text: `${username} joined`,
      time: new Date().toLocaleTimeString()
    });
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", {
      user: socket.username,
      text: msg,
      time: new Date().toLocaleTimeString()
    });
  });

  socket.on("disconnect", () => {
    users = users.filter(u => u !== socket.username);
    io.emit("user list", users);
  });

});
//Redis client setup
async function setupRedis() {
  const pubClient = createClient({
    url: "redis://127.0.0.1:7001"
  });

  const subClient = pubClient.duplicate();

  await pubClient.connect();
  await subClient.connect();

  io.adapter(createAdapter(pubClient, subClient));

  console.log("Connected to Redis Cluster ✅");
}

setupRedis();

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
