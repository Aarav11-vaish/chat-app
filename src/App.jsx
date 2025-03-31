import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import './App.css';
import Navbar from './components/Navbar';
import Input_send from './components/Input_send';

function App() {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [socket, setSocket] = useState(null);

    useEffect(() => {
      const Socket = io('http://localhost:3000');
      console.log("socket ,", Socket)
      
      setSocket(Socket);

      Socket.on("messageHistory", (messages) => {
        {console.log(messages)
        }
        setMessages(messages); // Keep messages as objects, not just strings
      });
      
    
      Socket.on("message", (message) => {
        setMessages(prev => [...prev, message]);
      });
    
      return () => Socket.disconnect();
    }, []);
    
const clearmessage=async()=>{
  try{
const response = await fetch("http://localhost:3000/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    console.log("Messages cleared successfully");
    setMessages([]); // Clear messages from state
  } else {
    console.error("Failed to clear messages");
  }
}
  catch{
    console.log("error")
  }
}

    const senddata = () => {
      if (socket && messageInput.trim() !== "") {
        socket.emit("sendmessage", messageInput);
        setMessageInput('');
      } else if (!socket) {
        console.log("Socket not connected");
      } else {
        console.log("No text entered");
      }
    };
    
    return (
      <>
        <Navbar clearmessage ={clearmessage}/>
        

        <div className="App">
          <div className="chat-container">
          <div className="chat-messages">
  {messages.map((msg, index) => (
    console.log(msg),
    
    <div key={msg._id || index} className="message">
      {msg.message} {/* Extract only the text message */}
    </div>
  ))}
</div>

            <Input_send

              messageInput={messageInput}
              setMessageInput={setMessageInput}
              senddata={senddata}
            />
          </div>
        </div>  
      </>
    );
}

export default App;