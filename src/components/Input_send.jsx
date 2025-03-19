import React from "react";
function Input_send({messageInput, setMessageInput, senddata}) {

    return (

    <div className="fixed bottom-0 left-0 right-0 bg-blue border-t border-gray-200 p-3">
      <div className="max-w-7xl mx-auto flex items-center">
        <input
          type="text"
          placeholder="Enter your text here"
          value={messageInput}
          onKeyDown={(e) => e.key === "Enter" && senddata()}
          onChange={(e) => setMessageInput(e.target.value)}
          className="flex-1 px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button 
          onClick={senddata}
          className="ml-2 px-4 py-2 bg-indigo-600 text-black rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Send
        </button>
      </div>
    </div>
     
)}

export default Input_send;



