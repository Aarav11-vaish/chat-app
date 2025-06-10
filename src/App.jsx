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
function App() {
  const {authUser , checkAuth , ischeckAuthenticated }=authStore();
  
  useEffect(() => {
      checkAuth();
  }, [checkAuth]);
  // console.log("authUser", authUser);
  console.log({authUser});
  
  if(ischeckAuthenticated&& !authUser) {
    // If the authentication check is in progress and no user is authenticated, show a loading spinner
    return (
      <div className="flex item-center justify-center h-screen ">
       <Loader className="size-10 animate-spin" />
      </div>
    );

  }
  
    return (
     <>
     <Navbar/>
  
     
        <Routes>
          <Route path="/" element={authUser? <Home/>: <Navigate to ="/login"/>} />
          <Route path="/signup" element={!authUser? <Signup/>: <Navigate to ="/"/> } />
          <Route path="/login" element={!authUser? <Login/>: <Navigate to='/'/>} />
          <Route path="/profile" element ={!authUser? <Navigate to="/login"/> : <Profile/>} />

        </Routes>
     <Toaster />
     </>
    );
}

export default App;