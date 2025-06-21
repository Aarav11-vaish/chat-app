import React, { useEffect } from "react";
import { Send } from "lucide-react";
import { chatStore } from "../chatStore";
import { authStore } from "../authStore";
function Input_send({ messageInput, setMessageInput, senddata }) {
  useEffect(()=>{

  }, [])
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Type your message..."
        value={messageInput}
        onKeyDown={(e) => e.key === "Enter" && senddata()}
        onChange={(e) => setMessageInput(e.target.value)}
        className="flex-1 px-4 py-2 border border-y-zinc-900 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 border-indigo-950"
      />
      <button
        onClick={senddata}
        className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}

export default Input_send;
