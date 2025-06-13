import { useEffect } from "react";
import { chatStore } from "../chatStore";
import { authStore } from "../authStore";
import ChatHeader from "./ChatHeader";
import Input_send from "./Input_send";

function ChatContainer() {
  const { messages, getMessages, selectedusers, ismessagesloading } = chatStore();
  const { onlineUsers } = authStore();

  useEffect(() => {
    if (selectedusers && selectedusers._id) {
      getMessages(selectedusers._id);
    }
  }, [getMessages, selectedusers]);

  if (ismessagesloading) return <h1>Loading....</h1>;

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto">
        {messages.map((m, idx) => (
          <p key={idx}>{m.text}</p> // example
        ))}
      </div>
      <Input_send />
    </div>
  );
}

export default ChatContainer;
