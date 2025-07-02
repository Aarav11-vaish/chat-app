import { useEffect, useState } from "react";
import { chatStore } from "../chatStore";
import { authStore } from "../authStore";
import ChatHeader from "./ChatHeader";
import Input_send from "./Input_send";
import { formdate } from "../utils";
import CreateGroup from "../Group/CreateGroup";

function ChatContainer() {
  const {
    messages,
    getMessages,
    getGroupMessages,
    selectedusers,
    selectedGroups,
    sendMessages,
    chatMode,
    subscribetomessages,
    unsubscribetomessages,
  } = chatStore();

  const { authUser } = authStore();
  const [messageInput, setMessageInput] = useState("");

  const handleSendMessage = async () => {
    if (messageInput.trim() === "") return;

    const receiverId = chatMode === "group" ? selectedGroups?._id : selectedusers?._id;
    if (!receiverId) return;

    await sendMessages(receiverId, messageInput);
    setMessageInput("");
  };

  useEffect(() => {
    if (chatMode === "personal" && selectedusers?._id) {
      getMessages(selectedusers._id);
      subscribetomessages();
      return () => unsubscribetomessages();
    }
    if (chatMode === "group" && selectedGroups?._id) {
      getGroupMessages(selectedGroups._id);
    }
  }, [chatMode, selectedusers, selectedGroups]);

  if (chatMode === "group" && !selectedGroups) {
    return <CreateGroup />;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-base-200">
        {messages.map((m) => {
          const isOwnMessage = m.senderID === authUser?._id;
          return (
            <div
              key={m._id}
              className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
            >
              <div>
                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1">
                    {formdate(m.createdAt)}
                  </time>
                </div>
                <div
                  className={`p-2 rounded shadow text-sm max-w-md ${
                    isOwnMessage
                      ? "bg-red-300 text-right rounded-br-none"
                      : "bg-white text-left rounded-bl-none text-black"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-base-300 bg-base-100">
        <Input_send
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          senddata={handleSendMessage}
        />
      </div>
    </div>
  );
}

export default ChatContainer;