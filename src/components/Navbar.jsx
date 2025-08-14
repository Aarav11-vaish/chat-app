import React from "react";
import { MessageSquare, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { authStore } from "../authStore"; 

function Navbar() {
  const { logout, authUser } = authStore(); 

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 fixed w-full top-0 z-40 backdrop-blur-xl backdrop-saturate-150">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-90 transition-all duration-200 group"
            >
              <div className="relative">
                <div className="size-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 to-indigo-500/20 group-hover:from-blue-400/30 group-hover:to-indigo-500/30 transition-all duration-200"></div>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                DoodleSync
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {authUser && (
              <>
                <Link
                  to={"/profile"}
                  className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:shadow-sm hover:scale-105 active:scale-95"
                >
                  <div className="p-1 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white group-hover:from-green-400 group-hover:to-emerald-500 transition-all duration-200">
                    <User className="size-3.5" />
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">Profile</span>
                </Link>

                <button
                  className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 hover:shadow-sm hover:scale-105 active:scale-95 ring-1 ring-red-200 dark:ring-red-800"
                  onClick={logout}
                >
                  <div className="p-1 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 text-white group-hover:from-red-400 group-hover:to-rose-500 transition-all duration-200">
                    <LogOut className="size-3.5" />
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
