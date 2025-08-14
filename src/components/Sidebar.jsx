import React, { useEffect, useState } from "react";
import { chatStore } from "../chatStore";
import { authStore } from "../authStore";
import { Users, Search, MessageCircle, Users2 } from "lucide-react";
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
    <div className="relative shrink-0">
      <div className="relative">
        <img
          src="/chat.png"
          alt={user.username}
          className="size-11 object-cover rounded-full ring-2 ring-white/10 shadow-md"
        />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-black/20"></div>
      </div>
      <div 
        className={`absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full ring-2 ring-white/20 shadow-sm transition-all duration-200 ${
          isUserOnline(user._id) 
            ? "bg-gradient-to-br from-green-400 to-green-600 shadow-green-400/50" 
            : "bg-gradient-to-br from-gray-400 to-gray-600"
        }`} 
      />
    </div>
  );

  const renderUserInfo = (user, showId = false) => (
    <div className="hidden lg:block text-left min-w-0 flex-1">
      <div className="font-semibold text-gray-900 dark:text-white truncate text-sm">
        {user.username}
      </div>
      {showId && (
        <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
          #{user.id}
        </div>
      )}
      <div className={`text-xs font-medium transition-colors duration-200 ${
        isUserOnline(user._id) 
          ? "text-green-600 dark:text-green-400" 
          : "text-gray-400 dark:text-gray-500"
      }`}>
        {isUserOnline(user._id) ? "Online" : "Offline"}
      </div>
    </div>
  );

  const renderUserButton = (user, showId = false) => (
    <button
      key={user._id}
      onClick={() => handleUserSelect(user)}
      className={`group w-full p-3 flex items-center gap-3 rounded-xl mx-2 transition-all duration-200 hover:shadow-sm hover:scale-[0.98] active:scale-95 ${
        isUserSelected(user._id) 
          ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 ring-1 ring-blue-200 dark:ring-blue-800 shadow-sm" 
          : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
      }`}
    >
      {renderUserAvatar(user)}
      {renderUserInfo(user, showId)}
      {isUserSelected(user._id) && (
        <div className="hidden lg:block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
      )}
    </button>
  );

  const renderPersonalMode = () => (
    <>
      <div className="border-b border-gray-200 dark:border-gray-800 bg-gradient-to-b from-gray-50/50 to-transparent dark:from-gray-900/50 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
            <Users className="size-4" />
          </div>
          <div className="hidden lg:block">
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Contacts</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Connect with your team</p>
          </div>
        </div>

        <div className="space-y-2">
          <SearchBar onSearch={handleSearch} />
          
          <div className="hidden lg:flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400 font-medium">
              Recent conversations
            </span>
            <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full text-gray-600 dark:text-gray-400 font-semibold text-xs">
              {users.length}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2 space-y-1">
        {searchResult && (
          <div className="mb-3">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Search Result
            </div>
            {renderUserButton(searchResult)}
          </div>
        )}

        <div className="space-y-1">
          {users
            .filter((user) => user._id !== searchResult?._id)
            .map((user) => renderUserButton(user, true))}
        </div>

        {filteredUsers.length === 0 && !searchResult && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <MessageCircle className="size-8 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                No recent conversations
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Start chatting to see contacts here
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );

  const renderGroupMode = () => (
    <>
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-md">
            <Users2 className="size-4" />
          </div>
          <div className="hidden lg:block">
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Groups</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Team collaboration</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="text-amber-600 dark:text-amber-400 mt-0.5">⚠️</div>
            <div>
              <h3 className="font-semibold text-amber-800 dark:text-amber-200 text-sm">
                Coming Soon
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                Group chat and real-time board features are in development
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2 space-y-1">
        {groups.map((group) => {
          const member = isMember(group);
          const owner = isOwner(group);

          return (
            <div
              key={group._id}
              className={`group mx-2 rounded-xl transition-all duration-200 hover:shadow-sm hover:scale-[0.98] ${
                isGroupSelected(group._id) 
                  ? "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 ring-1 ring-purple-200 dark:ring-purple-800 shadow-sm" 
                  : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }`}
            >
              <div
                onClick={() => handleGroupSelect(group)}
                className="cursor-pointer p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                      {group.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">
                      Room #{group.roomid}
                    </div>
                  </div>
                  
                  {isGroupSelected(group._id) && (
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shrink-0"></div>
                  )}
                </div>

                {member && (
                  <div className="mt-3 inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span className="text-xs font-medium">
                      Member{!group.ispublic && " · Private"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {groups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <Users2 className="size-8 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                No groups yet
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Group features coming soon
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <aside className="h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 shadow-sm">
      <ChatModeToggle />
      <div className="flex-1 flex flex-col min-h-0">
        {chatMode === "personal" ? renderPersonalMode() : renderGroupMode()}
      </div>
    </aside>
  );
}

export default Sidebar;