import { useEffect, useState } from "react";
import { chatStore } from "../chatStore";
import { authStore } from "../authStore";
import ChatHeader from "./ChatHeader";
import Input_send from "./Input_send";
import NoChatSelected from "./NoChatSelected";
import { formdate } from "../utils";
import CreateGroup from "../Group/CreateGroup"

function ChatContainer() {
  const {
    messages,
    getMessages,
    selectedusers,
    selectedGroups,
    sendMessages,
    chatMode,
    setSelectedGroups,
    subscribetomessages,
    unsubscribetomessages,
  } = chatStore();

  const { onlineUsers, authUser } = authStore();
  const [messageInput, setMessageInput] = useState("");

  const senddata = async () => {
    if (messageInput.trim() === "") return;
    console.log("Sending:", messageInput);

    // Use group._id or user._id depending on chat mode
    const receiverId = chatMode === "group" ? selectedGroups?._id : selectedusers?._id;
    if (!receiverId) return;

    await sendMessages(receiverId, messageInput);
    setMessageInput("");
  };

  // Personal chat message fetching
  useEffect(() => {
    if (chatMode === "personal" && selectedusers?._id) {
      getMessages(selectedusers._id);
      subscribetomessages();
      return () => unsubscribetomessages();
    }
  }, [chatMode, selectedusers, getMessages, subscribetomessages, unsubscribetomessages]);

  if (chatMode === "group" && !selectedGroups) {
    return (
    <CreateGroup/>
    );
  }

  if (chatMode === "personal" && !selectedusers) return <NoChatSelected />;
  if (chatMode === "group" && !selectedGroups) return null;

  const isGroup = chatMode === "group";
  const chatTarget = isGroup ? selectedGroups : selectedusers;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ChatHeader />

      {/* Message List */}
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
