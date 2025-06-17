import React from "react";
import Navbar from "./Navbar";
import NoChatselected from "./NoChatSelected";
import Sidebar  from "./Sidebar";
import ChatContainer from "./ChatContainer";
import {chatStore} from "../chatStore";
function Home() {
    const {selectedusers}= chatStore();
    return(
<div>
<Navbar/>
   <div className="h-screen bg-base-200">
    <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
            <div className="flex h-full rounded-lg overflow-hidden">
                <Sidebar/>
                {!selectedusers ? <NoChatselected/>: <ChatContainer/>}
            </div>
        </div>
    </div>
   </div>
</div>
    );
}
    export default Home;