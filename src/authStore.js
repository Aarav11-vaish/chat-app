import { create } from 'zustand';
import { axiosInstance } from './axios.js';
import toast from 'react-hot-toast';
import { disconnect } from 'mongoose';
import { io } from 'socket.io-client';
export const authStore = create((set, get) => ({
    authUser: null,
    isSignedUp: false,
    isLoggedIn: false,
    isProfileUpdated: false,
    ischeckAuthenticated: true,
    onlineUsers: [],
    socket: null,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/checkAuth')
            // const res =await fetch('http://localhost:5000/checkAuth');
            set({ authUser: res.data });
            get().connectsocket();

            console.log(res);
        }     
        catch (err) {
            console.error(err, "Error in checkAuth");
            set({ authUser: null });
        }
        finally {
            set({ ischeckAuthenticated: false });
        }
    },
    
    // search users
searchUser: async (roomID) => {
    if (!/^\d{6}$/.test(roomID)) {
        toast.error("Please enter a valid 6-digit Room ID");
        return null;
    }

    try {
        const res = await axiosInstance.get(`/search-room/${roomID}`);
        return res.data; // return room object if found
    } catch (e) {
        console.error(e, "Error in searchRoomByID");
        toast.error(
            e.response?.status === 404
                ? "Room not found"
                : "Error while searching room"
        );
        return null;
    }
},


    signAuth:async (data)=>{
        set({ isSignedUp: true });
        try{
            const res =await axiosInstance.post('/signup', data);
            // console.log(res);
            // set({ authUser: res.data});
            toast.success("Signup successful!! please verify your email");
        }
            catch(e){
toast.error("Signup failed");
console.error(e, "Error in signAuth");
            }
        finally {
            set({ isSignedUp: false });
        }
    },
    login:async(data)=>{
      try{
set({ isLoggedIn: true });
        const res =await axiosInstance.post('/login', data);
        console.log(res);
        set({ authUser: res.data });
        get().connectsocket();
       
        toast.success("Login successful");
      } 
      catch(e){
        // if the user does not exist then say "User does not exist"
        if (e.response && e.response.status === 400) {
          toast.error("User does not exist");
        } else if (e.response && e.response.status === 500) {
          toast.error("email verification required");
        } else {
          toast.error("Login failed");
        }
        
      }
      finally{
set({ isLoggedIn: false });
      } 
    },
     logout:async()=>{
        try{
            const res =await axiosInstance.get('/logout');
            set({ authUser:null});
            console.log(res);
            toast.success("Logout successful");
            get().disconnectsocket();
        }
        catch(e){
            console.error(e, "Error in logout");
            toast.error("Logout failed");

        }
    }, 
   profileupdate: async (data) => {
    try {
        set({ isProfileUpdated: true});

        // Filter out empty or undefined fields
        const filteredData = {};
        if (data.fullName && data.fullName.trim() !== "") {
            filteredData.fullName = data.fullName.trim();
        }
        if (data.password && data.password.trim() !== "") {
            filteredData.password = data.password.trim();
        }

        if (Object.keys(filteredData).length === 0) {
            toast.error("No changes to update");
            return;
        }

        const res = await axiosInstance.put('/profileupdate', filteredData);
        console.log(res);
        set({ authUser: res.data });
        toast.success("Profile updated successfully");

    } catch (e) {
        console.error(e, "Error in profileupdate");
        toast.error("Profile update failed");
    } finally {
        set({ isProfileUpdated: false });
    }
},
connectsocket: () => {
    const { authUser } = get();
    if (!authUser|| get().socket?.connected) {

        console.error("User not authenticated, cannot connect socket");
        return;
    }

    const socket =io("http://localhost:3000", {
        query: { userID: authUser._id },
        transports: ['websocket'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    });
    socket.connect();
    set({socket: socket});
    socket.on("onlineusers", (users) => {
        set({ onlineUsers: users });
    });
    console.log("Socket connected");
}, 
disconnectsocket: () => {
     if(get().socket?.connected) {
        get().socket.disconnect();
        console.log("Socket disconnected");
    }
}

}));

