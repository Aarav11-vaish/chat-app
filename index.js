import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("sendmessage", (message) => {
        console.log("Received message:", message);
        io.emit("message", message); // Broadcast to all clients
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
