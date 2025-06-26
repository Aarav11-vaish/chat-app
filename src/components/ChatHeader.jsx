import { X } from "lucide-react";
import { authStore } from "../authStore";
import { chatStore } from "../chatStore";

const ChatHeader = () => {
  const {
    selectedusers,
    selectedGroups,
    setSelectedUser,
    setSelectedGroups,
    chatMode,
  } = chatStore();
  const { onlineUsers } = authStore();

  // Determine if we're in group mode or personal mode
  const isGroup = chatMode === "group";

  // Get the active chat object based on mode
  const chatTarget = isGroup ? selectedGroups : selectedusers;

  // Don’t show header if no one is selected
  if (!chatTarget) return null;

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
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
        </div>
        <button
          onClick={() => {
            isGroup ? setSelectedGroups(null) : setSelectedUser(null);
          }}
        >
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
