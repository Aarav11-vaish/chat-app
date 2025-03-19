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
      const newSocket = io('http://localhost:3000');
      setSocket(newSocket);

      newSocket.on("messageHistory", (messages) => {
        setMessages(messages); // Keep messages as objects, not just strings
      });
      
    
      newSocket.on("message", (message) => {
        setMessages(prev => [...prev, message]);
      });
    
      return () => newSocket.disconnect();
    }, []);
    
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
        <Navbar/>
        <div className="App">
          <div className="chat-container">
          <div className="chat-messages">
  {messages.map((msg, index) => (
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