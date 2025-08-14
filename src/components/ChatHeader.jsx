import { X, Plus } from "lucide-react";
import { authStore } from "../authStore";
import { chatStore } from "../chatStore";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import TxtDelete from "../FeatureButton/TxtDelete";

const ChatHeader = () => {
  const navigate = useNavigate();
  const {
    selectedusers,
    selectedGroups,
    setSelectedUser,
    setSelectedGroups,
    chatMode,
    sendMessages,
  } = chatStore();

  const openWhiteboard = () => {
    const roomId = uuidv4();
    const whiteboardLink = `${window.location.origin}/whiteboard/${roomId}`;

    if (chatMode === "personal" && selectedusers) {
      sendMessages(selectedusers._id, `Join whiteboard: ${whiteboardLink}`);
    }
    window.open(whiteboardLink, "_blank");
  };

  const { onlineUsers } = authStore();
  const isGroup = chatMode === "group";
  const chatTarget = isGroup ? selectedGroups : selectedusers;

  if (!chatTarget) return null;

  return (
    <div className="px-4 py-3 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
      {/* Left: Avatar + Name */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
          <img src="/chat.png" alt="avatar" className="object-cover w-full h-full" />
        </div>

        <div>
          <h3 className="font-medium text-zinc-900 dark:text-white">
            {isGroup ? chatTarget.name : chatTarget.username}
          </h3>
          {!isGroup && (
            <p className="text-sm text-zinc-500">
              {onlineUsers.includes(chatTarget._id) ? "Online" : "Offline"}
            </p>
          )}
        </div>

        <button
          onClick={openWhiteboard}
          className="ml-3 px-3 py-1.5 text-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          Whiteboard
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {isGroup && (
          <button
            onClick={() => navigate("/group-page")}
            title="Create New Group"
            className="flex items-center gap-1 px-2 py-1 text-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New</span>
          </button>
        )}

        <TxtDelete />

        <button
          onClick={() => (isGroup ? setSelectedGroups(null) : setSelectedUser(null))}
          title="Close Chat"
          className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
