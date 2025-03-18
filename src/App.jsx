import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import './App.css';

function App() {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const senddata = () => {
    console.log(messageInput);
    
    if (messageInput.trim() !== "") {
      const socket = io('http://localhost:3000');
      socket.emit("sendmessage", messageInput);
      setMessageInput('');
    }
    else{
      //need a small red marker on button if no rtext is entered and send button is clicked
      console.log("No text entered");     
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <div className="App">
        <div className="chat-container">
          <div className="chat-messages">
            {console.log("display:->",messages)}
            {messages.map((message, index) => (
              <div key={index} className="message">
                {message}
              </div>
            ))}
          </div>
          <span>
            <input
              type="text"
              placeholder="Enter your text here"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button onClick={senddata}>Send</button>
          </span>
        </div>
      </div>
    </>
  );
}

export default App;
