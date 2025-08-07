import {Server} from 'socket.io';
import http from 'http';
import express from 'express';

const app= express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONT_END_URL ||  'http://localhost:5173', // Adjust this to your frontend URL
   methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],

    credentials: true,
  },
});



const usersocketmap= {
    // This will map user IDs to socket IDs
}// {userid: socket.id}

const receiverSocketMap = (userID)=>{
    return usersocketmap[userID]
}

io.on("connection", (socket)=>{
    console.log("a user is connected with name ", socket.id);
    const userID=socket.handshake.query.userID; // Assuming userID is passed in the query string
    if(userID){
        usersocketmap[userID]=socket.id; // Map userID to socket ID
        console.log(`User ${userID} connected with socket ID ${socket.id}`);
    }
    io.emit("onlineusers", Object.keys(usersocketmap)); // Emit online users to all clients


    socket.on("disconnect", ()=>{
        console.log("a user is disconnected with name ", socket.id);
        delete usersocketmap[userID]; // Remove user from the map on disconnect
        io.emit("onlineusers", Object.keys(usersocketmap)); // Emit updated online users to all clients
    }
    );
})

export {io , app , server, receiverSocketMap};