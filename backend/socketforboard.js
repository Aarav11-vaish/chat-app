import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io =new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // Adjust this to your frontend URL
        methods: ['GET', 'POST'],
        credentials: true,
    },
})
io.on("connection", (socket) => {
    console.log("A user connected with socket ID:", socket.id);

    socket.on("join-room", (roomId) => {
        socket.join(roomId);

});
socket.on("drawing", ({ roomId, data }) => {
    socket.to(roomId).emit("drawing", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");

    
});
