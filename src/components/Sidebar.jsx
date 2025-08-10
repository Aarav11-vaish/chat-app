import React, { useEffect, useState } from "react";
import { chatStore } from "../chatStore";
import { authStore } from "../authStore";
import { Users } from "lucide-react";
import ChatModeToggle from "./ChatModeToggle";
import SearchBar from "./SearchBar";
import toast from "react-hot-toast";

function Sidebar() {
  const [searchResult, setSearchResult] = useState(null);

  const {
    getUsers,
    getGroups,
    users,
    groups,
    chatMode,
    selectedusers,
    selectedGroups,
    setSelectedUser,
    setSelectedGroups,
    getGroupMessages,
  } = chatStore();

  const searchUser = authStore((state) => state.searchUser);
  const { onlineUsers, authUser } = authStore();

  useEffect(() => {
    if (chatMode === "personal") getUsers();
    else getGroups();
  }, [chatMode]);

  const filteredUsers = users.filter((user) =>
    onlineUsers.includes(user._id)
  );

  const handleSearch = async (query) => {
    if (!/^\d{6}$/.test(query)) {
      toast.error("Please enter a valid 6-digit ID");
      return;
    }
    const user = await searchUser(query);
    setSearchResult(user || null);
  };

  const isMember = (group) => group.members?.includes(authUser._id);
  const isOwner = (group) => group.owner === authUser._id;

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    if (user === searchResult) {
      setSearchResult(null);
    }
  };

  const handleGroupSelect = (group) => {
    setSelectedGroups(group);
    getGroupMessages(group._id);
  };

  const isUserSelected = (userId) => selectedusers?._id === userId;
  const isGroupSelected = (groupId) => selectedGroups?._id === groupId;
  const isUserOnline = (userId) => onlineUsers.includes(userId);

  const renderUserAvatar = (user) => (
    <div className="relative mx-auto lg:mx-0">
      <img
        src="/chat.png"
        alt={user.username}
        className="size-12 object-cover rounded-full"
      />
      <span 
        className={`absolute bottom-0 right-0 size-3 rounded-full ring-2 ring-zinc-850 ${
          isUserOnline(user._id) ? "bg-green-600" : "bg-slate-600"
        }`} 
      />
    </div>
  );

  const renderUserInfo = (user, showId = false) => (
    <div className="hidden lg:block text-left min-w-0">
      <div className="font-medium truncate">{user.username}</div>
      {showId && (
        <div className="text-sm text-zinc-150">{user.id}</div>
      )}
      <div className="text-sm text-zinc-400">
        {isUserOnline(user._id) ? "Online" : "Offline"}
      </div>
    </div>
  );

  const renderUserButton = (user, showId = false) => (
    <button
      key={user._id}
      onClick={() => handleUserSelect(user)}
      className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
        isUserSelected(user._id) ? "bg-base-300 ring-1 ring-base-300" : ""
      }`}
    >
      {renderUserAvatar(user)}
      {renderUserInfo(user, showId)}
    </button>
  );

  const renderPersonalMode = () => (
    <>
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        <div className="mt-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <span className="text-xs text-zinc-300">
            Previous users you have chatted with or shared board with ({users.length})
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {searchResult && renderUserButton(searchResult)}

        {users
          .filter((user) => user._id !== searchResult?._id)
          .map((user) => renderUserButton(user, true))}

        {filteredUsers.length === 0 && !searchResult && (
          <div className="text-center text-zinc-500 text-xs py-1">
            No more Previously Contacted Users
          </div>
        )}
      </div>
    </>
  );

  const renderGroupMode = () => (
    <>
      <div className="p-5">
        <h2 className="text-lg font-semibold">
          ⚠️ We are working on this group chat and real time board
        </h2>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {groups.map((group) => {
          const member = isMember(group);
          const owner = isOwner(group);

          return (
            <div
              key={group._id}
              className={`p-3 hover:bg-base-300 transition-colors ${
                isGroupSelected(group._id) ? "bg-base-300 ring-1 ring-base-300" : ""
              }`}
            >
              <div
                onClick={() => handleGroupSelect(group)}
                className="cursor-pointer"
              >
                <div className="font-medium">{group.name}</div>
                <div className="text-sm text-zinc-400">
                  Room ID: {group.roomid}
                </div>
              </div>

              {member && (
                <p className="text-xs mt-1 text-green-600">
                  ✔ Member{group.ispublic ? "" : " (private)"}
                </p>
              )}
            </div>
          );
        })}

        {groups.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            No groups found, we are working on this feature
          </div>
        )}
      </div>
    </>
  );

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <ChatModeToggle />
      {chatMode === "personal" ? renderPersonalMode() : renderGroupMode()}
    </aside>
  );
}

export default Sidebar;