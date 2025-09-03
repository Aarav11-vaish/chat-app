import React from "react";
import { MessageSquare, Sparkles, Users, Search } from "lucide-react";

function NoChatSelected(){

return(
    <div className="w-full flex flex-1 flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-lg text-center space-y-8 relative z-10">
        {/* Enhanced Icon Display */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <div className="relative group">
            {/* Main chat icon */}
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/25 group-hover:shadow-2xl group-hover:shadow-blue-500/30 transition-all duration-500 group-hover:scale-105">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>
              
              {/* Floating sparkle */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* Floating secondary icons */}
            <div className="absolute -left-6 top-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-pulse opacity-80">
              <Users className="w-4 h-4 text-white" />
            </div>
            
            <div className="absolute -right-6 bottom-2 w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg animate-pulse opacity-80 animation-delay-500">
              <Search className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Enhanced Welcome Text */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Welcome to DoodleSync!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-md mx-auto">
            Start connecting with your team by selecting a conversation or searching for user's ID.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <div className="group p-4 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 hover:scale-105">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-1">
              Real-time Chat
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
             For your demo testing purpose u can search for userid : 495671 
            </p>
          </div>

          <div className="group p-4 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 hover:scale-105">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-1">
              Team Boards
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Collaborative drawing & planning
            </p>
          </div>
        </div>

        {/* Call to action */}
      
      </div>
    </div>
  );
};

export default NoChatSelected;