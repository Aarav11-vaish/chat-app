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

mongoose.connect("mongodb://localhost:27017/chat-app");




const messageSchema = new mongoose.Schema({
    message: String,
    timestamp: {type: Date, default: Date.now}
});

const Message= mongoose.model("message", messageSchema);



io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
console.log(socket);

    Message.find().then((result) => {
        console.log(result);
        
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

app.delete("/delete", async (req, res) => {
    try {
        await Message.deleteMany({});
        io.emit("messageHistory", []); // Emit an empty array to clear the messages on the client side
        console.log("All messages deleted successfully.");
        res.status(200).send("All messages deleted successfully.");
    } catch (error) {
        console.error("Error deleting messages:", error);
        res.status(500).send("Error deleting messages.");
    }
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});


