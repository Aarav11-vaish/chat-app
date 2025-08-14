import React from "react";
import Navbar from "./Navbar";
import NoChatselected from "./NoChatSelected";
import Sidebar from "./Sidebar";
import ChatContainer from "./ChatContainer";
import { chatStore } from "../chatStore";

function Home() {
  const { selectedusers, selectedGroups, chatMode } = chatStore();

  const shouldShowChatContainer =
    (chatMode === "personal" && selectedusers) ||
    (chatMode === "group"); // even if no group selected, ChatContainer will handle it

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950">
      <Navbar />
      <div className="h-screen">
        <div className="flex items-center justify-center pt-20 px-4">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 w-full max-w-7xl h-[calc(100vh-8rem)] border border-white/20 dark:border-gray-700/50">
            <div className="flex h-full rounded-2xl ">
              <Sidebar />
              {shouldShowChatContainer ? <ChatContainer /> : <NoChatselected />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;