import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter , Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import {authStore} from './authStore';
import { axiosInstance } from './axios';
import { Loader, LogIn } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Profile from './components/Profile';
import Email_verification from './components/Email_verification';
import GroupPage from './Group/GroupPage';
// import Whiteboard from './whiteBoard/Board';
import Board from './whiteBoard/Board';
import VideoCall from './video_chat/VideCall';
function App() {
  const [message , setmessage]= useState("fetching components...");
  const {authUser , checkAuth , ischeckAuthenticated, onlineUsers }=authStore();

  // console.log(onlineUsers);
useEffect(() => {
  if (!ischeckAuthenticated && !authUser) {
    setmessage("Processing and fetching initial component..."); 
    

   setInterval(() => {
    
   const timer1 = setTimeout(() => {
      setmessage("Fetching user data...");
    }, 1000);

    const timer2 = setTimeout(() => {
      setmessage("We recommend using laptop's chrome browser for better experience for now");
    }, 2000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, 4000);
  }
}, [ischeckAuthenticated, authUser]);


  useEffect(() => {
      checkAuth();
  }, [checkAuth]);
  // console.log("authUser", authUser);
  console.log({authUser});
  
  if(ischeckAuthenticated&& !authUser) {
    // If the authentication check is in progress and no user is authenticated, show a loading spinner
    return (
     <div className="flex flex-col items-center justify-center h-screen space-y-6 bg-gray-200">
<div className="flex space-x-2">
  <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce"></div>
  <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
  <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.6s]"></div>
</div>
  <p className="text-lg font-medium text-gray-700">{message}</p>
</div>

    );

  }
  
    return (
     <>
     {/* <Navbar/> */}
  
     
        <Routes>
          <Route path="/" element={authUser? <Home/>: <Navigate to ="/login"/>} />
          <Route path="/signup" element={!authUser? <Signup/>: <Navigate to ="/"/> } />
          <Route path="/login" element={!authUser? <Login/>: <Navigate to='/'/>} />
          <Route path="/profile" element ={!authUser? <Navigate to="/login"/> : <Profile/>} />
          <Route path="/verify-email/:token" element={<Email_verification />} />
          <Route path="/group-page" element={ <GroupPage/> }/>
  <Route path="/whiteboard/:roomId" element={<Board />} />
  <Route path="/whiteboard/:roomId/video" element={<VideoCall />} />

        </Routes>
     <Toaster />
     </>
    );
}

export default App;