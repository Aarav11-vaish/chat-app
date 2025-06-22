import { useEffect, useState } from "react";
import { chatStore } from "../chatStore";
import { authStore } from "../authStore";
import ChatHeader from "./ChatHeader";
import Input_send from "./Input_send";
import NoChatSelected from "./NoChatSelected";
import { formdate } from "../utils";
function ChatContainer() {
  const { messages, getMessages, selectedusers , sendMessages} = chatStore();
  const { onlineUsers } = authStore();
  const [messageInput, setMessageInput] = useState("");

  const senddata = async () => {
    if (messageInput.trim() === "") return;
    console.log("Sending:", messageInput);
    await sendMessages( selectedusers._id, messageInput);
    setMessageInput(""); // Clear input after sendin
  };


  useEffect(() => {
    if (selectedusers && selectedusers._id) {
      getMessages(selectedusers._id);
    }
  }, [getMessages, selectedusers]);

  if (!selectedusers) return <NoChatSelected />;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ChatHeader />
      
      {/* Message List */}
      
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-base-200">
      {messages.map((m, idx) => (
  <div>
    <div className="chat-header mb-1">
      <time className="text-xs opacity-50 ml-1">
        {formdate(m.createdAt)}
      </time>
    </div>
    <div key={idx} className="p-2 rounded shadow text-sm max-w-md">
      {m.text}
    </div>
  </div>
))}

      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-base-300 bg-base-100">
        <Input_send
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          senddata={senddata}
        />
      </div>
    </div>
  );
}

export default ChatContainer;
