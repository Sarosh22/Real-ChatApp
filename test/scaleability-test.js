const io = require("socket.io-client");

const TOTAL_CLIENTS = 50; // you can increase later

for (let i = 0; i < TOTAL_CLIENTS; i++) {

  const socket = io("http://localhost:3000");

  socket.on("connect", () => {
    console.log(`✅ Client ${i} connected`);

    // send message after connection
    socket.emit("chat message", `Hello from client ${i}`);
  });

  socket.on("disconnect", () => {
    console.log(`❌ Client ${i} disconnected`);
  });

  socket.on("connect_error", (err) => {
    console.log(`⚠️ Client ${i} error:`, err.message);
  });
}