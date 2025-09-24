import { chatStore } from "../chatStore";

const ChatModeToggle = () => {
  const { chatMode, setChatMode } = chatStore();

  return (
    <div className="p-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30">
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
        <button
          onClick={() => setChatMode("personal")}
          className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
            chatMode === "personal"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-gray-600"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50"
          }`}
        >
          Personal
        </button>
        <button
          onClick={() => setChatMode("group")}
          className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
            chatMode === "group"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-gray-600"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50"
          }`}
        >
          Group
        </button>
      </div>
    </div>
  );
};

export default ChatModeToggle;