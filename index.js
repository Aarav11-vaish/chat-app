import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import { time } from 'console';
import { type } from 'os';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/chat-app")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));



const messageSchema = new mongoose.Schema({
    message: String,
    timestamp: {type: Date, default: Date.now}
});

const Message= mongoose.model("message", messageSchema);



io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    Message.find().then((result) => {
         socket.emit("messageHistory", result);
    });
    socket.on("sendmessage", async (message) => {
        console.log("Received message:", message);
        const newMessage = new Message({ message: message });
        await newMessage.save();
        io.emit("message", { message: message, timestamp: newMessage.timestamp }); 
    });
    

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});


