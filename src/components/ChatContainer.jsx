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
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {messages.map((m) => {
          const isOwnMessage = m.senderID === authUser?._id;
          return (
            <div
              key={m._id}
              className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} group`}
            >
              <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? "mr-2" : "ml-2"}`}>
                <div className="chat-header mb-2">
                  <time className="text-xs text-gray-400 dark:text-gray-500 font-medium px-1">
                    {formdate(m.createdAt)}
                  </time>
                </div>
                <div className="relative">
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 group-hover:shadow-md text-sm leading-relaxed break-words ${
                      isOwnMessage
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-right rounded-br-md"
                        : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-left text-gray-900 dark:text-white rounded-bl-md"
                    }`}
                  >
                    {m.text}
                  </div>
                  
                  {/* Message tail */}
                  <div className={`absolute bottom-0 w-3 h-3 ${
                    isOwnMessage
                      ? "right-0 translate-x-1 bg-gradient-to-br from-blue-500 to-indigo-600"
                      : "left-0 -translate-x-1 bg-white dark:bg-gray-700 border-l border-b border-gray-200 dark:border-gray-600"
                  } rotate-45`}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
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