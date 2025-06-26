// components/ChatModeToggle.jsx
import { chatStore } from "../chatStore";

const ChatModeToggle = () => {
  const { chatMode, setChatMode } = chatStore();

  return (
    <div className="flex gap-2 p-3 border-b border-base-300">
      <button
        onClick={() => setChatMode("personal")}
        className={`btn btn-sm ${chatMode === "personal" ? "btn-primary" : "btn-outline"}`}
      >
        Personal
      </button>
      <button
        onClick={() => setChatMode("group")}
        className={`btn btn-sm ${chatMode === "group" ? "btn-primary" : "btn-outline"}`}
      >
        Group
      </button>
    </div>
  );
};

export default ChatModeToggle;
