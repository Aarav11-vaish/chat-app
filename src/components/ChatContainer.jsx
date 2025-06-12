import { useState } from "react";
import { chatStore } from "../chatStore";
import {authStore} from "../authStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatHeader from "./ChatHeader";
import Input_send from "./Input_send";
function ChatContainer(){
const {messages  , getMessages, selectedUsers, ismessagesloading} = chatStore();
useEffect(()=>{
  if (selectedUsers && selectedUsers._id) {
    getMessages(selectedUsers._id);
  }

}, [getMessages, selectedUsers])
const {onlineUsers} = authStore();
if(ismessagesloading) return <> 
<h1>Loading....</h1></>;

return (
    <div className="flex-1 flex flex-col overflow-auto">
        ChatHeader
        <ChatHeader />
        <p>Messages....</p>
        Input_send
        <Input_send />
    

    </div>
)
}
export default ChatContainer;