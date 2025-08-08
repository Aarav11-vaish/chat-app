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
    // searchUser,
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

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <ChatModeToggle />

      {chatMode === "personal" ? (
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
              <span className="text-sm">Online users:</span>
              <span className="text-xs text-zinc-500">
                ({onlineUsers.length - 1})
              </span>
            </div>
          </div>

          <div className="overflow-y-auto w-full py-3">
            {searchResult && (
              <button
                key={searchResult._id}
                onClick={() => {setSelectedUser(searchResult);
                  setSearchResult(null);
                }
                }
                className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                  selectedusers?._id === searchResult._id
                    ? "bg-base-300 ring-1 ring-base-300"
                    : ""
                }`}
              >
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src="/chat.png"
                    alt={searchResult.username}
                    className="size-12 object-cover rounded-full"
                  />
                  {onlineUsers.includes(searchResult._id) && (
                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-850" />
                  )}
                </div>
                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-medium truncate">
                    {searchResult.username}
                  </div>
                  <div className="text-sm text-zinc-400">
                    {onlineUsers.includes(searchResult._id)
                      ? "Online"
                      : "Offline"}
                  </div>
                </div>
              </button>
            )}

            {filteredUsers
              .filter((user) => user._id !== searchResult?._id)
              .map((user) => (
                <button
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                    selectedusers?._id === user._id
                      ? "bg-base-300 ring-1 ring-base-300"
                      : ""
                  }`}
                >
                  <div className="relative mx-auto lg:mx-0">
                    <img
                      src="/chat.png"
                      alt={user.username}
                      className="size-12 object-cover rounded-full"
                    />
                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-850" />
                  </div>
                  <div className="hidden lg:block text-left min-w-0">
                    <div className="font-medium truncate">{user.username}</div>
                    <div className="text-sm text-zinc-150">{user.id}</div>
                    <div className="text-sm text-zinc-400">Online</div>
                  </div>
                </button>
              ))}

            {filteredUsers.length === 0 && !searchResult && (
              <div className="text-center text-zinc-500 py-4">
                No online users
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="p-5">
            <h2 className="text-lg font-semibold">All Groups, ⚠️ we are working on this group chat and real time board</h2>
          </div>
          <div className="overflow-y-auto w-full py-3">
            {groups.map((grp) => {
              const member = isMember(grp);
              const owner = isOwner(grp);
              return (
                <div
                  key={grp._id}
                  className={`p-3 hover:bg-base-300 transition-colors ${
                    selectedGroups?._id === grp._id
                      ? "bg-base-300 ring-1 ring-base-300"
                      : ""
                  }`}
                >
                  <div
                    onClick={() => {
                      setSelectedGroups(grp);
                      getGroupMessages(grp._id);
                    }}
                    className="cursor-pointer"
                  >
                    <div className="font-medium">{grp.name}</div>
                    <div className="text-sm text-zinc-400">
                      Room ID: {grp.roomid}
                    </div>
                  </div>

                  {member && (
                    <p className="text-xs mt-1 text-green-600">
                      ✔ Member{grp.ispublic ? "" : " (private)"}
                    </p>
                  )}
                </div>
              );
            })}
            {groups.length === 0 && (
              <div className="text-center text-zinc-500 py-4">
                No groups found , we are working on this feature
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  );
}

export default Sidebar;
