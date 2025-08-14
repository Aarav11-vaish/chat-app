import React from "react";
import { Send } from "lucide-react";

function Input_send({ messageInput, setMessageInput, senddata }) {
  return (
    <div className="flex items-center gap-3 p-2 bg-zinc-900 rounded-full shadow-md">
      <input
        type="text"
        placeholder="Type your message..."
        value={messageInput}
        onKeyDown={(e) => e.key === "Enter" && senddata()}
        onChange={(e) => setMessageInput(e.target.value)}
        className="flex-1 bg-transparent text-white placeholder-zinc-400 px-4 py-2 rounded-full 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
      />
      <button
        onClick={senddata}
        className="p-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 
                   hover:scale-105 hover:shadow-lg transition-all duration-200 text-white"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}

export default Input_send;
