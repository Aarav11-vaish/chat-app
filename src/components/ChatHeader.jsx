import { X } from "lucide-react";
import { authStore } from "../authStore";
import { chatStore } from "../chatStore";
const ChatHeader = () => {
  const { selectedusers, setSelectedUser } = chatStore(); // use selectedusers
  const { onlineUsers } = authStore();

  if (!selectedusers) return null;

console.log(selectedusers._id);

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={"/chat.png"} />
            </div>
          </div>
          <div>
            <h3 className="font-medium">{selectedusers.username}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedusers._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
