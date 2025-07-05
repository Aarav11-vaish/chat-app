import { X, Plus } from "lucide-react";
import { authStore } from "../authStore";
import { chatStore } from "../chatStore";
import { useNavigate } from "react-router-dom";


const ChatHeader = () => {
  const navigate = useNavigate();
  const {
    selectedusers,
    selectedGroups,
    setSelectedUser,
    setSelectedGroups,
    chatMode,
  } = chatStore();

const handlewhiteboardnavigation=()=>{
  navigate("/whiteboard");

}

  const { onlineUsers } = authStore();
  // const navigate = useNavigate();

  const isGroup = chatMode === "group";
  const chatTarget = isGroup ? selectedGroups : selectedusers;

  if (!chatTarget) return null;

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        {/* Left: Avatar and Name */}
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src="/chat.png" alt="avatar" />
            </div>
          </div>
          <div>
            <h3 className="font-medium">
              {isGroup ? chatTarget.name : chatTarget.username}
            </h3>
            {!isGroup && (
              <p className="text-sm text-base-content/70">
                {onlineUsers.includes(chatTarget._id) ? "Online" : "Offline"}
              </p>
            )}
          </div>
          <div>
<a
  href="/WhiteBoard"
  target="_blank"
  rel="noopener noreferrer"
  className="px-4 py-2 bg-blue-400 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
>
  Whiteboard
</a>

         </div>
        </div>

        {/* Right: Create Group button + Close */}
        <div className="flex items-center gap-2">
          {isGroup && (
            <button
              onClick={() => navigate("/group-page")}
              title="Create New Group"
              className="btn btn-xs btn-outline"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">New</span>
            </button>
          )}
          <button
            onClick={() => {
              isGroup ? setSelectedGroups(null) : setSelectedUser(null);
            }}
            title="Close Chat"
            className="btn btn-xs btn-ghost"
          >
            <X />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
