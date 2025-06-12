import { create } from 'zustand';
import { axiosInstance } from './axios.js';
import toast from 'react-hot-toast';
export const authStore = create((set) => ({
    authUser: null,
    isSignedUp: false,
    isLoggedIn: false,
    isProfileUpdated: false,
    ischeckAuthenticated: true,
    onlineUsers:[],
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/checkAuth')
            // const res =await fetch('http://localhost:5000/checkAuth');
            set({ authUser: res.data });
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
    signAuth:async (data)=>{
        set({ isSignedUp: true });
        try{
            const res =await axiosInstance.post('/signup', data);
            console.log(res);
            set({ authUser: res.data});
            toast.success("Signup successful");
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
        toast.success("Login successful");
      } 
      catch(e){
        console.error(e, "Error in login");
        toast.error("Login failed");
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
        }
        catch(e){
            console.error(e, "Error in logout");
            toast.error("Logout failed");

        }
    }, 
   profileupdate: async (data) => {
    try {
        set({ isProfileUpdated: true });

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
}

}));

