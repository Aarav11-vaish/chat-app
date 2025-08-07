import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:  process.env.FRONT_END_URL || 'http://localhost:5173',
   
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🟢 A user connected with socket ID:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("drawing", ({ roomId, data }) => {
    socket.to(roomId).emit("drawing", data); // emit to everyone in room (including sender)
  });

  socket.on("join-video-room", (roomId)=>{
    socket.join(roomId);
    const users =Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    const otherUsers = users.filter((id) => id !== socket.id); // exclude the current user
    if(otherUsers) {
      socket.emit("user-joined", otherUsers);
    }

    socket.on("offer", ({ roomId, offer }) => {
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", ({ roomId, answer }) => {
    socket.to(roomId).emit("answer", answer);
  });

  socket.on("ice-candidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("ice-candidate", candidate);
  });
  });

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`✅ Socket.IO server running on port ${PORT}`);
});
